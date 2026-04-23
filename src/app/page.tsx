"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  HeartPulse,
  BrainCircuit,
  Sparkles,
  Users,
  LifeBuoy,
  Flame,
  ShieldCheck,
  PlayCircle,
  Network,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { CrisisBanner } from "@/components/crisis-banner";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { DemoVideo } from "@/components/demo-video";
import { useLocale } from "@/components/locale-provider";

const featureIcons = [
  HeartPulse,
  BrainCircuit,
  Sparkles,
  Users,
  LifeBuoy,
  Flame,
] as const;

import type { Variants } from "framer-motion";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT, delay: i * 0.06 },
  }),
};

export default function LandingPage() {
  const { t, locale } = useLocale();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* ==================== Hero ==================== */}
        <section className="gradient-hero">
          <div className="mx-auto max-w-6xl px-4 pt-16 pb-24 md:pt-24 md:pb-32">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE_OUT }}
              className="flex flex-col items-center text-center"
            >
              <Badge
                variant="secondary"
                className="rounded-full bg-secondary text-secondary-foreground border-none px-4 py-1.5 text-xs font-medium"
              >
                <Sparkles className="size-3.5 mr-1.5" />
                {t.landing.heroBadge}
              </Badge>
              <h1 className="font-display mt-6 max-w-3xl text-5xl font-medium tracking-tight md:text-7xl leading-[1.02]">
                {t.landing.heroTitle}
              </h1>
              <p className="mt-6 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
                {t.landing.heroSubtitle}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link
                  href="/auth/signup"
                  className={buttonVariants({
                    size: "lg",
                    className:
                      "rounded-full h-12 px-6 text-base gap-2 hover:-translate-y-0.5 transition-transform",
                  })}
                >
                  {t.landing.tryDemo}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="#features"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className:
                      "rounded-full h-12 px-6 text-base gap-2 hover:-translate-y-0.5 transition-transform",
                  })}
                >
                  <PlayCircle className="size-4" />
                  {t.landing.seeFeatures}
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 text-accent-hover" />
                <span>
                  PDPA-compliant · Anonymous handles · Free for every Malaysian youth
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ==================== Problem (NHMS 2022) ==================== */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            custom={0}
          >
            <Card className="rounded-2xl border-none bg-secondary/70 soft-shadow">
              <CardContent className="p-8 md:p-12 grid md:grid-cols-5 gap-6 items-center">
                <div className="md:col-span-2">
                  <div className="font-display text-5xl md:text-6xl font-medium tracking-tight text-primary">
                    {t.landing.problemStat}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    NHMS 2022 · Institute for Public Health, Malaysia
                  </div>
                </div>
                <div className="md:col-span-3">
                  <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight">
                    {t.landing.problemTitle}
                  </h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {t.landing.problemBody}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* ==================== Demo video ==================== */}
        <section className="mx-auto max-w-6xl px-4 pb-12 md:pb-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
                {t.landing.demoTitle}
              </h2>
              <p className="mt-3 text-muted-foreground">
                {t.landing.demoSubtitle}
              </p>
            </div>
            <Link
              href="/demo"
              className={buttonVariants({
                variant: "outline",
                className:
                  "rounded-full self-start md:self-end gap-2 hover:-translate-y-0.5 transition-transform",
              })}
            >
              {t.landing.tryDemoInstant}
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <DemoVideo />
        </section>

        {/* ==================== Features ==================== */}
        <section
          id="features"
          className="mx-auto max-w-6xl px-4 py-12 md:py-20"
        >
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
              {t.landing.featuresTitle}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {t.landing.featuresSubtitle}
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {t.landing.features.map((f, i) => {
              const Icon = featureIcons[i] ?? Sparkles;
              return (
                <motion.div
                  key={f.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={fadeUp}
                  custom={i}
                >
                  <Card className="rounded-2xl border-border/60 soft-shadow hover:-translate-y-1 transition-transform h-full">
                    <CardHeader>
                      <div className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <CardTitle className="mt-4 text-lg">{f.title}</CardTitle>
                      <CardDescription className="leading-relaxed">
                        {f.body}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ==================== Architecture diagram ==================== */}
        <section className="mx-auto max-w-6xl px-4 py-12 md:py-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Network className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
                {t.landing.archTitle}
              </h2>
              <p className="mt-1 text-muted-foreground">
                {t.landing.archSubtitle}
              </p>
            </div>
          </div>
          <Card className="rounded-2xl border-border/60 soft-shadow">
            <CardContent className="p-6 md:p-10">
              <ArchitectureDiagram />
            </CardContent>
          </Card>
        </section>

        {/* ==================== CTA + Crisis ==================== */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-24 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            <Card className="rounded-2xl border-none bg-primary text-primary-foreground soft-shadow-lg overflow-hidden relative">
              <div className="absolute -right-10 -top-10 size-48 rounded-full bg-accent/40 blur-3xl" />
              <div className="absolute -left-10 -bottom-10 size-56 rounded-full bg-secondary/30 blur-3xl" />
              <CardContent className="relative p-10 md:p-14 grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight">
                    {t.landing.ctaTitle}
                  </h2>
                  <p className="mt-3 text-primary-foreground/85">
                    {t.landing.ctaBody}
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
                    {t.nav.getStarted}
                  </Link>
                  <Link
                    href="/demo"
                    className={buttonVariants({
                      size: "lg",
                      variant: "outline",
                      className:
                        "rounded-full h-12 px-6 text-base border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white hover:-translate-y-0.5 transition-transform",
                    })}
                  >
                    {t.landing.tryDemoInstant}
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <CrisisBanner />
        </section>

        <footer className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col gap-4 text-sm text-muted-foreground">
            <nav className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
              <Link
                href="/legal/privacy"
                className="hover:text-primary transition"
              >
                {locale === "bm" ? "Polisi Privasi" : "Privacy"}
              </Link>
              <Link
                href="/legal/terms"
                className="hover:text-primary transition"
              >
                {locale === "bm" ? "Terma" : "Terms"}
              </Link>
              <Link
                href="/legal/pdpa-notice"
                className="hover:text-primary transition"
              >
                {locale === "bm" ? "Notis PDPA" : "PDPA Notice"}
              </Link>
              <Link
                href="/legal/crisis-policy"
                className="hover:text-primary transition"
              >
                {locale === "bm" ? "Polisi Krisis" : "Crisis Policy"}
              </Link>
            </nav>
            <div className="flex flex-col md:flex-row items-center justify-between gap-2">
              <span>
                © {new Date().getFullYear()} SAHABAT.AI · ICYOUTH 2026 · UPM
              </span>
              <span>Built with Claude, Supabase, and Next.js.</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
