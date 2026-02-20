/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ShoppingCart, Search, Menu, Play, ChevronRight, Zap } from "lucide-react";
import { useState } from "react";
import logoImage from './assets/LOGO-AKA-SOUNDS-PNG.png';
import htEssentialsImg from './assets/HARDTECHNO-ESSENTIALS-VOL.-1.jpg';
import htFreeTrialImg from './assets/HARDTECHNO-ESSENTIALS-VOL.-1-FREE-SAMPLEPACK.jpg';

// Mock data for products using the user's real links
const products = [
  {
    id: 1,
    name: "Hardtechno Essentials Vol. 1",
    description: "The ultimate collection for modern hard techno production.",
    price: "$29.99",
    genre: "HARD TECHNO",
    image: htEssentialsImg,
    link: "https://akasounds.com/b/hardtechno-essentials-vol-1"
  },
  {
    id: 2,
    name: "Hardtechno Essentials Vol. 1 FREE TRIAL",
    description: "Get a taste of our premium sounds at no cost.",
    price: "FREE",
    genre: "SAMPLE PACK",
    image: htFreeTrialImg,
    link: "https://akasounds.com/b/hardtechno-essentials-vol-1-free-trial"
  }
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-2xl font-display font-bold tracking-tighter"
            >
              <img src={logoImage} alt="AKA SOUNDS Logo" className="h-8 w-auto object-contain" />
              AKA SOUNDS
            </motion.div>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/60">
              <a href="#" className="hover:text-white transition-colors">Packs</a>
              <a href="#" className="hover:text-white transition-colors">Genres</a>
              <a href="#" className="hover:text-white transition-colors">Bundles</a>
              <a href="#" className="hover:text-white transition-colors">Free Samples</a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors px-4 py-2">
              Log in
            </button>
            <button className="bg-white text-black text-sm font-bold px-5 py-2.5 rounded-full hover:bg-white/90 transition-all active:scale-95">
              Sign up
            </button>
            <button className="p-2 text-white/60 hover:text-white md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

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
              New Release: HARD TECHNO VOL. 4
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
              {/* Video Container - Completely black background, ultra aggressive edge masking */}
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
                {/* Sculpted Card Container */}
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-zinc-50 border border-black/5 p-[1px] transition-all duration-500 group-hover:border-black/20 group-hover:shadow-[0_0_50px_rgba(0,0,0,0.05)]">
                  {/* The Gradient Base */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white to-zinc-100" />

                  {/* Sculpted Highlights */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/60 pointer-events-none" />
                  <div className="absolute inset-[1px] rounded-[2.4rem] bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />

                  <div className="h-full w-full rounded-[2.4rem] overflow-hidden relative flex flex-col z-10">
                    {/* Artwork Area */}
                    <div className="relative flex-1 overflow-hidden m-4 rounded-[1.8rem]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-100 via-transparent to-transparent opacity-90" />

                      {/* Play Overlay on Hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-xl border border-white/40 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                          <Play size={24} fill="black" className="ml-1 text-black" />
                        </div>
                      </div>

                      {/* Genre Tag */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-black/10 text-[9px] font-bold tracking-widest uppercase text-black/60">
                          {product.genre}
                        </span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="px-8 pb-8">
                      <div className="flex justify-between items-end mb-6">
                        <div>
                          <h3 className="text-lg font-display font-bold tracking-tight mb-1 text-black transition-colors">{product.name}</h3>
                          <p className="text-xs text-black/50 font-medium">{product.description}</p>
                        </div>
                        <div className="text-base font-display font-bold text-black/80">
                          {product.price}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={product.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-black/5 hover:bg-black text-black hover:text-white border border-black/5 hover:border-black py-3.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          <ShoppingCart size={14} />
                          {product.price === "FREE" ? "Get Free" : "Buy Now"}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Footer / Bottom Info */}
      <section className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between gap-8 opacity-40">
          <div className="flex flex-col gap-2">
            <div className="text-[10px] font-bold tracking-widest uppercase">Genre Focus</div>
            <div className="text-sm">Hard Techno, Hardstyle, Rawstyle, Uptempo, Hardcore, Psytrance</div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-[10px] font-bold tracking-widest uppercase">Instant Access</div>
            <div className="text-sm">Digital Download after purchase</div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-[10px] font-bold tracking-widest uppercase">Royalty Free</div>
            <div className="text-sm">100% Royalty Free for all productions</div>
          </div>
        </div>
      </section>
    </div>
  );
}
