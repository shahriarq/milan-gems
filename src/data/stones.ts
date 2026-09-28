import type { StoneMaterial, StoneSlug } from "./types";
import type { Locale } from "@/i18n/config";

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
    visualTreatment: "macro",
    description: [
      "Ancient turquoise from one of the world's historically significant turquoise-producing regions, selected for its distinctive color, character, and natural individuality.",
      "Each specimen is evaluated on its own terms — matrix pattern, tone, and structure vary by nature, and we present that variation rather than smooth it away.",
    ],
    highlights: ["Historic Neyshabur origin", "Distinctive matrix patterning", "Selected for bespoke settings"],
    heroImage: {
      src: "/assets/stones/turquoise/photo/turquoise-hero.jpg",
      alt: "A single natural Persian turquoise nodule with dark spiderweb matrix veining, Neyshabur, Iran, isolated on a dark studio background",
      width: 1600,
      height: 2000,
    },
    showcase: [
      {
        image: {
          src: "/assets/stones/turquoise/photo/turquoise-showcase-01.jpg",
          alt: "Natural Persian turquoise cabochons in varied sizes, sky-blue with fine matrix",
          width: 1200,
          height: 1500,
        },
        // Fill in when the piece's specification is confirmed.
        facts: {},
      },
      {
        image: {
          src: "/assets/stones/turquoise/photo/turquoise-showcase-02.jpg",
          alt: "Polished Persian turquoise nodule with dark spiderweb matrix on dark slate, studio lighting",
          width: 1200,
          height: 1500,
        },
        // Fill in when the piece's specification is confirmed.
        facts: {},
      },
    ],
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
          src: "/assets/stones/turquoise/photo/turquoise-specimen-01-main.jpg",
          alt: "Persian turquoise nodule specimen, Neyshabur origin, natural matrix and polished surface",
          width: 1200,
          height: 1200,
        },
        gallery: [
          {
            src: "/assets/stones/turquoise/photo/turquoise-specimen-01-detail-a.jpg",
            alt: "Close-up detail of Persian turquoise matrix veining and surface texture",
            width: 1200,
            height: 1200,
          },
          {
            src: "/assets/stones/turquoise/photo/turquoise-specimen-01-detail-b.jpg",
            alt: "Persian turquoise specimen detail showing natural color variation and veining",
            width: 1200,
            height: 1200,
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
          src: "/assets/stones/turquoise/photo/turquoise-specimen-02-main.jpg",
          alt: "Persian turquoise cabochon, light webbing, cabochon-grade, Neyshabur, Iran",
          width: 1200,
          height: 1200,
          isPlaceholder: true,
        },
        gallery: [
          {
            src: "/assets/stones/turquoise/photo/turquoise-specimen-02-detail-a.jpg",
            alt: "Detail of Persian turquoise cabochon surface and light matrix webbing",
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
    visualTreatment: "horizontal",
    description: [
      "Banded agate selected for the individuality of its natural patterning — no two cross-sections repeat, and each rough specimen carries its own record of formation.",
      "Earthy, layered tones read well in both sculptural and traditional settings, offering designers a material that carries visible natural history.",
    ],
    highlights: ["Natural banding, no two alike", "Earthy tonal range", "Rough & cut specimens available"],
    heroImage: {
      src: "/assets/stones/agate/photo/agate-hero.jpg",
      alt: "Polished banded agate specimens showing natural mineral layering and color variation",
      width: 1600,
      height: 2000,
      isPlaceholder: true,
    },
    showcase: [
      {
        image: {
          src: "/assets/stones/agate/photo/agate-showcase-01.jpg",
          alt: "Polished tumbled stones with blue and golden-brown mottled patterning",
          width: 1200,
          height: 1500,
        },
        // Fill in when the piece's specification is confirmed.
        facts: {},
      },
      {
        image: {
          src: "/assets/stones/agate/photo/agate-showcase-02.jpg",
          alt: "Polished agate with moss-green, amber and translucent banded zones on dark slate, studio lighting",
          width: 1200,
          height: 1500,
        },
        // Fill in when the piece's specification is confirmed.
        facts: {},
      },
    ],
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
          src: "/assets/stones/agate/photo/agate-specimen-01-main.jpg",
          alt: "Iranian agate specimen, polished face with natural banding",
          width: 1200,
          height: 1200,
          isPlaceholder: true,
        },
        gallery: [
          {
            src: "/assets/stones/agate/photo/agate-specimen-01-detail-a.jpg",
            alt: "Close-up detail of agate banding and mineral inclusions",
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
    visualTreatment: "macro",
    description: [
      "Deep red garnet with a natural character shaped by pressure and time, historically associated with jewelry and royal adornment across many cultures.",
      "Its clarity and saturation suit both classical settings and contemporary bespoke work, offering a material with genuine depth rather than uniform perfection.",
    ],
    highlights: ["Deep, saturated red tones", "Historic jewelry association", "Suited to contemporary settings"],
    heroImage: {
      src: "/assets/stones/garnet/photo/garnet-hero.jpg",
      alt: "A deep red garnet crystal cluster on its natural matrix beside a large faceted garnet gem, dark studio background",
      width: 1600,
      height: 2000,
    },
    showcase: [
      {
        image: {
          src: "/assets/stones/garnet/photo/garnet-showcase-01.jpg",
          alt: "Macro of deep red garnet crystals lining a geode with white quartz edges",
          width: 1200,
          height: 1500,
        },
        // Fill in when the piece's specification is confirmed.
        facts: {},
      },
      {
        image: {
          src: "/assets/stones/garnet/photo/garnet-showcase-02.jpg",
          alt: "Faceted cushion-cut red garnet on dark slate, studio lighting",
          width: 1200,
          height: 1500,
        },
        // Fill in when the piece's specification is confirmed.
        facts: {},
      },
    ],
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
          src: "/assets/stones/garnet/photo/garnet-specimen-01-main.jpg",
          alt: "Faceted transparent Iranian garnet specimen beside its natural crystal cluster, deep saturated red tone",
          width: 1200,
          height: 1200,
        },
        gallery: [
          {
            src: "/assets/stones/garnet/photo/garnet-specimen-01-detail-a.jpg",
            alt: "Close-up macro detail of garnet crystal facets on quartz matrix, natural clarity and formation",
            width: 1200,
            height: 1200,
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
      src: "/assets/stones/meteorite/photo/meteorite-hero.jpg",
      alt: "Meteorite specimen with metallic mineral inclusions and etched natural surface",
      width: 1600,
      height: 2000,
      isPlaceholder: true,
    },
    showcase: [
      {
        image: {
          src: "/assets/stones/meteorite/photo/meteorite-showcase-01.jpg",
          alt: "Meteorite-like specimen with dark crust and golden metallic surface, grey background",
          width: 1200,
          height: 1500,
        },
        // Fill in when the piece's specification is confirmed.
        facts: {},
      },
      {
        image: {
          src: "/assets/stones/meteorite/photo/meteorite-showcase-02.jpg",
          alt: "Dark pitted meteorite specimen resting in a sample box, macro photograph",
          width: 1200,
          height: 1500,
        },
        // Fill in when the piece's specification is confirmed.
        facts: {},
      },
    ],
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
          src: "/assets/stones/meteorite/photo/meteorite-specimen-01-main.jpg",
          alt: "Meteorite specimen, etched metallic surface, studio photograph",
          width: 1200,
          height: 1200,
          isPlaceholder: true,
        },
        gallery: [
          {
            src: "/assets/stones/meteorite/photo/meteorite-specimen-01-detail-a.jpg",
            alt: "Close-up detail of meteorite surface texture and metallic inclusions",
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

/**
 * Italian text for each material. Only the visible, translatable fields are
 * listed; images, specimen data and facts are shared with the English base
 * above, so a spec entered once appears in both languages.
 */
interface StoneTranslation {
  name: string;
  kicker: string;
  originSummary: string;
  description: string[];
  highlights: string[];
  heroAlt: string;
  showcaseAlts: [string, string];
}

const STONES_IT: Record<StoneSlug, StoneTranslation> = {
  turquoise: {
    name: "Turchese Persiano",
    kicker: "01 — Materiali",
    originSummary: "Neyshabur, Iran",
    description: [
      "Turchese antico da una delle regioni storicamente più importanti al mondo per la sua estrazione, selezionato per il colore distintivo, il carattere e l'individualità naturale.",
      "Ogni esemplare è valutato per ciò che è — disegno della matrice, tono e struttura variano per natura, e noi presentiamo questa variazione invece di nasconderla.",
    ],
    highlights: ["Storica origine di Neyshabur", "Matrice dal disegno distintivo", "Selezionato per montature su misura"],
    heroAlt:
      "Un singolo nodulo di turchese persiano naturale con venature scure a ragnatela, Neyshabur, Iran, isolato su fondo scuro",
    showcaseAlts: [
      "Cabochon di turchese persiano naturale di varie dimensioni, azzurro cielo con sottile matrice",
      "Nodulo di turchese persiano lucidato con matrice scura a ragnatela su ardesia scura, luce da studio",
    ],
  },
  agate: {
    name: "Agata Iraniana",
    kicker: "02 — Materiali",
    originSummary: "Giacimenti regionali iraniani",
    description: [
      "Agata a bande selezionata per l'unicità del suo disegno naturale — nessuna sezione si ripete e ogni esemplare grezzo porta con sé la propria storia di formazione.",
      "I toni terrosi e stratificati si prestano sia a montature scultoree sia tradizionali, offrendo ai designer un materiale che mostra la propria storia naturale.",
    ],
    highlights: ["Bande naturali, mai uguali", "Gamma di toni terrosi", "Esemplari grezzi e tagliati"],
    heroAlt: "Esemplari di agata a bande lucidati con stratificazioni minerali naturali e variazioni di colore",
    showcaseAlts: [
      "Pietre burattate lucidate con disegni screziati blu e bruno-dorati",
      "Agata lucidata con zone verde muschio, ambra e bande traslucide su ardesia scura, luce da studio",
    ],
  },
  garnet: {
    name: "Granato Iraniano",
    kicker: "03 — Materiali",
    originSummary: "Giacimenti regionali iraniani",
    description: [
      "Granato rosso intenso dal carattere naturale plasmato da pressione e tempo, storicamente legato alla gioielleria e agli ornamenti regali di molte culture.",
      "Limpidezza e saturazione si adattano sia a montature classiche sia a creazioni contemporanee su misura: un materiale di vera profondità, non di perfezione uniforme.",
    ],
    highlights: ["Toni rossi profondi e saturi", "Storico legame con la gioielleria", "Adatto a montature contemporanee"],
    heroAlt:
      "Un gruppo di cristalli di granato rosso intenso sulla matrice naturale accanto a un grande granato sfaccettato, fondo scuro",
    showcaseAlts: [
      "Macro di cristalli di granato rosso intenso in un geode con bordi di quarzo bianco",
      "Granato rosso sfaccettato a taglio cuscino su ardesia scura, luce da studio",
    ],
  },
  meteorite: {
    name: "Meteorite",
    kicker: "04 — Materiali · Sperimentale",
    originSummary: "Origine extraterrestre",
    description: [
      "Presentata come materiale sperimentale e d'avanguardia per designer che lavorano oltre le applicazioni gemmologiche convenzionali — la sua storia precede la terra sotto qualsiasi atelier.",
      "Provenienza e documentazione di autenticità variano da esemplare a esemplare. Presentiamo ogni pezzo con chiarezza, senza considerare verificata alcuna affermazione in assenza di documentazione.",
    ],
    highlights: ["Origine extraterrestre", "Carattere materico insolito", "Per lavori sperimentali e contemporanei"],
    heroAlt: "Esemplare di meteorite con inclusioni metalliche e superficie naturale incisa",
    showcaseAlts: [
      "Esemplare simile a una meteorite con crosta scura e superficie metallica dorata, fondo grigio",
      "Esemplare di meteorite scuro e bucherellato in un cofanetto campionario, fotografia macro",
    ],
  },
};

/** Materials in the requested language (English is the base). */
export function getStones(locale: Locale): StoneMaterial[] {
  if (locale === "en") return STONES;
  return STONES.map((stone) => {
    const t = STONES_IT[stone.slug];
    return {
      ...stone,
      name: t.name,
      kicker: t.kicker,
      originSummary: t.originSummary,
      description: t.description,
      highlights: t.highlights,
      heroImage: { ...stone.heroImage, alt: t.heroAlt },
      showcase: [
        { ...stone.showcase[0], image: { ...stone.showcase[0].image, alt: t.showcaseAlts[0] } },
        { ...stone.showcase[1], image: { ...stone.showcase[1].image, alt: t.showcaseAlts[1] } },
      ],
    };
  });
}
