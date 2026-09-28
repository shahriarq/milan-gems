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
