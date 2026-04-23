"use client";

import Link from "next/link";
import { PhoneCall, LifeBuoy, AlertCircle } from "lucide-react";
import { useLocale } from "@/components/locale-provider";

/**
 * CrisisBanner — designed to be visually unmissable.
 *
 * Red 2-stop gradient, pulsing alert icon, and oversized tel: buttons
 * with tabular-numbered helpline numbers. Always renders both Talian Kasih
 * and Befrienders KL. Use `compact` on navigation-heavy pages.
 */
export function CrisisBanner({ compact = false }: { compact?: boolean }) {
  const { t, locale } = useLocale();
  return (
    <div
      className={`w-full rounded-2xl border-2 border-red-500/60 bg-gradient-to-br from-red-50 to-rose-50 text-red-950 soft-shadow-lg overflow-hidden relative ${
        compact ? "p-4" : "p-5 md:p-6"
      }`}
      role="region"
      aria-label="Crisis helplines — call now"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.08),transparent_60%)] pointer-events-none" />

      <div className="relative flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="relative grid size-10 shrink-0 place-items-center rounded-2xl bg-red-600 text-white">
            <AlertCircle className="size-5" />
            <span className="absolute inset-0 rounded-2xl ring-4 ring-red-500/40 animate-ping" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold uppercase tracking-wider text-red-700">
              {locale === "bm" ? "Panggil sekarang" : "Call now"}
            </div>
            <div className="mt-0.5 text-base font-semibold leading-snug">
              <LifeBuoy className="size-4 inline-block mr-1.5 -mt-0.5" />
              {t.crisis.label}
            </div>
            {!compact && (
              <p className="mt-1 text-xs text-red-800/80 leading-relaxed">
                {locale === "bm"
                  ? "Bebas · 24 jam · dalam Bahasa Melayu & Inggeris."
                  : "Free · 24 hours · in Bahasa Melayu & English."}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <a
            href="tel:15999"
            className="group inline-flex items-center gap-3 rounded-2xl bg-red-600 px-4 py-3 text-white soft-shadow hover:bg-red-700 active:scale-[0.98] transition"
          >
            <PhoneCall className="size-5 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] uppercase tracking-wider text-red-100">
                Talian Kasih
              </span>
              <span className="text-xl font-bold tabular-nums tracking-tight">
                15999
              </span>
            </div>
          </a>

          <a
            href="tel:+60376272929"
            className="group inline-flex items-center gap-3 rounded-2xl border-2 border-red-600 bg-white px-4 py-3 text-red-700 soft-shadow hover:bg-red-50 active:scale-[0.98] transition"
          >
            <PhoneCall className="size-5 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] uppercase tracking-wider text-red-500">
                Befrienders KL
              </span>
              <span className="text-xl font-bold tabular-nums tracking-tight">
                03-7627 2929
              </span>
            </div>
          </a>
        </div>

        {!compact && (
          <p className="text-[11px] leading-relaxed text-red-800/80">
            {locale === "bm" ? (
              <>
                Bagaimana Sahabat mengendalikan mesej krisis?{" "}
                <Link
                  href="/legal/crisis-policy"
                  className="underline underline-offset-2 font-medium hover:text-red-900"
                >
                  Baca Polisi Krisis kami
                </Link>
                .
              </>
            ) : (
              <>
                How does Sahabat handle a crisis message?{" "}
                <Link
                  href="/legal/crisis-policy"
                  className="underline underline-offset-2 font-medium hover:text-red-900"
                >
                  Read our Crisis Policy
                </Link>
                .
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
