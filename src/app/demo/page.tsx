"use client";

/**
 * /demo — a self-contained, instantly-populated walkthrough of SAHABAT.AI
 * for hackathon judges.
 *
 * No auth, no Supabase, no network calls. Everything renders from in-memory
 * seeded fixtures so the page is green on first paint. Intentionally mirrors
 * the real dashboard + discover + chat layouts so the judge sees the same
 * UI a student would after a week of use.
 */

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
import {
  ArrowRight,
  ArrowLeft,
  Flame,
  TrendingUp,
  Sparkles,
  ExternalLink,
  MapPin,
  MessageCircle,
  Info,
  PlayCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";
import { LocaleToggle } from "@/components/locale-toggle";
import { CrisisBanner } from "@/components/crisis-banner";
import { useLocale } from "@/components/locale-provider";

// ---------------------------------------------------------------------------
// Seeded demo data (stable — generated at module load, not per render)
// ---------------------------------------------------------------------------

type WellbeingTier = "green" | "yellow" | "orange" | "red";

const TIER_STYLES: Record<
  WellbeingTier,
  { label: string; ring: string; bg: string; text: string; hex: string }
> = {
  green: {
    label: "Green",
    ring: "stroke-[color:var(--tier-green)]",
    bg: "bg-[color:var(--tier-green)]/10",
    text: "text-[color:var(--tier-green)]",
    hex: "#52B788",
  },
  yellow: {
    label: "Yellow",
    ring: "stroke-[color:var(--tier-yellow)]",
    bg: "bg-[color:var(--tier-yellow)]/10",
    text: "text-[color:var(--tier-yellow)]",
    hex: "#F4A261",
  },
  orange: {
    label: "Orange",
    ring: "stroke-[color:var(--tier-orange)]",
    bg: "bg-[color:var(--tier-orange)]/10",
    text: "text-[color:var(--tier-orange)]",
    hex: "#E76F51",
  },
  red: {
    label: "Red",
    ring: "stroke-[color:var(--tier-red)]",
    bg: "bg-[color:var(--tier-red)]/10",
    text: "text-[color:var(--tier-red)]",
    hex: "#E63946",
  },
};

// A pleasant "yellow-trending-toward-green" 30-day curve. Fixed seed so it's
// identical across sessions — important for demos where judges compare.
const SEED_TREND: { day: string; score: number; tier: WellbeingTier }[] = (() => {
  const baseline = [
    48, 52, 50, 55, 53, 58, 56, 61, 59, 63, 60, 65, 62, 66, 64, 68, 67, 70, 69,
    72, 71, 74, 73, 75, 74, 76, 77, 75, 78, 76,
  ];
  const out: { day: string; score: number; tier: WellbeingTier }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const score = baseline[29 - i];
    const tier: WellbeingTier =
      score >= 75 ? "green" : score >= 55 ? "yellow" : score >= 35 ? "orange" : "red";
    out.push({ day: `${d.getDate()}/${d.getMonth() + 1}`, score, tier });
  }
  return out;
})();

const CURRENT_SCORE = SEED_TREND[SEED_TREND.length - 1].score;
const CURRENT_TIER = SEED_TREND[SEED_TREND.length - 1].tier;
const STREAK = 12;

const SEED_SUGGESTION = {
  title: "UPM Mindful Mornings",
  category: "Mindfulness · Students",
  location: "Serdang · Tue & Fri, 7:30am",
  why: "Short guided breathwork before lectures — a gentle match for the exam-week energy in your recent chats.",
  url: "https://upm.edu.my/wellbeing",
};

const SEED_INSIGHT = {
  en: "Your sleep stabilised around 7 hours this week and mood is climbing into the green. Keep the evening wind-downs going — one small watch-out: exam-stress mentions tick up mid-week.",
  bm: "Tidur anda stabil sekitar 7 jam minggu ini dan mood naik ke zon hijau. Teruskan rutin malam — satu perkara untuk diperhatikan: sebutan tekanan peperiksaan meningkat pada pertengahan minggu.",
};

const SEED_PROGRAMS = [
  {
    id: "p1",
    title: "UPM Mindful Mornings",
    category: "Mindfulness",
    location: "Serdang · Tue & Fri",
    similarity: 0.87,
    why: "Guided breathwork in 10 minutes — fits the exam-week energy you mentioned.",
    url: "https://upm.edu.my/wellbeing",
  },
  {
    id: "p2",
    title: "MIASA Peer Support Circle",
    category: "Peer Support",
    location: "PJ · Weekly",
    similarity: 0.82,
    why: "Small group of youth who've been through similar — safe, free, judgement-free.",
    url: "https://miasa.org.my",
  },
  {
    id: "p3",
    title: "R.AGE Youth Storytelling Lab",
    category: "Creative",
    location: "KL · Hybrid",
    similarity: 0.74,
    why: "Turn what you're carrying into writing or a podcast. Others will hear it.",
    url: "https://rage.com.my",
  },
  {
    id: "p4",
    title: "KBS MyBelia Sukan Harian",
    category: "Movement",
    location: "Nationwide",
    similarity: 0.69,
    why: "30-minute sport meetups — great when sleep dips like yours did last week.",
    url: "https://kbs.gov.my/mybelia",
  },
];

const SEED_CHAT: {
  role: "user" | "assistant";
  content: { en: string; bm: string };
}[] = [
  {
    role: "user",
    content: {
      en: "Finals next week and I can't sleep past 3am anymore 😞",
      bm: "Final minggu depan dan aku tak boleh tidur selepas 3 pagi dah 😞",
    },
  },
  {
    role: "assistant",
    content: {
      en: "That sounds exhausting — two things pulling at once. Before we talk about study, what usually happens in your head around 2am?",
      bm: "Bunyinya melelahkan — dua perkara menarik serentak. Sebelum kita bincang tentang belajar, apa biasanya bermain dalam fikiran awak sekitar jam 2 pagi?",
    },
  },
  {
    role: "user",
    content: {
      en: "Just lists. Everything I haven't done. And then I feel guilty for not sleeping.",
      bm: "Senarai je. Semua benda yang belum siap. Lepas tu rasa bersalah sebab tak tidur.",
    },
  },
  {
    role: "assistant",
    content: {
      en: "That guilt loop is brutal. Tonight, one small experiment: dump the list onto paper at 9pm. Not to solve — just to put it somewhere outside your head.",
      bm: "Loop rasa bersalah tu memang menyiksa. Malam ni, satu eksperimen kecil: tulis senarai tu atas kertas pukul 9 malam. Bukan nak selesaikan — letak sahaja di luar kepala.",
    },
  },
];

const ADMIN_TIERS = [
  { tier: "green" as WellbeingTier, label: "Green", color: "#52B788", value: 412 },
  { tier: "yellow" as WellbeingTier, label: "Yellow", color: "#F4A261", value: 188 },
  { tier: "orange" as WellbeingTier, label: "Orange", color: "#E76F51", value: 64 },
  { tier: "red" as WellbeingTier, label: "Red", color: "#E63946", value: 19 },
];

const ADMIN_TOPICS = [
  { topic: "exam_stress", label: "Exam stress", count: 142 },
  { topic: "loneliness", label: "Loneliness", count: 117 },
  { topic: "sleep", label: "Sleep", count: 98 },
  { topic: "family", label: "Family", count: 71 },
  { topic: "finance", label: "Finance", count: 58 },
  { topic: "anxiety", label: "Anxiety", count: 46 },
];

// ---------------------------------------------------------------------------
// ScoreRing (duplicated here to keep /demo standalone)
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
          transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-5xl font-semibold tracking-tight tabular-nums"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          {clamped}
        </motion.span>
        <span className="text-xs text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT, delay: i * 0.05 },
  }),
};

export default function DemoPage() {
  const { locale } = useLocale();
  const style = TIER_STYLES[CURRENT_TIER];
  const chartData = SEED_TREND.map(({ day, score }) => ({ day, score }));

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      {/* ============ Header ============ */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/75 border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <BrandMark href="/" />
          <Badge
            variant="secondary"
            className="rounded-full hidden sm:inline-flex gap-1"
          >
            <PlayCircle className="size-3" />
            {locale === "bm" ? "Mod demo · data contoh" : "Demo mode · sample data"}
          </Badge>
          <div className="ml-auto flex items-center gap-2">
            <LocaleToggle />
            <Link
              href="/"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className: "rounded-full gap-1.5",
              })}
            >
              <ArrowLeft className="size-4" />
              {locale === "bm" ? "Kembali" : "Back"}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6 space-y-8">
        {/* ============ Intro ============ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-2"
        >
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            {locale === "bm"
              ? "Walkthrough pantas"
              : "Instant walkthrough"}
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            {locale === "bm"
              ? "Ini yang pengguna lihat selepas seminggu check-in. Data ini contoh — cuba versi sebenar dengan log masuk."
              : "This is what a user sees after a week of check-ins. The data here is seeded — try the real thing by signing in."}
          </p>
        </motion.div>

        {/* ============ Dashboard top row ============ */}
        <section className="grid gap-5 md:grid-cols-3">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <Card className="rounded-2xl border-border/60 soft-shadow h-full">
              <CardHeader>
                <CardDescription>
                  {locale === "bm" ? "Skor kesejahteraan" : "Wellbeing score"}
                </CardDescription>
                <CardTitle className="text-lg">
                  {locale === "bm" ? "Sekarang" : "Right now"}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4 pt-2">
                <ScoreRing score={CURRENT_SCORE} tier={CURRENT_TIER} />
                <Badge
                  className={`rounded-full border-none ${style.bg} ${style.text}`}
                >
                  {locale === "bm"
                    ? {
                        green: "Hijau",
                        yellow: "Kuning",
                        orange: "Jingga",
                        red: "Merah",
                      }[CURRENT_TIER]
                    : style.label}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
          >
            <Card className="rounded-2xl border-border/60 soft-shadow h-full">
              <CardHeader>
                <CardDescription>
                  {locale === "bm" ? "Hari berturut" : "Day streak"}
                </CardDescription>
                <CardTitle className="text-5xl font-semibold tracking-tight flex items-center gap-2">
                  {STREAK} <Flame className="size-8 text-[color:var(--accent)]" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {locale === "bm"
                    ? "Teruskan momentum ini 💪"
                    : "Keep it going 💪"}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
          >
            <Card className="rounded-2xl border-none bg-primary text-primary-foreground soft-shadow h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4" />
                  <CardDescription className="text-primary-foreground/80">
                    {locale === "bm" ? "Cadangan hari ini" : "Today's suggestion"}
                  </CardDescription>
                </div>
                <CardTitle className="mt-2 text-xl leading-snug">
                  {SEED_SUGGESTION.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-primary-foreground/90">
                  {SEED_SUGGESTION.why}
                </p>
                <a
                  href={SEED_SUGGESTION.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full gap-2 bg-white/15 text-primary-foreground hover:bg-white/25 border-0"
                  >
                    {locale === "bm" ? "Ketahui lagi" : "Learn more"}
                    <ExternalLink className="size-3.5" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* ============ Claude insight ============ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={3}
        >
          <Card className="rounded-2xl border-border/60 soft-shadow bg-secondary/40">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Info className="size-4 text-primary" />
                <CardTitle className="text-lg">
                  {locale === "bm" ? "Trend anda" : "How you're trending"}
                </CardTitle>
                <Badge variant="secondary" className="rounded-full text-[10px] ml-auto">
                  {locale === "bm" ? "Ditulis oleh Claude" : "Written by Claude"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed text-foreground/90">
                {SEED_INSIGHT[locale]}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* ============ Trend chart ============ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={4}
        >
          <Card className="rounded-2xl border-border/60 soft-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" />
                <CardTitle className="text-lg">
                  {locale === "bm" ? "Trend 30 hari" : "30-day trend"}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 8, right: 16, bottom: 0, left: -10 }}
                >
                  <defs>
                    <linearGradient id="demoScoreFill" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#demoScoreFill)"
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke={style.hex}
                    strokeWidth={2.5}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* ============ Chat preview ============ */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <MessageCircle className="size-5 text-primary" />
            <h2 className="text-xl font-semibold">
              {locale === "bm" ? "Satu perbualan baru-baru ini" : "A recent conversation"}
            </h2>
          </div>
          <Card className="rounded-2xl border-border/60 soft-shadow">
            <CardContent className="p-4 md:p-6 space-y-3">
              {SEED_CHAT.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.role === "user" ? 14 : -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.1 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {m.content[locale]}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* ============ Recommended programs ============ */}
        <section>
          <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              <h2 className="text-xl font-semibold">
                {locale === "bm" ? "Program untuk anda" : "Programs for you"}
              </h2>
            </div>
            <Link
              href="/app/discover"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className: "rounded-full gap-1.5",
              })}
            >
              {locale === "bm" ? "Lihat semua" : "See all"}
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {SEED_PROGRAMS.map((p, i) => (
              <motion.div
                key={p.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <Card className="rounded-2xl border-border/60 soft-shadow hover:-translate-y-1 transition-transform h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardDescription className="text-xs uppercase tracking-wide text-muted-foreground">
                        {p.category}
                      </CardDescription>
                      <Badge
                        variant="secondary"
                        className="rounded-full text-[10px]"
                      >
                        {Math.round(p.similarity * 100)}%{" "}
                        {locale === "bm" ? "sepadan" : "match"}
                      </Badge>
                    </div>
                    <CardTitle className="text-base leading-snug">
                      {p.title}
                    </CardTitle>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="size-3.5" />
                      {p.location}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-3">
                    <div className="rounded-2xl bg-secondary/60 p-3 text-xs leading-relaxed">
                      <div className="flex items-center gap-1.5 text-primary font-medium mb-1">
                        <Sparkles className="size-3" />
                        {locale === "bm"
                          ? "Kenapa ini sesuai"
                          : "Why this is for you"}
                      </div>
                      <p className="text-muted-foreground">{p.why}</p>
                    </div>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto"
                    >
                      <Button
                        variant="outline"
                        className="w-full rounded-full gap-2"
                        size="sm"
                      >
                        {locale === "bm" ? "Ketahui lagi" : "Learn more"}
                        <ExternalLink className="size-3.5" />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ============ Admin preview ============ */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" />
            <h2 className="text-xl font-semibold">
              {locale === "bm"
                ? "Yang dilihat rakan kongsi NGO / UPM / KBS"
                : "What NGO / UPM / KBS partners see"}
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <Card className="rounded-2xl border-border/60 soft-shadow md:col-span-1">
              <CardHeader>
                <CardDescription>
                  {locale === "bm"
                    ? "Taburan tahap kesejahteraan"
                    : "Wellbeing tier distribution"}
                </CardDescription>
                <CardTitle className="text-base">
                  {locale === "bm" ? "Kohort · 683 pengguna" : "Cohort · 683 users"}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ADMIN_TIERS}
                      innerRadius={40}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {ADMIN_TIERS.map((entry) => (
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
              </CardContent>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {ADMIN_TIERS.map((d) => (
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

            <Card className="rounded-2xl border-border/60 soft-shadow md:col-span-2">
              <CardHeader>
                <CardDescription>
                  {locale === "bm"
                    ? "Topik paling dibincangkan"
                    : "Most-discussed topics"}
                </CardDescription>
                <CardTitle className="text-base">
                  {locale === "bm"
                    ? "Peta haba · 30 hari · tanpa nama"
                    : "Heatmap · last 30 days · anonymised"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ADMIN_TOPICS.map((t) => {
                    const max = ADMIN_TOPICS[0].count;
                    const intensity = t.count / max;
                    const bg = `rgba(79, 70, 229, ${0.12 + intensity * 0.6})`;
                    return (
                      <div
                        key={t.topic}
                        className="rounded-2xl px-3 py-3 flex flex-col gap-1"
                        style={{ backgroundColor: bg }}
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
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ============ Crisis — always visible at bottom of demo ============ */}
        <CrisisBanner />

        {/* ============ CTA ============ */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <Card className="rounded-2xl border-none bg-primary text-primary-foreground soft-shadow-lg overflow-hidden relative">
            <div className="absolute -right-10 -top-10 size-48 rounded-full bg-accent/40 blur-3xl" />
            <CardContent className="relative p-10 md:p-14 grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                  {locale === "bm"
                    ? "Sedia cuba versi sebenar?"
                    : "Ready to try the real thing?"}
                </h2>
                <p className="mt-3 text-primary-foreground/85">
                  {locale === "bm"
                    ? "Percuma, tanpa nama, patuh PDPA."
                    : "Free, anonymous, PDPA-compliant."}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row md:justify-end gap-3">
                <Link
                  href="/auth/signup"
                  className={buttonVariants({
                    size: "lg",
                    variant: "secondary",
                    className:
                      "rounded-full h-12 px-6 text-base hover:-translate-y-0.5 transition-transform",
                  })}
                >
                  {locale === "bm" ? "Cipta akaun" : "Create account"}
                </Link>
                <Link
                  href="/app/chat"
                  className={buttonVariants({
                    size: "lg",
                    variant: "outline",
                    className:
                      "rounded-full h-12 px-6 text-base border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white hover:-translate-y-0.5 transition-transform",
                  })}
                >
                  {locale === "bm" ? "Mula berbual" : "Start chatting"}
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
