import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactPage from "@/components/contact/ContactPage";
import JsonLd from "@/components/JsonLd";
import { getContent } from "@/data/content";
import { hasLocale } from "@/i18n/config";
import { breadcrumbLd, ldGraph, organizationLd, pageMetadata, webPageLd } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { CONTACT_PAGE } = getContent(lang);
  return pageMetadata({
    lang,
    path: "/contact",
    title: CONTACT_PAGE.metaTitle,
    description: CONTACT_PAGE.metaDescription,
  });
}

export default async function Page({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { CONTACT_PAGE, SITE } = getContent(lang);

  const jsonLd = ldGraph(
    organizationLd(lang),
    webPageLd({
      lang,
      path: "/contact",
      type: "ContactPage",
      name: `${CONTACT_PAGE.metaTitle} — ${SITE.name}`,
      description: CONTACT_PAGE.metaDescription,
    }),
    breadcrumbLd([
      { name: SITE.name, path: `/${lang}` },
      { name: CONTACT_PAGE.metaTitle, path: `/${lang}/contact` },
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
