/**
 * Local embeddings via @xenova/transformers (MiniLM-L6-v2, 384 dims).
 *
 * Runs entirely on the server (Node runtime) — no API key, no quota, no
 * network hop after the first model download. The model weights (~23MB)
 * are cached under `~/.cache/huggingface/transformers/` on first run and
 * reused thereafter.
 *
 * Model: sentence-transformers/all-MiniLM-L6-v2
 *   - 384-dim sentence embeddings
 *   - Mean-pooled + L2-normalised (so cosine similarity = dot product)
 *   - Multilingual-friendly enough for BM/EN/Manglish short texts
 */

// The Xenova package has no first-party types for `pipeline`, so we type it
// just enough to satisfy TS without pulling in a separate types package.
type FeatureExtractor = (
  inputs: string | string[],
  opts?: { pooling?: "mean" | "cls" | "none"; normalize?: boolean },
) => Promise<{ data: Float32Array | number[]; dims: number[] }>;

export const EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2";
export const EMBEDDING_DIMENSIONS = 384;

let extractorPromise: Promise<FeatureExtractor> | null = null;

async function getExtractor(): Promise<FeatureExtractor> {
  if (!extractorPromise) {
    extractorPromise = (async () => {
      // Dynamic import keeps the ESM-only package compatible with our
      // CommonJS-ish TS build and avoids loading the model at import time.
      const { pipeline, env } = await import("@xenova/transformers");
      // Disable local-file-only gating; allow the first run to pull weights
      // from the HF CDN if not cached.
      env.allowLocalModels = false;
      env.useBrowserCache = false;
      return (await pipeline(
        "feature-extraction",
        EMBEDDING_MODEL,
      )) as unknown as FeatureExtractor;
    })();
  }
  return extractorPromise;
}

/** Embed a single string. Returns a 384-length number[]. */
export async function embed(text: string): Promise<number[]> {
  const [vec] = await embedMany([text]);
  return vec;
}

/**
 * Batch-embed an array of strings. Preserves input order. Uses mean pooling
 * + L2 normalisation so downstream cosine similarity is a plain dot product.
 */
export async function embedMany(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  const extractor = await getExtractor();
  const out = await extractor(texts, { pooling: "mean", normalize: true });

  // `out.data` is a Float32Array of length (texts.length × 384); `out.dims` is
  // [texts.length, 384]. Slice back into per-input vectors.
  const [n, dim] = out.dims;
  if (dim !== EMBEDDING_DIMENSIONS) {
    throw new Error(
      `Embedding dim mismatch: got ${dim}, expected ${EMBEDDING_DIMENSIONS}`,
    );
  }

  const vectors: number[][] = [];
  const flat = out.data;
  for (let i = 0; i < n; i++) {
    const start = i * dim;
    const row = new Array<number>(dim);
    for (let j = 0; j < dim; j++) row[j] = Number(flat[start + j]);
    vectors.push(row);
  }
  return vectors;
}

/**
 * Serialize a number[] into pgvector's text input format: '[1,2,3]'.
 */
export function toPgVector(vec: number[]): string {
  return `[${vec.join(",")}]`;
}
