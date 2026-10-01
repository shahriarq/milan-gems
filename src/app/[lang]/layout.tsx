import type { Metadata, Viewport } from "next";
// Self-hosted via @fontsource (no external network calls at build/runtime) —
// next/font/google requires fetching fonts.googleapis.com, which is not
// reachable in restricted network environments.
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/400-italic.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
// Persian micro-labels only (فیروزه, عقیق …); the Arabic-script subset is
// fetched solely on pages that actually render Persian glyphs.
import "@fontsource/vazirmatn/300.css";
import "../globals.css";
import { notFound } from "next/navigation";
import { getContent } from "@/data/content";
import { LOCALES, hasLocale } from "@/i18n/config";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { GA_MEASUREMENT_ID, GSC_VERIFICATION, SITE_URL } from "@/lib/site";
import Analytics from "@/components/Analytics";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#070707",
  colorScheme: "dark",
};

/**
 * Site-wide defaults. Each page adds its own canonical, hreflang, Open
 * Graph and Twitter data through pageMetadata().
 */
export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { META, SITE } = getContent(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: META.title, template: `%s | ${SITE.name}` },
    description: META.description,
    keywords: META.keywords,
    applicationName: SITE.name,
    authors: [{ name: SITE.name, url: SITE_URL }],
    creator: SITE.name,
    publisher: SITE.name,
    category: "jewelry",
    formatDetection: { telephone: false, email: false, address: false },
    // Google Search Console ownership (HTML-tag method), when configured.
    ...(GSC_VERIFICATION ? { verification: { google: GSC_VERIFICATION } } : {}),
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    // suppressHydrationWarning: the inline script below adds the "js" class
    // to <html> before React hydrates; React should keep the DOM's version.
    <html lang={lang} className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* Runs synchronously before first paint: lets CSS pre-hide the
            elements that animate in, so they never flash (globals.css). */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-full flex flex-col bg-ink text-bone font-sans">
        <LocaleProvider locale={lang}>
          <SmoothScrollProvider>
            <Header />
            {children}
            <Footer locale={lang} />
            <BackToTop />
            <Analytics gaId={GA_MEASUREMENT_ID} />
          </SmoothScrollProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
