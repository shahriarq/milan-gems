import type { Metadata } from "next";
import { getContent } from "@/data/content";
import { LOCALES, pagePath, type Locale, type PageKey } from "@/i18n/config";
import { SITE_URL, absoluteUrl } from "./site";

/**
 * Per-page metadata: canonical + hreflang for both languages (x-default →
 * Italian), and complete Open Graph / Twitter blocks. Next.js replaces
 * `openGraph` wholesale when a page sets it, so every page builds the full
 * object here rather than relying on the layout's.
 */
export function pageMetadata({
  lang,
  page = "home",
  title,
  description,
}: {
  lang: Locale;
  page?: PageKey;
  title?: string;
  description: string;
}): Metadata {
  const { META, SITE } = getContent(lang);
  const url = pagePath(page, lang);
  const ogTitle = title ? `${title} — ${SITE.name}` : META.ogTitle;
  const languages = Object.fromEntries(LOCALES.map((l) => [l, pagePath(page, l)]));
  const image = { url: `/og/og-${lang}.jpg`, width: 1200, height: 630, alt: META.ogImageAlt };

  return {
    ...(title ? { title } : {}),
    description,
    // Set per indexable page (not in the layout) so 404s carry only "noindex".
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    alternates: {
      canonical: url,
      languages: { ...languages, "x-default": pagePath(page, "it") },
    },
    openGraph: {
      type: "website",
      url,
      siteName: SITE.name,
      title: ogTitle,
      description,
      locale: META.ogLocale,
      alternateLocale: lang === "it" ? ["en_US"] : ["it_IT"],
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [image],
    },
  };
}

/* ------------------------------------------------------------------ */
/* JSON-LD (schema.org)                                                 */
/* ------------------------------------------------------------------ */

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function organizationLd(lang: Locale) {
  const { SITE, META } = getContent(lang);
  const telephone = SITE.phone.replace(/\s/g, "");
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    url: absoluteUrl(`/${lang}`),
    logo: absoluteUrl("/icon-512.png"),
    image: absoluteUrl(`/og/og-${lang}.jpg`),
    description: META.orgDescription,
    email: SITE.email,
    telephone,
    address: { "@type": "PostalAddress", addressLocality: "Milano", addressCountry: "IT" },
    areaServed: "Europe",
    knowsLanguage: ["it", "en"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone,
        email: SITE.email,
        areaServed: "Europe",
        availableLanguage: ["Italian", "English"],
      },
    ],
    sameAs: [SITE.linkedin],
  };
}

export function websiteLd(lang: Locale) {
  const { SITE, META } = getContent(lang);
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: absoluteUrl(`/${lang}`),
    name: SITE.name,
    description: META.description,
    inLanguage: lang,
    publisher: { "@id": ORG_ID },
  };
}

export function webPageLd({
  lang,
  page = "home",
  name,
  description,
  type = "WebPage",
}: {
  lang: Locale;
  page?: PageKey;
  name: string;
  description: string;
  type?: "WebPage" | "ContactPage";
}) {
  return {
    "@type": type,
    "@id": `${absoluteUrl(pagePath(page, lang))}#webpage`,
    url: absoluteUrl(pagePath(page, lang)),
    name,
    description,
    inLanguage: lang,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    primaryImageOfPage: absoluteUrl(`/og/og-${lang}.jpg`),
  };
}

export function breadcrumbLd(items: Array<{ name: string; path: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** One @graph per page keeps related entities linked by @id. */
export const ldGraph = (...nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes });
