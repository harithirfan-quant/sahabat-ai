/**
 * POST /api/recommend
 *
 * Returns the top-N Malaysian youth programs most relevant to the user right
 * now, plus a short Claude-generated "why this is for you" snippet per card.
 *
 * Request body
 * ------------
 *   {
 *     query?:       string,            // free-text (e.g. "exam stress")
 *     chatContext?: string,            // recent chat excerpt to embed
 *     interests?:   string[],          // tag list
 *     limit?:       number,            // default 5, capped at 10
 *     minSimilarity?: number,          // default 0 (keep everything ≥ 0)
 *   }
 *
 * If all three of query/chatContext/interests are missing, we pull the user's
 * last 10 chat messages and use those as the query — so the Discover page
 * "just works" without any explicit input.
 *
 * Response
 * --------
 *   { programs: Array<{ id, title, description, category, location, url,
 *                       similarity, why }> }
 *
 * `why` is a single sentence (≤ 120 chars) explaining the fit in the user's
 * language. It's cached in-memory per query to avoid paying Claude on
 * every refresh.
 */

import { NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { embed } from "@/lib/embedding";
import { getGroq, CHAT_MODEL } from "@/lib/llm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  query: z.string().max(2000).optional(),
  chatContext: z.string().max(4000).optional(),
  interests: z.array(z.string().max(80)).max(20).optional(),
  limit: z.number().int().min(1).max(10).optional(),
  minSimilarity: z.number().min(-1).max(1).optional(),
});

const DEFAULT_LIMIT = 5;
const DEFAULT_MIN_SIM = 0.1;

type MatchedProgram = {
  id: string;
  title: string;
  description: string;
  category: string | null;
  location: string | null;
  url: string | null;
  similarity: number;
};

type Recommendation = MatchedProgram & { why: string };

// ---------------------------------------------------------------------------
// "why this is for you" — tiny Haiku call, batched for all 5 programs.
// ---------------------------------------------------------------------------

const WHY_CACHE = new Map<string, string>();
const WHY_CACHE_MAX = 500;

const WHY_SYSTEM = `You write a ONE-sentence "why this is for you" pitch for a Malaysian youth reading a list of mental-wellbeing programs.

Rules:
- Maximum 120 characters.
- Match the user's language (English, Bahasa Melayu, or Manglish).
- Be warm, specific, and direct. No clinical tone.
- No emojis. No "this program helps you…"; start with a verb or a noun.
- Ground it in ONE detail from the program + ONE thread from what the user shared.

Output STRICT JSON only:
{"whys":[{"i":0,"text":"..."},{"i":1,"text":"..."}, ...]}`;

function extractJson(raw: string): unknown {
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

async function generateWhys(
  userContext: string,
  programs: MatchedProgram[],
): Promise<string[]> {
  const fallback = (p: MatchedProgram) =>
    `Matches what you've shared — ${(p.description || "").slice(0, 80)}`;
  if (programs.length === 0) return [];

  const cacheKey = `${userContext.slice(0, 200)}::${programs.map((p) => p.id).join(",")}`;
  const cached = WHY_CACHE.get(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached) as string[];
    } catch {
      /* fall through */
    }
  }

  const userMessage = [
    `USER SHARED:`,
    userContext.trim() || "(no recent context — use general framing)",
    ``,
    `PROGRAMS:`,
    ...programs.map(
      (p, i) =>
        `[${i}] ${p.title} — ${p.description} (category: ${p.category ?? "n/a"}, location: ${p.location ?? "n/a"})`,
    ),
  ].join("\n");

  try {
    const groq = getGroq();
    const resp = await groq.chat.completions.create({
      model: CHAT_MODEL,
      max_tokens: 500,
      temperature: 0.5,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: WHY_SYSTEM },
        { role: "user", content: userMessage },
      ],
    });

    const raw = resp.choices[0]?.message?.content ?? "";
    const parsed = extractJson(raw) as { whys?: { i: number; text: string }[] } | null;

    if (!parsed?.whys || !Array.isArray(parsed.whys)) {
      return programs.map(fallback);
    }

    const out = programs.map((p, idx) => {
      const hit = parsed.whys!.find((w) => w.i === idx);
      return hit?.text?.slice(0, 160) || fallback(p);
    });

    // LRU-ish: evict oldest when hot.
    if (WHY_CACHE.size >= WHY_CACHE_MAX) {
      const firstKey = WHY_CACHE.keys().next().value;
      if (firstKey !== undefined) WHY_CACHE.delete(firstKey);
    }
    WHY_CACHE.set(cacheKey, JSON.stringify(out));
    return out;
  } catch (err) {
    console.error("[recommend] why generation failed:", err);
    return programs.map(fallback);
  }
}

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: z.infer<typeof BodySchema> = {};
  try {
    const parsed = BodySchema.safeParse(await req.json().catch(() => ({})));
    if (parsed.success) body = parsed.data;
  } catch {
    /* ignore — empty body is valid */
  }

  // ---- Build the query text ------------------------------------------------
  const parts: string[] = [];
  if (body.query?.trim()) parts.push(body.query.trim());
  if (body.interests && body.interests.length > 0) {
    parts.push(`Interests: ${body.interests.join(", ")}`);
  }
  if (body.chatContext?.trim()) parts.push(body.chatContext.trim());

  if (parts.length === 0) {
    // Fallback: pull the user's last 10 chat messages for context.
    const { data: chats } = await supabase
      .from("chats")
      .select("role, content, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    const recent = (chats ?? [])
      .filter((c) => c.role === "user")
      .map((c) => c.content)
      .reverse()
      .join("\n");
    if (recent) parts.push(recent);
  }

  const queryText = parts.join("\n\n").trim();

  if (!queryText) {
    // Cold start — return a diverse handful so the page is never empty.
    const { data, error } = await supabase
      .from("programs")
      .select("id, title, description, category, location, url")
      .limit(body.limit ?? DEFAULT_LIMIT);
    if (error) {
      return Response.json({ error: "db_error" }, { status: 500 });
    }
    return Response.json({
      programs: (data ?? []).map((p) => ({
        ...p,
        similarity: 0,
        why: "Start here — one of the most commonly helpful programs for Malaysian youth.",
      })),
      coldStart: true,
    });
  }

  // ---- Embed + vector search -----------------------------------------------
  // On Vercel's read-only Lambda filesystem, @xenova/transformers can fail
  // to download its model cache. When that happens we fall back to a simple
  // ILIKE keyword match so the Discover page still returns results.
  const limit = body.limit ?? DEFAULT_LIMIT;
  let programs: MatchedProgram[] = [];
  let usedFallback = false;

  try {
    const vec = await embed(queryText.slice(0, 4000));
    const { data: matches, error: rpcErr } = await supabase.rpc(
      "match_programs",
      {
        query_embedding: vec as unknown as string,
        match_count: limit,
        min_similarity: body.minSimilarity ?? DEFAULT_MIN_SIM,
      },
    );

    if (rpcErr) {
      console.error("[recommend] rpc failed:", rpcErr);
      throw rpcErr;
    }
    programs = (matches ?? []) as MatchedProgram[];
  } catch (err) {
    console.error("[recommend] embed/match failed, falling back to keyword:", err);
    usedFallback = true;

    // Keyword fallback — score by the number of query tokens appearing in
    // title/description/category. Ranks by hit count desc, then alpha.
    const tokens = Array.from(
      new Set(
        queryText
          .toLowerCase()
          .split(/[^a-zA-Z\u00C0-\u024F]+/)
          .filter((t) => t.length >= 3)
          .slice(0, 12),
      ),
    );

    const { data: all, error: dbErr } = await supabase
      .from("programs")
      .select("id, title, description, category, location, url")
      .limit(100);

    if (dbErr) {
      console.error("[recommend] fallback db fetch failed:", dbErr);
      return Response.json({ error: "db_error" }, { status: 500 });
    }

    const scored = (all ?? [])
      .map((p) => {
        const hay = `${p.title} ${p.description} ${p.category ?? ""}`.toLowerCase();
        let hits = 0;
        for (const t of tokens) if (hay.includes(t)) hits++;
        return {
          ...p,
          similarity: tokens.length ? hits / tokens.length : 0,
          _hits: hits,
        };
      })
      .sort((a, b) => b._hits - a._hits || a.title.localeCompare(b.title));

    // If nothing hits at all, still return the first N so the page isn't empty.
    const picked = (scored.some((s) => s._hits > 0)
      ? scored.filter((s) => s._hits > 0)
      : scored
    ).slice(0, limit);

    programs = picked.map(({ _hits: _h, ...p }) => p) as MatchedProgram[];
  }

  if (programs.length === 0) {
    return Response.json({ programs: [], fallback: usedFallback });
  }

  // ---- "Why this is for you" snippets via Claude --------------------------
  const whys = await generateWhys(queryText, programs);

  const recommendations: Recommendation[] = programs.map((p, i) => ({
    ...p,
    why: whys[i] ?? "",
  }));

  return Response.json({ programs: recommendations, fallback: usedFallback });
}
