/** Supported languages. Italian first: it is the primary market. */
export const LOCALES = ["it", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "it";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const hasLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value);

/**
 * Prefix an internal href with the locale: "/" → "/it", "/#about" →
 * "/it#about", "/contact#inquiry" → "/it/contact#inquiry". External and
 * mailto/tel links pass through untouched.
 */
export function localizeHref(href: string, locale: Locale): string {
  if (!href.startsWith("/")) return href;
  if (href === "/") return `/${locale}`;
  if (href.startsWith("/#")) return `/${locale}${href.slice(1)}`;
  return `/${locale}${href}`;
}

/** Swap the locale segment of a pathname. */
export function switchLocalePath(pathname: string, to: Locale): string {
  const rest = pathname.replace(/^\/(it|en)(?=\/|$)/, "");
  return `/${to}${rest}`;
}

/** Remember the visitor's language choice for the proxy (one year). */
export function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}
