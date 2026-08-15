import type { Metadata } from "next";
import { Google_Sans, Google_Sans_Code } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/context";
import { getDict, getLang } from "@/lib/i18n/server";
import "./globals.css";

/* 'thai' subset loads lazily via unicode-range, only when Thai text is on the page. */
const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin", "thai"],
  display: "swap",
  // Avoids a build warning: next/font has no metrics for this family to build a fallback from.
  adjustFontFallback: false,
  fallback: ["system-ui", "sans-serif"],
});

const googleSansCode = Google_Sans_Code({
  variable: "--font-google-sans-code",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
  fallback: ["ui-monospace", "monospace"],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDict();
  return { title: t.meta.patient, description: t.meta.description };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Resolved server-side and set on <html> immediately — avoids a language flash after hydrate.
  const lang = await getLang();

  return (
    <html
      lang={lang}
      className={`${googleSans.variable} ${googleSansCode.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider initialLang={lang}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
