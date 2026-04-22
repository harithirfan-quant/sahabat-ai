import { BrandMark } from "@/components/brand-mark";
import { LocaleToggle } from "@/components/locale-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex flex-col gradient-hero">
      <header className="w-full">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center">
          <BrandMark />
          <div className="ml-auto">
            <LocaleToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 grid place-items-center px-4 py-10">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
