import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import AdvantageSection from "@/components/AdvantageSection";
import AboutSection from "@/components/AboutSection";
import B2BCTA from "@/components/B2BCTA";
import SectionProgress from "@/components/SectionProgress";
import { notFound } from "next/navigation";
import { getContent } from "@/data/content";
import { hasLocale } from "@/i18n/config";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { SITE, META } = getContent(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    description: META.orgDescription,
    url: "https://www.milangems.com",
    email: `mailto:${SITE.email}`,
    telephone: SITE.phone.replace(/\s/g, ""),
    address: { "@type": "PostalAddress", addressLocality: "Milano", addressCountry: "IT" },
    sameAs: [SITE.instagram, SITE.linkedin],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
