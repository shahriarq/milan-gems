import { NextResponse, type NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  canonicalPathFor,
  hasLocale,
  pagePath,
  type Locale,
} from "./i18n/config";

/**
 * Keeps every URL in its correct, language-specific form:
 *  - "/", "/contact", "/contatti" (no locale) → the visitor's language,
 *    picked from their saved choice (cookie) → Accept-Language → Italian;
 *  - a page slug in the other language ("/it/contact", "/en/contatti") →
 *    permanent redirect to the right one ("/it/contatti", "/en/contact").
 */
function pickLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (saved && hasLocale(saved)) return saved;

  const header = request.headers.get("accept-language") ?? "";
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
    })
    .filter((x) => x.lang)
    .sort((a, b) => b.q - a.q);

  for (const { lang } of ranked) {
    if (hasLocale(lang)) return lang;
  }
  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const match = pathname.match(/^\/(it|en)(?=\/|$)(.*)$/);

  if (match) {
    const locale = match[1] as Locale;
    const fixed = canonicalPathFor(locale, match[2]);
    if (!fixed) return;
    const url = request.nextUrl.clone();
    url.pathname = fixed;
    return NextResponse.redirect(url, 308);
  }

  const locale = pickLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = canonicalPathFor(locale, pathname) ?? (pathname === "/" ? pagePath("home", locale) : `/${locale}${pathname}`);
  // The target depends on the visitor's cookie / Accept-Language, so browsers
  // and CDNs must never reuse this redirect for someone else (or for the same
  // person after they switch language).
  const res = NextResponse.redirect(url);
  res.headers.set("Cache-Control", "private, no-store");
  res.headers.set("Vary", "Cookie, Accept-Language");
  return res;
}

export const config = {
  // Skip API routes, Next internals, and any file with an extension
  // (images, video, fonts, robots.txt, sitemap.xml, favicon.ico …).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
