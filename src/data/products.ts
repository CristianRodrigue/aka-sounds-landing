import htEssentialsImg from '../assets/HARDTECHNO-ESSENTIALS-VOL.-1.jpg';
import htFreeTrialImg from '../assets/HARDTECHNO-ESSENTIALS-VOL.-1-FREE-SAMPLEPACK.jpg';

export const products = [
    {
        id: 1,
        slug: "hardtechno-essentials-vol-1",
        name: "Hardtechno Essentials Vol. 1",
        description: "The ultimate collection for modern hard techno production.",
        price: "$14.99",
        originalPrice: "$29.99",
        discountPercentage: 50,
        genre: "HARD TECHNO",
        image: htEssentialsImg,
        wcProductId: 123, // Placeholder for the actual WooCommerce Product ID
        paymentUrl: "https://payhip.com/buy?link=ljIN2",
        scTrackUrl: "https://soundcloud.com/deat_aka/this-is-a-f-cking-hardtechno",
        previewTracks: [
            { id: 1, name: "DEAT_AKA_PUNCH_KICK_01", type: "Kick", duration: "0:02", url: "/samples/AKA_SOUNDS_HARDTECHNO-ESSENTIALS-VOL.-1-FREE-TRIAL/01 Kick Builder & Kicks/Punches/DEAT_AKA_PUNCH_KICK_01.wav" },
            { id: 2, name: "DEAT_AKA_RUMBLE_KICK_LOOP_01_155", type: "Rumble Loop", duration: "0:06", url: "/samples/AKA_SOUNDS_HARDTECHNO-ESSENTIALS-VOL.-1-FREE-TRIAL/01 Kick Builder & Kicks/Rumble Kicks/Kicks Loops/DEAT_AKA_RUMBLE_KICK_LOOP_01_155.wav" },
            { id: 3, name: "DEAT_AKA_VOCAL_DRY_01", type: "Vocal", duration: "0:08", url: "/samples/AKA_SOUNDS_HARDTECHNO-ESSENTIALS-VOL.-1-FREE-TRIAL/03 Vocals & FX/01 Vocals - Dry (Raw)/DEAT_AKA_VOCAL_DRY_01.wav" },
            { id: 4, name: "DEAT_AKA_VOCAL_GLITCH_01", type: "FX", duration: "0:04", url: "/samples/AKA_SOUNDS_HARDTECHNO-ESSENTIALS-VOL.-1-FREE-TRIAL/03 Vocals & FX/03 FX & Glitch/DEAT_AKA_VOCAL_GLITCH_01.wav" }
        ]
    },
    {
        id: 2,
        slug: "hardtechno-essentials-vol-1-free-trial",
        name: "Hardtechno Essentials Vol. 1 FREE TRIAL",
        description: "Get a taste of our premium sounds at no cost.",
        price: "FREE",
        originalPrice: undefined,
        discountPercentage: undefined,
        genre: "SAMPLE PACK",
        image: htFreeTrialImg,
        wcProductId: 124,
        paymentUrl: "https://payhip.com/buy?link=5jDOq",
        scTrackUrl: "https://soundcloud.com/deat_aka/this-is-a-f-cking-hardtechno",
        previewTracks: [
            { id: 1, name: "DEAT_AKA_PUNCH_KICK_01", type: "Kick", duration: "0:02", url: "/samples/AKA_SOUNDS_HARDTECHNO-ESSENTIALS-VOL.-1-FREE-TRIAL/01 Kick Builder & Kicks/Punches/DEAT_AKA_PUNCH_KICK_01.wav" },
            { id: 2, name: "DEAT_AKA_RUMBLE_KICK_LOOP_01_155", type: "Rumble Loop", duration: "0:06", url: "/samples/AKA_SOUNDS_HARDTECHNO-ESSENTIALS-VOL.-1-FREE-TRIAL/01 Kick Builder & Kicks/Rumble Kicks/Kicks Loops/DEAT_AKA_RUMBLE_KICK_LOOP_01_155.wav" }
        ]
    }
];
