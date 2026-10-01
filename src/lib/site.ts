/**
 * Absolute origin used for canonicals, hreflang, sitemap, robots, Open
 * Graph and JSON-LD.
 *
 * Resolution order:
 *  1. NEXT_PUBLIC_SITE_URL — set this in Vercel once the custom domain is
 *     live (e.g. https://www.milangems.com);
 *  2. VERCEL_PROJECT_PRODUCTION_URL — injected by Vercel automatically; it
 *     is the project's production domain (the custom domain once assigned,
 *     otherwise milan-gems.vercel.app);
 *  3. a hard fallback for local builds.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;
  return "https://milan-gems.vercel.app";
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
