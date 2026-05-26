import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, ShieldCheck, ShoppingCart } from 'lucide-react';
import { freePacks, FreePack } from '../data/freePacks';

export default function FreeTrial() {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handlePaddleCheckout = (e: React.MouseEvent, priceId: string) => {
        e.preventDefault();
        if (typeof window !== 'undefined' && (window as any).Paddle) {
            (window as any).Paddle.Checkout.open({
                items: [{ priceId, quantity: 1 }]
            });
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 relative">
            {/* Background elements */}
            <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16 relative">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-6 mx-auto">
                        <Download size={28} className="text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white mb-4 uppercase">
                        Free Sounds
                    </h1>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto">
                        Free drops from the AKA SOUNDS archive: sounds, presets, and tools for producers who connect with the project.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {freePacks.map((pack: FreePack, index: number) => (
                        <motion.div
                            key={pack.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden flex flex-col hover:border-white/20 transition-all duration-300 group"
                        >
                            {/* Pack Image */}
                            <div className="relative aspect-square overflow-hidden bg-zinc-900 border-b border-white/10">
                                <img 
                                    src={pack.image} 
                                    alt={pack.title}
                                    className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                            </div>

                            <div className="p-8 flex flex-col flex-1">
                                <h3 className="text-2xl font-display font-bold text-white mb-3">
                                    {pack.title}
                                </h3>
                                <p className="text-white/60 text-sm mb-6 flex-1">
                                    {pack.description}
                                </p>

                                <ul className="space-y-2 mb-8">
                                    {pack.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-xs font-medium text-white/50">
                                            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex flex-col gap-4 mt-auto">
                                    <button
                                        onClick={(e) => handlePaddleCheckout(e, pack.paddlePriceId)}
                                        className="w-full flex items-center justify-center gap-3 bg-white text-black font-extrabold text-sm uppercase tracking-widest px-6 py-4 rounded-xl hover:bg-white/90 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                                    >
                                        <ShoppingCart size={18} />
                                        Download - $0.00
                                    </button>

                                    <p className="text-center text-[10px] text-white/40 flex items-center justify-center gap-1.5 leading-none">
                                        <ShieldCheck size={12} /> Secure Delivery via Email
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
