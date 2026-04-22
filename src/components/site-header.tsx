"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";
import { LocaleToggle } from "@/components/locale-toggle";
import { useLocale } from "@/components/locale-provider";

export function SiteHeader() {
  const { t } = useLocale();
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/70 border-b border-border">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <BrandMark />
        <div className="ml-auto flex items-center gap-2">
          <LocaleToggle />
          <Link
            href="/auth/login"
            className={buttonVariants({ variant: "ghost", size: "sm", className: "hidden sm:inline-flex rounded-full h-9 px-4" })}
          >
            {t.nav.login}
          </Link>
          <Link
            href="/auth/signup"
            className={buttonVariants({ size: "sm", className: "rounded-full h-9 px-4" })}
          >
            {t.nav.getStarted}
          </Link>
        </div>
      </div>
    </header>
  );
}
