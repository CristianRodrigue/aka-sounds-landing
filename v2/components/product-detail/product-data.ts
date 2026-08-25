export type ProductPreviewTrack = {
  readonly id: number;
  readonly name: string;
  readonly type: string;
  readonly duration: string;
  readonly url: string;
};

export type ProductDetailModel = {
  readonly slug: string;
  readonly title: string;
  readonly volume: string;
  readonly genre: string;
  readonly description: string;
  readonly artwork: string;
  readonly currentPrice: string;
  readonly paddlePriceId: string;
  readonly previewTracks: readonly ProductPreviewTrack[];
  readonly soundCloudTrackUrl: string;
  readonly relatedTrial: {
    readonly title: string;
    readonly artwork: string;
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
  soundCloudTrackUrl: "https://soundcloud.com/deat_aka/this-is-a-f-cking-hardtechno",
  relatedTrial: {
    title: "HARDTECHNO ESSENTIALS VOL. 01 FREE TRIAL",
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
