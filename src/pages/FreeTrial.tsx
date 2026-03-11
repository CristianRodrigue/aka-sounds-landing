import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, ShieldCheck, ShoppingCart } from 'lucide-react';

export default function FreeTrial() {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handlePaddleCheckout = (e: React.MouseEvent) => {
        e.preventDefault();
        if (typeof window !== 'undefined' && (window as any).Paddle) {
            (window as any).Paddle.Checkout.open({
                items: [{ priceId: 'pri_01kkd2y0pdsxvg234s8zvfshqj', quantity: 1 }]
            });
        }
    };

    return (
        <div className="min-h-[80vh] pt-32 pb-24 px-6 flex items-center justify-center relative">
            {/* Background elements */}
            <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-xl relative z-10"
            >
                <div className="bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                    <div className="text-center mb-10 relative">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-6 mx-auto">
                            <Download size={28} className="text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight text-white mb-4 uppercase">
                            Unlock Free Trial
                        </h1>
                        <p className="text-white/60 text-lg">
                            Get instant access to 32MB of pure industrial hard techno. High-quality samples, 100% royalty-free.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6 relative">
                        <button
                            onClick={handlePaddleCheckout}
                            className="w-full flex items-center justify-center gap-3 bg-white text-black font-extrabold text-sm uppercase tracking-widest px-8 py-5 rounded-xl hover:bg-white/90 transition-all active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                        >
                            <ShoppingCart size={20} />
                            Get Access Now - $0.00
                        </button>

                        <p className="text-center text-xs text-white/40 flex flex-col items-center justify-center gap-2">
                            <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Secure Checkout via Paddle</span>
                            Your download link will be emailed to you immediately.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
