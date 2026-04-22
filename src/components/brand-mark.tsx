import Link from "next/link";
import { LogoFull } from "@/components/logo";

export function BrandMark({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2"
      aria-label="SAHABAT.AI home"
    >
      <LogoFull size={32} wordmarkClassName="text-lg" />
    </Link>
  );
}
