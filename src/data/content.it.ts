import type { SiteContent } from "./content";
import { en } from "./content.en";

/**
 * Italian site copy. Same shape as content.en.ts (enforced by the
 * SiteContent type); media paths are shared, only text differs.
 */

const CTA = {
  explore: "Esplora la Collezione",
  viewSpecimen: "Vedi l’Esemplare",
  sampleBox: "Richiedi il Campionario",
  inquiry: "Richiedi Informazioni",
  contact: "Contatta Milan Gems",
  submit: "Invia la Richiesta",
  submitting: "Invio in corso…",
  backToTop: "Torna su",
  or: "oppure",
};

export const it: SiteContent = {
  SITE: {
    ...en.SITE,
    tagline: "Gemme Iraniane & Materiali Naturali",
    description: "Fornitura B2B per professionisti della gioielleria.",
    city: "Milano, Italia",
  },

  META: {
    title: "Milan Gems — Gemme Iraniane per la Gioielleria",
    description:
      "Turchese persiano, agata, granato e meteorite iraniani per atelier di gioielleria e buyer professionali. Fornitura B2B di gemme da Milano.",
    keywords: [
      "gemme iraniane",
      "turchese persiano",
      "turchese di Neyshabur",
      "agata iraniana",
      "granato iraniano",
      "pietre per designer di gioielli",
      "fornitore gemme B2B Milano",
      "gemme all'ingrosso Italia",
    ],
    ogTitle: "Milan Gems — Gemme Iraniane e Materiali Naturali",
    ogDescription:
      "Materiali rari, origini antiche, lavorazione d'eccellenza. Gemme iraniane selezionate per orafi su misura e buyer professionali.",
    ogLocale: "it_IT",
    ogImageAlt: "Milan Gems — gemme e materiali naturali iraniani, Milano. Un nodulo di turchese persiano lucidato su ardesia scura.",
    orgDescription:
      "Fornitura B2B di gemme e materiali naturali iraniani — turchese persiano, agata, granato e meteorite — per atelier di gioielleria e buyer professionali.",
  },

  NAV_LINKS: [
    { label: "Collezione", href: "/#collection" },
    { label: "B2B", href: "/#b2b" },
    { label: "Chi Siamo", href: "/#about" },
    { label: "Contatti", href: "/contact" },
  ],

  SECTION_INDEX: [
    { id: "turquoise", label: "Turchese" },
    { id: "agate", label: "Agata" },
    { id: "garnet", label: "Granato" },
    { id: "meteorite", label: "Meteorite" },
    { id: "b2b", label: "B2B" },
    { id: "about", label: "Chi Siamo" },
    { id: "request", label: "Campionario" },
  ],

  CTA,

  HERO: {
    eyebrow: "Milan Gems",
    line1: "Gemme Iraniane",
    line2: "Materiali Naturali",
    tagline: "Una collezione digitale privata di rari materiali iraniani.",
    scrollCue: "Esplora la Collezione",
    media: {
      ...en.HERO.media,
      alt: "Un singolo nodulo di turchese persiano naturale con venature scure a ragnatela, isolato su fondo scuro, fotografia macro",
    },
    video: {
      ...en.HERO.video,
      alt: "Un nodulo di turchese persiano naturale che ruota lentamente sotto la luce da studio su fondo scuro",
    },
  },

  CLOSING_FILM: {
    ...en.CLOSING_FILM,
    alt: "Un cofanetto di gemme iraniane che si apre su un tavolo di marmo scuro, seguito da dettagli macro di agata, meteorite e granato",
  },

  ABOUT: {
    kicker: "Chi Siamo",
    heading: "Un partner di approvvigionamento, non un negozio",
    body: [
      "Milan Gems lavora tra l'origine e l'atelier — selezionando gemme e materiali naturali iraniani per professionisti della gioielleria che cercano costanza, carattere e un partner che conosca sia il commercio sia il mestiere.",
      "Abbiamo sede a Milano e collaboriamo con atelier su misura, maestri orafi, designer e buyer professionali in tutta Europa.",
    ],
    whyIran: {
      kicker: "Perché l’Iran",
      body: [
        "Da secoli l’Iran è un paesaggio di diversità minerale, materiali naturali e lavorazione della pietra.",
        "Milan Gems avvicina all’atelier materiali selezionati da quell’origine.",
      ],
    },
  },

  ADVANTAGE: {
    kicker: "Il Vantaggio",
    heading: "Una proposta di approvvigionamento sobria e professionale",
    items: [
      { title: "Approvvigionamento Diretto", body: "Materiali selezionati reperiti attraverso la nostra rete di fornitura." },
      {
        title: "Documentazione",
        body: "Documentazione di esportazione e di prodotto disponibile per gli ordini B2B, ove applicabile.",
      },
      { title: "Selezione Curata", body: "Ogni collezione è selezionata per applicazioni di gioielleria professionale." },
      {
        title: "Fornitura B2B",
        body: "Pensata per le esigenze del singolo atelier come per ordini professionali di maggiore entità.",
      },
    ],
  },

  B2B_CTA: {
    kicker: "Programma Campionari B2B",
    heading: "Richiedi la Collezione",
    body: "Campionari di gemme selezionati, disponibili per la valutazione professionale a Milano.",
    ctaLabel: CTA.sampleBox,
  },

  CLOSING_SEQUENCE: {
    kicker: "La Collezione",
    statement: "Dall'Origine all'Atelier.",
    city: "Milano",
    route: { originLabel: "Origine", origin: "Iran", destinationLabel: "Atelier", destination: "Milano" },
    finalStatement: "Milan Gems — dove i rari materiali iraniani iniziano il loro viaggio verso l'atelier.",
  },

  CONTACT_FORM_FIELDS: {
    materialsOfInterest: ["Turchese Persiano", "Agata", "Granato", "Meteorite", "Altro / Da definire"],
    requestTypes: [
      { value: "sample-box", label: "Campionario" },
      { value: "b2b-inquiry", label: "Richiesta B2B Generale" },
    ],
  },

  CONTACT_PAGE: {
    ...en.CONTACT_PAGE,
    metaTitle: "Contatti",
    metaDescription:
      "Contatta Milan Gems per richieste B2B e campionari — gemme e materiali naturali iraniani per professionisti della gioielleria, da Milano.",
    kicker: "Contatti",
    heading: "Iniziamo una Conversazione",
    intro:
      "Per atelier su misura, maestri orafi, designer e buyer professionali. Raccontaci il tuo progetto: ti ricontatteremo da Milano.",
    sampleBox: {
      image: {
        ...en.CONTACT_PAGE.sampleBox.image,
        alt: "Un cofanetto campionario Milan Gems aperto con granati sfaccettati, pepite di turchese, una fetta di agata a bande, frammenti di meteorite e agate lucidate in scomparti di velluto nero",
      },
      kicker: "Programma Campionari B2B",
      heading: "Il Campionario",
      body: "Una selezione curata di materiali per la valutazione professionale — il modo più diretto per giudicare dal vivo colore, matrice e carattere.",
      points: [
        "Composto in base ai materiali di tuo interesse",
        "Per atelier, orafi e buyer professionali",
        "Preparato su misura dopo aver valutato la tua richiesta",
      ],
    },
    inquiry: {
      kicker: "Richiesta B2B",
      heading: "Raccontaci il tuo progetto",
      body: "Indica materiali, quantità e tempistiche che hai in mente. I campi contrassegnati da * sono obbligatori.",
    },
    details: {
      heading: "Milano",
      body: "Con sede a Milano, collaboriamo con atelier e buyer professionali in tutta Europa.",
    },
    success:
      "Grazie. Valuteremo la tua richiesta e ti ricontatteremo per una selezione curata destinata alla valutazione professionale.",
  },

  PORTFOLIO_INTRO: {
    kicker: "La Collezione",
    heading: "Quattro materiali, selezionati per il lavoro professionale",
    body: "Ogni materiale è presentato con la sua origine, il suo carattere e le sue specifiche — valutato singolarmente, non venduto come una merce uniforme.",
  },

  UI: {
    homeLabel: "home",
    consent: {
      text: "Usiamo cookie analitici per capire come viene utilizzato il sito, solo con il tuo consenso. Puoi modificare la scelta in qualsiasi momento dal piè di pagina.",
      accept: "Accetta",
      decline: "Rifiuta",
      settings: "Preferenze cookie",
    },
    chapter: { coordinates: "Coordinate" },
    notFound: {
      title: "Pagina non trovata",
      heading: "Questa pagina non esiste.",
      body: "La pagina che cerchi potrebbe essere stata spostata. Torna alla collezione o contattaci.",
    },
    menu: { open: "Apri menu", close: "Chiudi menu", label: "Menu", primary: "Principale", mobile: "Mobile" },
    language: { label: "Lingua", names: { it: "Italiano", en: "English" } },
    sectionProgress: { label: "Avanzamento sezioni", goTo: "Vai a" },
    showcase: {
      photos: "fotografie",
      showImage: "Mostra immagine",
      of: "di",
    },
    detail: {
      lot: "Lotto",
      origin: "Origine",
      form: "Forma",
      weight: "Peso",
      dimensions: "Dimensioni",
      treatment: "Trattamento",
      documentation: "Documentazione",
      price: "Prezzo",
      onRequest: "Disponibile su richiesta",
      perSpecimen: "Verificata per esemplare",
      note: "I valori non ancora confermati per questo esemplare sono indicati con —. La specifica completa è disponibile su richiesta.",
      close: "Chiudi esemplare",
      previous: "Esemplare precedente",
      next: "Esemplare successivo",
    },
    form: {
      requestType: "Tipo di Richiesta",
      name: "Nome",
      company: "Azienda / Atelier",
      email: "Email",
      country: "Paese",
      materials: "Materiali di Interesse",
      quantity: "Quantità Indicativa",
      message: "Messaggio",
      received: "Richiesta Ricevuta",
      genericError: "Si è verificato un errore. Riprova.",
    },
    contact: {
      email: "Email",
      phone: "Telefono",
      whatsapp: "WhatsApp",
      whatsappMessage: "Buongiorno Milan Gems, vorrei ricevere informazioni sui vostri materiali.",
      linkedin: "LinkedIn",
      localTime: "Ora locale",
    },
    footer: {
      navigate: "Naviga",
      contact: "Contatti",
      studio: "Studio",
      line: "Dall'origine all'atelier.",
      studioNote: "B2B, su richiesta",
      legal: "Tutte le specifiche e le disponibilità sono soggette a verifica.",
      label: "Piè di pagina",
    },
  },
};
