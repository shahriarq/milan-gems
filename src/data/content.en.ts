import type { MediaAsset, VideoAsset } from "./types";

/**
 * English site copy & media references — nav, hero, sections, CTA, contact
 * page, footer and interface labels. The Italian dictionary (content.it.ts)
 * mirrors this exact shape; components read whichever one matches the
 * current locale via `useContent()` (client) or `getContent()` (server).
 */

const SITE = {
  name: "Milan Gems",
  tagline: "Iranian Gemstones & Natural Materials",
  description: "B2B sourcing for jewelry professionals.",
  email: "info@milangems.com",
  phone: "+39 352 024 9244",
  phoneHref: "tel:+393520249244",
  whatsapp: "https://wa.me/393520249244",
  linkedin: "https://linkedin.com/company/milangems",
  city: "Milan, Italy",
};

const CTA = {
  explore: "Explore Collection",
  viewSpecimen: "View Specimen",
  sampleBox: "Request Sample Box",
  inquiry: "Make an Inquiry",
  contact: "Contact Milan Gems",
  submit: "Send Inquiry",
  submitting: "Sending…",
  backToTop: "Back to top",
  or: "or",
};

export const en = {
  SITE,

  META: {
    title: "Milan Gems — Iranian Gemstones for Jewelry Professionals",
    description:
      "Persian turquoise, Iranian agate, garnet and meteorite for jewelry ateliers and professional buyers. B2B gemstone sourcing from Milan.",
    keywords: [
      "Iranian gemstones",
      "Persian turquoise",
      "Neyshabur turquoise",
      "Iranian agate",
      "Iranian garnet",
      "gemstones for jewelry designers",
      "B2B gemstone supplier Milan",
      "wholesale gemstones Italy",
    ],
    ogTitle: "Milan Gems — Iranian Gemstones & Natural Materials",
    ogDescription:
      "Rare materials, ancient origins, exceptional craft. Selected Iranian gemstones sourced for bespoke jewelry makers and professional buyers.",
    ogLocale: "en_US",
    ogImageAlt: "Milan Gems — Iranian gemstones and natural materials, Milan. A polished Persian turquoise nodule on dark slate.",
    orgDescription:
      "B2B sourcing of Iranian gemstones and natural materials — Persian turquoise, agate, garnet, and meteorite — for bespoke jewelry ateliers and professional buyers.",
  },

  /**
   * Primary navigation. Hrefs are locale-neutral ("/#about", "/contact") and
   * get the locale prefix at render time (see localizeHref).
   */
  NAV_LINKS: [
    { label: "Collection", href: "/#collection" },
    { label: "B2B", href: "/#b2b" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/contact" },
  ],

  /** Home-page sections tracked by the section progress indicator. */
  SECTION_INDEX: [
    { id: "turquoise", label: "Turquoise" },
    { id: "agate", label: "Agate" },
    { id: "garnet", label: "Garnet" },
    { id: "meteorite", label: "Meteorite" },
    { id: "b2b", label: "B2B" },
    { id: "about", label: "About" },
    { id: "request", label: "Sample Box" },
  ],

  /** One vocabulary for every call to action on the site. */
  CTA,

  HERO: {
    eyebrow: "Milan Gems",
    line1: "Iranian Gemstones",
    line2: "Natural Materials",
    tagline: "A private digital collection of rare Iranian materials.",
    scrollCue: "Explore Collection",
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
  },

  /**
   * Background film for the closing sequence and the contact hero — the
   * sample box opening, then macro cuts of the material, trimmed before its
   * own baked-in title card.
   */
  CLOSING_FILM: {
    src: "/assets/cta/photo/cta-brand-film.mp4",
    poster: "/assets/cta/photo/cta-brand-film-poster.jpg",
    alt: "A sample box of Iranian gemstones opening on a dark marble table, followed by macro details of agate, meteorite, and garnet specimens",
  } satisfies VideoAsset,

  ABOUT: {
    kicker: "About",
    heading: "A sourcing partner, not a storefront",
    body: [
      "Milan Gems works between origin and atelier — selecting Iranian gemstones and natural materials for jewelry professionals who need consistency, character, and a partner who understands both trade and craft.",
      "We are based in Milan and work with bespoke ateliers, master jewelers, designers, and professional buyers across Europe.",
    ],
    whyIran: {
      kicker: "Why Iran",
      body: [
        "For centuries, Iran has been a landscape of mineral diversity, natural materials and stone craftsmanship.",
        "Milan Gems brings selected materials from that origin closer to the atelier.",
      ],
    },
  },

  ADVANTAGE: {
    kicker: "The Advantage",
    heading: "A restrained, professional sourcing proposition",
    items: [
      { title: "Direct Sourcing", body: "Selected materials sourced through our supply network." },
      {
        title: "Documentation",
        body: "Export and product documentation available for B2B orders where applicable.",
      },
      { title: "Curated Selection", body: "Each collection is selected for professional jewelry applications." },
      {
        title: "B2B Supply",
        body: "Designed to support both individual atelier requirements and larger professional orders.",
      },
    ],
  },

  B2B_CTA: {
    kicker: "B2B Sample Program",
    heading: "Request the Collection",
    body: "Curated gemstone samples available for professional review in Milan.",
    ctaLabel: CTA.sampleBox,
  },

  CLOSING_SEQUENCE: {
    kicker: "The Collection",
    statement: "From Origin to Atelier.",
    city: "Milan",
    route: { originLabel: "Origin", origin: "Iran", destinationLabel: "Atelier", destination: "Milan" },
    finalStatement: "Milan Gems — where rare Iranian materials begin their journey to the atelier.",
  },

  CONTACT_FORM_FIELDS: {
    materialsOfInterest: ["Persian Turquoise", "Agate", "Garnet", "Meteorite", "Other / Not sure yet"],
    requestTypes: [
      { value: "sample-box", label: "Sample Box" },
      { value: "b2b-inquiry", label: "General B2B Inquiry" },
    ],
  },

  CONTACT_PAGE: {
    metaTitle: "Contact",
    metaDescription:
      "Contact Milan Gems for B2B inquiries and sample box requests — Iranian gemstones and natural materials for jewelry professionals, from Milan.",
    heroPoster: "/assets/cta/photo/contact-hero-poster.jpg",
    kicker: "Contact",
    heading: "Begin a Conversation",
    intro:
      "For bespoke ateliers, master jewelers, designers and professional buyers. Tell us what you are working on and we will follow up from Milan.",
    sampleBox: {
      image: {
        src: "/assets/cta/photo/sample-box-open.jpg",
        alt: "An open Milan Gems sample box with faceted garnets, turquoise nuggets, a banded agate slice, meteorite fragments and polished agates in black velvet compartments",
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
      heading: "Milan",
      body: "Based in Milan, working with ateliers and professional buyers across Europe.",
    },
    success:
      "Thank you. We will review your request and follow up regarding a curated selection for professional review.",
  },

  PORTFOLIO_INTRO: {
    kicker: "The Collection",
    heading: "Four materials, selected for professional work",
    body: "Each material is presented with its origin, character, and specification — reviewed individually rather than sold as a uniform commodity.",
  },

  /** Interface labels (buttons, form fields, dialogs, footer headings). */
  UI: {
    homeLabel: "home",
    consent: {
      text: "We use analytics cookies to understand how the site is used — only with your consent. You can change your choice at any time from the footer.",
      accept: "Accept",
      decline: "Decline",
      settings: "Cookie preferences",
    },
    chapter: { coordinates: "Coordinates" },
    notFound: {
      title: "Page not found",
      heading: "This page could not be found.",
      body: "The page you are looking for may have moved. Continue to the collection or get in touch.",
    },
    menu: { open: "Open menu", close: "Close menu", label: "Menu", primary: "Primary", mobile: "Mobile" },
    language: { label: "Language", names: { it: "Italiano", en: "English" } },
    sectionProgress: { label: "Section progress", goTo: "Go to" },
    showcase: {
      photos: "photographs",
      showImage: "Show image",
      of: "of",
    },
    detail: {
      lot: "Lot",
      origin: "Origin",
      form: "Form",
      weight: "Weight",
      dimensions: "Dimensions",
      treatment: "Treatment",
      documentation: "Documentation",
      price: "Price",
      onRequest: "Available upon request",
      perSpecimen: "Verified per specimen",
      note: "Values not yet confirmed for this specimen are shown as —. The full specification is available on request.",
      close: "Close specimen",
      previous: "Previous specimen",
      next: "Next specimen",
    },
    form: {
      requestType: "Request Type",
      name: "Name",
      company: "Company / Atelier",
      email: "Email",
      country: "Country",
      materials: "Materials of Interest",
      quantity: "Approximate Quantity",
      message: "Message",
      received: "Request Received",
      genericError: "Something went wrong. Please try again.",
    },
    contact: {
      email: "Email",
      phone: "Phone",
      whatsapp: "WhatsApp",
      whatsappMessage: "Hello Milan Gems, I would like some information about your materials.",
      linkedin: "LinkedIn",
      localTime: "Local time",
    },
    footer: {
      navigate: "Navigate",
      contact: "Contact",
      studio: "Studio",
      line: "From origin to atelier.",
      studioNote: "B2B, by request",
      legal: "All specifications and availability subject to review.",
      label: "Footer",
    },
  },
};
