import { motion } from "motion/react";
import { ShoppingCart, Search, Play, ChevronRight, Zap, Instagram, CloudLightning, Music2, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "../data/products";
import deatPortrait from "../assets/deat_portrait.png";
import Newsletter from "../components/Newsletter";
import { CountdownTimer, CountdownSpots, useDiscount } from "../components/Countdown";

export default function Home() {
    const { isActive } = useDiscount();

    return (
        <>
            {/* Hero Section */}

            <main id="latest-release" className="relative min-h-[90vh] flex items-center justify-center pt-32 overflow-hidden bg-black">
                {/* Background Video (YouTube Embed styled as background loop) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <iframe
                        className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-full min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none scale-105"
                        src="https://www.youtube.com/embed/b9OFXRXgnhY?autoplay=1&mute=1&loop=1&playlist=b9OFXRXgnhY&controls=0&showinfo=0&rel=0&playsinline=1&iv_load_policy=3&disablekb=1&fs=0&color=white"
                        title="AKA SOUNDS latest visual release background"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                    {/* Semi-transparent dark overlay to protect contrast & readability */}
                    <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[1px] z-10" />
                    {/* Subtle top and bottom dark gradients to blend into navigation and next section */}
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/90 via-transparent to-zinc-950 z-20" />
                    {/* Grid Overlay for aesthetic continuity */}
                    <div className="absolute top-0 left-0 w-full h-full bg-grid pointer-events-none opacity-20 z-30" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center">
                    {/* Centered Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col items-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-8 backdrop-blur-md"
                        >
                            <Zap size={12} className="text-red-500 animate-pulse" />
                            Latest Visual Release
                        </motion.div>

                        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-extrabold tracking-tighter leading-[0.9] mb-8 uppercase select-none">
                            AKA SOUNDS <br />
                            <span className="text-white/40 drop-shadow-[0_0_35px_rgba(255,255,255,0.05)]">Beyond Samples.</span>
                        </h1>

                        <p className="text-base md:text-lg lg:text-xl text-white/70 max-w-2xl mb-12 leading-relaxed">
                            An audiovisual hub for the hard dance universe. Featuring heavy electronic music,
                            intense video visualizers, and premium sample packs.
                        </p>

                        <div className="hidden flex-col sm:flex-row items-center gap-4 w-full justify-center">
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

                        <div className="mt-8 flex items-center gap-8 opacity-60 hover:opacity-100 transition-all">
                            <div className="text-xs font-bold tracking-widest uppercase text-white/40">Signal path:</div>
                            <div className="flex flex-wrap gap-4 md:gap-6 items-center justify-center">
                                <span className="font-display font-bold text-base md:text-lg tracking-wider hover:text-red-500 transition-colors cursor-pointer">VIDEO</span>
                                <span className="text-white/20">/</span>
                                <span className="font-display font-bold text-base md:text-lg tracking-wider hover:text-red-500 transition-colors cursor-pointer">MUSIC</span>
                                <span className="text-white/20">/</span>
                                <span className="font-display font-bold text-base md:text-lg tracking-wider hover:text-red-500 transition-colors cursor-pointer">VISUALS</span>
                                <span className="text-white/20">/</span>
                                <span className="font-display font-bold text-base md:text-lg tracking-wider hover:text-red-500 transition-colors cursor-pointer">TUTORIALS</span>
                                <span className="text-white/20">/</span>
                                <span className="font-display font-bold text-base md:text-lg tracking-wider hover:text-red-500 transition-colors cursor-pointer">TOOLS</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Latest Visual Release Player */}
            <section className="py-20 relative bg-zinc-950 text-white border-b border-white/5">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="mb-10 text-center flex flex-col items-center">
                        <div className="bg-red-500 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3 shadow-[0_0_15px_rgba(255,0,0,0.5)]">
                            Official Visualizer
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-black tracking-tighter uppercase mb-3">
                            Watch The Latest Drop
                        </h2>
                        <p className="text-white/60 font-medium md:text-lg max-w-2xl">
                            DEAT AKA - init. The visual statement opening the next direction of AKA SOUNDS.
                        </p>
                    </div>

                    <div className="w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 relative bg-black shadow-[0_0_50px_rgba(255,0,0,0.15)]">
                        <iframe
                            className="absolute inset-0 h-full w-full"
                            src="https://www.youtube.com/embed/b9OFXRXgnhY?rel=0&modestbranding=1&playsinline=1"
                            title="DEAT AKA - init official visualizer"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </div>
                </div>
            </section>

            {/* Community Statement / Demo Submissions */}
            <section className="relative bg-zinc-950 text-white py-24 border-y border-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
                <div className="max-w-6xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 items-stretch">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="border border-white/10 bg-white/[0.03] rounded-[2rem] p-8 md:p-12 flex flex-col justify-between"
                    >
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-[10px] tracking-[0.2em] font-bold uppercase mb-8">
                                <Zap size={12} fill="currentColor" />
                                Statement
                            </div>

                            <p className="text-2xl md:text-4xl font-display font-black tracking-tight leading-tight mb-8">
                                "This visual was made to open the vision of what AKA SOUNDS can become."
                            </p>

                            <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-3xl">
                                Not a label, not a roster, and not a free upload channel. AKA SOUNDS is a curated visual platform for hard electronic music, underground premieres, and creators with a real point of view.
                            </p>
                        </div>

                        <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap gap-3 text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">
                            <span>Hard Dance</span>
                            <span>/</span>
                            <span>Visualizers</span>
                            <span>/</span>
                            <span>Community</span>
                            <span>/</span>
                            <span>Curated Demos</span>
                            <span>/</span>
                            <span>Non-Exclusive Features</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-white text-black rounded-[2rem] p-8 md:p-10 flex flex-col justify-between"
                    >
                        <div>
                            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-8">
                                <Mail size={20} />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight uppercase mb-5">
                                Submit Your Demo
                            </h2>
                            <p className="text-black/60 leading-relaxed mb-6">
                                If you want your track to be considered for an AKA SOUNDS visual premiere, send your demo, artist name, links, and concept to the email below.
                            </p>
                            <div className="border-y border-black/10 py-5 mb-6">
                                <a href="mailto:contact@akasounds.com" className="text-lg md:text-xl font-display font-black tracking-tight hover:opacity-60 transition-opacity">
                                    contact@akasounds.com
                                </a>
                            </div>
                            <p className="text-sm text-black/50 leading-relaxed mb-5">
                                Quality, originality, and visual direction are required. Generic demos will not be considered.
                            </p>
                            <div className="grid grid-cols-1 gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-black/45">
                                <span>No distribution or label deal implied.</span>
                                <span>Artists keep their rights.</span>
                                <span>Selected features require written permission for YouTube, AKA SOUNDS, and social media use.</span>
                            </div>
                        </div>

                        <a
                            href="mailto:contact@akasounds.com?subject=AKA%20SOUNDS%20Demo%20Submission"
                            className="mt-8 w-full inline-flex items-center justify-center gap-3 bg-black text-white font-extrabold text-sm uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-black/90 transition-all active:scale-95"
                        >
                            Send Demo
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Featured Product Section (Archive / Production Tools) */}
            <section id="featured" className="py-24 relative bg-white text-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-xs font-bold tracking-[0.2em] uppercase text-black/40 mb-4"
                            >
                                Sound Pack Archive
                            </motion.div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">Selected Production Tools</h2>
                        </div>
                    </div>

                    {/* Highlighted Premium Product */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-zinc-50 border border-black/5 rounded-[3rem] overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-[0_0_50px_rgba(0,0,0,0.05)] hover:shadow-[0_0_80px_rgba(0,0,0,0.08)] transition-shadow duration-500"
                    >
                        {/* Image Content */}
                        <Link to={`/product/${products[0].slug}`} className="relative aspect-square lg:aspect-auto overflow-hidden group block">
                            <img
                                src={products[0].image}
                                alt={products[0].name}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-xl border border-white/40 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                                    <Play size={32} fill="black" className="ml-1 text-black" />
                                </div>
                            </div>
                        </Link>

                        {/* Text Content */}
                        <div className="p-12 md:p-16 flex flex-col justify-center">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="px-3 py-1 rounded-full bg-black/5 border border-black/10 text-[10px] font-bold tracking-widest uppercase text-black/60 inline-block">
                                    {products[0].genre}
                                </span>
                                <Link


                                    to={`/product/${products[0].slug}`}
                                    className="bg-black text-white hover:bg-black/90 font-bold px-4 py-2 rounded-xl text-[10px] tracking-widest uppercase transition-all active:scale-95 flex items-center gap-2 shadow-sm"
                                >
                                    <ShoppingCart size={14} />
                                    View Details
                                </Link>
                            </div>

                            <Link to={`/product/${products[0].slug}`} className="block hover:opacity-70 transition-opacity mb-4">
                                <h3 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-black">{products[0].name}</h3>
                            </Link>

                            <p className="text-lg text-black/60 mb-8 leading-relaxed">
                                {products[0].description} A selected artifact from the AKA SOUNDS archive, built for producers who connect with the heavier side of the project.
                            </p>

                            <div className="flex flex-col w-full mt-auto pt-8 border-t border-black/5">
                                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                                    <div className="flex flex-col w-full xl:w-auto">
                                        <CountdownTimer />
                                        {products[0].originalPrice && isActive && (
                                            <div className="flex items-center gap-4 mb-1">
                                                <span className="text-xl font-bold text-black/40 line-through">
                                                    {products[0].originalPrice}
                                                </span>
                                                <CountdownSpots theme="light" />
                                            </div>
                                        )}
                                        <div className="flex items-center gap-4">
                                            <span className="text-5xl md:text-6xl font-display font-black text-black tracking-tighter leading-none">
                                                {isActive ? products[0].price : (products[0].originalPrice || products[0].price)}
                                            </span>
                                            {products[0].discountPercentage && isActive && (
                                                <span className="bg-red-50 text-red-600 border border-red-200 text-lg font-bold px-3 py-1 rounded-xl shadow-sm">
                                                    -{products[0].discountPercentage}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (typeof window !== 'undefined' && (window as any).Paddle) {
                                                (window as any).Paddle.Checkout.open({
                                                    items: [{ priceId: products[0].paddlePriceId, quantity: 1 }],
                                                    ...(isActive ? { discountId: 'dsc_01kkcqpxaca9tc9qtn73dv81bz' } : {})
                                                });
                                            }
                                        }}
                                        className="w-full xl:w-auto inline-flex items-center justify-center gap-3 bg-black text-white font-extrabold text-sm uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-black/90 transition-all active:scale-95 group shadow-lg"
                                    >
                                        <ShoppingCart size={18} className="group-hover:-translate-y-1 transition-transform" />
                                        {isActive ? 'Claim Discount' : 'Buy Now'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* About AKA SOUNDS Section - Tri-Grid Layout */}
            <section id="about" className="py-16 relative bg-zinc-950 text-white border-y border-white/5">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/10 rounded-[2rem] overflow-hidden">

                        {/* Column 1: Info & Links */}
                        <div className="p-12 md:p-16 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between">
                            <div>
                                <h3 className="text-4xl lg:text-5xl font-display font-bold tracking-tight mb-4">
                                    About <br /> <span className="text-white/40">AKA SOUNDS</span>
                                </h3>
                                <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-[1px] bg-white/20"></span> The Direction
                                </h4>
                                <p className="text-white/60 text-sm leading-relaxed mb-8">
                                    AKA SOUNDS is becoming a curated space for the hard dance universe: heavy electronic music, visual releases, selected demos, and production tools for artists who care about identity as much as impact.
                                </p>
                                <p className="text-white/50 text-sm leading-relaxed">
                                    Founded and curated by DEAT AKA, the platform keeps the original sample-pack archive alive while opening the door to a wider community of producers and visual-minded creators.
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
                        <div className="p-12 md:p-16 flex flex-col justify-between bg-zinc-100 text-black">
                            <div className="mb-12 text-right md:text-left">
                                <p className="text-black/70 text-sm leading-relaxed font-medium">
                                    The standard is simple: hard sound, strong visual direction, real creative intention. Demo submissions are welcome, but only quality and originality move forward.
                                </p>
                            </div>

                            <div className="space-y-4 mb-16 text-right md:text-left">
                                <div className="text-2xl font-display font-bold text-black/30 hover:text-black transition-colors cursor-default">Distort</div>
                                <div className="text-2xl font-display font-bold text-black/30 hover:text-black transition-colors cursor-default">Compress</div>
                                <div className="text-4xl md:text-5xl font-display font-black text-black tracking-tight drop-shadow-sm">Annihilate.</div>
                                <div className="text-2xl font-display font-bold text-black/30 hover:text-black transition-colors cursor-default">Repeat</div>
                            </div>

                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-inner bg-zinc-200 border border-black/5 group">
                                {/* Placeholder for secondary tech image/video */}
                                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                    <span className="text-xs uppercase tracking-[0.2em] font-bold text-black/40">Curated Signal</span>
                                </div>
                            </div>

                            <Link 
                                to="/deat_aka"
                                onClick={() => window.scrollTo(0,0)}
                                className="mt-8 w-full border border-black/20 text-black px-8 py-4 uppercase tracking-[0.2em] font-bold text-xs text-center hover:bg-black hover:text-white transition-colors rounded-xl"
                            >
                                Enter DEAT AKA Profile →
                            </Link>
                        </div>

                    </div>
                </div>
            </section>

            {/* Global Newsletter Subscription */}
            <div id="community" className="max-w-7xl mx-auto px-6">
                <Newsletter />
            </div>

        </>
    );
}
