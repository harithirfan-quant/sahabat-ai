"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Send,
  Sparkles,
  PhoneCall,
  LifeBuoy,
  MapPin,
  ExternalLink,
  Heart,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PageHeading } from "@/components/page-heading";
import { useLocale } from "@/components/locale-provider";

type Role = "user" | "assistant" | "system";
type SafetyTier = "green" | "yellow" | "orange" | "red";

type Message = {
  id: string;
  role: Role;
  content: string;
  pending?: boolean;
  tier?: SafetyTier;
};

type CrisisPayload = {
  title: string;
  body: string;
  contacts: { name: string; number: string; tel: string; note: string }[];
};

// Keyword → suggested programs. Simple client-side heuristic for the demo
// side panel. The real recommender (vector search on /api/recommend) can
// replace this with an exact payload later.
const PROGRAM_SEEDS = [
  {
    keywords: ["exam", "study", "assignment", "peperiksaan", "kerja kursus"],
    title: "UPM Mindful Mornings",
    org: "UPM Wellbeing",
    location: "Serdang · Tue & Fri",
    blurb: "10-minute guided breathwork before class. No attendance list.",
  },
  {
    keywords: ["lonely", "alone", "sunyi", "seorang", "isolated"],
    title: "MIASA Peer Support Circle",
    org: "MIASA",
    location: "PJ · Weekly",
    blurb: "Small, safe group for youth feeling isolated. Free.",
  },
  {
    keywords: ["sleep", "tidur", "insomnia", "tired", "lelah"],
    title: "KBS MyBelia Sukan Harian",
    org: "KBS",
    location: "Nationwide",
    blurb: "Daily 30-minute sport meetups — great when sleep dips.",
  },
  {
    keywords: ["family", "keluarga", "parents", "ibu bapa"],
    title: "R.AGE Youth Storytelling Lab",
    org: "R.AGE",
    location: "KL · Hybrid",
    blurb: "Writing & podcasting workshops — turn your story into something shared.",
  },
] as const;

function recommendFromMessages(messages: Message[]) {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) return [];
  const text = lastUser.content.toLowerCase();
  return PROGRAM_SEEDS.filter((p) =>
    p.keywords.some((k) => text.includes(k.toLowerCase())),
  );
}

// Distinct BM markers — function words that virtually never appear in English.
// If we see any, we treat the message as BM for placeholder purposes.
const BM_MARKERS =
  /\b(saya|aku|tak|tidak|yang|apa|boleh|tidur|malam|pagi|rasa|lah|nak|hendak|macam|sudah|belum|dah|sangat|banyak|sikit|kecik|besar|kita|kami|mereka|dia|untuk|dari|pada|dengan|juga|kalau|tetapi|atau|bila|kenapa|mengapa|sekarang|hari|bermain|fikiran|anda|awak|terasa|tertekan|sunyi|sedih|gembira|suka|benci|cinta|rindu|keluarga|kawan|rakan|sekolah|universiti|kerja)\b/i;

function detectInputLang(text: string): "en" | "bm" {
  return BM_MARKERS.test(text) ? "bm" : "en";
}

export default function ChatPage() {
  const { t, locale } = useLocale();
  const suggestions = useMemo(
    () => [
      "I'm feeling stressed about exams",
      "I feel lonely lately",
      "Tak boleh tidur malam ni",
      "Saya rasa tertekan",
    ],
    [],
  );

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      role: "assistant",
      content:
        "Hey, I'm Sahabat. Take a breath — I'm here to listen. You can write in BM, English, or Manglish. What's on your mind?",
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [crisis, setCrisis] = useState<CrisisPayload | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Auto-scroll on new tokens.
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const recommended = useMemo(() => recommendFromMessages(messages), [messages]);

  // Placeholder follows the language of what the user is currently typing, then
  // the language of their most recent sent message, then the locale toggle.
  // This way the textarea hint never contradicts the user's own words.
  const placeholderLang = useMemo<"en" | "bm">(() => {
    if (input.trim().length >= 3) return detectInputLang(input);
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) return detectInputLang(lastUser.content);
    return locale;
  }, [input, messages, locale]);

  const placeholder =
    placeholderLang === "bm"
      ? "Apa yang bermain di fikiran anda hari ini?"
      : "What's on your mind today?";

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || streaming) return;

    const userId = crypto.randomUUID();
    const assistantId = crypto.randomUUID();
    const userMsg: Message = { id: userId, role: "user", content: text };
    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      pending: true,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setStreaming(true);
    setCrisis(null);

    // Build the payload from the full visible history (excluding the
    // placeholder assistant message we just appended). We also drop empty-
    // content messages so a previously-failed stream (0 tokens before error)
    // doesn't break the server's Zod `min(1)` validation.
    const payloadMessages = [
      ...messages
        .filter(
          (m) => m.role !== "system" && !m.pending && m.content.trim().length > 0,
        )
        .map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: text },
    ];

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const contentType = res.headers.get("content-type") ?? "";

      // --- Crisis branch (non-stream JSON) -----------------------------------
      if (contentType.includes("application/json")) {
        const data = (await res.json()) as
          | { type: "crisis"; message: string; payload: CrisisPayload }
          | { error: string };

        if ("type" in data && data.type === "crisis") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: data.message, pending: false, tier: "red" }
                : m,
            ),
          );
          setCrisis(data.payload);
        } else {
          toast.error("error" in data ? data.error : "Unexpected response");
        }
        return;
      }

      // --- Streaming branch (SSE) --------------------------------------------
      if (!res.body) throw new Error("no response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const evt of events) {
          const line = evt.trim();
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") continue;

          try {
            const obj = JSON.parse(data) as
              | { type: "meta"; tier: SafetyTier }
              | { type: "delta"; text: string }
              | { type: "done" }
              | { type: "error"; message: string };

            if (obj.type === "meta") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, tier: obj.tier } : m,
                ),
              );
            } else if (obj.type === "delta") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + obj.text, pending: true }
                    : m,
                ),
              );
            } else if (obj.type === "done") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, pending: false } : m,
                ),
              );
            } else if (obj.type === "error") {
              toast.error(obj.message);
            }
          } catch (e) {
            console.error("parse sse", e, data);
          }
        }
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, pending: false } : m)),
      );
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error(err);
        toast.error("Something went quiet. Try again?");
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  pending: false,
                  content:
                    m.content ||
                    "I'm having trouble right now — would you like to try again?",
                }
              : m,
          ),
        );
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-4 min-w-0">
        <PageHeading title={t.chat.title} subtitle={t.chat.subtitle} />

        {crisis ? <CrisisCard payload={crisis} /> : null}

        <Card className="rounded-2xl border-border/60 soft-shadow flex-1">
          <CardContent className="p-0 flex flex-col min-h-[60vh]">
            <div
              ref={scrollerRef}
              className="flex-1 overflow-y-auto flex flex-col gap-3 p-4 md:p-6"
            >
              {messages.map((m) => (
                <Bubble key={m.id} message={m} />
              ))}
            </div>

            <div className="border-t border-border p-3 md:p-4 flex flex-col gap-3 bg-background/60">
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <Badge
                    key={s}
                    variant="outline"
                    className={`rounded-full px-3 py-1.5 cursor-pointer transition ${
                      streaming
                        ? "opacity-50 pointer-events-none"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => send(s)}
                  >
                    <Sparkles className="size-3 mr-1.5 text-accent" />
                    {s}
                  </Badge>
                ))}
              </div>

              <form
                className="flex gap-2 items-end"
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
              >
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={placeholder}
                  rows={2}
                  disabled={streaming}
                  className="resize-none rounded-2xl"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon-lg"
                  className="rounded-full size-11 shrink-0"
                  disabled={streaming || !input.trim()}
                >
                  <Send className="size-4" />
                  <span className="sr-only">{t.chat.send}</span>
                </Button>
              </form>

              {/* AI honesty line + link to Crisis Policy. Kept short so it
                  doesn't feel like a lawyer shout. */}
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                {locale === "bm" ? (
                  <>
                    Sahabat adalah AI, bukan ahli terapi. Mesej anda melalui
                    Groq untuk menjana jawapan.{" "}
                    <Link
                      href="/legal/crisis-policy"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      Apa yang berlaku kepada mesej saya?
                    </Link>
                  </>
                ) : (
                  <>
                    Sahabat is an AI companion, not a therapist. Your message
                    passes through Groq to generate a reply.{" "}
                    <Link
                      href="/legal/crisis-policy"
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      What happens to my message?
                    </Link>
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <aside className="flex flex-col gap-4">
        <Card className="rounded-2xl border-border/60 soft-shadow">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Heart className="size-4 text-accent" />
              Recommended for you
            </div>
            <p className="text-xs text-muted-foreground">
              Programs surfaced from what you've shared. They update as the
              conversation grows.
            </p>

            {recommended.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/70 p-4 text-sm text-muted-foreground">
                Share what's on your mind and we'll gently suggest a few
                Malaysian programs that fit.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {recommended.map((p) => (
                  <div
                    key={p.title}
                    className="rounded-2xl border border-border/60 bg-secondary/40 p-4 space-y-2"
                  >
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      {p.org}
                    </div>
                    <div className="font-medium leading-snug">{p.title}</div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="size-3.5" />
                      {p.location}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {p.blurb}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full h-8 gap-1.5"
                    >
                      Learn more <ExternalLink className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <HelplineCard />
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------

function Bubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const showTyping = message.pending && !message.content;

  return (
    <div
      className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
        isUser
          ? "bg-primary text-primary-foreground self-end rounded-tr-sm"
          : message.tier === "red"
          ? "bg-red-50 text-red-900 border border-red-200 self-start rounded-tl-sm"
          : "bg-secondary text-secondary-foreground self-start rounded-tl-sm"
      }`}
    >
      {showTyping ? <TypingDots /> : message.content}
    </div>
  );
}

function TypingDots() {
  return (
    <span
      className="inline-flex items-center gap-1"
      aria-label="Sahabat is typing"
    >
      <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.2s]" />
      <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.1s]" />
      <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce" />
    </span>
  );
}

function CrisisCard({ payload }: { payload: CrisisPayload }) {
  return (
    <Card className="rounded-2xl border-2 border-red-500/70 bg-gradient-to-br from-red-50 to-rose-50 text-red-950 soft-shadow-lg overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.1),transparent_60%)] pointer-events-none" />
      <CardContent className="relative p-5 md:p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="relative grid size-11 shrink-0 place-items-center rounded-2xl bg-red-600 text-white">
            <AlertCircle className="size-5" />
            <span className="absolute inset-0 rounded-2xl ring-4 ring-red-500/40 animate-ping" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold uppercase tracking-wider text-red-700">
              Call now · Free · 24/7
            </div>
            <div className="mt-0.5 text-lg font-semibold leading-snug">
              <LifeBuoy className="size-4 inline-block mr-1.5 -mt-0.5" />
              {payload.title}
            </div>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-red-900/90">{payload.body}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {payload.contacts.map((c, i) => (
            <a
              key={c.number}
              href={c.tel}
              className={`group inline-flex items-center gap-3 rounded-2xl px-4 py-3 soft-shadow active:scale-[0.98] transition ${
                i === 0
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "border-2 border-red-600 bg-white text-red-700 hover:bg-red-50"
              }`}
            >
              <PhoneCall className="size-5 shrink-0" />
              <div className="flex flex-col min-w-0 text-left">
                <span
                  className={`text-[11px] uppercase tracking-wider ${
                    i === 0 ? "text-red-100" : "text-red-500"
                  }`}
                >
                  {c.name}
                </span>
                <span className="text-xl font-bold tabular-nums tracking-tight">
                  {c.number}
                </span>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function HelplineCard() {
  return (
    <Card className="rounded-2xl border-border/60 bg-secondary/50 soft-shadow">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <LifeBuoy className="size-4 text-red-600" />
          Need to talk to a human now?
        </div>
        <div className="flex flex-col gap-2">
          <a
            href="tel:15999"
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
          >
            <PhoneCall className="size-4" />
            Talian Kasih · 15999
          </a>
          <a
            href="tel:+60376272929"
            className="inline-flex items-center gap-2 rounded-full border border-red-300 bg-white px-3.5 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 transition"
          >
            <PhoneCall className="size-4" />
            Befrienders KL · 03-7627 2929
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
