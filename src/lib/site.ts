/**
 * Absolute origin used for canonicals, hreflang, sitemap, robots, Open
 * Graph and JSON-LD.
 *
 * The production domain is hard-coded (milangems.com redirects to www, so
 * www is the canonical host). NEXT_PUBLIC_SITE_URL, if set in Vercel,
 * overrides it — e.g. for a staging domain.
 */
const PRODUCTION_URL = "https://www.milangems.com";

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  return (explicit || PRODUCTION_URL).replace(/\/+$/, "");
}

export const SITE_URL = resolveSiteUrl();

export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/**
 * Google integrations. Public identifiers (they appear in the page source),
 * so they can live here; an environment variable of the same purpose in
 * Vercel takes precedence. Leave empty to keep the integration off.
 *
 *  - GA4 Measurement ID, e.g. "G-ABC123XYZ"
 *    (Analytics → Admin → Data streams → Web → Measurement ID)
 *  - Search Console HTML-tag verification code: only the content="…" value
 *    of <meta name="google-site-verification" content="…">
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-Q790T63WEH";
export const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION || "";
