import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import AdvantageSection from "@/components/AdvantageSection";
import AboutSection from "@/components/AboutSection";
import B2BCTA from "@/components/B2BCTA";
import SectionProgress from "@/components/SectionProgress";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent } from "@/data/content";
import { hasLocale } from "@/i18n/config";

import JsonLd from "@/components/JsonLd";
import { ldGraph, organizationLd, pageMetadata, webPageLd, websiteLd } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { META } = getContent(lang);
  return pageMetadata({ lang, description: META.description });
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { META } = getContent(lang);

  const jsonLd = ldGraph(
    organizationLd(lang),
    websiteLd(lang),
    webPageLd({ lang, name: META.title, description: META.description })
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="flex-1">
        <Hero />
        <Portfolio />
        <AdvantageSection />
        <AboutSection />
        <B2BCTA />
      </main>
      <SectionProgress />
    </>
  );
}
