import htFreeTrialImg from '../assets/HARDTECHNO-ESSENTIALS-VOL.-1-FREE-SAMPLEPACK.jpg';

export interface FreePack {
    id: number;
    title: string;
    description: string;
    image: string;
    paddlePriceId: string;
    features: string[];
}

export const freePacks: FreePack[] = [
    {
        id: 5,
        title: "Serum 2 Hard Dance Screeches",
        description: "Master the most aggressive sounds in Hard Dance. An exclusive free pack containing pro-grade screeches and serum presets.",
        image: '/PORTADAS DE SAMPLE PACKS/Cover_FREE_SCREECH_Cyan.png',
        paddlePriceId: 'pri_01knt149kwqhp35wa0hwb4gwqn',
        features: [
            "Serum Presets",
            "Hard Dance Screeches",
            "Tutorial Project Files"
        ]
    },
    {
        id: 4,
        title: "Serum 2 Hardtechno Kick",
        description: "Unleash pure hardtechno power. A professional-grade kick designed for the heaviest warehouse sessions.",
        image: '/PORTADAS DE SAMPLE PACKS/AkasoundsProductCover-Hardtechno.jpeg',
        paddlePriceId: 'pri_01kn7gspy845ttqp6m8mn4jgkr',
        features: [
            "Serum Presets",
            "Hardtechno Kicks",
            "Tutorial Project Files"
        ]
    },
    {
        id: 3,
        title: "Serum 2 Zaag Kick",
        description: "An exclusive free mini-pack for creating massive Zaag Kicks in Serum. Drag, drop, and destroy.",
        image: '/PORTADAS DE SAMPLE PACKS/AkasoundsProductCover-ZaagKick.jpeg',
        paddlePriceId: 'pri_01kmnmnp5fr08h43fsfa2qbcqt',
        features: [
            "Serum Presets",
            "Zaag Kick Samples",
            "Tutorial Project Files"
        ]
    },
    {
        id: 2,
        title: "Serum 2 Reverse Bass Kick",
        description: "An exclusive free mini-pack from our latest YouTube tutorial. Master the art of the perfect reverse bass.",
        image: '/PORTADAS DE SAMPLE PACKS/AkasoundsProductCover.jpeg',
        paddlePriceId: 'pri_01kkwnrqgq7xcd5hhpxg99ae6p',
        features: [
            "Serum Presets",
            "Reverse Bass Samples",
            "Tutorial Project Files"
        ]
    },
    {
        id: 1,
        title: "Hardtechno Essentials Vol. 1",
        description: "Get a taste of our premium sounds. 32MB of pure industrial hard techno. High-quality samples, 100% royalty-free.",
        image: htFreeTrialImg,
        paddlePriceId: 'pri_01kkd2y0pdsxvg234s8zvfshqj',
        features: [
            "Premium Kicks & Rumbles",
            "Industrial Synths & Leads",
            "Atmospheric FX & Textures"
        ]
    }
];
