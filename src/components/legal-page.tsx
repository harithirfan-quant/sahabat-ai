"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useLocale } from "@/components/locale-provider";

/**
 * LegalPage — shared shell for Privacy, Terms, PDPA, and Crisis Policy pages.
 *
 * Every legal page renders:
 *   - A visible "Hackathon prototype — not yet legal-reviewed" banner. This is
 *     an explicit, honest disclosure for ICYOUTH 2026 judges and early users.
 *     Remove the banner only after a Malaysian lawyer has reviewed the text.
 *   - A "Last updated" line with the effective date.
 *   - Bilingual content via the `content` prop: we render whichever the current
 *     locale matches, falling back to EN.
 *   - A "Back to home" link and prose styling.
 */

export type LegalContent = {
  title: string;
  subtitle?: string;
  body: React.ReactNode;
};

export function LegalPage({
  content,
  lastUpdatedISO,
}: {
  content: { en: LegalContent; bm: LegalContent };
  /** ISO date string, e.g. "2026-04-24". Parsed once, formatted per locale. */
  lastUpdatedISO: string;
}) {
  const { locale } = useLocale();
  const c = content[locale] ?? content.en;
  const lastUpdatedLabel = formatDate(lastUpdatedISO, locale);

  return (
    <article className="space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="size-4" />
        {locale === "bm" ? "Kembali ke laman utama" : "Back to home"}
      </Link>

      <header className="space-y-3">
        <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
          {c.title}
        </h1>
        {c.subtitle && (
          <p className="text-base md:text-lg text-muted-foreground">
            {c.subtitle}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {locale === "bm" ? "Kemas kini terakhir" : "Last updated"}:{" "}
          <time dateTime={lastUpdatedISO}>{lastUpdatedLabel}</time>
        </p>
      </header>

      {/* Hackathon honesty banner — remove only after formal legal review. */}
      <div
        role="note"
        className="flex gap-3 rounded-2xl border border-[color:var(--tier-yellow)]/40 bg-[color:var(--tier-yellow)]/10 p-4"
      >
        <AlertTriangle className="size-5 shrink-0 text-[color:var(--accent-hover)]" />
        <div className="text-sm leading-relaxed">
          <strong className="font-semibold">
            {locale === "bm"
              ? "Prototaip ICYOUTH 2026 — belum disemak secara rasmi oleh peguam."
              : "ICYOUTH 2026 prototype — not yet reviewed by a Malaysian lawyer."}
          </strong>{" "}
          {locale === "bm"
            ? "Kandungan ini disediakan dengan niat jujur dan mengikut rangka PDPA 2010 (pindaan 2024), tetapi ia BUKAN nasihat perundangan. Sebelum pelancaran awam sebenar, teks ini akan disemak dan diperkemas oleh peguam Malaysia yang pakar dalam PDPA + undang-undang kesihatan digital."
            : "This text is drafted in good faith along the PDPA 2010 (as amended 2024) framework, but it is NOT legal advice. Before any real public launch, a Malaysian lawyer familiar with PDPA + digital-health regulation will review and finalise the wording."}
        </div>
      </div>

      <div className="prose-sahabat space-y-6 text-foreground/90 leading-relaxed">
        {c.body}
      </div>

      <nav className="border-t border-border pt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <Link
          href="/legal/privacy"
          className="text-muted-foreground hover:text-primary transition"
        >
          {locale === "bm" ? "Polisi Privasi" : "Privacy Policy"}
        </Link>
        <Link
          href="/legal/terms"
          className="text-muted-foreground hover:text-primary transition"
        >
          {locale === "bm" ? "Terma Perkhidmatan" : "Terms of Service"}
        </Link>
        <Link
          href="/legal/pdpa-notice"
          className="text-muted-foreground hover:text-primary transition"
        >
          {locale === "bm" ? "Notis PDPA" : "PDPA Notice"}
        </Link>
        <Link
          href="/legal/crisis-policy"
          className="text-muted-foreground hover:text-primary transition"
        >
          {locale === "bm" ? "Polisi Krisis" : "Crisis Policy"}
        </Link>
      </nav>
    </article>
  );
}

function formatDate(iso: string, locale: "en" | "bm"): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(locale === "bm" ? "ms-MY" : "en-MY", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
