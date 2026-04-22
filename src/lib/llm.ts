/**
 * Shared LLM client — Groq (OpenAI-compatible Chat Completions).
 *
 * We use Groq because:
 *   - Generous free tier (14.4k req/day on llama-3.3-70b-versatile, no card)
 *   - Fastest streaming first-token latency in the industry
 *   - OpenAI-compatible API shape, so swapping providers later is trivial
 *
 * Models:
 *   - CHAT_MODEL      : the warm, empathetic Sahabat companion (70B).
 *   - SAFETY_MODEL    : fast 8B zero-shot classifier for tier triage.
 *   - SENTIMENT_MODEL : same 8B for async valence scoring (fire-and-forget).
 *
 * All three are overridable via env for easy A/B.
 */

import Groq from "groq-sdk";

export const CHAT_MODEL =
  process.env.GROQ_CHAT_MODEL ?? "llama-3.3-70b-versatile";
export const SAFETY_MODEL =
  process.env.GROQ_SAFETY_MODEL ?? "llama-3.1-8b-instant";
export const SENTIMENT_MODEL =
  process.env.GROQ_SENTIMENT_MODEL ?? "llama-3.1-8b-instant";

let client: Groq | null = null;

export function getGroq(): Groq {
  if (!client) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not set");
    }
    client = new Groq({ apiKey });
  }
  return client;
}
