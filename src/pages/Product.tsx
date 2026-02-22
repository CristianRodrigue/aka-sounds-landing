import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ShoppingCart, Check, Star, ArrowLeft } from "lucide-react";
import { products } from "../data/products";

export default function Product() {
    const { id } = useParams();
    const product = products.find(p => p.id === Number(id));

    if (!product) {
        return (
            <div className="min-h-screen pt-32 px-6 flex flex-col items-center">
                <h1 className="text-4xl font-display font-bold mb-4">Product not found</h1>
                <Link to="/" className="text-white/60 hover:text-white underline">Back to home</Link>
            </div>
        );
    }

    // Generate the WooCommerce cart API link dynamically
    const addToCartUrl = `https://akasounds.com/store/wp-json/wc/v3/cart/add?product_id=${product.wcProductId}`;

    return (
        <div className="min-h-screen pt-24 pb-24">
            {/* Background Grid */}
            <div className="fixed inset-0 bg-grid pointer-events-none opacity-20 z-0" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
                        <ArrowLeft size={16} /> Back to Catalog
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Left Column - Product Image & Player */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col gap-8"
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

                        {/* Embedded SoundCloud Player */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-md">
                            <h3 className="text-xs font-bold tracking-widest uppercase text-white/60 mb-4 ml-2">Audio Demo</h3>
                            <div className="rounded-2xl overflow-hidden bg-black">
                                <iframe
                                    width="100%"
                                    height="166"
                                    scrolling="no"
                                    frameBorder="no"
                                    allow="autoplay"
                                    src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(product.scTrackUrl)}&color=%23ffffff&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`}
                                ></iframe>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column - Product Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col"
                    >
                        <h1 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter leading-[0.9] mb-6">
                            {product.name}
                        </h1>

                        <div className="text-4xl font-display font-bold text-white/90 mb-8">
                            {product.price}
                        </div>

                        <p className="text-lg text-white/70 mb-8 leading-relaxed">
                            DOMINATE THE INDUSTRIAL MAINSTAGE. 🔥 <br /><br />
                            The definitive artillery for producers who refuse to sound mediocre. This isn't just a pack; it's your shortcut to the heavy, label-ready sound demanded by the biggest stages in Europe.
                        </p>

                        <ul className="flex flex-col gap-4 mb-10">
                            <li className="flex items-start gap-3">
                                <div className="mt-1 bg-white/10 p-1 rounded-full"><RocketIcon /></div>
                                <span className="text-white/80"><strong>143 MB of High-End Raw Energy.</strong> Includes kicks, synths, and FX designed perfectly.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 bg-white/10 p-1 rounded-full"><FireIcon /></div>
                                <span className="text-white/80"><strong>Internationally Validated</strong> by top-tier producers across Finland and Europe.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 bg-white/10 p-1 rounded-full"><ToolsIcon /></div>
                                <span className="text-white/80"><strong>10 Years of Experience</strong> engineered strictly into every single sound.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="mt-1 bg-green-500/20 text-green-400 p-1 rounded-full"><Check size={14} strokeWidth={3} /></div>
                                <span className="text-white/80"><strong>100% Royalty-Free & Pro-Grade Compatibility</strong> (WAV + Serum).</span>
                            </li>
                        </ul>

                        {/* API ADD TO CART BUTTON */}
                        <a
                            href={addToCartUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-3 bg-white text-black font-extrabold text-lg px-8 py-5 rounded-2xl hover:bg-white/90 transition-all active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)] mb-12 group"
                        >
                            <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                            COMPRAR AHORA
                        </a>

                        {/* Testimonials */}
                        <div className="border-t border-white/10 pt-10">
                            <h3 className="text-xs font-bold tracking-widest uppercase text-white/40 mb-6">Producer Testimonials</h3>
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative">
                                <div className="absolute -top-3 -left-3 text-4xl opacity-20 font-serif">"</div>
                                <p className="text-white/80 italic mb-4 leading-relaxed relative z-10">
                                    This pack is ridiculous. The rumble kicks cut through the mix instantly without needing 5 plugins to EQ them. Absolute game changer for my workflow.
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">KK</div>
                                    <div>
                                        <div className="font-bold text-sm text-white">Kimmo Korpela</div>
                                        <div className="text-xs text-white/40 font-medium tracking-wide">G-Powered (Finland)</div>
                                    </div>
                                    <div className="flex ml-auto text-yellow-500 gap-1 opacity-80">
                                        <Star size={12} fill="currentColor" />
                                        <Star size={12} fill="currentColor" />
                                        <Star size={12} fill="currentColor" />
                                        <Star size={12} fill="currentColor" />
                                        <Star size={12} fill="currentColor" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </motion.div>

                </div>
            </div>
        </div>
    );
}

// Icons for the list
function RocketIcon() { return <span className="text-[14px] leading-none block">🚀</span>; }
function FireIcon() { return <span className="text-[14px] leading-none block">🔥</span>; }
function ToolsIcon() { return <span className="text-[14px] leading-none block">🛠️</span>; }
