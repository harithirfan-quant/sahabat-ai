"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, ExternalLink, Sparkles, Loader2, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/page-heading";
import { useLocale } from "@/components/locale-provider";

type Recommendation = {
  id: string;
  title: string;
  description: string;
  category: string | null;
  location: string | null;
  url: string | null;
  similarity: number;
  why: string;
};

type RecommendResponse = {
  programs: Recommendation[];
  coldStart?: boolean;
};

const SUGGESTED_INTERESTS = [
  "exam stress",
  "loneliness",
  "sleep",
  "movement",
  "creative",
  "peer support",
];

export default function DiscoverPage() {
  const { t, locale } = useLocale();
  const [programs, setPrograms] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [coldStart, setColdStart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeInterests, setActiveInterests] = useState<string[]>([]);

  async function load(interests: string[] = []) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests: interests.length > 0 ? interests : undefined,
          limit: 6,
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = (await res.json()) as RecommendResponse;
      setPrograms(data.programs ?? []);
      setColdStart(Boolean(data.coldStart));
    } catch (err) {
      console.error("[discover] load failed:", err);
      setError(
        locale === "bm"
          ? "Tak dapat muatkan cadangan. Cuba lagi."
          : "Couldn't load recommendations. Try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleInterest(tag: string) {
    setActiveInterests((prev) => {
      const next = prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag];
      load(next);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeading title={t.discover.title} subtitle={t.discover.subtitle} />

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-muted-foreground mr-1">
          {locale === "bm" ? "Minat" : "Interests"}
        </span>
        {SUGGESTED_INTERESTS.map((tag) => {
          const active = activeInterests.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleInterest(tag)}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {tag}
            </button>
          );
        })}
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto rounded-full gap-1.5"
          onClick={() => load(activeInterests)}
          disabled={loading}
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          {locale === "bm" ? "Muat semula" : "Refresh"}
        </Button>
      </div>

      {coldStart && !loading && (
        <div className="rounded-2xl border border-dashed border-border/60 bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
          {locale === "bm"
            ? "Kami cadangkan program yang paling membantu dulu. Bila awak chat lebih banyak dengan Sahabat, cadangan akan jadi lebih peribadi."
            : "Starter picks while we learn about you. The more you chat with Sahabat, the more personal these get."}
        </div>
      )}

      {error && !loading && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading && programs.length === 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card
              key={i}
              className="rounded-2xl border-border/60 soft-shadow animate-pulse"
            >
              <CardHeader>
                <div className="h-3 w-16 rounded-full bg-muted" />
                <div className="h-5 w-4/5 rounded-full bg-muted mt-2" />
                <div className="h-3 w-24 rounded-full bg-muted mt-2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-16 w-full rounded-2xl bg-muted" />
                <div className="h-9 w-full rounded-full bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : programs.length === 0 ? (
        <Card className="rounded-2xl border-border/60 soft-shadow">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Sparkles className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground max-w-sm">
              {locale === "bm"
                ? "Tiada padanan lagi. Chat sikit dengan Sahabat, kami akan cari yang sesuai."
                : "No matches yet. Chat a little with Sahabat and we'll find something that fits."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.05 }}
              className="flex"
            >
            <Card
              className="rounded-2xl border-border/60 soft-shadow hover:-translate-y-1 transition-transform flex flex-col w-full"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardDescription className="text-xs uppercase tracking-wide text-muted-foreground">
                    {p.category ?? (locale === "bm" ? "Program" : "Program")}
                  </CardDescription>
                  {p.similarity > 0 && (
                    <Badge
                      variant="secondary"
                      className="rounded-full text-[10px]"
                    >
                      {Math.round(p.similarity * 100)}%{" "}
                      {locale === "bm" ? "sepadan" : "match"}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg leading-snug">{p.title}</CardTitle>
                {p.location && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5" />
                    {p.location}
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {p.description}
                </p>
                <div className="rounded-2xl bg-secondary/60 p-3 text-sm leading-relaxed">
                  <div className="flex items-center gap-1.5 text-primary font-medium mb-1">
                    <Sparkles className="size-3.5" />
                    {locale === "bm"
                      ? "Kenapa ini sesuai"
                      : "Why this is for you"}
                  </div>
                  <p className="text-muted-foreground">{p.why}</p>
                </div>
                <div className="mt-auto">
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button variant="outline" className="w-full rounded-full gap-2">
                        {locale === "bm" ? "Ketahui lagi" : "Learn more"}{" "}
                        <ExternalLink className="size-3.5" />
                      </Button>
                    </a>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full rounded-full gap-2"
                      disabled
                    >
                      {locale === "bm" ? "Butiran tak tersedia" : "Details coming soon"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </div>
      )}

      {loading && programs.length > 0 && (
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          {locale === "bm" ? "Mencari padanan terbaik..." : "Finding better matches..."}
        </div>
      )}
    </div>
  );
}
