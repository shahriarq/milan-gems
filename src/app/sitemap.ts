import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";

/** Both language versions of each page, cross-linked with hreflang. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", changeFrequency: "monthly" as const, priority: 1 },
    { path: "/contact", changeFrequency: "yearly" as const, priority: 0.7 },
  ];
  const lastModified = new Date();
  return pages.flatMap(({ path, changeFrequency, priority }) =>
    LOCALES.map((lang) => ({
      url: `${SITE_URL}/${lang}${path}`,
      lastModified,
      changeFrequency,
      priority: lang === "it" ? priority : Math.round(priority * 90) / 100,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`])),
      },
    }))
  );
}
