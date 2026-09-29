import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactPage from "@/components/contact/ContactPage";
import JsonLd from "@/components/JsonLd";
import { getContent } from "@/data/content";
import { hasLocale, pagePath, type Locale } from "@/i18n/config";
import { breadcrumbLd, ldGraph, organizationLd, pageMetadata, webPageLd } from "@/lib/seo";

/**
 * The contact page lives at a different slug per language
 * (/it/contatti, /en/contact). Both route files render this; each only
 * answers for its own language (the proxy redirects the other one).
 */
export function contactMetadata(lang: string, owner: Locale): Metadata {
  if (!hasLocale(lang) || lang !== owner) return {};
  const { CONTACT_PAGE } = getContent(lang);
  return pageMetadata({ lang, page: "contact", title: CONTACT_PAGE.metaTitle, description: CONTACT_PAGE.metaDescription });
}

export function ContactRoute({ lang, owner }: { lang: string; owner: Locale }) {
  if (!hasLocale(lang) || lang !== owner) notFound();
  const { CONTACT_PAGE, SITE } = getContent(lang);

  const jsonLd = ldGraph(
    organizationLd(lang),
    webPageLd({
      lang,
      page: "contact",
      type: "ContactPage",
      name: `${CONTACT_PAGE.metaTitle} — ${SITE.name}`,
      description: CONTACT_PAGE.metaDescription,
    }),
    breadcrumbLd([
      { name: SITE.name, path: pagePath("home", lang) },
      { name: CONTACT_PAGE.metaTitle, path: pagePath("contact", lang) },
    ])
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="flex-1">
        <ContactPage />
      </main>
    </>
  );
}
