"use client";

/**
 * Buddy page — peer matching (DEMO MOCK).
 *
 * NOTE: Real peer-matching requires a backend that doesn't exist yet:
 *   - `match_opt_in` flag on public.users
 *   - pairing algorithm over shared tags / embeddings
 *   - a messages table + realtime chat + moderation + abuse reporting
 *
 * For ICYOUTH 2026 we ship a realistic UX shell so judges see the intended
 * flow. Opt-in state is persisted in localStorage; "Say hi" shows confirmation
 * without actually contacting anyone. The hardcoded buddies stand in for real
 * matches. Replace with a real backend post-hackathon.
 */

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  UserCircle2,
  ShieldCheck,
  Sparkles,
  Check,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeading } from "@/components/page-heading";
import { useLocale } from "@/components/locale-provider";

const buddies = [
  { handle: "rusa_senja", similarity: 87, tags: ["exam stress", "night owl", "KL"] },
  { handle: "awan_pagi", similarity: 81, tags: ["first year", "homesick", "Serdang"] },
  { handle: "lumba_lumba", similarity: 74, tags: ["creative", "introvert", "PJ"] },
];

const OPT_IN_KEY = "sahabat:buddy:opted_in";
const SAID_HI_KEY = "sahabat:buddy:said_hi";

export default function BuddyPage() {
  const { t, locale } = useLocale();
  const [optedIn, setOptedIn] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [saidHi, setSaidHi] = useState<Set<string>>(new Set());

  // Hydrate from localStorage on mount (skip during SSR).
  useEffect(() => {
    try {
      setOptedIn(localStorage.getItem(OPT_IN_KEY) === "1");
      const raw = localStorage.getItem(SAID_HI_KEY);
      if (raw) setSaidHi(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* private mode or quota — ignore */
    }
    setHydrated(true);
  }, []);

  function toggleOptIn() {
    if (toggling) return;
    setToggling(true);
    // Simulate a brief async save so the UI doesn't feel instant/placebo.
    setTimeout(() => {
      const next = !optedIn;
      setOptedIn(next);
      try {
        if (next) localStorage.setItem(OPT_IN_KEY, "1");
        else localStorage.removeItem(OPT_IN_KEY);
      } catch {
        /* ignore */
      }
      toast.success(
        next
          ? locale === "bm"
            ? "Kamu dah opt-in. Kami akan cari rakan sepadan."
            : "You're opted in. We'll find a buddy near your vibe."
          : locale === "bm"
            ? "Kamu dah keluar dari padanan."
            : "You've left matching.",
      );
      setToggling(false);
    }, 400);
  }

  function sayHi(handle: string) {
    if (!optedIn) {
      toast.error(
        locale === "bm"
          ? "Opt-in dulu untuk hantar sapaan."
          : "Opt in first to say hi.",
      );
      return;
    }
    if (saidHi.has(handle)) return;
    const next = new Set(saidHi);
    next.add(handle);
    setSaidHi(next);
    try {
      localStorage.setItem(SAID_HI_KEY, JSON.stringify(Array.from(next)));
    } catch {
      /* ignore */
    }
    toast.success(
      locale === "bm"
        ? `Sapaan tanpa nama dihantar kepada @${handle}. Kami akan beritahu bila mereka balas.`
        : `Anonymous hi sent to @${handle}. We'll ping you when they reply.`,
    );
  }

  const ctaLabel = !hydrated
    ? t.buddy.cta
    : optedIn
      ? locale === "bm"
        ? "Dah opt-in · Keluar"
        : "Opted in · Leave"
      : t.buddy.cta;

  return (
    <div className="flex flex-col gap-5">
      <PageHeading title={t.buddy.title} subtitle={t.buddy.subtitle} />

      <Card className="rounded-2xl border-none bg-secondary/70 soft-shadow">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <ShieldCheck className="size-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium">
              {optedIn
                ? locale === "bm"
                  ? "Kamu dalam padanan — tanpa nama."
                  : "You're in the pool — anonymously."
                : locale === "bm"
                  ? "Tanpa nama secara lalai."
                  : "Anonymous by default."}
            </p>
            <p className="text-sm text-muted-foreground">
              {locale === "bm"
                ? "Kami kongsi hanya apa yang kamu benarkan — tiada nama, tiada ID. Boleh keluar bila-bila masa."
                : "We share only what you opt-in to — no names, no IDs. Unmatch anytime."}
            </p>
          </div>
          <Button
            onClick={toggleOptIn}
            disabled={toggling || !hydrated}
            variant={optedIn ? "outline" : "default"}
            className="rounded-full h-11 px-6 gap-2"
          >
            {toggling ? (
              <Loader2 className="size-4 animate-spin" />
            ) : optedIn ? (
              <Check className="size-4" />
            ) : null}
            {ctaLabel}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-5 md:grid-cols-3">
        {buddies.map((b) => {
          const already = saidHi.has(b.handle);
          return (
            <Card
              key={b.handle}
              className="rounded-2xl border-border/60 soft-shadow"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <UserCircle2 className="size-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">@{b.handle}</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <Sparkles className="size-3 text-accent" />
                      {b.similarity}% match
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {b.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-full"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-full gap-2"
                  onClick={() => sayHi(b.handle)}
                  disabled={!optedIn || already}
                >
                  {already && <Check className="size-4" />}
                  {already
                    ? locale === "bm"
                      ? "Sapaan dihantar"
                      : "Hi sent"
                    : locale === "bm"
                      ? "Sapa"
                      : "Say hi"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
