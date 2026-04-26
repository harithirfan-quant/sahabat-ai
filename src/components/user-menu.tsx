"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Settings as SettingsIcon, User as UserIcon } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { createClient } from "@/lib/supabase/client";

/**
 * UserMenu — small avatar button in the top bar that opens a click-outside
 * popover with Settings + Sign out. No dropdown primitive needed; we manage
 * open state + outside-click detection ourselves to keep the bundle thin.
 */
export function UserMenu() {
  const { locale } = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Pull the user's email once so the menu shows who is logged in.
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  // Close on outside click + Escape.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      // Send the user to the landing page and force a full router refresh so
      // server components re-render against the cleared session.
      router.push("/");
      router.refresh();
    } finally {
      setSigningOut(false);
      setOpen(false);
    }
  }

  // Don't render until we know whether there is a user — avoids flashing the
  // menu on logged-out pages that wrongly include the AppTopBar.
  if (!email) return null;

  const labels =
    locale === "bm"
      ? {
          account: "Akaun",
          settings: "Tetapan",
          signOut: "Log keluar",
          signingOut: "Sedang log keluar…",
        }
      : {
          account: "Account",
          settings: "Settings",
          signOut: "Sign out",
          signingOut: "Signing out…",
        };

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={labels.account}
        className="grid size-9 place-items-center rounded-full border border-border bg-background hover:bg-muted transition"
      >
        <UserIcon className="size-4 text-foreground/80" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 origin-top-right rounded-2xl border border-border bg-popover text-popover-foreground soft-shadow-lg overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-border/60">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {labels.account}
            </div>
            <div className="mt-0.5 truncate text-sm font-medium">{email}</div>
          </div>
          <Link
            href="/app/settings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition"
          >
            <SettingsIcon className="size-4 text-muted-foreground" />
            {labels.settings}
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[color:var(--destructive)] hover:bg-[color:var(--destructive)]/8 transition disabled:opacity-60"
          >
            <LogOut className="size-4" />
            {signingOut ? labels.signingOut : labels.signOut}
          </button>
        </div>
      )}
    </div>
  );
}
