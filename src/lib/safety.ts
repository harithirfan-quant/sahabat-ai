/**
 * Two-stage safety classifier for inbound chat messages.
 *
 *  Stage 1 — regex (instant, zero-cost)
 *    Matches obvious self-harm / abuse phrases in EN, BM, and Manglish.
 *    A single hit short-circuits to RED.
 *
 *  Stage 2 — Claude Haiku zero-shot (~200-400 ms)
 *    Structured-output classifier. Used when regex is inconclusive so we
 *    catch paraphrase, irony, and mixed-language signals the regex misses.
 *
 *  Tiers:
 *    green  — no concern
 *    yellow — distressed but no imminent risk
 *    orange — ambiguous self-harm ideation; gentle safety nudge
 *    red    — explicit self-harm / suicide / abuse disclosure → crisis flow
 */

import { getGroq, SAFETY_MODEL } from "@/lib/llm";

export type SafetyTier = "green" | "yellow" | "orange" | "red";

export type SafetyResult = {
  tier: SafetyTier;
  reason: string;
  source: "regex" | "llm" | "llm-fallback";
};

// ---------------------------------------------------------------------------
// Regex layer — words/phrases that, by themselves, warrant immediate crisis.
// Kept intentionally small to minimise false positives on casual venting.
// ---------------------------------------------------------------------------

const RED_PATTERNS: RegExp[] = [
  // Self-harm / suicide — English
  /\bkill(ing)?\s+my ?self\b/i,
  /\bend(ing)?\s+my\s+life\b/i,
  /\btake\s+my\s+own\s+life\b/i,
  /\bwant\s+to\s+die\b/i,
  /\bsuicid(e|al)\b/i,
  /\bcut(ting)?\s+my ?self\b/i,
  /\b(i\s+)?(don'?t|do\s+not)\s+want\s+to\s+(live|be\s+here)\b/i,
  // BM / Manglish — mati/bunuh diri
  /\bbunuh\s+diri\b/i,
  /\bnak\s+mati\b/i,
  /\btak\s+nak\s+hidup\b/i,
  /\bmengakhiri\s+(hidup|nyawa)\b/i,
  // Abuse disclosure
  /\b(i\s+am|i'?m)\s+(being|getting)\s+(abused|hit|beaten|raped)\b/i,
  /\b(dipukul|dirogol|didera)\b/i,
];

// Softer distress signals — drive yellow/orange if combined with ideation words.
const DISTRESS_PATTERNS: RegExp[] = [
  /\b(hopeless|worthless|numb|empty|exhausted)\b/i,
  /\bcan'?t\s+take\s+it\b/i,
  /\btiada\s+harapan\b/i,
  /\btak\s+boleh\s+tahan\b/i,
  /\blelah\b/i,
];

function regexTriage(text: string): SafetyResult | null {
  for (const p of RED_PATTERNS) {
    if (p.test(text)) {
      return {
        tier: "red",
        reason: `matched high-risk pattern ${p.source}`,
        source: "regex",
      };
    }
  }
  return null;
}

function heuristicFallback(text: string): SafetyTier {
  const distress = DISTRESS_PATTERNS.some((p) => p.test(text));
  return distress ? "yellow" : "green";
}

// ---------------------------------------------------------------------------
// LLM layer — Claude Haiku zero-shot classifier
// ---------------------------------------------------------------------------

const CLASSIFIER_SYSTEM = `You are a safety classifier for a mental-wellbeing chat service aimed at Malaysian youth.

Classify the user message into exactly one tier:
  - "green"  : no safety concern. Ordinary conversation.
  - "yellow" : user is distressed, anxious, or sad but not expressing self-harm.
  - "orange" : ambiguous or passive self-harm ideation ("I don't see the point", "tired of being alive"). Needs gentle safety check-in.
  - "red"    : explicit suicidal intent, plan, self-harm action, or disclosure of active abuse. Requires crisis routing.

Language: the user writes in English, Bahasa Melayu, or Manglish. Treat them equivalently.

Output STRICT JSON only — no prose, no markdown:
{"tier":"green|yellow|orange|red","reason":"short reason in english, <= 120 chars"}`;

export async function classifyMessage(text: string): Promise<SafetyResult> {
  // Stage 1
  const regex = regexTriage(text);
  if (regex) return regex;

  // Stage 2 — LLM
  try {
    const groq = getGroq();
    const resp = await groq.chat.completions.create({
      model: SAFETY_MODEL,
      max_tokens: 120,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: CLASSIFIER_SYSTEM },
        { role: "user", content: text },
      ],
    });

    const raw = resp.choices[0]?.message?.content?.trim() ?? "";
    const parsed = extractJson(raw);
    if (parsed && isValidTier(parsed.tier)) {
      return {
        tier: parsed.tier,
        reason: String(parsed.reason ?? "").slice(0, 200) || "classifier",
        source: "llm",
      };
    }
  } catch (err) {
    console.error("[safety] classifier error:", err);
  }

  // Stage 3 — heuristic fallback if LLM fails or returns garbage.
  return {
    tier: heuristicFallback(text),
    reason: "fallback heuristic",
    source: "llm-fallback",
  };
}

function extractJson(text: string): { tier?: string; reason?: string } | null {
  // Tolerate stray code fences.
  const cleaned = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
}

function isValidTier(t: unknown): t is SafetyTier {
  return t === "green" || t === "yellow" || t === "orange" || t === "red";
}

// ---------------------------------------------------------------------------
// Crisis payload — shown verbatim in the UI when tier === "red".
// ---------------------------------------------------------------------------

export const CRISIS_PAYLOAD = {
  title: "You're not alone — please reach out right now.",
  body: "What you're feeling is real, and it matters. Malaysian-based help is available 24/7, free and confidential.",
  contacts: [
    {
      name: "Talian Kasih",
      number: "15999",
      tel: "tel:15999",
      note: "24/7 national helpline · BM & EN",
    },
    {
      name: "Befrienders KL",
      number: "03-7627 2929",
      tel: "tel:+60376272929",
      note: "24/7 emotional support · confidential",
    },
  ],
} as const;
