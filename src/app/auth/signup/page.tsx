"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/components/locale-provider";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ageOk, setAgeOk] = useState(false);
  const [consentOk, setConsentOk] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const handle = String(form.get("handle") ?? "").trim();

    if (!email || !password) return;

    // Hard gate — never hit Supabase without both boxes ticked. The PDPA
    // notice + privacy policy explicitly rely on "explicit consent" as the
    // lawful basis; collecting sensitive personal data before that tick
    // would be unlawful under s.40 PDPA 2010.
    if (!ageOk || !consentOk) {
      setError(
        locale === "bm"
          ? "Sila tandakan kedua-dua kotak sebelum mendaftar."
          : "Please tick both boxes before signing up.",
      );
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            handle: handle || null,
            language_pref: locale,
            pdpa_consent_at: new Date().toISOString(),
            pdpa_consent_version: "2026-04-24",
            age_confirmed_15_plus: true,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      // If email confirmations are enabled, `session` will be null and the user
      // needs to confirm via email. Otherwise we have a session immediately.
      if (!data.session) {
        setError(
          locale === "bm"
            ? "Semak e-mel anda untuk pengesahan. Selepas itu, log masuk."
            : "Check your email to confirm, then log in.",
        );
        return;
      }

      router.push("/app/chat");
      router.refresh();
    } catch (err) {
      console.error("[signup] failed:", err);
      setError(
        locale === "bm"
          ? "Tidak dapat mendaftar. Cuba lagi."
          : "Couldn't sign up. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="rounded-2xl border-border/60 soft-shadow-lg">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">{t.auth.signupTitle}</CardTitle>
        <CardDescription>{t.auth.signupSubtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="handle">{t.auth.handle}</Label>
            <Input
              id="handle"
              name="handle"
              type="text"
              placeholder="e.g. rusa_senja"
              disabled={submitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t.auth.email}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@upm.edu.my"
              disabled={submitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t.auth.password}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              disabled={submitting}
            />
          </div>
          {/* PDPA consent gate — both boxes are required. */}
          <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/40 p-4 text-sm">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={ageOk}
                onChange={(e) => setAgeOk(e.target.checked)}
                className="mt-0.5 size-4 rounded border-border accent-[color:var(--primary)]"
                disabled={submitting}
              />
              <span className="leading-relaxed text-foreground/90">
                {locale === "bm" ? (
                  <>
                    Saya berumur <strong>15 tahun ke atas</strong>. Jika saya
                    bawah 18, ibu bapa atau penjaga saya telah menyemak
                    polisi ini bersama saya.
                  </>
                ) : (
                  <>
                    I am <strong>15 years of age or older</strong>. If I am
                    under 18, a parent or guardian has reviewed these
                    policies with me.
                  </>
                )}
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consentOk}
                onChange={(e) => setConsentOk(e.target.checked)}
                className="mt-0.5 size-4 rounded border-border accent-[color:var(--primary)]"
                disabled={submitting}
              />
              <span className="leading-relaxed text-foreground/90">
                {locale === "bm" ? (
                  <>
                    Saya bersetuju dengan{" "}
                    <Link
                      href="/legal/terms"
                      target="_blank"
                      className="text-primary underline underline-offset-2"
                    >
                      Terma Perkhidmatan
                    </Link>
                    ,{" "}
                    <Link
                      href="/legal/privacy"
                      target="_blank"
                      className="text-primary underline underline-offset-2"
                    >
                      Polisi Privasi
                    </Link>
                    , dan{" "}
                    <Link
                      href="/legal/pdpa-notice"
                      target="_blank"
                      className="text-primary underline underline-offset-2"
                    >
                      Notis PDPA
                    </Link>
                    . Saya memberi kebenaran nyata untuk memproses data
                    kesihatan mental sensitif saya.
                  </>
                ) : (
                  <>
                    I agree to the{" "}
                    <Link
                      href="/legal/terms"
                      target="_blank"
                      className="text-primary underline underline-offset-2"
                    >
                      Terms of Service
                    </Link>
                    ,{" "}
                    <Link
                      href="/legal/privacy"
                      target="_blank"
                      className="text-primary underline underline-offset-2"
                    >
                      Privacy Policy
                    </Link>
                    , and{" "}
                    <Link
                      href="/legal/pdpa-notice"
                      target="_blank"
                      className="text-primary underline underline-offset-2"
                    >
                      PDPA Notice
                    </Link>
                    . I give explicit consent to process my sensitive
                    mental-health data.
                  </>
                )}
              </span>
            </label>
          </div>

          {error && (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <Button
            type="submit"
            className="w-full rounded-full h-11 gap-2"
            disabled={submitting || !ageOk || !consentOk}
          >
            {submitting && <Loader2 className="size-4 animate-spin" />}
            {t.auth.signup}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t.auth.hasAccount}{" "}
          <Link
            href="/auth/login"
            className="font-medium text-primary hover:underline"
          >
            {t.nav.login}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
