"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageCircleHeart,
  NotebookPen,
  LayoutDashboard,
  Compass,
  Users,
} from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { BrandMark } from "@/components/brand-mark";
import { LocaleToggle } from "@/components/locale-toggle";

type Item = {
  href: string;
  labelKey: "chat" | "journal" | "dashboard" | "discover" | "buddy";
  Icon: React.ComponentType<{ className?: string }>;
};

const items: Item[] = [
  { href: "/app/chat", labelKey: "chat", Icon: MessageCircleHeart },
  { href: "/app/journal", labelKey: "journal", Icon: NotebookPen },
  { href: "/app/dashboard", labelKey: "dashboard", Icon: LayoutDashboard },
  { href: "/app/discover", labelKey: "discover", Icon: Compass },
  { href: "/app/buddy", labelKey: "buddy", Icon: Users },
];

export function AppTopBar() {
  const { t } = useLocale();
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/75 border-b border-border">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <BrandMark href="/app/dashboard" />
        <nav className="ml-6 hidden md:flex items-center gap-1">
          {items.map(({ href, labelKey, Icon }) => {
            const active = pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="size-4" />
                {t.nav[labelKey]}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <LocaleToggle />
        </div>
      </div>
    </header>
  );
}

export function AppBottomBar() {
  const { t } = useLocale();
  const pathname = usePathname();
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-md"
      aria-label="Primary"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ href, labelKey, Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center gap-1 py-2.5 text-xs ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="size-5" />
                <span className="font-medium">{t.nav[labelKey]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
