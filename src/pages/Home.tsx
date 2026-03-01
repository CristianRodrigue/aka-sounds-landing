import { motion } from "motion/react";
import { ShoppingCart, Search, Play, ChevronRight, Zap, Instagram, CloudLightning, Music2, Star, Download, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "../data/products";
import deatPortrait from "../assets/Picsart_26-02-28_22-33-05-682.jpg.jpeg";
import htFreeTrialImg from "../assets/HARDTECHNO-ESSENTIALS-VOL.-1-FREE-SAMPLEPACK.jpg";
import Newsletter from "../components/Newsletter";
import { CountdownTimer, CountdownSpots, useDiscount } from "../components/Countdown";

const globalTestimonials = [
    {
        id: 1,
        text: "The hard techno packs completely transformed my workflow. The quality is excellent and they adapt perfectly to my industrial style!🔥",
        author: "Marco Silva",
        role: "Hardstyle Producer",
        initials: "M"
    },
    {
        id: 2,
        text: "Thanks for making awesome Sounds 🔊😎😎 it was so inspirating to use them in this upcoming track 💎",
        author: "G-Powered",
        role: "Hypertechno & EDM Producer",
        initials: "G"
    },
    {
        id: 3,
        text: "These sounds saved me a ton of time and I was able to finish tracks faster than ever. Definitely my go-to choice!",
        author: "Sam Taylor",
        role: "Techno DJ & Producer",
        initials: "S"
    }
];

export default function Home() {
    const { isActive } = useDiscount();

    return (
        <>
            {/* Hero Section */}



            <main className="relative pt-32 overflow-hidden">
                {/* Background Accents - Grid Only */}
                <div className="absolute top-0 left-0 w-full h-full bg-grid pointer-events-none opacity-20" />

                <div className="max-w-7xl mx-auto px-6 pt-24 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative z-10"
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

                        <div className="hidden flex-col sm:flex-row items-center gap-4">
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
                                <span className="font-display font-bold text-lg">G-POWERED</span>
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
                        className="relative flex items-center justify-center -ml-6 md:-ml-16 xl:-ml-32 mt-8 md:mt-0"
                    >
                        <div className="relative w-[115%] md:w-full md:max-w-[120%] md:scale-[1.35]">
                            <div className="relative w-full flex items-center justify-center group" style={{ WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 50%, black 40%, transparent 80%)', maskImage: 'radial-gradient(ellipse 75% 65% at 50% 50%, black 40%, transparent 80%)' }}>
                                <video
                                    src="/Ista_esttica_cinematogrfica_1080p_202602201.mp4"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-auto object-cover scale-[1.25] md:scale-[1.2] opacity-90 transition-transform duration-1000"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>



            {/* Featured Product Section (Premium Only) */}
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
                                Premium Selection
                            </motion.div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">Featured Release</h2>
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
                                {products[0].description} Designed for the most demanding producers, this pack delivers earth-shattering kicks and industrial synths.
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
                                    <a
                                        href={products[0].paymentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full xl:w-auto inline-flex items-center justify-center gap-3 bg-black text-white font-extrabold text-sm uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-black/90 transition-all active:scale-95 group shadow-lg"
                                    >
                                        <Download size={18} className="group-hover:-translate-y-1 transition-transform" />
                                        Download
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 1. THE DIAGNOSTIC & FOMO Section */}
            <div className="pt-16 pb-8 max-w-4xl mx-auto flex flex-col items-center text-center px-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] tracking-[0.2em] font-bold uppercase mb-8">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    The Hard Truth
                </div>

                <h2 className="text-3xl md:text-5xl font-display font-black tracking-tighter mb-8 uppercase leading-[1.1]">
                    Have you ever wondered why your Kicks sound <span className="text-red-500">empty</span> compared to the Pro scene?
                </h2>

                <p className="text-lg md:text-2xl text-white/60 leading-relaxed font-medium mb-12 max-w-3xl">
                    Every day you spend tweaking synths and trying to design a Kick from scratch is <span className="text-white underline decoration-red-500 underline-offset-4 font-bold">a day lost sending your demo</span> to labels like Q-Dance, Teletech, or Soave.
                </p>
            </div>

            {/* 2. THE EXCLUSION Section */}
            <div className="w-full bg-zinc-950 border-y border-white/5 py-8 md:py-12 my-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <p className="text-base md:text-xl text-white/50 font-medium uppercase tracking-widest leading-relaxed">
                        <span className="text-red-500 mr-2">⚠️</span> This pack is <span className="text-white font-bold">NOT</span> for commercial EDM producers.<br className="hidden md:block" /> It is strictly designed for those seeking the <span className="text-red-500 font-bold drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]">raw aggression of Industrial Hardtechno</span>.
                    </p>
                </div>
            </div>

            {/* 3. AUTHORITY (THE PROOF) */}
            <div className="mt-16 mb-16 max-w-5xl mx-auto flex flex-col items-center px-6">
                <h3 className="text-3xl md:text-5xl font-display font-black tracking-tighter mb-6 text-center uppercase">
                    The Industry Is Already Listening
                </h3>

                <div className="mb-8 text-center flex flex-col items-center">
                    <div className="bg-red-500 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3 shadow-[0_0_15px_rgba(255,0,0,0.5)]">Industry Support</div>
                    <h4 className="text-white font-black font-display text-2xl md:text-3xl drop-shadow-lg leading-tight mb-2">THNDERZ & ENRICO</h4>
                    <p className="text-white/70 font-medium md:text-lg">Dropping an AKA SOUNDS track live at the mainstage.</p>
                </div>

                {/* Video Player for THNDERZ & Enrico */}
                <div className="w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 relative group bg-black flex items-center justify-center shadow-[0_0_50px_rgba(255,0,0,0.15)]">
                    <video
                        src="/0227.mp4"
                        controls
                        controlsList="nodownload noplaybackrate"
                        disablePictureInPicture
                        className="w-full h-full object-contain bg-black"
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>

            {/* Global Testimonials Section */}
            <section className="py-16 relative bg-zinc-950 text-white border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">WHAT PRODUCERS SAY</h2>
                        <p className="text-white/60">Trusted by industry professionals</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {globalTestimonials.map(t => (
                            <div key={t.id} className="bg-white/5 border border-white/10 rounded-3xl p-8 relative flex flex-col h-full hover:bg-white/10 transition-colors group">
                                <div className="text-4xl opacity-20 font-serif mb-4 leading-none">"</div>
                                <p className="text-white/80 italic mb-8 leading-relaxed flex-1">
                                    {t.text}
                                </p>
                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-white shrink-0 shadow-inner group-hover:bg-white/20 transition-colors">
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
                </div>
            </section>

            {/* Lead Magnet / Free Download Section */}
            <section id="free-samples" className="py-16 relative bg-zinc-950 text-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="bg-zinc-900 border border-white/10 rounded-[3rem] overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                        {/* Text Content */}
                        <div className="p-12 md:p-16 flex flex-col justify-center">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-[10px] font-bold tracking-widest uppercase text-red-500 mb-6 self-start"
                            >
                                <Zap size={12} fill="currentColor" />
                                Free Download
                            </motion.div>

                            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
                                {products[1].name.replace(" FREE TRIAL", "")} <br />
                                <span className="text-white/50">Free Trial.</span>
                            </h2>

                            <p className="text-white/60 text-lg mb-6 leading-relaxed">
                                {products[1].description} Download it now and start annihilating in seconds.
                            </p>

                            <ul className="flex flex-col gap-3 mb-8">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 text-red-500 flex-shrink-0"><Check size={16} strokeWidth={3} /></div>
                                    <span className="text-white/70 text-sm"><strong>01 Kick Builder & Kicks:</strong> 12 surgical samples including Crunches, Punches, Top Kicks, and 155 BPM Rumble Kicks (Loops & One Shots).</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 text-red-500 flex-shrink-0"><Check size={16} strokeWidth={3} /></div>
                                    <span className="text-white/70 text-sm"><strong>02 Serum Presets:</strong> 8 elite presets (Leads like Berlin Bunker and Screeches like Biohazard).</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 text-red-500 flex-shrink-0"><Check size={16} strokeWidth={3} /></div>
                                    <span className="text-white/70 text-sm"><strong>03 Vocals & FX:</strong> 21 high-quality files featuring Dry, Wet, and Glitch vocals to add dark textures to your tracks.</span>
                                </li>
                            </ul>

                            <div className="flex flex-col gap-4">
                                <a
                                    href={products[1].paymentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-black font-extrabold text-sm uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-white/90 transition-all active:scale-95 group shadow-lg"
                                >
                                    <Download size={18} className="group-hover:-translate-y-1 transition-transform" />
                                    Free Download
                                </a>
                                <p className="text-xs text-white/30 font-medium">
                                    Instant free download link via Payhip.
                                </p>
                            </div>
                        </div>

                        {/* Image Content */}
                        <div className="relative aspect-square lg:aspect-auto border-t lg:border-t-0 lg:border-l border-white/10 overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 mix-blend-screen pointer-events-none" />
                            <img
                                src={products[1].image}
                                alt={products[1].name}
                                className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. ROADMAP (THE INEVITABILITY) */}
            <div className="pt-16 pb-24 max-w-5xl mx-auto px-6">
                <h3 className="text-3xl md:text-5xl font-display font-black tracking-tighter mb-20 text-center uppercase">
                    Your Shortcut to the Mainstage
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[4.5rem] left-[16.66%] right-[16.66%] h-[2px] bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0" />

                    {/* Step 1 */}
                    <div className="relative flex flex-col items-center text-center group">
                        <div className="w-36 h-36 rounded-full bg-zinc-900 border border-white/5 flex flex-col items-center justify-center mb-8 relative z-10 transition-transform duration-500 group-hover:-translate-y-4 group-hover:border-red-500/40 bg-gradient-to-b from-white/5 to-transparent shadow-2xl">
                            <span className="text-white/20 font-display font-black text-6xl absolute -top-4 -left-4 group-hover:text-red-500/20 transition-colors">1</span>
                            <span className="text-white font-black text-2xl mb-1">DOWNLOAD</span>
                            <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">The Pack</span>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-3 tracking-tight">Get The Artillery</h4>
                        <p className="text-white/50 text-sm leading-relaxed px-4">Instant access to the elite samples used by top-tier producers.</p>
                    </div>

                    {/* Step 2 */}
                    <div className="relative flex flex-col items-center text-center group">
                        <div className="w-36 h-36 rounded-full bg-zinc-900 border border-white/5 flex flex-col items-center justify-center mb-8 relative z-10 transition-transform duration-500 group-hover:-translate-y-4 group-hover:border-red-500/40 bg-gradient-to-b from-white/5 to-transparent shadow-2xl">
                            <span className="text-white/20 font-display font-black text-6xl absolute -top-4 -left-4 group-hover:text-red-500/20 transition-colors">2</span>
                            <span className="text-white font-black text-2xl mb-1">DRAG&DROP</span>
                            <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Into your DAW</span>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-3 tracking-tight">Load The BRUTAL HARD Kick</h4>
                        <p className="text-white/50 text-sm leading-relaxed px-4">Drop our pre-processed kicks and synth presets directly into your session. No endless tweaking.</p>
                    </div>

                    {/* Step 3 */}
                    <div className="relative flex flex-col items-center text-center group">
                        <div className="w-36 h-36 rounded-full bg-zinc-900 border border-red-500/30 flex flex-col items-center justify-center mb-8 relative z-10 transition-transform duration-500 group-hover:-translate-y-4 group-hover:border-red-500 shadow-[0_0_30px_rgba(255,0,0,0.15)] group-hover:shadow-[0_0_50px_rgba(255,0,0,0.3)] bg-gradient-to-b from-red-500/10 to-transparent">
                            <span className="text-red-500/30 font-display font-black text-6xl absolute -top-4 -left-4 group-hover:text-red-500/50 transition-colors">3</span>
                            <span className="text-red-500 font-black text-2xl mb-1 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">DOMINATE</span>
                            <span className="text-red-400/60 text-[10px] font-bold uppercase tracking-widest">The Scene</span>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-3 tracking-tight relative inline-block">Sound Professional <span className="absolute -bottom-1 left-0 w-full h-1 bg-red-500/50 -rotate-1 skew-x-12"></span></h4>
                        <p className="text-white/80 text-sm leading-relaxed px-4 font-medium">Your low-end is glued, your track has energy, and your demo is finally ready for the label.</p>
                    </div>
                </div>
            </div>

            {/* About Me Section - Tri-Grid Layout */}
            <section id="about" className="py-16 relative bg-zinc-950 text-white border-y border-white/5">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/10 rounded-[2rem] overflow-hidden">

                        {/* Column 1: Info & Links */}
                        <div className="p-12 md:p-16 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between">
                            <div>
                                <h3 className="text-4xl lg:text-5xl font-display font-bold tracking-tight mb-4">
                                    About <br /> <span className="text-white/40">DEAT AKA</span>
                                </h3>
                                <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-[1px] bg-white/20"></span> Who Am I?
                                </h4>
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
                        <div className="relative aspect-[4/5] md:aspect-auto border-b md:border-b-0 md:border-r border-white/10 bg-zinc-950 flex flex-col items-center justify-center overflow-hidden p-0 group">

                            <div className="relative z-10 w-full h-full grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-700">
                                <img src={deatPortrait} alt="DEAT AKA" className="w-full h-full object-cover object-center scale-100 md:scale-[1.15] max-w-none" />
                            </div>
                        </div>

                        {/* Column 3: Philosophy / Tech */}
                        <div className="p-12 md:p-16 flex flex-col justify-between bg-zinc-100 text-black">
                            <div className="mb-12 text-right md:text-left">
                                <p className="text-black/70 text-sm leading-relaxed font-medium">
                                    AKA SOUNDS was created to share a piece of the DEAT AKA universe with other producers. It is an invitation to use his exact sonic arsenal as inspiration to destroy and rebuild your own worlds.
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
                                    <span className="text-xs uppercase tracking-[0.2em] font-bold text-black/40">Technical Process</span>
                                </div>
                            </div>
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
