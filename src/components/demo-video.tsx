"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useLocale } from "@/components/locale-provider";

/**
 * DemoVideo — placeholder with a clickable poster.
 *
 * Swap `videoSrc` for a real file or iframe (YouTube/Loom) when available.
 * Until then, we render a polished poster so the section doesn't feel empty.
 */
export function DemoVideo({
  videoSrc,
  poster,
}: {
  videoSrc?: string;
  poster?: string;
}) {
  const { locale } = useLocale();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full overflow-hidden rounded-2xl border border-border/60 soft-shadow-lg bg-gradient-to-br from-indigo-100 via-white to-emerald-50 aspect-video"
    >
      {videoSrc ? (
        <video
          src={videoSrc}
          controls
          poster={poster}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center space-y-4">
            <motion.button
              type="button"
              aria-label="Play demo video"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="grid size-20 md:size-24 place-items-center rounded-full bg-primary text-primary-foreground soft-shadow-lg hover:bg-primary/90 transition"
            >
              <Play className="size-8 md:size-10 translate-x-0.5" fill="currentColor" />
            </motion.button>
            <div>
              <div className="text-lg md:text-xl font-semibold tracking-tight">
                {locale === "bm"
                  ? "2-minit walkthrough SAHABAT.AI"
                  : "2-minute SAHABAT.AI walkthrough"}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {locale === "bm"
                  ? "Dari semakan 60 saat ke perpadanan program — semua dalam satu aliran."
                  : "From 60-second check-in to program match — all in one flow."}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Glossy overlay dots */}
      <div className="pointer-events-none absolute inset-x-0 top-3 flex gap-1.5 justify-start pl-4 opacity-40">
        <span className="size-2 rounded-full bg-red-400" />
        <span className="size-2 rounded-full bg-amber-400" />
        <span className="size-2 rounded-full bg-emerald-400" />
      </div>
    </motion.div>
  );
}
