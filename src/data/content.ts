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

/**
 * Primary navigation. Hash links point at home-page sections (prefixed with
 * "/" so they also work from /contact); Contact is its own page.
 */
export const NAV_LINKS = [
  { label: "Collection", href: "/#collection" },
  { label: "B2B", href: "/#advantage" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/contact" },
];

/**
 * Home-page sections tracked by the section progress indicator, in page
 * order. Each id must exist on the home page.
 */
export const SECTION_INDEX = [
  { id: "turquoise", label: "Turquoise" },
  { id: "agate", label: "Agate" },
  { id: "garnet", label: "Garnet" },
  { id: "meteorite", label: "Meteorite" },
  { id: "advantage", label: "B2B" },
  { id: "about", label: "About" },
  { id: "contact", label: "Sample Box" },
];

/**
 * One vocabulary for every call to action on the site, so the same action
 * is never named two different ways.
 */
export const CTA = {
  sampleBox: "Request a Sample Box",
  inquiry: "Start a B2B Inquiry",
  submit: "Send Request",
  submitting: "Sending…",
  contact: "Contact Milan Gems",
  backToTop: "Back to top",
};

export const HERO = {
  eyebrow: "Milan Gems",
  line1: "Iranian Gemstones",
  line2: "Natural Materials",
  tagline: "A private digital collection of rare Iranian materials.",
  scrollCue: "Scroll to Explore",
  media: {
    src: "/assets/stones/hero/photo/hero-cinematic.jpg",
    alt: "A single natural Persian turquoise nodule with dark spiderweb matrix veining, isolated on a dark studio background, macro photograph",
    width: 1920,
    height: 2400,
  } satisfies MediaAsset,
  video: {
    src: "/assets/stones/hero/photo/hero-cinematic.mp4",
    poster: "/assets/stones/hero/photo/hero-cinematic.jpg",
    alt: "A single natural Persian turquoise nodule slowly rotating under studio light against a dark background",
  } satisfies VideoAsset,
};

/**
 * Background film for the closing sequence (B2BCTA) — a short brand film
 * (a leather sample box opening to reveal stones, then macro cuts of the
 * agate, meteorite, and garnet material) trimmed to end before its own
 * baked-in title card, so it never duplicates the on-page closing copy.
 */
export const CLOSING_FILM = {
  src: "/assets/cta/photo/cta-brand-film.mp4",
  poster: "/assets/cta/photo/cta-brand-film-poster.jpg",
  alt: "A sample box of Iranian gemstones opening on a dark marble table, followed by macro details of agate, meteorite, and garnet specimens",
} satisfies VideoAsset;

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
  ctaLabel: CTA.sampleBox,
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
  requestTypes: [
    { value: "sample-box", label: "Sample Box" },
    { value: "b2b-inquiry", label: "General B2B Inquiry" },
  ],
};

export type RequestType = "sample-box" | "b2b-inquiry";

/** Copy for the dedicated /contact page. */
export const CONTACT_PAGE = {
  metaTitle: "Contact",
  metaDescription:
    "Contact Milan Gems for B2B inquiries and sample box requests — Iranian gemstones and natural materials for jewelry professionals, from Milan.",
  /** Poster for the hero film: the open sample box (brighter than frame 1). */
  heroPoster: "/assets/cta/photo/contact-hero-poster.jpg",
  kicker: "Contact",
  heading: "Begin a Conversation",
  intro:
    "For bespoke ateliers, master jewelers, designers and professional buyers. Tell us what you are working on and we will follow up from Milan.",
  sampleBox: {
    image: {
      src: "/assets/cta/photo/sample-box-open.jpg",
      alt: "An open Milan Gems sample box on a dark marble table holding turquoise, agate, garnet and meteorite specimens",
      width: 960,
      height: 1200,
    } satisfies MediaAsset,
    kicker: "B2B Sample Program",
    heading: "The Sample Box",
    body: "A curated selection of materials for professional review — the most direct way to judge color, matrix and character in hand.",
    points: [
      "Curated around your materials of interest",
      "For ateliers, jewelers and professional buyers",
      "Arranged individually after we review your request",
    ],
  },
  inquiry: {
    kicker: "B2B Inquiry",
    heading: "Tell us about your project",
    body: "Share the materials, quantities and timing you have in mind. Fields marked * are required.",
  },
  details: {
    kicker: "Milan Gems",
    heading: "Milan",
    body: "Based in Milan, working with ateliers and professional buyers across Europe.",
  },
  success:
    "Thank you. We will review your request and follow up regarding a curated selection for professional review.",
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
