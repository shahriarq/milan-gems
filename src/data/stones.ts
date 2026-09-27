import type { StoneMaterial } from "./types";

/**
 * All stone/material content lives here. Replace `mainImage` / `gallery` /
 * `video` paths with real photography under /public/assets/stones/<slug>/
 * and update the specimen fields — no component changes required.
 */
export const STONES: StoneMaterial[] = [
  {
    slug: "turquoise",
    name: "Persian Turquoise",
    kicker: "01 — Materials",
    originSummary: "Neyshabur, Iran",
    description: [
      "Ancient turquoise from one of the world's historically significant turquoise-producing regions, selected for its distinctive color, character, and natural individuality.",
      "Each specimen is evaluated on its own terms — matrix pattern, tone, and structure vary by nature, and we present that variation rather than smooth it away.",
    ],
    highlights: ["Historic Neyshabur origin", "Distinctive matrix patterning", "Selected for bespoke settings"],
    heroImage: {
      src: "/assets/stones/turquoise/realistic/turquoise-hero.jpg",
      alt: "Placeholder studio image of Persian turquoise rough specimen with natural matrix veining",
      width: 1600,
      height: 2000,
      isPlaceholder: true,
    },
    specimens: [
      {
        id: "turq-001",
        name: "Turquoise Specimen — Lot 01",
        origin: "Neyshabur, Iran",
        treatment: "not-specified",
        weightCarats: 42.3,
        dimensionsMm: "28 × 19 × 8",
        matrix: "Dark spiderweb matrix",
        availability: "limited",
        documentation: "available-on-request",
        mainImage: {
          src: "/assets/stones/turquoise/realistic/turquoise-specimen-01-main.jpg",
          alt: "Placeholder image of turquoise specimen, lot 01, main view",
          width: 1200,
          height: 1200,
          isPlaceholder: true,
        },
        gallery: [
          {
            src: "/assets/stones/turquoise/realistic/turquoise-specimen-01-detail-a.jpg",
            alt: "Placeholder detail image of turquoise specimen 01, angle A",
            width: 1200,
            height: 1200,
            isPlaceholder: true,
          },
          {
            src: "/assets/stones/turquoise/realistic/turquoise-specimen-01-detail-b.jpg",
            alt: "Placeholder detail image of turquoise specimen 01, angle B",
            width: 1200,
            height: 1200,
            isPlaceholder: true,
          },
        ],
        notes: "Specification pending verification. Placeholder specimen for layout purposes only.",
      },
      {
        id: "turq-002",
        name: "Turquoise Specimen — Lot 02",
        origin: "Neyshabur, Iran",
        treatment: "not-specified",
        weightCarats: 18.7,
        dimensionsMm: "20 × 14 × 6",
        matrix: "Light webbing, cabochon-grade",
        availability: "inquire",
        documentation: "available-on-request",
        mainImage: {
          src: "/assets/stones/turquoise/realistic/turquoise-specimen-02-main.jpg",
          alt: "Placeholder image of turquoise specimen, lot 02, main view",
          width: 1200,
          height: 1200,
          isPlaceholder: true,
        },
        gallery: [
          {
            src: "/assets/stones/turquoise/realistic/turquoise-specimen-02-detail-a.jpg",
            alt: "Placeholder detail image of turquoise specimen 02, angle A",
            width: 1200,
            height: 1200,
            isPlaceholder: true,
          },
        ],
      },
    ],
  },
  {
    slug: "agate",
    name: "Iranian Agate",
    kicker: "02 — Materials",
    originSummary: "Regional Iranian deposits",
    description: [
      "Banded agate selected for the individuality of its natural patterning — no two cross-sections repeat, and each rough specimen carries its own record of formation.",
      "Earthy, layered tones read well in both sculptural and traditional settings, offering designers a material that carries visible natural history.",
    ],
    highlights: ["Natural banding, no two alike", "Earthy tonal range", "Rough & cut specimens available"],
    heroImage: {
      src: "/assets/stones/agate/realistic/agate-hero.jpg",
      alt: "Placeholder studio image of banded Iranian agate specimen",
      width: 1600,
      height: 2000,
      isPlaceholder: true,
    },
    specimens: [
      {
        id: "agate-001",
        name: "Agate Specimen — Lot 01",
        origin: "Iran",
        treatment: "not-specified",
        weightGrams: 86,
        dimensionsMm: "45 × 32 × 15",
        matrix: "Banded, polished face",
        availability: "in-stock",
        documentation: "available-on-request",
        mainImage: {
          src: "/assets/stones/agate/realistic/agate-specimen-01-main.jpg",
          alt: "Placeholder image of agate specimen, lot 01, main view",
          width: 1200,
          height: 1200,
          isPlaceholder: true,
        },
        gallery: [
          {
            src: "/assets/stones/agate/realistic/agate-specimen-01-detail-a.jpg",
            alt: "Placeholder detail image of agate specimen 01, angle A",
            width: 1200,
            height: 1200,
            isPlaceholder: true,
          },
        ],
      },
    ],
  },
  {
    slug: "garnet",
    name: "Iranian Garnet",
    kicker: "03 — Materials",
    originSummary: "Regional Iranian deposits",
    description: [
      "Deep red garnet with a natural character shaped by pressure and time, historically associated with jewelry and royal adornment across many cultures.",
      "Its clarity and saturation suit both classical settings and contemporary bespoke work, offering a material with genuine depth rather than uniform perfection.",
    ],
    highlights: ["Deep, saturated red tones", "Historic jewelry association", "Suited to contemporary settings"],
    heroImage: {
      src: "/assets/stones/garnet/realistic/garnet-hero.jpg",
      alt: "Placeholder studio image of deep red Iranian garnet specimen",
      width: 1600,
      height: 2000,
      isPlaceholder: true,
    },
    specimens: [
      {
        id: "garnet-001",
        name: "Garnet Specimen — Lot 01",
        origin: "Iran",
        treatment: "not-specified",
        weightCarats: 6.2,
        dimensionsMm: "9 × 7 × 5",
        matrix: "Faceted, transparent",
        availability: "limited",
        documentation: "available-on-request",
        mainImage: {
          src: "/assets/stones/garnet/realistic/garnet-specimen-01-main.jpg",
          alt: "Placeholder image of garnet specimen, lot 01, main view",
          width: 1200,
          height: 1200,
          isPlaceholder: true,
        },
        gallery: [
          {
            src: "/assets/stones/garnet/realistic/garnet-specimen-01-detail-a.jpg",
            alt: "Placeholder detail image of garnet specimen 01, angle A",
            width: 1200,
            height: 1200,
            isPlaceholder: true,
          },
        ],
      },
    ],
  },
  {
    slug: "meteorite",
    name: "Meteorite",
    kicker: "04 — Materials · Experimental",
    originSummary: "Extraterrestrial origin",
    description: [
      "Presented as an experimental, avant-garde material for designers working beyond conventional gemstone applications — its history predates the earth beneath any atelier.",
      "Provenance and authenticity documentation vary by specimen. We present each piece plainly, without treating any claim as verified unless supporting documentation exists.",
    ],
    highlights: ["Extraterrestrial origin", "Unusual material character", "For experimental & contemporary work"],
    isExperimental: true,
    heroImage: {
      src: "/assets/stones/meteorite/realistic/meteorite-hero.jpg",
      alt: "Placeholder studio image of meteorite specimen with Widmanstätten-like surface pattern",
      width: 1600,
      height: 2000,
      isPlaceholder: true,
    },
    specimens: [
      {
        id: "meteorite-001",
        name: "Meteorite Specimen — Lot 01",
        origin: "Provenance pending verification",
        treatment: "not-specified",
        weightGrams: 34,
        dimensionsMm: "38 × 22 × 10",
        matrix: "Etched metallic surface",
        availability: "inquire",
        documentation: "pending-verification",
        mainImage: {
          src: "/assets/stones/meteorite/realistic/meteorite-specimen-01-main.jpg",
          alt: "Placeholder image of meteorite specimen, lot 01, main view",
          width: 1200,
          height: 1200,
          isPlaceholder: true,
        },
        gallery: [
          {
            src: "/assets/stones/meteorite/realistic/meteorite-specimen-01-detail-a.jpg",
            alt: "Placeholder detail image of meteorite specimen 01, angle A",
            width: 1200,
            height: 1200,
            isPlaceholder: true,
          },
        ],
        notes: "Authenticity and provenance documentation not yet confirmed for this placeholder listing.",
      },
    ],
  },
];

export const getStoneBySlug = (slug: string) => STONES.find((s) => s.slug === slug);
