"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Trash2, ShieldCheck, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeading } from "@/components/page-heading";
import { useLocale } from "@/components/locale-provider";
import { createClient } from "@/lib/supabase/client";

/**
 * Account settings — minimal for the hackathon: show who's logged in, link to
 * the legal pages, and provide the PDPA-mandated "delete account" flow.
 *
 * Deletion requires typing the word DELETE (EN) or PADAM (BM) so one wrong
 * tap doesn't nuke a user's data.
 */
export default function SettingsPage() {
  const { locale } = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [handle, setHandle] = useState<string | null>(null);
  const [consentAt, setConsentAt] = useState<string | null>(null);
  const [confirm, setConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requiredWord = locale === "bm" ? "PADAM" : "DELETE";
  const canDelete = confirm.trim().toUpperCase() === requiredWord;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/auth/login");
        return;
      }
      setEmail(data.user.email ?? null);
      const meta = data.user.user_metadata ?? {};
      setHandle(typeof meta.handle === "string" ? meta.handle : null);
      setConsentAt(
        typeof meta.pdpa_consent_at === "string" ? meta.pdpa_consent_at : null,
      );
    });
  }, [router]);

  async function handleDelete() {
    if (!canDelete || deleting) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? `HTTP ${res.status}`);
      }
      // Make doubly sure the client auth state is cleared before we leave.
      await createClient().auth.signOut();
      router.push("/?deleted=1");
      router.refresh();
    } catch (err) {
      console.error("[settings/delete] failed:", err);
      setError(
        locale === "bm"
          ? "Tidak dapat memadam akaun. Sila hubungi privacy@sahabat-ai.example."
          : "Couldn't delete your account. Please contact privacy@sahabat-ai.example.",
      );
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeading
        title={locale === "bm" ? "Tetapan" : "Settings"}
        subtitle={
          locale === "bm"
            ? "Akaun, privasi, dan kawalan data anda."
            : "Your account, privacy, and data controls."
        }
      />

      {/* Account identity */}
      <Card className="rounded-2xl border-border/60 soft-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            {locale === "bm" ? "Akaun" : "Account"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-muted-foreground">
              {locale === "bm" ? "E-mel" : "Email"}
            </span>
            <span className="col-span-2 font-medium">{email ?? "—"}</span>
          </div>
          {handle && (
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">
                {locale === "bm" ? "Nama samaran" : "Handle"}
              </span>
              <span className="col-span-2 font-medium">{handle}</span>
            </div>
          )}
          {consentAt && (
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">
                {locale === "bm"
                  ? "Persetujuan PDPA diberi"
                  : "PDPA consent given"}
              </span>
              <span className="col-span-2 font-medium">
                {new Date(consentAt).toLocaleDateString(
                  locale === "bm" ? "ms-MY" : "en-MY",
                  { day: "numeric", month: "long", year: "numeric" },
                )}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legal documents */}
      <Card className="rounded-2xl border-border/60 soft-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="size-4 text-primary" />
            {locale === "bm" ? "Dokumen undang-undang" : "Legal documents"}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
          {[
            {
              href: "/legal/privacy",
              en: "Privacy Policy",
              bm: "Polisi Privasi",
            },
            {
              href: "/legal/terms",
              en: "Terms of Service",
              bm: "Terma Perkhidmatan",
            },
            {
              href: "/legal/pdpa-notice",
              en: "PDPA Notice",
              bm: "Notis PDPA",
            },
            {
              href: "/legal/crisis-policy",
              en: "Crisis Policy",
              bm: "Polisi Krisis",
            },
          ].map((doc) => (
            <Link
              key={doc.href}
              href={doc.href}
              className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2 hover:border-primary/60 hover:text-primary transition"
            >
              <span>{locale === "bm" ? doc.bm : doc.en}</span>
              <ExternalLink className="size-3.5" />
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Danger zone — delete account */}
      <Card className="rounded-2xl border-[color:var(--destructive)]/40 bg-[color:var(--destructive)]/5">
        <CardHeader>
          <CardTitle className="text-lg text-[color:var(--destructive)] flex items-center gap-2">
            <Trash2 className="size-4" />
            {locale === "bm" ? "Padam akaun" : "Delete account"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="leading-relaxed text-foreground/90">
            {locale === "bm"
              ? "Ini akan memadam akaun, sembang, semakan, dan skor kesejahteraan anda secara kekal. Tidak boleh diundur. Proses selesai dalam 30 hari (termasuk simpanan sandaran)."
              : "This permanently deletes your account, chats, check-ins, and wellbeing scores. It cannot be undone. The process completes within 30 days (including backup copies)."}
          </p>
          <p className="leading-relaxed text-foreground/80">
            {locale === "bm"
              ? "Untuk teruskan, taip"
              : "To continue, type"}{" "}
            <strong>{requiredWord}</strong>{" "}
            {locale === "bm"
              ? "di bawah."
              : "below."}
          </p>
          <div className="space-y-2 max-w-xs">
            <Label htmlFor="confirm" className="sr-only">
              {locale === "bm" ? "Pengesahan" : "Confirmation"}
            </Label>
            <Input
              id="confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={requiredWord}
              autoComplete="off"
              disabled={deleting}
            />
          </div>
          {error && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-destructive">
              {error}
            </div>
          )}
          <Button
            type="button"
            variant="destructive"
            className="rounded-full gap-2"
            disabled={!canDelete || deleting}
            onClick={handleDelete}
          >
            {deleting && <Loader2 className="size-4 animate-spin" />}
            <Trash2 className="size-4" />
            {locale === "bm"
              ? "Padam akaun saya secara kekal"
              : "Permanently delete my account"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
