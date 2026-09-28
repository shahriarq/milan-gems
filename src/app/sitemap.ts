import type { MetadataRoute } from "next";

const BASE = "https://www.milangems.com";

/** Both language versions of each page, cross-linked with hreflang. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", changeFrequency: "monthly" as const, priority: 1 },
    { path: "/contact", changeFrequency: "yearly" as const, priority: 0.7 },
  ];
  return pages.flatMap(({ path, changeFrequency, priority }) =>
    (["it", "en"] as const).map((lang) => ({
      url: `${BASE}/${lang}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: { languages: { it: `${BASE}/it${path}`, en: `${BASE}/en${path}` } },
    }))
  );
}
