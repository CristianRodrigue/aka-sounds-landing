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
