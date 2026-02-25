import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { setCookie, getCookie } from '../utils/cookies';
import { initializeAnalytics } from '../utils/analytics';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if the user has already consented
        const hasConsented = getCookie('akasounds_cookie_consent');
        if (hasConsented === 'accepted') {
            // If already accepted, initialize tracking silently in the background
            initializeAnalytics();
        } else if (!hasConsented) {
            // Add a small delay so it doesn't pop up instantly
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        // Set cookie to expire in 30 days
        setCookie('akasounds_cookie_consent', 'accepted', 30);
        setIsVisible(false);
        // Start tracking immediately upon user consent
        initializeAnalytics();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 pointer-events-none"
                >
                    <div className="max-w-4xl mx-auto bg-zinc-950 border border-white/10 p-6 rounded-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pointer-events-auto flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1">
                            <h3 className="text-lg font-display font-bold text-white tracking-tight mb-2">
                                Data for Annihilation.
                            </h3>
                            <p className="text-sm text-white/60 leading-relaxed">
                                We use cookies to optimize your production experience on this site. No fluff, just the essentials to keep things running heavy.
                            </p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <button
                                onClick={handleAccept}
                                className="w-full md:w-auto bg-white text-black font-extrabold px-8 py-3 rounded-xl text-xs tracking-widest uppercase hover:bg-white/90 active:scale-95 transition-all"
                            >
                                Accept & Continue
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
