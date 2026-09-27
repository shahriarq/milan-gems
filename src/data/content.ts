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
  line1: "Iranian Gemstones",
  line2: "Natural Materials",
  tagline: "A private digital collection of rare Iranian materials.",
  scrollCue: "Scroll to Explore",
  media: {
    src: "/assets/stones/hero/photo/hero-cinematic.jpg",
    alt: "Natural Persian turquoise cabochons with dark matrix veining, macro photograph",
    width: 1920,
    height: 2400,
    isPlaceholder: true,
  } satisfies MediaAsset,
  video: {
    src: "/assets/stones/hero/photo/hero-cinematic.mp4",
    poster: "/assets/stones/hero/photo/hero-cinematic.jpg",
    alt: "Slow cinematic zoom across natural Persian turquoise specimens under studio light",
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
  heading: "Request the Collection",
  body: "Curated gemstone samples available for professional review in Milan.",
  ctaLabel: "Request a Sample Box",
};

/**
 * The closing sequence — a short cinematic beat before the sample-request
 * CTA and footer: "The Collection" → a brand statement → the city → the
 * CTA (above) → a final editorial line.
 */
export const CLOSING_SEQUENCE = {
  kicker: "The Collection",
  statement: "From Origin to Atelier.",
  city: "Milan",
  finalStatement:
    "Milan Gems — where rare Iranian materials begin their journey to the atelier.",
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
