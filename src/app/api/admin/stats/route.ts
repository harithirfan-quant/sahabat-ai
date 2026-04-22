/**
 * POST /api/admin/stats
 *
 * Returns aggregated, fully-anonymised cohort signals for the NGO / UPM / KBS
 * partner dashboard. This is the demo-value endpoint: it proves the product
 * creates population-level intelligence without exposing any individual user.
 *
 * Auth
 * ----
 *   Mock-auth gated via a shared PIN. Set ADMIN_PIN in env for real deploys;
 *   the hackathon default is "icyouth2026". The PIN travels in the POST body
 *   (never logged) and is checked with a constant-time compare.
 *
 * Request
 * -------
 *   { pin: string }
 *
 * Response
 * --------
 *   {
 *     cohortSize:   number,   // distinct users with any activity in last 30d
 *     tierDistribution: { tier, label, color, value }[],
 *     topicHeatmap:     { topic, label, count }[],
 *     programLeaderboard: { id, title, category, signal }[],
 *     generatedAt: string,
 *   }
 *
 * Uses the service-role client so we can aggregate across ALL users without
 * tripping RLS. No user_ids or chat content ever leave this handler.
 */

import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { WellbeingTier } from "@/lib/supabase/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DAY_MS = 24 * 60 * 60 * 1000;

const TIER_META: Record<
  WellbeingTier,
  { label: string; color: string; order: number }
> = {
  green: { label: "Green", color: "#52B788", order: 0 },
  yellow: { label: "Yellow", color: "#F4A261", order: 1 },
  orange: { label: "Orange", color: "#E76F51", order: 2 },
  red: { label: "Red", color: "#E63946", order: 3 },
};

// Curated topic buckets — bilingual regex matched over recent user chats.
// Ordered so higher-priority categories win when a message matches multiple.
const TOPIC_BUCKETS: { topic: string; label: string; re: RegExp }[] = [
  {
    topic: "exam_stress",
    label: "Exam stress",
    re: /\b(exam|test|ujian|peperiksaan|paper|midterm|final|stud(?:y|ying|ied))\b/i,
  },
  {
    topic: "loneliness",
    label: "Loneliness",
    re: /\b(lonely|alone|sendiri|sepi|isolate|isolated|tiada kawan)\b/i,
  },
  {
    topic: "sleep",
    label: "Sleep",
    re: /\b(sleep|tidur|insomnia|awake|tired|lelah|letih|mengantuk)\b/i,
  },
  {
    topic: "family",
    label: "Family",
    re: /\b(family|parent|mother|father|mak|ayah|ibu|bapa|adik|abang|kakak)\b/i,
  },
  {
    topic: "finance",
    label: "Finance",
    re: /\b(money|financ|duit|wang|loan|hutang|pinjam|biaya|ptptn)\b/i,
  },
  {
    topic: "relationships",
    label: "Relationships",
    re: /\b(relationship|boyfriend|girlfriend|partner|cinta|breakup|putus)\b/i,
  },
  {
    topic: "anxiety",
    label: "Anxiety",
    re: /\b(anxi|panic|nervous|gelisah|risau|cemas|takut)\b/i,
  },
  {
    topic: "academic",
    label: "Academic",
    re: /\b(grade|gpa|cgpa|course|subject|lecture|kursus|pensyarah|assignment|tugasan)\b/i,
  },
];

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function POST(req: NextRequest) {
  const expectedPin = process.env.ADMIN_PIN ?? "icyouth2026";

  let pin = "";
  try {
    const body = (await req.json().catch(() => ({}))) as { pin?: unknown };
    pin = typeof body.pin === "string" ? body.pin : "";
  } catch {
    pin = "";
  }

  if (!pin || !timingSafeEqual(pin, expectedPin)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let supabase;
  try {
    supabase = createServiceClient();
  } catch (err) {
    console.error("[admin/stats] service client init failed:", err);
    return Response.json({ error: "service_unavailable" }, { status: 503 });
  }

  const now = Date.now();
  const since7d = new Date(now - 7 * DAY_MS).toISOString();
  const since30d = new Date(now - 30 * DAY_MS).toISOString();

  // ---- Tier distribution: most recent score per user in last 7 days --------
  const { data: scoreRows, error: scoreErr } = await supabase
    .from("wellbeing_scores")
    .select("user_id, tier, computed_at")
    .gte("computed_at", since7d)
    .order("computed_at", { ascending: false });

  if (scoreErr) {
    console.error("[admin/stats] score query failed:", scoreErr);
  }

  const latestTierByUser = new Map<string, WellbeingTier>();
  for (const row of scoreRows ?? []) {
    if (!latestTierByUser.has(row.user_id)) {
      latestTierByUser.set(row.user_id, row.tier);
    }
  }

  const tierCounts: Record<WellbeingTier, number> = {
    green: 0,
    yellow: 0,
    orange: 0,
    red: 0,
  };
  for (const tier of latestTierByUser.values()) {
    tierCounts[tier]++;
  }

  const tierDistribution = (Object.keys(tierCounts) as WellbeingTier[])
    .map((tier) => ({
      tier,
      label: TIER_META[tier].label,
      color: TIER_META[tier].color,
      value: tierCounts[tier],
    }))
    .sort(
      (a, b) => TIER_META[a.tier].order - TIER_META[b.tier].order,
    );

  // ---- Topic heatmap: keyword matches across user chats (30d) --------------
  const { data: chatRows, error: chatErr } = await supabase
    .from("chats")
    .select("content, user_id, created_at")
    .eq("role", "user")
    .gte("created_at", since30d)
    .limit(5000);

  if (chatErr) {
    console.error("[admin/stats] chat query failed:", chatErr);
  }

  const topicCounts = new Map<string, number>();
  const activeUsers = new Set<string>();
  for (const row of chatRows ?? []) {
    activeUsers.add(row.user_id);
    const text = row.content ?? "";
    for (const bucket of TOPIC_BUCKETS) {
      if (bucket.re.test(text)) {
        topicCounts.set(
          bucket.topic,
          (topicCounts.get(bucket.topic) ?? 0) + 1,
        );
      }
    }
  }

  const topicHeatmap = TOPIC_BUCKETS.map((b) => ({
    topic: b.topic,
    label: b.label,
    count: topicCounts.get(b.topic) ?? 0,
  }))
    .sort((a, b) => b.count - a.count)
    .filter((t) => t.count > 0);

  // ---- Program leaderboard: map topic counts onto program categories -------
  const { data: programRows } = await supabase
    .from("programs")
    .select("id, title, category, description");

  const categoryWeight: Record<string, number> = {};
  const matchTopicToCategory = (topic: string): string[] => {
    switch (topic) {
      case "exam_stress":
      case "academic":
        return ["counselling", "mindfulness", "students"];
      case "loneliness":
        return ["peer support", "community", "volunteer"];
      case "sleep":
        return ["mindfulness", "movement", "wellbeing"];
      case "family":
        return ["counselling", "family"];
      case "finance":
        return ["finance", "career"];
      case "relationships":
        return ["peer support", "counselling"];
      case "anxiety":
        return ["mindfulness", "counselling", "peer support"];
      default:
        return [];
    }
  };
  for (const t of topicHeatmap) {
    for (const cat of matchTopicToCategory(t.topic)) {
      categoryWeight[cat] = (categoryWeight[cat] ?? 0) + t.count;
    }
  }

  const programLeaderboard = (programRows ?? [])
    .map((p) => {
      const cat = (p.category ?? "").toLowerCase();
      const signal =
        Object.entries(categoryWeight)
          .filter(([k]) => cat.includes(k))
          .reduce((sum, [, v]) => sum + v, 0) || 0;
      return {
        id: p.id,
        title: p.title,
        category: p.category,
        signal,
      };
    })
    .sort((a, b) => b.signal - a.signal)
    .slice(0, 5);

  return Response.json({
    cohortSize: Math.max(latestTierByUser.size, activeUsers.size),
    tierDistribution,
    topicHeatmap,
    programLeaderboard,
    generatedAt: new Date().toISOString(),
  });
}
