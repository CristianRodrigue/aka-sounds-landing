import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ShoppingCart, Check, Star, ArrowLeft, Package, Award, Lock, ShieldCheck } from "lucide-react";
import { products } from "../data/products";
import AudioPlayer from "../components/AudioPlayer";
import Newsletter from "../components/Newsletter";
import { CountdownTimer, CountdownSpots, useDiscount } from "../components/Countdown";

export default function Product() {
    const { slug } = useParams();
    const { isActive } = useDiscount();
    const product = products.find(p => p.slug === slug);

    // Scroll to top when the component mounts or when slug changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!product) {
        return (
            <div className="min-h-screen pt-32 px-6 flex flex-col items-center">
                <h1 className="text-4xl font-display font-bold mb-4">Product not found</h1>
                <Link to="/" className="text-white/60 hover:text-white underline">Back to home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-24">
            {/* Background Grid */}
            <div className="fixed inset-0 bg-grid pointer-events-none opacity-20 z-0" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
                        <ArrowLeft size={16} /> Back to Catalog
                    </Link>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                    {/* 1. Product Image (Mobile: 1st, Desktop: Top-Left) */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="order-1 lg:col-start-1 lg:row-start-1 w-full"
                    >
                        {/* The Sculpted Style Card from Landing */}
                        <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-zinc-50 border border-white/10 p-[1px] shadow-[0_0_100px_rgba(255,255,255,0.05)]">
                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                            <div className="h-full w-full rounded-[2.9rem] overflow-hidden relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover scale-100 hover:scale-105 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />

                                <div className="absolute top-6 left-6">
                                    <span className="px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold tracking-widest uppercase text-white/90">
                                        {product.genre}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 3. Audio Demos (Mobile: 3rd, Desktop: Bottom-Left) */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="order-3 lg:col-start-1 lg:row-start-2 flex flex-col gap-8 w-full"
                    >

                        {/* Individual Sample Previews */}
                        {product.previewTracks && product.previewTracks.length > 0 && (
                            <AudioPlayer tracks={product.previewTracks} />
                        )}

                        {/* Casos de Exito (SoundCloud Demos) */}
                        <div className="flex flex-col gap-4 mt-2">
                            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white/60 mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                SUCCESS STORIES
                            </h3>

                            {/* Main Demo */}
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-md transition-all hover:bg-white/10">
                                <div className="rounded-2xl overflow-hidden bg-black">
                                    <iframe
                                        width="100%"
                                        height="166"
                                        scrolling="no"
                                        frameBorder="no"
                                        allow="autoplay"
                                        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(product.scTrackUrl)}&color=%23000000&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`}
                                    ></iframe>
                                </div>
                            </div>

                            {/* G-Powered Afterlife Demo */}
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-md transition-all hover:bg-white/10">
                                <div className="rounded-2xl overflow-hidden bg-black">
                                    <iframe
                                        width="100%"
                                        height="166"
                                        scrolling="no"
                                        frameBorder="no"
                                        allow="autoplay"
                                        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent('https://soundcloud.com/gpowered/g-powered-afterlife')}&color=%23000000&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`}
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 2. Product Info (Mobile: 2nd, Desktop: Right Column) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 flex flex-col w-full"
                    >
                        <h1 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter leading-[0.9] mb-6">
                            {product.name}
                        </h1>

                        <div className="flex flex-col mb-8">
                            <CountdownTimer />
                            <div className="flex flex-col gap-2 mb-6 mt-2">
                                {product.originalPrice && isActive && (
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl md:text-3xl font-bold text-white/30 line-through decoration-red-500/50">
                                            {product.originalPrice}
                                        </span>
                                        <CountdownSpots />
                                    </div>
                                )}
                                <div className="flex items-center gap-4">
                                    <div className="text-7xl md:text-8xl font-display font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] tracking-tighter">
                                        {isActive ? product.price : (product.originalPrice || product.price)}
                                    </div>
                                    {product.discountPercentage && isActive && (
                                        <div className="bg-red-500/15 text-red-400 border border-red-500/30 text-lg md:text-2xl font-black px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.25)]">
                                            -{product.discountPercentage}% OFF
                                        </div>
                                    )}
                                </div>
                            </div>

                            {product.originalPrice && isActive && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3 w-fit"
                                >
                                    <span className="text-xl">⏳</span>
                                    <div>
                                        <div className="text-red-400 font-bold text-sm mb-1 uppercase tracking-wider">Limited Time Offer</div>
                                        <div className="text-white/60 text-sm">Grab this special discount. This offer is strictly limited to the first 50 producers. Price will soon return to {product.originalPrice}.</div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <p className="text-lg text-white/70 mb-8 leading-relaxed">
                            DOMINATE THE INDUSTRIAL MAINSTAGE. 🔥 <br /><br />
                            The definitive artillery for producers who refuse to sound mediocre. This isn't just a pack; it's your shortcut to the heavy, label-ready sound demanded by the biggest stages in Europe.
                        </p>

                        <ul className="flex flex-col gap-4 mb-10">
                            <li className="flex items-start gap-3">
                                <div className="mt-1 bg-white/10 p-1 rounded-full"><span className="text-[14px] leading-none block">🔥</span></div>
                                <span className="text-white/80"><strong>20+ Signature Rumble Kicks:</strong> Pre-processed for maximum impact. Instant low-end dominance.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 bg-white/10 p-1 rounded-full"><span className="text-[14px] leading-none block">🛠️</span></div>
                                <span className="text-white/80"><strong>20+ Elite Kick Builder Kit:</strong> 20+ Toks, 20+ Bodies, 20+ Tails, 20+ Loops. Total control over your signature sound.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 bg-white/10 p-1 rounded-full"><span className="text-[14px] leading-none block">🎹</span></div>
                                <span className="text-white/80"><strong>20+ Serum Presets:</strong> Cutting-edge Industrial Screeches & Acid Leads. Pure sonic aggression.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 bg-white/10 p-1 rounded-full"><span className="text-[14px] leading-none block">🗣️</span></div>
                                <span className="text-white/80"><strong>40+ Dark Vocals:</strong> (Dry/Wet) Hypnotic, aggressive, and processed for the underground.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 bg-white/10 p-1 rounded-full"><span className="text-[14px] leading-none block">⚡</span></div>
                                <span className="text-white/80"><strong>40+ High-End FX & Glitch Loops:</strong> High-energy fillers designed for perfect tension and release.</span>
                            </li>
                        </ul>

                        {/* API ADD TO CART BUTTON (Payhip) */}
                        <a
                            href={product.paymentUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-3 bg-white text-black font-extrabold text-lg px-8 py-5 rounded-2xl hover:bg-white/90 transition-all active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)] mb-12 group"
                        >
                            <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                            BUY NOW
                        </a>

                        {/* Desktop Testimonials */}
                        {product.testimonials && product.testimonials.length > 0 && (
                            <div className="hidden lg:flex border-t border-white/10 pt-10 flex-col gap-4">
                                <h3 className="text-xs font-bold tracking-widest uppercase text-white/40 mb-2">Producer Testimonials</h3>
                                {product.testimonials.map((t: any) => (
                                    <div key={t.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 relative">
                                        <div className="absolute -top-3 -left-3 text-4xl opacity-20 font-serif">"</div>
                                        <p className="text-white/80 italic mb-4 leading-relaxed relative z-10">
                                            {t.text}
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white shrink-0">
                                                {t.initials}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-sm text-white truncate">{t.author}</div>
                                                <div className="text-xs text-white/40 font-medium tracking-wide truncate">{t.role}</div>
                                            </div>
                                            <div className="flex ml-auto text-yellow-500 gap-1 opacity-80 shrink-0">
                                                <Star size={12} fill="currentColor" />
                                                <Star size={12} fill="currentColor" />
                                                <Star size={12} fill="currentColor" />
                                                <Star size={12} fill="currentColor" />
                                                <Star size={12} fill="currentColor" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </motion.div>

                </div>

                {/* Mobile Testimonials Section */}
                {product.testimonials && product.testimonials.length > 0 && (
                    <div className="mt-24 max-w-4xl mx-auto flex flex-col lg:hidden">
                        <h3 className="text-xs font-bold tracking-widest uppercase text-white/40 mb-8 text-center">Producer Testimonials</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {product.testimonials.map((t: any) => (
                                <div key={t.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 relative">
                                    <div className="absolute -top-3 -left-3 text-4xl opacity-20 font-serif">"</div>
                                    <p className="text-white/80 italic mb-4 leading-relaxed relative z-10">
                                        {t.text}
                                    </p>
                                    <div className="flex items-center gap-4 mt-auto">
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white shrink-0">
                                            {t.initials}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-sm text-white truncate">{t.author}</div>
                                            <div className="text-[10px] text-white/40 font-medium tracking-wide truncate">{t.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* WHY USE THIS SAMPLE PACK Section */}
                <div className="mt-24 max-w-5xl mx-auto flex flex-col items-center">
                    <h2 className="text-3xl md:text-5xl font-display font-black tracking-tighter mb-8 text-center uppercase">Why Use This Sample Pack?</h2>

                    <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 md:p-12 relative overflow-hidden group">
                        {/* Red Accent Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-red-500/10 blur-[80px] pointer-events-none transition-opacity duration-700 group-hover:opacity-70" />

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <p className="text-lg md:text-xl text-white/70 leading-relaxed font-medium mb-10 max-w-3xl">
                                We know the struggle. You spend <span className="text-white font-bold bg-red-500/20 px-2 rounded-md">hours layering weak kicks</span>, trying to find that punch that hits you in the chest, only to end up with a muddy, heartless low-end. Your drops lack energy, your leads sound thin, and your tracks just don't have that <span className="text-white font-bold bg-white/10 px-2 rounded-md">massive, main-stage presence</span>.
                            </p>

                            <h3 className="text-xl md:text-2xl font-black text-white mb-10 tracking-tight uppercase">This pack is the ultimate shortcut.</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full text-left">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-red-500 font-black text-3xl font-display leading-none">01</span>
                                        <div className="h-px w-8 bg-white/10"></div>
                                    </div>
                                    <h4 className="text-white font-bold text-lg uppercase tracking-wide">Instant Impact</h4>
                                    <p className="text-sm md:text-base text-white/50 leading-relaxed">No more endless tweaking. Drop these meticulously distressed sounds straight into your project and feel the room shake instantly.</p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-red-500 font-black text-3xl font-display leading-none">02</span>
                                        <div className="h-px w-8 bg-white/10"></div>
                                    </div>
                                    <h4 className="text-white font-bold text-lg uppercase tracking-wide">Label-Ready Quality</h4>
                                    <p className="text-sm md:text-base text-white/50 leading-relaxed">Engineered with elite analog distortion and high-end processing to meet industry standards without touching a mixing console.</p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-red-500 font-black text-3xl font-display leading-none">03</span>
                                        <div className="h-px w-8 bg-white/10"></div>
                                    </div>
                                    <h4 className="text-white font-bold text-lg uppercase tracking-wide">Break Creative Blocks</h4>
                                    <p className="text-sm md:text-base text-white/50 leading-relaxed">With ready-to-use glitch loops, synth presets, and brutal vocals, you'll spark new ideas and finish tracks faster than ever.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. ROADMAP (THE INEVITABILITY) */}
                <div className="mt-32 mb-16 max-w-5xl mx-auto px-6">
                    <h3 className="text-3xl md:text-5xl font-display font-black tracking-tighter mb-20 text-center uppercase">
                        Your Shortcut to the Mainstage
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[4.5rem] left-[16.66%] right-[16.66%] h-[2px] bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0" />

                        {/* Step 1 */}
                        <div className="relative flex flex-col items-center text-center group">
                            <div className="w-36 h-36 rounded-full bg-black border border-white/5 flex flex-col items-center justify-center mb-8 relative z-10 transition-transform duration-500 group-hover:-translate-y-4 group-hover:border-red-500/40 bg-gradient-to-b from-white/5 to-transparent shadow-2xl">
                                <span className="text-white/20 font-display font-black text-6xl absolute -top-4 -left-4 group-hover:text-red-500/20 transition-colors">1</span>
                                <span className="text-white font-black text-2xl mb-1">DOWNLOAD</span>
                                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">The Pack</span>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3 tracking-tight">Get The Artillery</h4>
                            <p className="text-white/50 text-sm leading-relaxed px-4">Instant access to the elite samples used by top-tier producers.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative flex flex-col items-center text-center group">
                            <div className="w-36 h-36 rounded-full bg-black border border-white/5 flex flex-col items-center justify-center mb-8 relative z-10 transition-transform duration-500 group-hover:-translate-y-4 group-hover:border-red-500/40 bg-gradient-to-b from-white/5 to-transparent shadow-2xl">
                                <span className="text-white/20 font-display font-black text-6xl absolute -top-4 -left-4 group-hover:text-red-500/20 transition-colors">2</span>
                                <span className="text-white font-black text-2xl mb-1">DRAG&DROP</span>
                                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Into your DAW</span>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3 tracking-tight">Load The BRUTAL HARD Kick</h4>
                            <p className="text-white/50 text-sm leading-relaxed px-4">Drop our pre-processed kicks and synth presets directly into your session. No endless tweaking.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative flex flex-col items-center text-center group">
                            <div className="w-36 h-36 rounded-full bg-black border border-red-500/30 flex flex-col items-center justify-center mb-8 relative z-10 transition-transform duration-500 group-hover:-translate-y-4 group-hover:border-red-500 shadow-[0_0_30px_rgba(255,0,0,0.15)] group-hover:shadow-[0_0_50px_rgba(255,0,0,0.3)] bg-gradient-to-b from-red-500/10 to-transparent">
                                <span className="text-red-500/30 font-display font-black text-6xl absolute -top-4 -left-4 group-hover:text-red-500/50 transition-colors">3</span>
                                <span className="text-red-500 font-black text-2xl mb-1 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">DOMINATE</span>
                                <span className="text-red-400/60 text-[10px] font-bold uppercase tracking-widest">The Scene</span>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3 tracking-tight relative inline-block">Sound Professional <span className="absolute -bottom-1 left-0 w-full h-1 bg-red-500/50 -rotate-1 skew-x-12"></span></h4>
                            <p className="text-white/80 text-sm leading-relaxed px-4 font-medium">Your low-end is glued, your track has energy, and your demo is finally ready for the label.</p>
                        </div>
                    </div>
                </div>

                {/* Trust Badges / Guarantees Section */}
                <div className="mt-32 pt-16 border-t border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* 1. Instant Downloads */}
                        <div className="flex flex-col items-center text-center p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all">
                                <Package size={28} className="text-white/80" />
                            </div>
                            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/90 mb-4">Instant Downloads</h4>
                            <p className="text-sm text-white/50 leading-relaxed">
                                Access your downloads at any time. Receive instant access immediately upon ordering.
                            </p>
                        </div>

                        {/* 2. Money Back */}
                        <div className="flex flex-col items-center text-center p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all">
                                <Award size={28} className="text-white/80" />
                            </div>
                            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/90 mb-4">Money-Back Guarantee</h4>
                            <p className="text-sm text-white/50 leading-relaxed">
                                Our products are backed by our 3-day money back guarantee policy.
                            </p>
                        </div>

                        {/* 3. Secure Payment */}
                        <div className="flex flex-col items-center text-center p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all">
                                <Lock size={28} className="text-white/80" />
                            </div>
                            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/90 mb-4">Secure Payment</h4>
                            <p className="text-sm text-white/50 leading-relaxed">
                                Your payment information is processed 100% securely by well-known providers.
                            </p>
                        </div>

                        {/* 4. Quality */}
                        <div className="flex flex-col items-center text-center p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all">
                                <ShieldCheck size={28} className="text-white/80" />
                            </div>
                            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/90 mb-4">Supreme Quality</h4>
                            <p className="text-sm text-white/50 leading-relaxed">
                                Our goal is 100% satisfaction, providing absolutely insane Techno Sample Packs.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Newsletter Subscription */}
                <Newsletter />

            </div>
        </div>
    );
}


