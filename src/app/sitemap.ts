import type { MetadataRoute } from "next";
import { LOCALES, pagePath, type PageKey } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";

/** Both language versions of each page (localized slugs), cross-linked with hreflang. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Array<{ page: PageKey; changeFrequency: "monthly" | "yearly"; priority: number }> = [
    { page: "home", changeFrequency: "monthly", priority: 1 },
    { page: "contact", changeFrequency: "yearly", priority: 0.7 },
  ];
  const lastModified = new Date();
  return pages.flatMap(({ page, changeFrequency, priority }) =>
    LOCALES.map((lang) => ({
      url: `${SITE_URL}${pagePath(page, lang)}`,
      lastModified,
      changeFrequency,
      priority: lang === "it" ? priority : Math.round(priority * 90) / 100,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}${pagePath(page, l)}`])),
      },
    }))
  );
}
