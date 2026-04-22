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

export default function LoginPage() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    if (!email || !password) return;

    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push("/app/chat");
      router.refresh();
    } catch (err) {
      console.error("[login] failed:", err);
      setError(
        locale === "bm"
          ? "Tidak dapat log masuk. Cuba lagi."
          : "Couldn't log in. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="rounded-2xl border-border/60 soft-shadow-lg">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">{t.auth.loginTitle}</CardTitle>
        <CardDescription>{t.auth.loginSubtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
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
              disabled={submitting}
            />
          </div>
          {error && (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <Button
            type="submit"
            className="w-full rounded-full h-11 gap-2"
            disabled={submitting}
          >
            {submitting && <Loader2 className="size-4 animate-spin" />}
            {t.auth.login}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t.auth.noAccount}{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-primary hover:underline"
          >
            {t.nav.signup}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
