/**
 * SAHABAT.AI brand mark.
 *
 * Two interlocking arcs form a soft "S"/embrace — one person reaching toward
 * another, becoming a whole. Sage by default, warm coral on hover for the
 * accent arc. Clean at 32×32, scales freely.
 *
 * Exports:
 *   <LogoMark  />   symbol only (square, 32×32 default)
 *   <LogoFull  />   symbol + wordmark "sahabat" (Fraunces 500) + ".ai" (Jakarta 600 coral)
 *   <Logo />        alias for <LogoFull /> — default import shape
 */

import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// LogoMark — the symbol
// ---------------------------------------------------------------------------

type MarkProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  title?: string;
};

export function LogoMark({
  size = 32,
  title = "SAHABAT.AI",
  className,
  ...rest
}: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={cn("group/logo shrink-0", className)}
      {...rest}
    >
      <title>{title}</title>
      {/* Sage arc — top curve reaching down-right */}
      <path
        d="M7 10
           C 7 6, 11 4, 15 4
           C 21 4, 24 8, 24 12
           C 24 15, 21 17, 17 17"
        stroke="var(--color-primary)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Coral arc — bottom curve reaching up-left, interlocking with the sage */}
      <path
        d="M25 22
           C 25 26, 21 28, 17 28
           C 11 28, 8 24, 8 20
           C 8 17, 11 15, 15 15"
        stroke="var(--color-accent)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        className="transition-[stroke] duration-300 group-hover/logo:[stroke:var(--color-accent-hover)]"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// LogoFull — symbol + wordmark
// ---------------------------------------------------------------------------

type FullProps = {
  size?: number;
  className?: string;
  wordmarkClassName?: string;
};

export function LogoFull({
  size = 32,
  className,
  wordmarkClassName,
}: FullProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark size={size} />
      <span
        className={cn(
          "inline-flex items-baseline leading-none",
          wordmarkClassName,
        )}
      >
        <span className="font-display font-medium tracking-tight text-foreground">
          sahabat
        </span>
        <span className="font-sans font-semibold text-accent-hover">.ai</span>
      </span>
    </span>
  );
}

// Default export — the most common usage.
export function Logo(props: FullProps) {
  return <LogoFull {...props} />;
}

export default Logo;
