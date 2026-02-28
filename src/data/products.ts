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
            { id: 1, name: "DEAT_AKA_RUMBLE_KICK_01_155", type: "Rumble Loop", duration: "0:06", url: "/samples/DEAT_AKA_RUMBLE_KICK_01_155.wav" },
            { id: 2, name: "DEAT_AKA_PUNCH_KICK_01", type: "Punch Kick", duration: "0:02", url: "/samples/DEAT_AKA_PUNCH_KICK_01.wav" },
            { id: 3, name: "DEAT_AKA_CRUNCH_01", type: "Crunch", duration: "0:02", url: "/samples/DEAT_AKA_CRUNCH_01.wav" },
            { id: 35, name: "DEAT_AKA_RUMBLE_KICK_LOOP_01_155", type: "Rumble Loop", duration: "0:06", url: "/samples/DEAT_AKA_RUMBLE_KICK_LOOP_01_155.wav" },
            { id: 4, name: "LD - Afterlife", type: "Lead", duration: "0:04", url: "/samples/LD - Afterlife.mp3" },
            { id: 5, name: "SCR - Broken Drill", type: "Screech", duration: "0:03", url: "/samples/SCR - Broken Drill.mp3" },
            { id: 6, name: "DEAT_AKA_VOCAL_DRY_01", type: "Vocal Dry", duration: "0:08", url: "/samples/DEAT_AKA_VOCAL_DRY_01.wav" },
            { id: 7, name: "DEAT_AKA_VOCAL_WET_01", type: "Vocal Wet", duration: "0:04", url: "/samples/DEAT_AKA_VOCAL_WET_01.wav" },
            { id: 8, name: "DEAT_AKA_VOCAL_GLITCH_01", type: "Vocal Glitch", duration: "0:04", url: "/samples/DEAT_AKA_VOCAL_GLITCH_01.wav" }
        ],
        testimonials: [
            { id: 1, text: "High quality pack... I got inspired by it!", author: "Kimmo Korpela", role: "G-Powered (Finland)", initials: "KK" },
            { id: 2, text: "Ahhhhh!!!!!!!! thats very sickkkk keep it upppp", author: "@MFB5", role: "YouTube Subscriber", initials: "M" },
            { id: 3, text: "awesome heavy", author: "@tw4987", role: "YouTube Subscriber", initials: "T" },
            { id: 4, text: "Aina mukana!", author: "@KaljaRutinaDJ", role: "YouTube Subscriber", initials: "K" },
            { id: 5, text: "yay!", author: "@elijahjuddofficial", role: "YouTube Subscriber", initials: "E" },
            { id: 6, text: "Jes uutta jytää", author: "@moversti92", role: "YouTube Subscriber", initials: "M" }
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
            { id: 1, name: "DEAT_AKA_PUNCH_KICK_01", type: "Kick", duration: "0:02", url: "/samples/DEAT_AKA_PUNCH_KICK_01.wav" },
            { id: 2, name: "DEAT_AKA_RUMBLE_KICK_LOOP_01_155", type: "Rumble Loop", duration: "0:06", url: "/samples/DEAT_AKA_RUMBLE_KICK_01_155.wav" },
            { id: 3, name: "LD - Afterlife", type: "Lead", duration: "0:04", url: "/samples/LD - Afterlife.mp3" },
            { id: 4, name: "SCR - Broken Drill", type: "Screech", duration: "0:03", url: "/samples/SCR - Broken Drill.mp3" },
            { id: 6, name: "DEAT_AKA_VOCAL_WET_01", type: "Vocal Wet", duration: "0:04", url: "/samples/DEAT_AKA_VOCAL_WET_01.wav" }
        ],
        testimonials: [
            { id: 1, text: "High quality pack... I got inspired by it!", author: "Kimmo Korpela", role: "G-Powered (Finland)", initials: "KK" },
            { id: 2, text: "Ahhhhh!!!!!!!! thats very sickkkk keep it upppp", author: "@MFB5", role: "YouTube Subscriber", initials: "M" },
            { id: 3, text: "awesome heavy", author: "@tw4987", role: "YouTube Subscriber", initials: "T" },
            { id: 4, text: "Aina mukana!", author: "@KaljaRutinaDJ", role: "YouTube Subscriber", initials: "K" },
            { id: 5, text: "yay!", author: "@elijahjuddofficial", role: "YouTube Subscriber", initials: "E" },
            { id: 6, text: "Jes uutta jytää", author: "@moversti92", role: "YouTube Subscriber", initials: "M" }
        ]
    }
];
