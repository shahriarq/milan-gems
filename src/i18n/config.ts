/** Supported languages. Italian first: it is the primary market. */
export const LOCALES = ["it", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "it";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const hasLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value);

/* ------------------------------------------------------------------ */
/* Localized URLs                                                       */
/*                                                                      */
/* Code always refers to pages and sections by a neutral key; the URL a */
/* visitor sees is in their language: /it/contatti#richiesta vs         */
/* /en/contact#inquiry.                                                 */
/* ------------------------------------------------------------------ */

/** Page slugs per language ("" = home). Neutral key = the English slug. */
export const PAGE_SLUGS = {
  home: { it: "", en: "" },
  contact: { it: "contatti", en: "contact" },
} as const satisfies Record<string, Record<Locale, string>>;
export type PageKey = keyof typeof PAGE_SLUGS;

/** In-page section anchors per language. */
export const ANCHORS = {
  collection: { it: "collezione", en: "collection" },
  turquoise: { it: "turchese", en: "turquoise" },
  agate: { it: "agata", en: "agate" },
  garnet: { it: "granato", en: "garnet" },
  meteorite: { it: "meteorite", en: "meteorite" },
  b2b: { it: "b2b", en: "b2b" },
  about: { it: "chi-siamo", en: "about" },
  request: { it: "richiedi", en: "request" },
  sampleBox: { it: "campionario", en: "sample-box" },
  inquiry: { it: "richiesta", en: "inquiry" },
} as const satisfies Record<string, Record<Locale, string>>;
export type AnchorKey = keyof typeof ANCHORS;

export const anchorId = (key: AnchorKey, locale: Locale) => ANCHORS[key][locale];

const pageKeyFromSlug = (slug: string): PageKey | undefined =>
  (Object.keys(PAGE_SLUGS) as PageKey[]).find((k) => LOCALES.some((l) => PAGE_SLUGS[k][l] === slug));

const anchorKeyFromId = (id: string): AnchorKey | undefined =>
  (Object.keys(ANCHORS) as AnchorKey[]).find((k) => LOCALES.some((l) => ANCHORS[k][l] === id));

/** Path of a page in a language: pagePath("contact", "it") → "/it/contatti". */
export function pagePath(page: PageKey, locale: Locale): string {
  const slug = PAGE_SLUGS[page][locale];
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

/**
 * Turn a neutral internal href into the visitor's language:
 * "/" → "/it", "/#about" → "/it#chi-siamo", "/contact#inquiry" →
 * "/it/contatti#richiesta". External, mailto: and tel: links pass through.
 */
export function localizeHref(href: string, locale: Locale): string {
  if (!href.startsWith("/")) return href;
  const [rawPath, hash] = href.split("#");
  const slug = rawPath.replace(/^\/+|\/+$/g, "");
  const page = pageKeyFromSlug(slug) ?? "home";
  const base = pageKeyFromSlug(slug) || slug === "" ? pagePath(page, locale) : `/${locale}/${slug}`;
  if (hash === undefined) return base;
  const key = anchorKeyFromId(hash);
  return `${base}#${key ? anchorId(key, locale) : hash}`;
}

/**
 * The same page (and section) in another language:
 * ("/it/contatti", "#richiesta", "en") → "/en/contact#inquiry".
 */
export function switchLocalePath(pathname: string, to: Locale, hash = ""): string {
  const rest = pathname.replace(/^\/(it|en)(?=\/|$)/, "").replace(/^\/+|\/+$/g, "");
  const page = pageKeyFromSlug(rest);
  const base = page ? pagePath(page, to) : rest ? `/${to}/${rest}` : `/${to}`;
  const id = hash.replace(/^#/, "");
  if (!id) return base;
  const key = anchorKeyFromId(id);
  return `${base}#${key ? anchorId(key, to) : id}`;
}

/**
 * For the proxy: the correct URL for a path whose page slug is in the wrong
 * language (or missing a locale), or null if it is already correct.
 */
export function canonicalPathFor(locale: Locale, rest: string): string | null {
  const slug = rest.replace(/^\/+|\/+$/g, "");
  const page = pageKeyFromSlug(slug);
  if (!page) return null;
  const correct = PAGE_SLUGS[page][locale];
  return correct === slug ? null : pagePath(page, locale);
}

/** Remember the visitor's language choice for the proxy (one year). */
export function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}
