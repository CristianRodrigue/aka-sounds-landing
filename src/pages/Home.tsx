import { motion } from "motion/react";
import { ShoppingCart, Search, Play, ChevronRight, Zap, Instagram, CloudLightning, Music2 } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "../data/products";
import deatPortrait from "../assets/deat_portrait.png";

export default function Home() {
    return (
        <>
            {/* Hero Section */}



            <main className="relative pt-20 overflow-hidden">
                {/* Background Accents - Grid Only */}
                <div className="absolute top-0 left-0 w-full h-full bg-grid pointer-events-none opacity-20" />

                <div className="max-w-7xl mx-auto px-6 pt-24 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-bold tracking-widest uppercase mb-8"
                        >
                            <Zap size={12} className="text-white" />
                            New Release: HARDTECHNO ESSENTIALS VOL. 1
                        </motion.div>

                        <h1 className="text-6xl md:text-8xl font-display font-extrabold tracking-tighter leading-[0.9] mb-8">
                            The Sound of <br />
                            <span className="text-white/40">Heavy Mainstream.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/60 max-w-lg mb-10 leading-relaxed">
                            Premium sample packs for Hard Techno, Hardstyle, Rawstyle, and Uptempo.
                            Crafted for the biggest stages and the heaviest systems.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="relative w-full sm:w-96 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search for a genre or pack..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-white/30 transition-all placeholder:text-white/20"
                                />
                            </div>
                            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black font-bold px-8 py-4 rounded-2xl hover:bg-white/90 transition-all active:scale-95">
                                Explore Packs
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        <div className="mt-12 flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
                            <div className="text-xs font-bold tracking-widest uppercase">Used by producers at:</div>
                            <div className="flex gap-6 items-center">
                                <span className="font-display font-bold text-lg">DEFQON.1</span>
                                <span className="font-display font-bold text-lg">REVERZE</span>
                                <span className="font-display font-bold text-lg">DECIBEL</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Content - Visual Element */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="relative flex items-center justify-center -ml-16 xl:-ml-32"
                    >
                        <div className="relative w-full max-w-[120%] scale-[1.35]">
                            <div className="relative w-full flex items-center justify-center group"
                                style={{
                                    WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 40%, black 50%, transparent 80%)',
                                    maskImage: 'radial-gradient(ellipse 65% 55% at 50% 40%, black 50%, transparent 80%)'
                                }}>
                                <video
                                    src="/Ista_esttica_cinematogrfica_1080p_202602201.mp4"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-auto object-contain scale-[1.2] opacity-90 transition-transform duration-1000"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>



            {/* Featured Products Section */}
            <section className="py-24 relative bg-white text-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-xs font-bold tracking-[0.2em] uppercase text-black/40 mb-4"
                            >
                                Curated Selection
                            </motion.div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">Featured Products</h2>
                        </div>
                        <button className="hidden sm:flex items-center gap-2 text-sm font-bold text-black/60 hover:text-black transition-colors group">
                            View All Packs
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative"
                            >
                                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-zinc-50 border border-black/5 p-[1px] transition-all duration-500 group-hover:border-black/20 group-hover:shadow-[0_0_50px_rgba(0,0,0,0.05)]">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white to-zinc-100" />

                                    <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/60 pointer-events-none" />
                                    <div className="absolute inset-[1px] rounded-[2.4rem] bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />

                                    <div className="h-full w-full rounded-[2.4rem] overflow-hidden relative flex flex-col z-10">
                                        <Link to={`/product/${product.slug}`} className="relative flex-1 overflow-hidden m-4 rounded-[1.8rem] block cursor-pointer">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                                                referrerPolicy="no-referrer"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-100 via-transparent to-transparent opacity-90" />

                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-xl border border-white/40 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                                                    <Play size={24} fill="black" className="ml-1 text-black" />
                                                </div>
                                            </div>

                                            <div className="absolute top-4 left-4">
                                                <span className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-black/10 text-[9px] font-bold tracking-widest uppercase text-black/60">
                                                    {product.genre}
                                                </span>
                                            </div>
                                        </Link>

                                        <div className="px-8 pb-8">
                                            <div className="flex justify-between items-end mb-6">
                                                <div>
                                                    <Link to={`/product/${product.slug}`} className="block hover:opacity-70 transition-opacity">
                                                        <h3 className="text-lg font-display font-bold tracking-tight mb-1 text-black">{product.name}</h3>
                                                    </Link>
                                                    <p className="text-xs text-black/50 font-medium">{product.description}</p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    {product.originalPrice && (
                                                        <span className="text-[10px] font-bold text-black/40 line-through mb-0.5">
                                                            {product.originalPrice}
                                                        </span>
                                                    )}
                                                    <div className="flex items-center gap-2">
                                                        {product.discountPercentage && (
                                                            <span className="bg-red-500/10 text-red-600 border border-red-500/20 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                                                                -{product.discountPercentage}%
                                                            </span>
                                                        )}
                                                        <span className="text-base font-display font-bold text-black/80">
                                                            {product.price}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Link
                                                    to={`/product/${product.slug}`}
                                                    className="flex-1 bg-black/5 hover:bg-black text-black hover:text-white border border-black/5 hover:border-black py-3.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all active:scale-95 flex items-center justify-center gap-2"
                                                >
                                                    <ShoppingCart size={14} />
                                                    VIEW DETAILS
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            {/* About Me Section - Tri-Grid Layout */}
            <section className="py-24 relative bg-black text-white border-y border-white/5">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/10 rounded-[2rem] overflow-hidden">

                        {/* Column 1: Info & Links */}
                        <div className="p-12 md:p-16 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between">
                            <div>
                                <h3 className="text-4xl lg:text-5xl font-display font-bold tracking-tight mb-4">
                                    About <br /> <span className="text-white/40">DEAT AKA</span>
                                </h3>
                                <p className="text-white/60 text-sm leading-relaxed mb-8">
                                    DEAT AKA is the sonic architect of a dark, futuristic underworld. With 10 years of experience refining his craft in the shadows, he has emerged as a relentless force in the Hard Dance scene. His sound is a visceral dive into the dirtiest and most aggressive side of electronic music—merging industrial textures with raw, high-octane energy. From bone-crushing Hardtechno to the frontiers of XTRARAW, DEAT AKA doesn't just produce tracks; he engineers high-pressure sonic weapons for those who thrive in the underground.
                                </p>
                            </div>

                            <div className="mt-8 flex items-center gap-6">
                                <a href="https://soundcloud.com/deat_aka" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:text-[#ff5500] hover:border-[#ff5500] transition-colors" title="Soundcloud">
                                    <CloudLightning size={20} />
                                </a>
                                <a href="https://open.spotify.com/intl-es/artist/2J50ThxDETbxoqoT4KP9bU?si=e1WUj9Z6TfOckAKzqED8hg" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:text-[#1DB954] hover:border-[#1DB954] transition-colors" title="Spotify">
                                    <Music2 size={20} />
                                </a>
                                <a href="https://www.instagram.com/deat_aka/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:text-[#E1306C] hover:border-[#E1306C] transition-colors" title="Instagram">
                                    <Instagram size={20} />
                                </a>
                            </div>
                        </div>

                        {/* Column 2: Visual Center (The Portrait) */}
                        <div className="relative aspect-square md:aspect-auto border-b md:border-b-0 md:border-r border-white/10 bg-zinc-950 flex flex-col items-center justify-center overflow-hidden p-0 group">

                            <div className="relative z-10 w-full h-full grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-700">
                                <img src={deatPortrait} alt="DEAT AKA" className="w-full h-full object-cover scale-[1.15]" />
                            </div>
                        </div>

                        {/* Column 3: Philosophy / Tech */}
                        <div className="p-12 md:p-16 flex flex-col justify-between bg-zinc-950">
                            <div className="space-y-4 mb-20 text-right md:text-left">
                                <div className="text-2xl font-display font-medium text-white/30 hover:text-white transition-colors cursor-default">Distort</div>
                                <div className="text-2xl font-display font-medium text-white/30 hover:text-white transition-colors cursor-default">Compress</div>
                                <div className="text-3xl font-display font-bold text-white tracking-tight">Annihilate.</div>
                                <div className="text-2xl font-display font-medium text-white/30 hover:text-white transition-colors cursor-default">Repeat</div>
                            </div>

                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black group">
                                <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-blue-600/0 transition-colors mix-blend-screen z-10" />
                                {/* Placeholder for secondary tech image/video */}
                                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                    <span className="text-xs uppercase tracking-[0.2em] font-bold text-white/40">Technical Process</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
