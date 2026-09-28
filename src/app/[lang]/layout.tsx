import type { Metadata } from "next";
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
import "../globals.css";
import { notFound } from "next/navigation";
import { getContent } from "@/data/content";
import { LOCALES, hasLocale } from "@/i18n/config";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

const SITE_URL = "https://www.milangems.com";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { META, SITE } = getContent(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: META.title, template: `%s | ${SITE.name}` },
    description: META.description,
    keywords: META.keywords,
    alternates: {
      canonical: `/${lang}`,
      languages: { it: "/it", en: "/en", "x-default": "/it" },
    },
    openGraph: {
      title: META.ogTitle,
      description: META.ogDescription,
      url: `${SITE_URL}/${lang}`,
      siteName: SITE.name,
      locale: META.ogLocale,
      alternateLocale: lang === "it" ? ["en_US"] : ["it_IT"],
      type: "website",
    },
    twitter: { card: "summary_large_image", title: META.ogTitle, description: META.ogDescription },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-ink text-bone font-sans">
        <LocaleProvider locale={lang}>
          <SmoothScrollProvider>
            <Header />
            {children}
            <Footer locale={lang} />
            <BackToTop />
          </SmoothScrollProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
