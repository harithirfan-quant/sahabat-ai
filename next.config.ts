import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @xenova/transformers ships ESM + wasm/onnx assets. Marking it external
  // prevents Turbopack from bundle-tracing onnxruntime's native bindings
  // into the Vercel serverless function (which blows past the size limit).
  serverExternalPackages: ["@xenova/transformers"],
};

export default nextConfig;
