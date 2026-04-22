"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeading } from "@/components/page-heading";
import { useLocale } from "@/components/locale-provider";
import { createClient } from "@/lib/supabase/client";

const moods = [
  { v: 1, e: "😞" },
  { v: 3, e: "😕" },
  { v: 5, e: "😐" },
  { v: 7, e: "🙂" },
  { v: 9, e: "😄" },
];

// Start and end of "today" in the user's local timezone — used to find any
// existing check-in so we can update it instead of inserting a duplicate.
function todayBounds(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

export default function JournalPage() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const [mood, setMood] = useState<number | null>(null);
  const [sleep, setSleep] = useState(7);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [existingId, setExistingId] = useState<string | null>(null);

  // On mount: pull today's existing check-in (if any) and prefill.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          if (!cancelled) setLoading(false);
          return;
        }

        const { start, end } = todayBounds();
        const { data, error } = await supabase
          .from("journals")
          .select("id, mood_score, sleep_hours, note")
          .eq("user_id", user.id)
          .gte("created_at", start)
          .lt("created_at", end)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (cancelled) return;

        if (error) {
          console.error("[journal] prefill fetch failed:", error);
        } else if (data) {
          setExistingId(data.id);
          setMood(data.mood_score);
          setSleep(Number(data.sleep_hours ?? 7));
          setNote(data.note ?? "");
        }
      } catch (err) {
        console.error("[journal] mount error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave() {
    if (mood === null || saving) return;

    setSaving(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser();

      if (authErr || !user) {
        toast.error(
          locale === "bm" ? "Sila log masuk semula." : "Please sign in again.",
        );
        router.push("/auth/login");
        return;
      }

      const row = {
        user_id: user.id,
        mood_score: mood,
        sleep_hours: sleep,
        note: note.trim() || null,
      };

      // If we already have a row for today, update it — one check-in per day.
      const query = existingId
        ? supabase.from("journals").update(row).eq("id", existingId)
        : supabase.from("journals").insert(row);

      const { error } = await query;

      if (error) {
        console.error("[journal] save failed:", error);
        toast.error(
          locale === "bm"
            ? "Tak dapat simpan. Cuba lagi."
            : "Couldn't save. Try again.",
        );
        return;
      }

      toast.success(
        existingId
          ? locale === "bm"
            ? "Semakan hari ini dikemas kini."
            : "Today's check-in updated."
          : locale === "bm"
            ? "Tersimpan. Syabas!"
            : "Saved. Nice one!",
      );

      router.push("/app/dashboard");
      router.refresh();
    } catch (err) {
      console.error("[journal] save failed:", err);
      toast.error(
        locale === "bm"
          ? "Sesuatu tak kena. Cuba lagi."
          : "Something went wrong. Try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  const disabled = mood === null || saving || loading;
  const buttonLabel = existingId
    ? locale === "bm"
      ? "Kemas kini semakan"
      : "Update check-in"
    : t.journal.save;

  return (
    <div className="max-w-2xl mx-auto w-full">
      <PageHeading title={t.journal.title} subtitle={t.journal.subtitle} />

      {existingId && !loading && (
        <div className="mb-4 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
          {locale === "bm"
            ? "Kamu dah check-in hari ni. Simpan akan kemas kini semakan tadi."
            : "You already checked in today. Saving will update your earlier entry."}
        </div>
      )}

      <Card className="rounded-2xl border-border/60 soft-shadow">
        <CardContent className="p-6 md:p-8 space-y-6">
          {/* Mood */}
          <div className="space-y-3">
            <Label className="text-base">{t.journal.mood}</Label>
            <div className="grid grid-cols-5 gap-2">
              {moods.map((m) => (
                <button
                  key={m.v}
                  type="button"
                  onClick={() => setMood(m.v)}
                  disabled={saving || loading}
                  className={`rounded-2xl border p-4 text-3xl transition ${
                    mood === m.v
                      ? "border-primary bg-primary/10 soft-shadow"
                      : "border-border hover:bg-muted"
                  }`}
                  aria-label={`mood ${m.v}`}
                >
                  {m.e}
                </button>
              ))}
            </div>
          </div>

          {/* Sleep */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base" htmlFor="sleep">
                {t.journal.sleep}
              </Label>
              <span className="text-sm font-semibold text-primary">
                {sleep}h
              </span>
            </div>
            <input
              id="sleep"
              type="range"
              min={0}
              max={12}
              step={0.5}
              value={sleep}
              onChange={(e) => setSleep(Number(e.target.value))}
              disabled={saving || loading}
              className="w-full accent-[color:var(--primary)]"
            />
          </div>

          {/* Note */}
          <div className="space-y-3">
            <Label className="text-base" htmlFor="note">
              {t.journal.note}
            </Label>
            <Textarea
              id="note"
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="—"
              disabled={saving || loading}
              className="rounded-2xl"
            />
          </div>

          <Button
            type="button"
            onClick={handleSave}
            className="w-full rounded-full h-12 text-base gap-2"
            disabled={disabled}
          >
            {saving && <Loader2 className="size-4 animate-spin" />}
            {buttonLabel}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
