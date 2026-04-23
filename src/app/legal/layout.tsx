import { SiteHeader } from "@/components/site-header";
import { CrisisBanner } from "@/components/crisis-banner";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-10 md:py-16">
          {children}
          <div className="mt-16">
            <CrisisBanner compact />
          </div>
        </div>
      </main>
    </>
  );
}
