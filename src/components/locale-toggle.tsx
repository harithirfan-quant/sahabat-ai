"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/locale-provider";

export function LocaleToggle({ className }: { className?: string }) {
  const { locale, toggleLocale } = useLocale();
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={toggleLocale}
      className={`rounded-full gap-2 ${className ?? ""}`}
      aria-label="Toggle language"
    >
      <Languages className="size-4" />
      <span className="font-semibold tracking-wide">
        {locale === "en" ? "EN" : "BM"}
      </span>
    </Button>
  );
}
