import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactPage from "@/components/contact/ContactPage";
import { getContent } from "@/data/content";
import { hasLocale } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { CONTACT_PAGE, SITE } = getContent(lang);
  return {
    title: CONTACT_PAGE.metaTitle,
    description: CONTACT_PAGE.metaDescription,
    alternates: {
      canonical: `/${lang}/contact`,
      languages: { it: "/it/contact", en: "/en/contact", "x-default": "/it/contact" },
    },
    openGraph: {
      title: `${CONTACT_PAGE.metaTitle} — ${SITE.name}`,
      description: CONTACT_PAGE.metaDescription,
      url: `https://www.milangems.com/${lang}/contact`,
    },
  };
}

export default async function Page({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return (
    <main className="flex-1">
      <ContactPage />
    </main>
  );
}
