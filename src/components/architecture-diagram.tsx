"use client";

import { motion } from "framer-motion";
import {
  MessageCircle,
  ShieldAlert,
  Sparkles,
  Activity,
  Compass,
  LayoutDashboard,
} from "lucide-react";
import { useLocale } from "@/components/locale-provider";

/**
 * Static architecture diagram for the landing page.
 *
 * Six pill-shaped nodes arranged in a flow, connected by curved SVG paths.
 * Responsive: collapses to a vertical stack on narrow screens. Each node
 * carries an icon + label + short sublabel so a judge can read the system
 * at a glance.
 */

type NodeKind =
  | "input"
  | "safety"
  | "claude"
  | "risk"
  | "recommender"
  | "output";

type NodeDef = {
  key: NodeKind;
  label: { en: string; bm: string };
  sub: { en: string; bm: string };
  icon: React.ComponentType<{ className?: string }>;
  tint: string; // tailwind bg-*/border-*
  iconTint: string;
};

const NODES: NodeDef[] = [
  {
    key: "input",
    label: { en: "Chat + Journal", bm: "Sembang + Jurnal" },
    sub: { en: "BM · EN · Manglish", bm: "BM · BI · Manglish" },
    icon: MessageCircle,
    tint: "bg-secondary border-border",
    iconTint: "bg-primary/10 text-primary",
  },
  {
    key: "safety",
    label: { en: "Safety classifier", bm: "Pengelas keselamatan" },
    sub: { en: "Regex → Haiku JSON", bm: "Regex → Haiku JSON" },
    icon: ShieldAlert,
    tint: "bg-red-50 border-red-200",
    iconTint: "bg-red-100 text-red-600",
  },
  {
    key: "claude",
    label: { en: "Claude Haiku 4.5", bm: "Claude Haiku 4.5" },
    sub: { en: "Empathetic stream", bm: "Aliran empati" },
    icon: Sparkles,
    tint: "bg-indigo-50 border-indigo-200",
    iconTint: "bg-indigo-100 text-indigo-600",
  },
  {
    key: "risk",
    label: { en: "Risk engine", bm: "Enjin risiko" },
    sub: {
      en: "Weighted wellbeing scoring (PHQ-9/GAD-7 aligned)",
      bm: "Pemarkahan kesejahteraan berwajaran (selaras PHQ-9/GAD-7)",
    },
    icon: Activity,
    tint: "bg-amber-50 border-amber-200",
    iconTint: "bg-amber-100 text-amber-700",
  },
  {
    key: "recommender",
    label: { en: "Recommender", bm: "Pencadang" },
    sub: { en: "pgvector cosine", bm: "pgvector kosinus" },
    icon: Compass,
    tint: "bg-emerald-50 border-emerald-200",
    iconTint: "bg-emerald-100 text-emerald-700",
  },
  {
    key: "output",
    label: { en: "Dashboard + Crisis", bm: "Papan pemuka + Krisis" },
    sub: { en: "Trend · programs · escalation", bm: "Trend · program · eskalasi" },
    icon: LayoutDashboard,
    tint: "bg-primary text-primary-foreground border-primary",
    iconTint: "bg-white/15 text-white",
  },
];

export function ArchitectureDiagram() {
  const { locale } = useLocale();

  return (
    <div className="relative">
      <div className="grid gap-3 md:grid-cols-3">
        {NODES.map((node, i) => (
          <motion.div
            key={node.key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.06, ease: "easeOut" }}
            className={`rounded-2xl border ${node.tint} p-4 flex items-start gap-3 soft-shadow`}
          >
            <div
              className={`grid size-10 shrink-0 place-items-center rounded-xl ${node.iconTint}`}
            >
              <node.icon className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-grid size-5 place-items-center rounded-full text-[10px] font-bold ${
                    node.key === "output"
                      ? "bg-white/20 text-white"
                      : "bg-foreground/10 text-foreground/70"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="text-sm font-semibold leading-tight">
                  {node.label[locale]}
                </div>
              </div>
              <div
                className={`mt-1 text-xs ${
                  node.key === "output"
                    ? "text-primary-foreground/85"
                    : "text-muted-foreground"
                }`}
              >
                {node.sub[locale]}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full bg-red-500" />
          {locale === "bm" ? "Aliran krisis" : "Crisis path"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block size-2 rounded-full bg-primary" />
          {locale === "bm" ? "Aliran biasa" : "Companion path"}
        </span>
        <span className="ml-auto">
          {locale === "bm"
            ? "Supabase Postgres + pgvector · Vercel Edge + Node runtime"
            : "Supabase Postgres + pgvector · Vercel Edge + Node runtime"}
        </span>
      </div>
    </div>
  );
}
