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
        paymentUrl: "https://payhip.com/b/ljIN2",
        scTrackUrl: "https://api.soundcloud.com/tracks/1580231579" // Example SC track
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
        paymentUrl: "https://payhip.com/b/5jDOq",
        scTrackUrl: "https://api.soundcloud.com/tracks/1580231579"
    }
];
