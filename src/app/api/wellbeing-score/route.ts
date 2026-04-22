/**
 * GET /api/wellbeing-score
 *
 * Returns the signed-in user's current wellbeing score, tier, top factors,
 * and a 30-day trend for the dashboard chart.
 *
 * Strategy
 * --------
 *   1. Authenticate via Supabase Auth.
 *   2. If we have a fresh score (< 1 hour old) in `wellbeing_scores`, reuse it.
 *   3. Otherwise:
 *        - Compute the five 7-day features from the user's chats + journals.
 *        - Score locally via the TS PHQ-9/GAD-7 heuristic in src/lib/risk.ts.
 *        - Persist the new row (service client — bypasses RLS to write).
 *   4. Fetch the last 30 days of scores for the trend line.
 *
 * Query params
 * ------------
 *   ?fresh=1   Skip the freshness cache and force a recompute.
 */

import { NextRequest } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import {
  computeFeatures,
  scoreWellbeing,
  type RiskFeatures,
} from "@/lib/risk";
import type { WellbeingTier } from "@/lib/supabase/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FRESH_WINDOW_MS = 60 * 60 * 1000;       // reuse if score is < 1 hour old
const TREND_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

type TrendPoint = { computed_at: string; score: number; tier: WellbeingTier };

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const force = req.nextUrl.searchParams.get("fresh") === "1";
  const nowMs = Date.now();

  // --- 1. Most recent score + trend window ----------------------------------
  const trendSince = new Date(nowMs - TREND_WINDOW_MS).toISOString();
  const { data: history } = await supabase
    .from("wellbeing_scores")
    .select("score, tier, computed_at")
    .eq("user_id", user.id)
    .gte("computed_at", trendSince)
    .order("computed_at", { ascending: true });

  const trend: TrendPoint[] = (history ?? []).map((r) => ({
    computed_at: r.computed_at,
    score: r.score,
    tier: r.tier,
  }));

  const latest = trend.length > 0 ? trend[trend.length - 1] : null;
  const latestAgeMs = latest
    ? nowMs - new Date(latest.computed_at).getTime()
    : Number.POSITIVE_INFINITY;

  // --- 2. Serve the cached row if still fresh -------------------------------
  if (!force && latest && latestAgeMs < FRESH_WINDOW_MS) {
    return Response.json({
      score: latest.score,
      tier: latest.tier,
      top_factors: [],
      computed_at: latest.computed_at,
      trend,
      cached: true,
    });
  }

  // --- 3. Recompute from features ------------------------------------------
  let features: RiskFeatures;
  try {
    features = await computeFeatures(user.id, supabase);
  } catch (err) {
    console.error("[wellbeing-score] feature computation failed:", err);
    return Response.json(
      { error: "feature_computation_failed" },
      { status: 500 },
    );
  }

  const risk = await scoreWellbeing(features);

  // --- 4. Persist the fresh row --------------------------------------------
  const computedAt = new Date().toISOString();
  try {
    const service = createServiceClient();
    await service.from("wellbeing_scores").insert({
      user_id: user.id,
      score: risk.score,
      tier: risk.tier,
      computed_at: computedAt,
    });
  } catch (err) {
    // Non-fatal — we still want to return the freshly computed score to the UI.
    console.error("[wellbeing-score] persist failed:", err);
  }

  return Response.json({
    score: risk.score,
    tier: risk.tier,
    top_factors: risk.top_factors,
    model_version: risk.model_version,
    computed_at: computedAt,
    features,
    trend: [
      ...trend,
      { computed_at: computedAt, score: risk.score, tier: risk.tier },
    ],
    cached: false,
  });
}
