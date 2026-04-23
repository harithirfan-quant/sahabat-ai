"use client";

import Link from "next/link";
import { useLocale } from "@/components/locale-provider";

/**
 * AppLegalFooter — lightweight footer shown inside the app shell.
 *
 * Deliberately quiet (single line of muted links) so it doesn't compete with
 * the bottom nav on mobile. Uses locale-aware labels.
 */
export function AppLegalFooter() {
  const { locale } = useLocale();

  const labels =
    locale === "bm"
      ? {
          privacy: "Privasi",
          terms: "Terma",
          pdpa: "PDPA",
          crisis: "Krisis",
          settings: "Tetapan",
        }
      : {
          privacy: "Privacy",
          terms: "Terms",
          pdpa: "PDPA",
          crisis: "Crisis",
          settings: "Settings",
        };

  return (
    <footer className="mt-12 border-t border-border/60 pt-5 text-xs text-muted-foreground">
      <nav className="flex flex-wrap gap-x-5 gap-y-2">
        <Link href="/legal/privacy" className="hover:text-primary transition">
          {labels.privacy}
        </Link>
        <Link href="/legal/terms" className="hover:text-primary transition">
          {labels.terms}
        </Link>
        <Link
          href="/legal/pdpa-notice"
          className="hover:text-primary transition"
        >
          {labels.pdpa}
        </Link>
        <Link
          href="/legal/crisis-policy"
          className="hover:text-primary transition"
        >
          {labels.crisis}
        </Link>
        <Link
          href="/app/settings"
          className="ml-auto hover:text-primary transition"
        >
          {labels.settings}
        </Link>
      </nav>
    </footer>
  );
}
