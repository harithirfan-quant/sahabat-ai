"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Loader2,
  Info,
} from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type WellbeingTier = "green" | "yellow" | "orange" | "red";

type TrendPoint = { computed_at: string; score: number; tier: WellbeingTier };

type WellbeingResponse = {
  score: number;
  tier: WellbeingTier;
  top_factors?: { label: string; copy: string }[];
  trend: TrendPoint[];
  computed_at?: string;
};

type InsightResponse = {
  insight: string;
  generatedAt: string;
};

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

// ---------------------------------------------------------------------------
// Tier → color system
// ---------------------------------------------------------------------------

const TIER_STYLES: Record<
  WellbeingTier,
  { label: string; ring: string; text: string; bg: string; hex: string }
> = {
  green: {
    label: "Green",
    ring: "stroke-[color:var(--tier-green)]",
    text: "text-[color:var(--tier-green)]",
    bg: "bg-[color:var(--tier-green)]/10",
    hex: "#52B788",
  },
  yellow: {
    label: "Yellow",
    ring: "stroke-[color:var(--tier-yellow)]",
    text: "text-[color:var(--tier-yellow)]",
    bg: "bg-[color:var(--tier-yellow)]/10",
    hex: "#F4A261",
  },
  orange: {
    label: "Orange",
    ring: "stroke-[color:var(--tier-orange)]",
    text: "text-[color:var(--tier-orange)]",
    bg: "bg-[color:var(--tier-orange)]/10",
    hex: "#E76F51",
  },
  red: {
    label: "Red",
    ring: "stroke-[color:var(--tier-red)]",
    text: "text-[color:var(--tier-red)]",
    bg: "bg-[color:var(--tier-red)]/10",
    hex: "#E63946",
  },
};

// ---------------------------------------------------------------------------
// Circular score gauge (SVG)
// ---------------------------------------------------------------------------

function ScoreRing({
  score,
  tier,
  size = 176,
  stroke = 14,
}: {
  score: number;
  tier: WellbeingTier;
  size?: number;
  stroke?: number;
}) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const style = TIER_STYLES[tier];

  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          className="stroke-secondary"
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          className={style.ring}
          fill="none"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-semibold tracking-tight tabular-nums">
          {clamped}
        </span>
        <span className="text-xs text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Streak: consecutive days with at least one wellbeing score ending today.
// ---------------------------------------------------------------------------

function computeStreak(trend: TrendPoint[]): number {
  if (trend.length === 0) return 0;
  const days = new Set<string>();
  for (const p of trend) {
    const d = new Date(p.computed_at);
    days.add(
      `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
    );
  }
  let streak = 0;
  const cursor = new Date();
  for (let i = 0; i < 60; i++) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    if (days.has(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const { t, locale } = useLocale();

  const [wellbeing, setWellbeing] = useState<WellbeingResponse | null>(null);
  const [wellbeingErr, setWellbeingErr] = useState<string | null>(null);
  const [wellbeingLoading, setWellbeingLoading] = useState(true);

  const [insight, setInsight] = useState<InsightResponse | null>(null);
  const [insightLoading, setInsightLoading] = useState(true);

  const [suggestion, setSuggestion] = useState<Recommendation | null>(null);
  const [suggestionLoading, setSuggestionLoading] = useState(true);

  // Fetch all three in parallel on mount.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/wellbeing-score", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as WellbeingResponse;
        if (!cancelled) setWellbeing(data);
      } catch (err) {
        console.error("[dashboard] wellbeing failed:", err);
        if (!cancelled)
          setWellbeingErr(
            locale === "bm"
              ? "Tak dapat kira skor kesejahteraan sekarang."
              : "Couldn't load your wellbeing score right now.",
          );
      } finally {
        if (!cancelled) setWellbeingLoading(false);
      }
    })();

    (async () => {
      try {
        const res = await fetch("/api/insight", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as InsightResponse;
        if (!cancelled) setInsight(data);
      } catch (err) {
        console.error("[dashboard] insight failed:", err);
      } finally {
        if (!cancelled) setInsightLoading(false);
      }
    })();

    (async () => {
      try {
        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ limit: 1 }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { programs: Recommendation[] };
        if (!cancelled) setSuggestion(data.programs?.[0] ?? null);
      } catch (err) {
        console.error("[dashboard] suggestion failed:", err);
      } finally {
        if (!cancelled) setSuggestionLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [locale]);

  // Derived values ------------------------------------------------------------

  const trend = wellbeing?.trend ?? [];
  const currentScore = wellbeing?.score ?? 0;
  const currentTier: WellbeingTier = wellbeing?.tier ?? "green";
  const style = TIER_STYLES[currentTier];
  const streak = useMemo(() => computeStreak(trend), [trend]);

  const chartData = useMemo(
    () =>
      trend.map((p) => {
        const d = new Date(p.computed_at);
        return {
          day: `${d.getDate()}/${d.getMonth() + 1}`,
          score: p.score,
        };
      }),
    [trend],
  );

  // Render --------------------------------------------------------------------

  return (
    <div className="flex flex-col gap-5">
      <PageHeading title={t.dashboard.title} subtitle={t.dashboard.subtitle} />

      {wellbeingErr && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {wellbeingErr}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-3">
        {/* ===== Score ring ====================================== */}
        <Card className="rounded-2xl border-border/60 soft-shadow md:col-span-1">
          <CardHeader>
            <CardDescription>{t.dashboard.score}</CardDescription>
            <CardTitle className="text-lg">
              {locale === "bm" ? "Sekarang" : "Right now"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pt-2">
            {wellbeingLoading ? (
              <div className="grid size-44 place-items-center">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ScoreRing score={currentScore} tier={currentTier} />
            )}
            {!wellbeingLoading && (
              <Badge
                className={`rounded-full border-none ${style.bg} ${style.text}`}
              >
                {locale === "bm"
                  ? {
                      green: "Hijau",
                      yellow: "Kuning",
                      orange: "Jingga",
                      red: "Merah",
                    }[currentTier]
                  : style.label}
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* ===== Streak ====================================== */}
        <Card className="rounded-2xl border-border/60 soft-shadow">
          <CardHeader>
            <CardDescription>{t.dashboard.streak}</CardDescription>
            <CardTitle className="text-5xl font-semibold tracking-tight flex items-center gap-2">
              {wellbeingLoading ? (
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  {streak} <Flame className="size-8 text-[color:var(--accent)]" />
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {streak === 0
                ? locale === "bm"
                  ? "Mula semakan pertama hari ini."
                  : "Start your first check-in today."
                : streak < 3
                ? locale === "bm"
                  ? "Langkah kecil pun kira."
                  : "Small steps count."
                : locale === "bm"
                ? "Teruskan momentum ini 💪"
                : "Keep it going 💪"}
            </p>
          </CardContent>
        </Card>

        {/* ===== Today's suggestion (from recommender) ============ */}
        <Card className="rounded-2xl border-none bg-primary text-primary-foreground soft-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4" />
              <CardDescription className="text-primary-foreground/80">
                {t.dashboard.suggestion}
              </CardDescription>
            </div>
            <CardTitle className="mt-2 text-xl leading-snug">
              {suggestionLoading ? (
                <span className="inline-flex items-center gap-2 text-primary-foreground/80">
                  <Loader2 className="size-4 animate-spin" />
                  {locale === "bm" ? "Memilih..." : "Picking..."}
                </span>
              ) : suggestion ? (
                suggestion.title
              ) : locale === "bm" ? (
                "Chat dengan Sahabat — kami akan cari padanan yang sesuai."
              ) : (
                "Chat with Sahabat — we'll find a good match for you."
              )}
            </CardTitle>
          </CardHeader>
          {suggestion && (
            <CardContent className="space-y-3">
              <p className="text-sm text-primary-foreground/90 line-clamp-2">
                {suggestion.why || suggestion.description}
              </p>
              {suggestion.url ? (
                <a
                  href={suggestion.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="secondary"
                    className="rounded-full gap-2 bg-white/15 text-primary-foreground hover:bg-white/25 border-0"
                    size="sm"
                  >
                    {locale === "bm" ? "Ketahui lagi" : "Learn more"}
                    <ExternalLink className="size-3.5" />
                  </Button>
                </a>
              ) : null}
            </CardContent>
          )}
        </Card>
      </div>

      {/* ===== How you're trending (Claude insight) ===== */}
      <Card className="rounded-2xl border-border/60 soft-shadow bg-secondary/40">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="size-4 text-primary" />
            <CardTitle className="text-lg">
              {locale === "bm" ? "Trend anda" : "How you're trending"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {insightLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              {locale === "bm"
                ? "Sahabat sedang membaca 7 hari terakhir..."
                : "Sahabat is reading the last 7 days..."}
            </div>
          ) : insight ? (
            <p className="text-base leading-relaxed text-foreground/90">
              {insight.insight}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {locale === "bm"
                ? "Tiada ringkasan buat masa ini. Cuba check-in hari ini."
                : "No summary yet. Try a check-in today."}
            </p>
          )}
        </CardContent>
      </Card>

      {/* ===== Trend chart ===== */}
      <Card className="rounded-2xl border-border/60 soft-shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />
            <CardTitle className="text-lg">{t.dashboard.trend}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="h-64 md:h-80">
          {wellbeingLoading ? (
            <div className="grid h-full place-items-center">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="grid h-full place-items-center text-sm text-muted-foreground text-center px-6">
              {locale === "bm"
                ? "Belum ada data trend. Skor anda akan muncul di sini selepas beberapa hari semakan."
                : "No trend data yet. Your score will appear here after a few daily check-ins."}
            </div>
          ) : chartData.length === 1 ? (
            <LineChartSingle point={chartData[0]} color={style.hex} locale={locale} />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 8, right: 16, bottom: 0, left: -10 }}
              >
                <defs>
                  <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={style.hex} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={style.hex} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11 }}
                  stroke="#9ca3af"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke={style.hex}
                  strokeWidth={2.5}
                  fill="url(#scoreFill)"
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={style.hex}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LineChartSingle({
  point,
  color,
  locale,
}: {
  point: { day: string; score: number };
  color: string;
  locale: "en" | "bm";
}) {
  return (
    <div className="grid h-full place-items-center gap-2 text-center">
      <div
        className="text-4xl font-semibold tabular-nums"
        style={{ color }}
      >
        {point.score}
      </div>
      <div className="text-xs text-muted-foreground">
        {point.day} ·{" "}
        {locale === "bm"
          ? "satu mata sahaja — sambung semakan harian."
          : "one data point so far — keep checking in daily."}
      </div>
    </div>
  );
}
