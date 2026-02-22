/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Menu } from "lucide-react";
import { useState } from "react";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import logoImage from './assets/LOGO-AKA-SOUNDS-PNG.png';
import Home from "./pages/Home";
import Product from "./pages/Product";
export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <HashRouter>
      <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black flex flex-col">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 text-2xl font-display font-bold tracking-tighter"
                >
                  <img src={logoImage} alt="AKA SOUNDS Logo" className="h-8 w-auto object-contain" />
                  AKA SOUNDS
                </motion.div>
              </Link>

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

        {/* Page Routes */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<Product />} />
          </Routes>
        </div>


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
    </HashRouter>
  );
}
