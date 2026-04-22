import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/components/locale-provider";
import { Toaster } from "@/components/ui/sonner";

// Display — warm, editorial serif for hero headlines and card titles.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Body — humanist sans, highly legible in EN + BM.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SAHABAT.AI — Your AI friend, always listening",
  description:
    "Your AI friend. Always listening. Always connecting you to the help you deserve. Built for Malaysian youth — in BM, English, and Manglish.",
};

export const viewport: Viewport = {
  themeColor: "#52B788",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <LocaleProvider>
          {children}
          <Toaster richColors closeButton position="top-center" />
        </LocaleProvider>
      </body>
    </html>
  );
}
