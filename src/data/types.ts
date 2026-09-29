/**
 * Central content & media types for Milan Gems.
 *
 * Everything a component renders — copy, specs, image/video paths — is
 * described by these shapes and supplied from /src/data/*.ts. Components
 * should never hardcode stone content; they only read it through props
 * typed against these interfaces. This is what lets the placeholder
 * media/copy be swapped for real photography and verified specifications
 * later without touching component logic.
 */

export type StoneSlug = "turquoise" | "agate" | "garnet" | "meteorite";

export type Availability = "in-stock" | "limited" | "made-to-order" | "inquire";

export type TreatmentStatus =
  | "untreated"
  | "stabilized"
  | "treatment-undisclosed"
  | "not-specified";

export type DocumentationStatus =
  | "available-on-request"
  | "included"
  | "not-applicable"
  | "pending-verification";

export interface MediaAsset {
  /** Path relative to /public, e.g. /assets/stones/turquoise/hero.jpg */
  src: string;
  /** Required, descriptive alternative text for accessibility & SEO. */
  alt: string;
  /** Intrinsic width/height, used to prevent layout shift. */
  width: number;
  height: number;
  /** Marks the file as a placeholder to be replaced with real photography. */
  isPlaceholder?: boolean;
  /**
   * Focal point kept in view when the image is cropped to fill a frame of
   * a different shape (CSS object-position, e.g. "85% 50%"). Defaults to
   * the center.
   */
  focus?: string;
}

export interface VideoAsset {
  src: string;
  poster: string;
  alt: string;
  isPlaceholder?: boolean;
}

/**
 * Specification shown in a showcase specimen's detail view. Every field is
 * optional and must only be filled with verified values — never invent a
 * figure. Empty fields display as "—", except documentation and price,
 * which display as "Available upon request" (meteorite documentation:
 * "Verified per specimen"). Values are free text so they can carry units
 * and currency, e.g. "12.4 ct", "18 × 14 × 6 mm", "€ 1.200". Origin
 * defaults to the material's origin line when left empty.
 */
export interface SpecimenFacts {
  origin?: string;
  form?: string;
  weight?: string;
  dimensions?: string;
  treatment?: string;
  documentation?: string;
  price?: string;
}

export interface ShowcaseItem {
  image: MediaAsset;
  facts: SpecimenFacts;
}

export interface StoneSpecimen {
  id: string;
  name: string;
  origin: string;
  treatment: TreatmentStatus;
  weightCarats?: number;
  weightGrams?: number;
  dimensionsMm?: string;
  matrix?: string;
  availability: Availability;
  documentation: DocumentationStatus;
  mainImage: MediaAsset;
  gallery: MediaAsset[];
  video?: VideoAsset;
  notes?: string;
}

/** One row of technical information, e.g. { label: "Hardness", value: "5–6 Mohs" }. */
export interface MaterialFact {
  label: string;
  value: string;
}

/**
 * Editorial structure for every material: the emotional layer first, then
 * the factual one. Keep the poetic line short and the origin paragraph
 * factual; never state anything about a specific specimen here.
 */
export interface MaterialStory {
  /** A single short line. Line breaks ("\n") are kept. */
  poeticLine: string;
  /** A short, factual origin paragraph. */
  origin: string;
  /** General material facts (mineral, hardness, origin). */
  facts: MaterialFact[];
}

export interface StoneMaterial {
  slug: StoneSlug;
  /** Display name, e.g. "Persian Turquoise" */
  name: string;
  /** Short eyebrow/kicker label used above the section heading. */
  kicker: string;
  originSummary: string;
  /** The material's name in Persian, shown as a subtle micro-label (e.g. فیروزه). */
  persianName?: string;
  /** The three storytelling layers, in reading order. */
  story: MaterialStory;
  /**
   * Verified geographic coordinates of the origin, shown only when known
   * (e.g. the Neyshabur turquoise mine). Leave undefined otherwise.
   */
  coordinates?: { lat: string; lon: string };
  /** Whether this material is framed as experimental/avant-garde (meteorite). */
  isExperimental?: boolean;
  /**
   * Which secondary visual treatment follows the chapter's opening shot —
   * a second full-bleed macro image ("macro", the default) or a horizontal
   * scrolling gallery of the material's specimen photography ("horizontal").
   * Purely a display hint; experimental materials ignore it entirely.
   */
  visualTreatment?: "macro" | "horizontal";
  heroImage: MediaAsset;
  /**
   * Two vertical (4:5) photographs shown side by side right after the
   * chapter's opening shot — a swipeable slider on mobile. Each opens a
   * detail box with that piece's specification.
   */
  showcase: [ShowcaseItem, ShowcaseItem];
  specimens: StoneSpecimen[];
}
