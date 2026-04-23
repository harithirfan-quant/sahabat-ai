import { AppBottomBar, AppTopBar } from "@/components/app-nav";
import { AppLegalFooter } from "@/components/app-legal-footer";

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <AppTopBar />
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6 pb-28 md:pb-10">
        {children}
        <AppLegalFooter />
      </main>
      <AppBottomBar />
    </div>
  );
}
