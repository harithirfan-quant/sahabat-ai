"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Loader2, Lock, RefreshCw, Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandMark } from "@/components/brand-mark";
import { LocaleToggle } from "@/components/locale-toggle";
import { PageHeading } from "@/components/page-heading";
import { useLocale } from "@/components/locale-provider";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TierDatum = {
  tier: "green" | "yellow" | "orange" | "red";
  label: string;
  color: string;
  value: number;
};

type TopicDatum = { topic: string; label: string; count: number };

type ProgramDatum = {
  id: string;
  title: string;
  category: string | null;
  signal: number;
};

type StatsResponse = {
  cohortSize: number;
  tierDistribution: TierDatum[];
  topicHeatmap: TopicDatum[];
  programLeaderboard: ProgramDatum[];
  generatedAt: string;
};

// ---------------------------------------------------------------------------
// PIN gate + fetcher
// ---------------------------------------------------------------------------

const PIN_STORAGE_KEY = "sahabat.admin.pin";

function AdminGate({
  onUnlocked,
}: {
  onUnlocked: (pin: string, stats: StatsResponse) => void;
}) {
  const { locale } = useLocale();
  const [pin, setPin] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-try cached pin on mount.
  useEffect(() => {
    const cached = localStorage.getItem(PIN_STORAGE_KEY);
    if (cached) {
      void attempt(cached);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function attempt(candidate: string) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: candidate }),
      });
      if (res.status === 401) {
        localStorage.removeItem(PIN_STORAGE_KEY);
        setError(locale === "bm" ? "PIN tidak sah." : "Invalid PIN.");
        return;
      }
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = (await res.json()) as StatsResponse;
      localStorage.setItem(PIN_STORAGE_KEY, candidate);
      onUnlocked(candidate, data);
    } catch (err) {
      console.error("[admin] attempt failed:", err);
      setError(
        locale === "bm"
          ? "Tak dapat sambung. Cuba lagi."
          : "Couldn't connect. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md w-full py-16">
      <Card className="rounded-2xl border-border/60 soft-shadow">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Lock className="size-5" />
          </div>
          <CardTitle>
            {locale === "bm"
              ? "Papan pemuka rakan kongsi"
              : "Partner dashboard"}
          </CardTitle>
          <CardDescription>
            {locale === "bm"
              ? "Masukkan PIN yang dikongsi oleh pasukan SAHABAT.AI untuk melihat statistik kohort tanpa nama."
              : "Enter the PIN shared by the SAHABAT.AI team to view anonymised cohort statistics."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pin.trim()) void attempt(pin.trim());
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="pin">PIN</Label>
              <Input
                id="pin"
                type="password"
                autoComplete="off"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••••"
                className="rounded-xl"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full rounded-full gap-2"
              disabled={submitting || pin.trim().length === 0}
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {locale === "bm" ? "Masuk" : "Unlock"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              {locale === "bm"
                ? "Demo: guna PIN hackathon yang dikongsi pasukan."
                : "Demo: use the hackathon PIN shared with your team."}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Topic heatmap — simple colored grid (no recharts required)
// ---------------------------------------------------------------------------

function TopicHeatmap({ topics }: { topics: TopicDatum[] }) {
  if (topics.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Not enough chat activity yet to surface topic trends.
      </p>
    );
  }
  const max = Math.max(...topics.map((t) => t.count), 1);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {topics.map((t) => {
        const intensity = t.count / max; // 0..1
        // Tailwind-free inline lerp: stronger → deeper indigo.
        const bg = `rgba(79, 70, 229, ${0.12 + intensity * 0.6})`;
        return (
          <div
            key={t.topic}
            className="rounded-2xl px-3 py-3 flex flex-col gap-1"
            style={{ backgroundColor: bg }}
            title={`${t.label}: ${t.count} mentions`}
          >
            <div
              className={`text-xs font-medium ${
                intensity > 0.45 ? "text-white" : "text-foreground/80"
              }`}
            >
              {t.label}
            </div>
            <div
              className={`text-lg font-semibold tabular-nums ${
                intensity > 0.45 ? "text-white" : "text-foreground"
              }`}
            >
              {t.count}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminPage() {
  const { t, locale } = useLocale();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [pin, setPin] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function refresh(pinToUse: string) {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinToUse }),
      });
      if (res.ok) {
        const data = (await res.json()) as StatsResponse;
        setStats(data);
      }
    } catch (err) {
      console.error("[admin] refresh failed:", err);
    } finally {
      setRefreshing(false);
    }
  }

  function handleUnlock(unlockedPin: string, firstStats: StatsResponse) {
    setPin(unlockedPin);
    setStats(firstStats);
  }

  function handleSignOut() {
    localStorage.removeItem(PIN_STORAGE_KEY);
    setPin(null);
    setStats(null);
  }

  const generatedAt = stats?.generatedAt
    ? new Date(stats.generatedAt).toLocaleString(
        locale === "bm" ? "ms-MY" : "en-MY",
      )
    : null;

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/75 border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <BrandMark href="/admin" />
          <Badge
            variant="secondary"
            className="rounded-full hidden sm:inline-flex gap-1"
          >
            <Shield className="size-3" />
            {locale === "bm"
              ? "Paparan rakan kongsi · tanpa nama"
              : "Partner view · anonymised"}
          </Badge>
          <div className="ml-auto flex items-center gap-2">
            {pin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="rounded-full"
              >
                {locale === "bm" ? "Keluar" : "Sign out"}
              </Button>
            )}
            <LocaleToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">
        {!pin || !stats ? (
          <AdminGate onUnlocked={handleUnlock} />
        ) : (
          <>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <PageHeading
                title={t.admin.title}
                subtitle={t.admin.subtitle}
              />
              <div className="flex items-center gap-2">
                {generatedAt && (
                  <span className="text-xs text-muted-foreground">
                    {locale === "bm" ? "Dikemaskini" : "Updated"} {generatedAt}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full gap-1.5"
                  onClick={() => refresh(pin)}
                  disabled={refreshing}
                >
                  <RefreshCw
                    className={`size-3.5 ${refreshing ? "animate-spin" : ""}`}
                  />
                  {locale === "bm" ? "Muat semula" : "Refresh"}
                </Button>
              </div>
            </div>

            {/* Cohort size strip */}
            <div className="grid gap-3 sm:grid-cols-3 mb-5">
              <Card className="rounded-2xl border-border/60 soft-shadow">
                <CardHeader>
                  <CardDescription>
                    {locale === "bm" ? "Saiz kohort aktif" : "Active cohort"}
                  </CardDescription>
                  <CardTitle className="text-3xl tabular-nums">
                    {stats.cohortSize}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  {locale === "bm"
                    ? "Pengguna dengan isyarat dalam 7–30 hari lalu"
                    : "Users with signals in the last 7–30 days"}
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-border/60 soft-shadow">
                <CardHeader>
                  <CardDescription>
                    {locale === "bm"
                      ? "% Hijau (sihat)"
                      : "% Green (healthy)"}
                  </CardDescription>
                  <CardTitle className="text-3xl tabular-nums text-emerald-600">
                    {percent(stats.tierDistribution, "green")}%
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="rounded-2xl border-border/60 soft-shadow">
                <CardHeader>
                  <CardDescription>
                    {locale === "bm"
                      ? "% Jingga + Merah (perlu sokongan)"
                      : "% Orange + Red (needs support)"}
                  </CardDescription>
                  <CardTitle className="text-3xl tabular-nums text-red-600">
                    {percent(stats.tierDistribution, "orange") +
                      percent(stats.tierDistribution, "red")}
                    %
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {/* ===== Tier donut ===== */}
              <Card className="rounded-2xl border-border/60 soft-shadow md:col-span-1">
                <CardHeader>
                  <CardDescription>
                    {locale === "bm"
                      ? "Taburan tahap kesejahteraan"
                      : "Wellbeing tier distribution"}
                  </CardDescription>
                  <CardTitle className="text-lg">
                    {locale === "bm" ? "Kohort · 7 hari lalu" : "Cohort · last 7 days"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  {stats.tierDistribution.every((d) => d.value === 0) ? (
                    <div className="grid h-full place-items-center text-sm text-muted-foreground text-center px-4">
                      {locale === "bm"
                        ? "Belum ada skor dikira dalam 7 hari lalu."
                        : "No scores computed in the last 7 days yet."}
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.tierDistribution}
                          innerRadius={50}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {stats.tierDistribution.map((entry) => (
                            <Cell key={entry.tier} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            border: "1px solid #e5e7eb",
                            fontSize: 12,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {stats.tierDistribution.map((d) => (
                      <div
                        key={d.tier}
                        className="flex items-center gap-1.5 text-xs"
                      >
                        <span
                          className="inline-block size-2.5 rounded-full"
                          style={{ backgroundColor: d.color }}
                        />
                        <span className="text-muted-foreground">
                          {d.label} · {d.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* ===== Topic heatmap ===== */}
              <Card className="rounded-2xl border-border/60 soft-shadow md:col-span-2">
                <CardHeader>
                  <CardDescription>
                    {locale === "bm" ? "Topik paling dibincangkan" : "Most-discussed topics"}
                  </CardDescription>
                  <CardTitle className="text-lg">
                    {locale === "bm"
                      ? "Peta haba · 30 hari · tanpa nama"
                      : "Heatmap · last 30 days · anonymised"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <TopicHeatmap topics={stats.topicHeatmap} />
                  {stats.topicHeatmap.length > 0 && (
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={stats.topicHeatmap.slice(0, 6)}
                          margin={{ top: 8, right: 10, bottom: 0, left: -10 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#eee"
                          />
                          <XAxis
                            dataKey="label"
                            tick={{ fontSize: 11 }}
                            stroke="#9ca3af"
                          />
                          <YAxis
                            tick={{ fontSize: 11 }}
                            stroke="#9ca3af"
                            allowDecimals={false}
                          />
                          <Tooltip
                            contentStyle={{
                              borderRadius: 12,
                              border: "1px solid #e5e7eb",
                              fontSize: 12,
                            }}
                          />
                          <Bar
                            dataKey="count"
                            fill="#4F46E5"
                            radius={[8, 8, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* ===== Program engagement leaderboard ===== */}
            <Card className="rounded-2xl border-border/60 soft-shadow mt-5">
              <CardHeader>
                <CardDescription>
                  {locale === "bm"
                    ? "Program paling relevan"
                    : "Highest-signal programs"}
                </CardDescription>
                <CardTitle className="text-lg">
                  {locale === "bm"
                    ? "Leaderboard rakan kongsi NGO / UPM / KBS"
                    : "NGO / UPM / KBS partner leaderboard"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.programLeaderboard.length === 0 ||
                stats.programLeaderboard.every((p) => p.signal === 0) ? (
                  <p className="text-sm text-muted-foreground">
                    {locale === "bm"
                      ? "Belum cukup data untuk menyusun program."
                      : "Not enough cohort signal yet to rank programs."}
                  </p>
                ) : (
                  <ul className="divide-y divide-border">
                    {stats.programLeaderboard.map((l, i) => (
                      <li
                        key={l.id}
                        className="py-3 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0">
                            {i + 1}
                          </span>
                          <div className="min-w-0">
                            <div className="font-medium truncate">
                              {l.title}
                            </div>
                            {l.category && (
                              <div className="text-xs text-muted-foreground">
                                {l.category}
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="rounded-full shrink-0"
                        >
                          {locale === "bm"
                            ? `isyarat ${l.signal}`
                            : `${l.signal} signal`}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}

function percent(dist: TierDatum[], tier: TierDatum["tier"]): number {
  const total = dist.reduce((a, d) => a + d.value, 0);
  if (total === 0) return 0;
  const v = dist.find((d) => d.tier === tier)?.value ?? 0;
  return Math.round((v / total) * 100);
}
