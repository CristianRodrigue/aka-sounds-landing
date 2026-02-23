import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowLeft, Skull } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden py-24">
            {/* Animated background elements */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full border-[1px] border-white/20 border-dashed"
                />
                <motion.div
                    animate={{ rotate: -360, scale: [1, 1.5, 1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full border-[2px] border-white/10"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
                className="relative z-10 text-center flex flex-col items-center px-6"
            >
                <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="mb-8 p-6 bg-white/5 rounded-full border border-white/10 backdrop-blur-md"
                >
                    <Skull size={64} className="text-white/80" />
                </motion.div>

                <h1 className="text-8xl md:text-[150px] font-display font-extrabold tracking-tighter leading-none mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
                    404
                </h1>

                <div className="text-2xl md:text-4xl font-display font-bold text-white/60 mb-8 tracking-tight uppercase">
                    Signal Lost.
                </div>

                <p className="text-white/40 max-w-md mx-auto mb-10 text-sm md:text-base leading-relaxed">
                    The frequency you're looking for doesn't exist on this band.
                    Return to the mainstage before the bass drops.
                </p>

                <Link
                    to="/"
                    className="flex items-center gap-3 bg-white text-black font-extrabold text-sm px-8 py-4 rounded-full hover:bg-white/90 hover:scale-105 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.15)] group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    BACK TO CATALOG
                </Link>
            </motion.div>
        </div>
    );
}
