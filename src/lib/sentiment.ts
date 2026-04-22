/**
 * Lightweight sentiment scoring via Claude Haiku.
 *
 * Returns a number in [-1, 1] where -1 = very negative, 0 = neutral, 1 = very
 * positive. We keep the prompt tiny and temperature 0 so the model emits a
 * single number. Falls back to 0 (neutral) on any error — sentiment is a
 * "nice to have" signal, never in the critical path.
 */

import { getGroq, SENTIMENT_MODEL } from "@/lib/llm";

const SYSTEM = `You score the emotional valence of a short user message on a scale from -1.0 (very negative) to 1.0 (very positive). Output only the number.`;

export async function scoreSentiment(text: string): Promise<number> {
  try {
    const groq = getGroq();
    const resp = await groq.chat.completions.create({
      model: SENTIMENT_MODEL,
      max_tokens: 8,
      temperature: 0,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: text },
      ],
    });
    const raw = resp.choices[0]?.message?.content?.trim() ?? "0";
    const n = Number(raw.match(/-?\d+(\.\d+)?/)?.[0] ?? "0");
    if (Number.isNaN(n)) return 0;
    return Math.max(-1, Math.min(1, n));
  } catch (err) {
    console.error("[sentiment] scoring error:", err);
    return 0;
  }
}
