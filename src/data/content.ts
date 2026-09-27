import type { MediaAsset, VideoAsset } from "./types";

/**
 * Non-stone site copy & references — nav, hero, advantage section, CTA,
 * footer. Kept separate from component logic so marketing copy can be
 * edited without touching JSX/animation code.
 */

export const SITE = {
  name: "Milan Gems",
  tagline: "Iranian Gemstones & Natural Materials",
  description: "B2B sourcing for jewelry professionals.",
  email: "info@milangems.com",
  instagram: "https://instagram.com/milangems",
  linkedin: "https://linkedin.com/company/milangems",
  city: "Milan, Italy",
};

export const NAV_LINKS = [
  { label: "Collection", href: "#collection" },
  { label: "Materials", href: "#materials" },
  { label: "B2B", href: "#advantage" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const HERO = {
  eyebrow: "Milan Gems",
  headline: "Rare Materials. Ancient Origins. Exceptional Craft.",
  sub: "Selected Iranian gemstones and natural materials, sourced for bespoke jewelry makers and professional buyers.",
  primaryCta: { label: "View the Collection", href: "#collection" },
  secondaryCta: { label: "Request a Sample Box", href: "#contact" },
  media: {
    src: "/assets/stones/hero/hero-gemstone-placeholder.svg",
    alt: "Placeholder cinematic studio image of a rough gemstone specimen on a dark surface",
    width: 1920,
    height: 2400,
    isPlaceholder: true,
  } satisfies MediaAsset,
  video: {
    src: "",
    poster: "/assets/stones/hero/hero-gemstone-placeholder.svg",
    alt: "Placeholder video of a gemstone specimen slowly rotating under studio light",
    isPlaceholder: true,
  } satisfies VideoAsset,
};

export const ABOUT = {
  kicker: "About",
  heading: "A sourcing partner, not a storefront",
  body: [
    "Milan Gems works between origin and atelier — selecting Iranian gemstones and natural materials for jewelry professionals who need consistency, character, and a partner who understands both trade and craft.",
    "We are based in Milan and work with bespoke ateliers, master jewelers, designers, and professional buyers across Europe.",
  ],
};

export const ADVANTAGE = {
  kicker: "The Advantage",
  heading: "A restrained, professional sourcing proposition",
  items: [
    {
      title: "Direct Sourcing",
      body: "Selected materials sourced through our supply network.",
    },
    {
      title: "Documentation",
      body: "Export and product documentation available for B2B orders where applicable.",
    },
    {
      title: "Curated Selection",
      body: "Each collection is selected for professional jewelry applications.",
    },
    {
      title: "B2B Supply",
      body: "Designed to support both individual atelier requirements and larger professional orders.",
    },
  ],
};

export const B2B_CTA = {
  kicker: "B2B Sample Program",
  heading: "Request a Physical Sample Box in Milan",
  body: "Tell us what you are looking for and we will prepare a curated selection for professional review.",
  ctaLabel: "Request the Collection",
};

export const CONTACT_FORM_FIELDS = {
  materialsOfInterest: ["Persian Turquoise", "Agate", "Garnet", "Meteorite", "Other / Not sure yet"],
};

export const FOOTER = {
  name: SITE.name,
  tagline: SITE.tagline,
  body: SITE.description,
};

export const PORTFOLIO_INTRO = {
  kicker: "The Collection",
  heading: "Four materials, selected for professional work",
  body: "Each material is presented with its origin, character, and specification — reviewed individually rather than sold as a uniform commodity.",
};
