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
}

export interface VideoAsset {
  src: string;
  poster: string;
  alt: string;
  isPlaceholder?: boolean;
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

export interface StoneMaterial {
  slug: StoneSlug;
  /** Display name, e.g. "Persian Turquoise" */
  name: string;
  /** Short eyebrow/kicker label used above the section heading. */
  kicker: string;
  originSummary: string;
  /** Longer editorial copy paragraph(s). */
  description: string[];
  /** Short highlight phrases (not absolute claims). */
  highlights: string[];
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
   * chapter's opening shot — a swipeable slider on mobile.
   */
  showcase: [MediaAsset, MediaAsset];
  specimens: StoneSpecimen[];
}
