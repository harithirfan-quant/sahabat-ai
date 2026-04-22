/**
 * GET /api/insight
 *
 * Returns a ONE-paragraph "how you're trending" insight written by Claude,
 * grounded in the user's last 7 days of chats + journals + wellbeing scores.
 *
 * Response
 * --------
 *   { insight: string, generatedAt: string, features: RiskFeatures }
 *
 * Caching
 * -------
 *   In-memory per user + rounded hour so repeat dashboard views don't pay
 *   Claude every refresh. The insight updates when new check-ins land or
 *   after an hour, whichever comes first.
 */

import { createClient } from "@/lib/supabase/server";
import { computeFeatures, type RiskFeatures } from "@/lib/risk";
import { getGroq, CHAT_MODEL } from "@/lib/llm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CacheEntry = { expires: number; payload: Payload };
type Payload = {
  insight: string;
  generatedAt: string;
  features: RiskFeatures;
};

const CACHE = new Map<string, CacheEntry>();
const CACHE_MAX = 500;
const CACHE_TTL_MS = 60 * 60 * 1000;

const SYSTEM = `You are Sahabat, an empathetic AI companion for Malaysian youth (15–30).

Write ONE short paragraph (2 sentences max, ≤ 220 characters total) describing how this person is trending over the last 7 days, grounded in the data provided.

Rules:
- Match the user's dominant language: English, Bahasa Melayu, or Manglish. Detect from recent messages.
- Warm, specific, non-clinical. No emojis. No bullet points.
- Name ONE bright spot and (if any) ONE gentle watch-out. If everything is healthy, celebrate softly.
- Never diagnose. Never use "depressed", "anxious disorder", or clinical labels.
- Do NOT mention Talian Kasih / Befrienders here — crisis flow handles that.

Output STRICT JSON only:
{"insight":"..."}`;

function extractJson(raw: string): { insight?: string } | null {
  const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
}

function fallbackInsight(features: RiskFeatures): string {
  const { mood_avg_7d, sleep_avg_7d, sentiment_avg_7d, journal_count_7d } =
    features;
  if (journal_count_7d === 0 && sentiment_avg_7d === 0) {
    return "A quiet week — no check-ins yet. Sahabat is here when you're ready to share.";
  }
  if (mood_avg_7d >= 7 && sleep_avg_7d >= 7) {
    return "Mood and sleep both look steady this week. Keep the rhythm going.";
  }
  if (sleep_avg_7d < 6) {
    return "Sleep dipped below 6 hours on average this week — a small wind-down routine tonight might help.";
  }
  if (sentiment_avg_7d < -0.1) {
    return "Tone has been a bit heavy lately. A short walk or one honest chat can shift the day.";
  }
  return "A mixed week, but you're showing up. That counts.";
}

const DAY_MS = 24 * 60 * 60 * 1000;

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const hourBucket = Math.floor(Date.now() / CACHE_TTL_MS);
  const cacheKey = `${user.id}:${hourBucket}`;
  const hit = CACHE.get(cacheKey);
  if (hit && hit.expires > Date.now()) {
    return Response.json({ ...hit.payload, cached: true });
  }

  let features: RiskFeatures;
  try {
    features = await computeFeatures(user.id, supabase);
  } catch (err) {
    console.error("[insight] feature computation failed:", err);
    return Response.json(
      { error: "feature_computation_failed" },
      { status: 500 },
    );
  }

  // Pull a small slice of actual text so Claude can detect language + tone.
  const since = new Date(Date.now() - 7 * DAY_MS).toISOString();
  const { data: recentChats } = await supabase
    .from("chats")
    .select("role, content, created_at")
    .eq("user_id", user.id)
    .eq("role", "user")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(8);

  const { data: recentJournals } = await supabase
    .from("journals")
    .select("mood_score, sleep_hours, note, created_at")
    .eq("user_id", user.id)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(5);

  const userMessage = [
    `7-DAY SIGNALS:`,
    `- sentiment avg: ${features.sentiment_avg_7d}  (range -1..+1)`,
    `- mood avg: ${features.mood_avg_7d}/10`,
    `- sleep avg: ${features.sleep_avg_7d}h`,
    `- check-ins: ${features.journal_count_7d}`,
    `- social engagement: ${features.social_engagement_7d}`,
    ``,
    `RECENT MESSAGES (use to detect language + tone, not to quote):`,
    ...(recentChats ?? []).map(
      (c) => `  · "${(c.content ?? "").slice(0, 140)}"`,
    ),
    ``,
    `RECENT JOURNAL NOTES:`,
    ...(recentJournals ?? []).map((j) =>
      [
        `  · mood ${j.mood_score}/10`,
        j.sleep_hours ? `${j.sleep_hours}h sleep` : null,
        j.note ? `"${(j.note ?? "").slice(0, 120)}"` : null,
      ]
        .filter(Boolean)
        .join(" — "),
    ),
  ].join("\n");

  let insight = fallbackInsight(features);

  try {
    const groq = getGroq();
    const resp = await groq.chat.completions.create({
      model: CHAT_MODEL,
      max_tokens: 200,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userMessage },
      ],
    });
    const raw = resp.choices[0]?.message?.content ?? "";
    const parsed = extractJson(raw);
    if (parsed?.insight) {
      insight = parsed.insight.slice(0, 260);
    }
  } catch (err) {
    console.error("[insight] claude failed:", err);
    // fall back quietly
  }

  const payload: Payload = {
    insight,
    generatedAt: new Date().toISOString(),
    features,
  };

  if (CACHE.size >= CACHE_MAX) {
    const firstKey = CACHE.keys().next().value;
    if (firstKey !== undefined) CACHE.delete(firstKey);
  }
  CACHE.set(cacheKey, {
    expires: Date.now() + CACHE_TTL_MS,
    payload,
  });

  return Response.json(payload);
}
