import htEssentialsImg from '../assets/HARDTECHNO-ESSENTIALS-VOL.-1.jpg';
import htFreeTrialImg from '../assets/HARDTECHNO-ESSENTIALS-VOL.-1-FREE-SAMPLEPACK.jpg';

export const products = [
    {
        id: 1,
        name: "Hardtechno Essentials Vol. 1",
        description: "The ultimate collection for modern hard techno production.",
        price: "$29.99",
        genre: "HARD TECHNO",
        image: htEssentialsImg,
        wcProductId: 123, // Placeholder for the actual WooCommerce Product ID
        scTrackUrl: "https://api.soundcloud.com/tracks/1580231579" // Example SC track
    },
    {
        id: 2,
        name: "Hardtechno Essentials Vol. 1 FREE TRIAL",
        description: "Get a taste of our premium sounds at no cost.",
        price: "FREE",
        genre: "SAMPLE PACK",
        image: htFreeTrialImg,
        wcProductId: 124,
        scTrackUrl: "https://api.soundcloud.com/tracks/1580231579"
    }
];
