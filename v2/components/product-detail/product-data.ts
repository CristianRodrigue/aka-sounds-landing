export type ProductPreviewTrack = {
  readonly id: number;
  readonly name: string;
  readonly type: string;
  readonly duration: string;
  readonly url: string;
};

export type ProductDetailModel = {
  readonly slug: string;
  readonly displayName: string;
  readonly heroMeta: { readonly title: string; readonly detail: string };
  readonly artworkCaption: { readonly title: string; readonly detail: string };
  readonly title: string;
  readonly volume: string;
  readonly genre: string;
  readonly description: string;
  readonly artwork: string;
  readonly optimizedArtwork?: boolean;
  readonly currentPrice: string;
  readonly referencePrice?: string;
  readonly paddlePriceId: string;
  readonly previewContext?: string;
  readonly previewTracks: readonly ProductPreviewTrack[];
  readonly soundCloudTrackUrls: readonly string[];
  readonly relatedTrial: {
    readonly title: string;
    readonly titleLines: readonly string[];
    readonly sectionTitle: string;
    readonly label: string;
    readonly artwork: string;
    readonly optimizedArtwork?: boolean;
    readonly paddlePriceId: string;
  };
  readonly includedContent: readonly {
    readonly title: string;
    readonly detail: string;
  }[];
  readonly valueProposition: {
    readonly headline: string;
    readonly description: string;
    readonly pillars: readonly {
      readonly title: string;
      readonly detail: string;
    }[];
  };
};

export const hardtechnoEssentialsProduct: ProductDetailModel = {
  slug: "hardtechno-essentials-vol-1",
  displayName: "Hardtechno Essentials Vol. 01",
  heroMeta: { title: "AKA SOUNDS", detail: "HARDTECHNO SAMPLE PACK" },
  artworkCaption: { title: "HARDTECHNO ESSENTIALS", detail: "VOL. 01" },
  title: "HARDTECHNO ESSENTIALS",
  volume: "VOL. 01",
  genre: "HARD TECHNO / SAMPLE PACK",
  description: "The ultimate collection for modern hard techno production.",
  artwork: "/assets/HARDTECHNO-ESSENTIALS-VOL.-1.jpg",
  currentPrice: "$14.99",
  paddlePriceId: "pri_01kk855x7wk29gv2d4hgz60k63",
  previewTracks: [
    { id: 1, name: "DEAT_AKA_RUMBLE_KICK_01_155", type: "RUMBLE LOOP", duration: "0:06", url: "/samples/DEAT_AKA_RUMBLE_KICK_01_155.wav" },
    { id: 2, name: "DEAT_AKA_PUNCH_KICK_01", type: "PUNCH KICK", duration: "0:02", url: "/samples/DEAT_AKA_PUNCH_KICK_01.wav" },
    { id: 3, name: "DEAT_AKA_CRUNCH_01", type: "CRUNCH", duration: "0:02", url: "/samples/DEAT_AKA_CRUNCH_01.wav" },
    { id: 35, name: "DEAT_AKA_RUMBLE_KICK_LOOP_01_155", type: "RUMBLE LOOP", duration: "0:06", url: "/samples/DEAT_AKA_RUMBLE_KICK_LOOP_01_155.wav" },
    { id: 4, name: "LD - AFTERLIFE", type: "LEAD", duration: "0:04", url: "/samples/LD - Afterlife.mp3" },
    { id: 5, name: "SCR - BROKEN DRILL", type: "SCREECH", duration: "0:03", url: "/samples/SCR - Broken Drill.mp3" },
    { id: 6, name: "DEAT_AKA_VOCAL_DRY_01", type: "VOCAL DRY", duration: "0:08", url: "/samples/DEAT_AKA_VOCAL_DRY_01.wav" },
    { id: 7, name: "DEAT_AKA_VOCAL_WET_01", type: "VOCAL WET", duration: "0:04", url: "/samples/DEAT_AKA_VOCAL_WET_01.wav" },
    { id: 8, name: "DEAT_AKA_VOCAL_GLITCH_01", type: "VOCAL GLITCH", duration: "0:04", url: "/samples/DEAT_AKA_VOCAL_GLITCH_01.wav" },
  ],
  soundCloudTrackUrls: [
    "https://soundcloud.com/deat_aka/this-is-a-f-cking-hardtechno",
    "https://soundcloud.com/gpowered/g-powered-afterlife",
  ],
  relatedTrial: {
    title: "HARDTECHNO ESSENTIALS VOL. 01 FREE TRIAL",
    titleLines: ["HARDTECHNO ESSENTIALS", "VOL. 01 FREE TRIAL"],
    sectionTitle: "FREE TRIAL",
    label: "RELATED FREE TRIAL",
    artwork: "/assets/HARDTECHNO-ESSENTIALS-VOL.-1-FREE-SAMPLEPACK.jpg",
    paddlePriceId: "pri_01kkd2y0pdsxvg234s8zvfshqj",
  },
  includedContent: [
    { title: "20+ SIGNATURE RUMBLE KICKS", detail: "Pre-processed for maximum impact." },
    { title: "20+ ELITE KICK BUILDER KIT", detail: "Toks, bodies, tails and loops." },
    { title: "20+ SERUM PRESETS", detail: "Industrial screeches and acid leads." },
    { title: "40+ DARK VOCALS", detail: "Dry and wet vocal material." },
    { title: "40+ HIGH-END FX & GLITCH LOOPS", detail: "High-energy fillers for tension and release." },
  ],
  valueProposition: {
    headline: "BUILT FOR HEAVY, FAST PRODUCTION.",
    description: "Core tools for shaping heavy hard techno tracks.",
    pillars: [
      { title: "READY FOR IMPACT", detail: "Pre-processed rumble kicks and kick-builder material designed for immediate use." },
      { title: "BUILD THE CORE", detail: "Presets, industrial leads and dry/wet vocal material for shaping the main character of a track." },
      { title: "ADD TENSION & RELEASE", detail: "High-end FX and glitch loops for transitions, tension and release." },
    ],
  },
};

export const modernRawKickArsenalProduct: ProductDetailModel = {
  slug: "modern-raw-kick-arsenal-vol-1",
  displayName: "AKA SOUNDS MODERN RAW KICK ARSENAL VOL. 1 — FULL EDITION",
  heroMeta: { title: "AKA SOUNDS MODERN RAW KICK ARSENAL VOL. 1", detail: "FULL SAMPLE PACK" },
  artworkCaption: { title: "MODERN RAW KICK ARSENAL", detail: "VOL. 1 / FULL EDITION" },
  title: "MODERN RAW KICK ARSENAL",
  volume: "VOL. 1 — FULL EDITION",
  genre: "RAW KICK / SAMPLE PACK",
  description: "A focused raw kick toolkit for modern hard dance production.",
  artwork: "/assets/modern-raw-kick-arsenal-vol-1-cover.png",
  optimizedArtwork: true,
  currentPrice: "$19.99",
  referencePrice: "$24.99",
  paddlePriceId: "pri_01m0zn4mcma11bnywpvcp2qfk0",
  previewContext: "PREVIEWS FROM THE FREE EDITION",
  previewTracks: [
    { id: 101, name: "AKA_SOUNDS_RKA1_FREE_EDITION_KICK_001", type: "FULL KICK", duration: "0:00.375", url: "/samples/modern-raw-kick-arsenal-free/AKA_SOUNDS_RKA1_FREE_EDITION_KICK_001.wav" },
    { id: 102, name: "AKA_SOUNDS_RKA1_FREE_EDITION_KICK_016", type: "FULL KICK", duration: "0:00.469", url: "/samples/modern-raw-kick-arsenal-free/AKA_SOUNDS_RKA1_FREE_EDITION_KICK_016.wav" },
    { id: 103, name: "AKA_SOUNDS_RKA1_FREE_EDITION_KICK_031", type: "FULL KICK", duration: "0:00.468", url: "/samples/modern-raw-kick-arsenal-free/AKA_SOUNDS_RKA1_FREE_EDITION_KICK_031.wav" },
    { id: 104, name: "AKA_SOUNDS_RKA1_FREE_EDITION_PUNCH_001", type: "FULL PUNCH", duration: "0:00.217", url: "/samples/modern-raw-kick-arsenal-free/AKA_SOUNDS_RKA1_FREE_EDITION_PUNCH_001.wav" },
    { id: 105, name: "AKA_SOUNDS_RKA1_FREE_EDITION_PUNCH_018", type: "FULL PUNCH", duration: "0:00.159", url: "/samples/modern-raw-kick-arsenal-free/AKA_SOUNDS_RKA1_FREE_EDITION_PUNCH_018.wav" },
    { id: 106, name: "AKA_SOUNDS_RKA1_FREE_EDITION_PUNCH_SUB_006", type: "PUNCH SUB", duration: "0:00.127", url: "/samples/modern-raw-kick-arsenal-free/AKA_SOUNDS_RKA1_FREE_EDITION_PUNCH_SUB_006.wav" },
    { id: 107, name: "AKA_SOUNDS_RKA1_FREE_EDITION_TOP_PUNCH_009", type: "PUNCH TOP", duration: "0:00.101", url: "/samples/modern-raw-kick-arsenal-free/AKA_SOUNDS_RKA1_FREE_EDITION_TOP_PUNCH_009.wav" },
    { id: 108, name: "AKA_SOUNDS_RKA1_FREE_EDITION_CRUNCH_001", type: "FULL CRUNCH", duration: "0:00.212", url: "/samples/modern-raw-kick-arsenal-free/AKA_SOUNDS_RKA1_FREE_EDITION_CRUNCH_001.wav" },
    { id: 109, name: "AKA_SOUNDS_RKA1_FREE_EDITION_CRUNCH_014", type: "FULL CRUNCH", duration: "0:00.280", url: "/samples/modern-raw-kick-arsenal-free/AKA_SOUNDS_RKA1_FREE_EDITION_CRUNCH_014.wav" },
    { id: 110, name: "AKA_SOUNDS_RKA1_FREE_EDITION_CRUNCH_TOP_006", type: "CRUNCH TOP", duration: "0:00.227", url: "/samples/modern-raw-kick-arsenal-free/AKA_SOUNDS_RKA1_FREE_EDITION_CRUNCH_TOP_006.wav" },
    { id: 111, name: "AKA_SOUNDS_RKA1_FREE_EDITION_RUMBLE_009", type: "RUMBLE", duration: "0:00.380", url: "/samples/modern-raw-kick-arsenal-free/AKA_SOUNDS_RKA1_FREE_EDITION_RUMBLE_009.wav" },
    { id: 112, name: "AKA_SOUNDS_RKA1_FREE_EDITION_CLICK_006", type: "CLICK / TRANSIENT", duration: "0:00.033", url: "/samples/modern-raw-kick-arsenal-free/AKA_SOUNDS_RKA1_FREE_EDITION_CLICK_006.wav" },
    { id: 113, name: "AKA_SOUNDS_RKA1_FREE_EDITION_REVERB_009", type: "PUNCH REVERB", duration: "0:00.429", url: "/samples/modern-raw-kick-arsenal-free/AKA_SOUNDS_RKA1_FREE_EDITION_REVERB_009.wav" },
  ],
  soundCloudTrackUrls: [],
  relatedTrial: {
    title: "MODERN RAW KICK ARSENAL VOL. 1 FREE EDITION",
    titleLines: ["MODERN RAW KICK ARSENAL", "VOL. 1 — FREE EDITION"],
    sectionTitle: "FREE EDITION",
    label: "RELATED FREE EDITION",
    artwork: "/assets/modern-raw-kick-arsenal-vol-1-free-edition-cover.jpg",
    optimizedArtwork: true,
    paddlePriceId: "pri_01m0zn4mt890s0fp4xym0jpj9s",
  },
  includedContent: [
    { title: "31 FULL RAW KICKS", detail: "Finished kick designs ready for immediate use." },
    { title: "120 KICK COMPONENTS", detail: "48 punch, 43 crunch/tail, 11 click/transient and 18 punch reverb layers." },
    { title: "4 FL STUDIO PROJECTS", detail: "Production-ready projects for dissecting and rebuilding the sound." },
    { title: "3 SERUM 2 PRESETS", detail: "Focused synthesis starting points for heavy kick design." },
    { title: "151 RAW KICK SAMPLES", detail: "A complete raw kick arsenal for modern hard dance production." },
  ],
  valueProposition: {
    headline: "BUILD THE KICK FROM THE CORE.",
    description: "A modular raw kick system built for speed, impact and control.",
    pillars: [
      { title: "START WITH IMPACT", detail: "31 full kicks give you immediate weight when the track needs a strong foundation." },
      { title: "SHAPE THE DETAILS", detail: "Layer punch, crunch, tail, clicks and reverb components into your own signature." },
      { title: "OPEN THE PROJECT", detail: "FL Studio projects and Serum 2 presets keep the design process transparent and flexible." },
    ],
  },
};

export const productDetails: readonly ProductDetailModel[] = [
  hardtechnoEssentialsProduct,
  modernRawKickArsenalProduct,
];

export function getProductDetailBySlug(slug: string) {
  return productDetails.find((product) => product.slug === slug);
}
