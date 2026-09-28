import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import AdvantageSection from "@/components/AdvantageSection";
import AboutSection from "@/components/AboutSection";
import B2BCTA from "@/components/B2BCTA";
import SectionProgress from "@/components/SectionProgress";
import { SITE } from "@/data/content";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  description:
    "B2B sourcing of Iranian gemstones and natural materials — Persian turquoise, agate, garnet, and meteorite — for bespoke jewelry ateliers and professional buyers.",
  url: "https://www.milangems.com",
  email: `mailto:${SITE.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Milan",
    addressCountry: "IT",
  },
  sameAs: [SITE.instagram, SITE.linkedin],
};

export default function Home() {
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
