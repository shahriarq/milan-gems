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
    originSummary: "Neyshabur · Iran",
    visualTreatment: "macro",
    persianName: "فیروزه",
    coordinates: { lat: "36° 29′ N", lon: "58° 23′ E" },
    story: {
      poeticLine: "Blue born from the mountains of Khorasan.",
      origin:
        "Our turquoise comes from Neyshabur, in Iran’s Razavi Khorasan province. The mine lies in the volcanic rock of the mountains north-west of the city, and has supplied most of Iran’s turquoise for more than a thousand years.",
      facts: [
        { label: "Mineral", value: "Hydrated copper aluminum phosphate" },
        { label: "Hardness", value: "5–6 Mohs" },
      ],
    },
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
    originSummary: "Iran",
    visualTreatment: "horizontal",
    persianName: "عقیق",
    story: {
      poeticLine: "No two lines follow the same path.",
      origin:
        "Agate forms slowly inside cavities in volcanic rock, as silica-rich water leaves one fine layer after another. Each band records a change in that water, which is why no two stones share a pattern. Ours is selected from Iranian deposits for the character of its banding.",
      facts: [
        { label: "Mineral", value: "Banded chalcedony (microcrystalline quartz)" },
        { label: "Hardness", value: "6.5–7 Mohs" },
        { label: "Origin", value: "Iran" },
      ],
    },
    heroImage: {
      src: "/assets/stones/agate/photo/agate-hero.jpg",
      alt: "Polished tumbled agates in deep blue, teal and amber with golden veining, laid out on black",
      width: 1920,
      height: 815,
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
    originSummary: "Iran",
    visualTreatment: "macro",
    persianName: "گارنت",
    story: {
      poeticLine: "Pressure became color.",
      origin:
        "Garnet crystallizes deep in the earth, where heat and pressure transform existing rock. Its color comes from the elements locked into the crystal as it grows. Ours is selected from Iranian deposits for depth and saturation of red.",
      facts: [
        { label: "Mineral", value: "Garnet group (silicates)" },
        { label: "Hardness", value: "6.5–7.5 Mohs" },
        { label: "Origin", value: "Iran" },
      ],
    },
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
    originSummary: "Provenance stated per specimen",
    persianName: "شهاب‌سنگ",
    story: {
      poeticLine: "Before the atelier.\nBefore the city.\nBefore us.",
      origin:
        "Meteorites are fragments of other bodies in the solar system that have reached the Earth. We offer them as an experimental material for contemporary design. Classification, provenance and documentation are stated only for individual specimens, and only where verified.",
      facts: [
        { label: "Material", value: "Experimental" },
        { label: "Classification", value: "Stated per specimen" },
        { label: "Documentation", value: "Only where verified" },
      ],
    },
    isExperimental: true,
    heroImage: {
      src: "/assets/stones/meteorite/photo/meteorite-hero.jpg",
      alt: "Three meteorite specimens on a dark shelf, the rightmost cut to show olivine crystals set in metal",
      width: 1920,
      height: 1072,
      // Keep the cut, olivine-rich specimen in frame on narrow (portrait) screens.
      focus: "86% 50%",
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
  story: StoneMaterial["story"];
  heroAlt: string;
  showcaseAlts: [string, string];
}

const STONES_IT: Record<StoneSlug, StoneTranslation> = {
  turquoise: {
    name: "Turchese Persiano",
    kicker: "01 — Materiali",
    originSummary: "Neyshabur · Iran",
    story: {
      poeticLine: "Un blu nato dalle montagne del Khorasan.",
      origin:
        "Il nostro turchese proviene da Neyshabur, nella provincia iraniana del Khorasan Razavi. La miniera si trova nella roccia vulcanica delle montagne a nord-ovest della città e da oltre mille anni fornisce la maggior parte del turchese iraniano.",
      facts: [
        { label: "Minerale", value: "Fosfato idrato di rame e alluminio" },
        { label: "Durezza", value: "5–6 Mohs" },
      ],
    },
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
    originSummary: "Iran",
    story: {
      poeticLine: "Nessuna linea segue lo stesso percorso.",
      origin:
        "L’agata si forma lentamente nelle cavità della roccia vulcanica, dove acque ricche di silice depositano uno strato sottile dopo l’altro. Ogni banda registra un cambiamento di quell’acqua: per questo nessuna pietra ha lo stesso disegno. La nostra è selezionata da giacimenti iraniani per il carattere delle sue bande.",
      facts: [
        { label: "Minerale", value: "Calcedonio a bande (quarzo microcristallino)" },
        { label: "Durezza", value: "6,5–7 Mohs" },
        { label: "Origine", value: "Iran" },
      ],
    },
    heroAlt: "Agate burattate lucidate in blu profondo, verde acqua e ambra con venature dorate, disposte su fondo nero",
    showcaseAlts: [
      "Pietre burattate lucidate con disegni screziati blu e bruno-dorati",
      "Agata lucidata con zone verde muschio, ambra e bande traslucide su ardesia scura, luce da studio",
    ],
  },
  garnet: {
    name: "Granato Iraniano",
    kicker: "03 — Materiali",
    originSummary: "Iran",
    story: {
      poeticLine: "La pressione è diventata colore.",
      origin:
        "Il granato cristallizza in profondità, dove calore e pressione trasformano la roccia esistente. Il suo colore nasce dagli elementi racchiusi nel cristallo durante la crescita. Il nostro è selezionato da giacimenti iraniani per profondità e saturazione del rosso.",
      facts: [
        { label: "Minerale", value: "Gruppo dei granati (silicati)" },
        { label: "Durezza", value: "6,5–7,5 Mohs" },
        { label: "Origine", value: "Iran" },
      ],
    },
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
    originSummary: "Provenienza indicata per esemplare",
    story: {
      poeticLine: "Prima dell’atelier.\nPrima della città.\nPrima di noi.",
      origin:
        "Le meteoriti sono frammenti di altri corpi del sistema solare giunti sulla Terra. Le proponiamo come materiale sperimentale per il design contemporaneo. Classificazione, provenienza e documentazione sono indicate solo per i singoli esemplari, e solo se verificate.",
      facts: [
        { label: "Materiale", value: "Sperimentale" },
        { label: "Classificazione", value: "Indicata per esemplare" },
        { label: "Documentazione", value: "Solo se verificata" },
      ],
    },
    heroAlt:
      "Tre esemplari di meteorite su una mensola scura, quello a destra tagliato a mostrare cristalli di olivina nel metallo",
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
      story: t.story,
      heroImage: { ...stone.heroImage, alt: t.heroAlt },
      showcase: [
        { ...stone.showcase[0], image: { ...stone.showcase[0].image, alt: t.showcaseAlts[0] } },
        { ...stone.showcase[1], image: { ...stone.showcase[1].image, alt: t.showcaseAlts[1] } },
      ],
    };
  });
}
