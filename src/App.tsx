/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Menu, Zap } from "lucide-react";
import { useState } from "react";
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import logoImage from './assets/LOGO-AKA-SOUNDS-PNG.png';
import Home from "./pages/Home";
import Product from "./pages/Product";
import NotFound from "./pages/NotFound";
import Legal from "./pages/Legal";
import CookieBanner from "./components/CookieBanner";

// Create an inner component to access router hooks inside HashRouter
function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (

    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black flex flex-col">
      {/* Fixed Header Group */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Navigation */}
        <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl">
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
                <a href="#featured" onClick={(e) => handleNavClick(e, 'featured')} className="hover:text-white transition-colors">Releases</a>
                <a href="#free-samples" onClick={(e) => handleNavClick(e, 'free-samples')} className="hover:text-white transition-colors">Free Samples</a>
                <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-white transition-colors">About</a>
                <a href="#community" onClick={(e) => handleNavClick(e, 'community')} className="hover:text-white transition-colors">Join Community</a>
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

        {/* Announcement Bar */}
        <div className="bg-red-600/10 border-b border-red-500/20 text-red-500 text-[10px] font-bold tracking-[0.25em] uppercase overflow-hidden flex relative w-full items-center backdrop-blur-md h-10">
          <div className="absolute left-0 w-16 md:w-32 h-full bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 w-16 md:w-32 h-full bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none"></div>

          <div className="animate-marquee flex gap-12">
            {[...Array(12)].map((_, i) => (
              <span key={i} className="flex items-center gap-12 whitespace-nowrap">
                <span className="flex items-center gap-2 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                  <Zap size={12} fill="currentColor" className="animate-pulse" />
                  LIMITED OFFER SAMPLE PACK
                </span>
                <span className="text-red-500/30 font-serif">/</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Page Routes */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/legal/:page" element={<Legal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>


      {/* Full Footer */}
      <footer className="border-t border-white/10 py-16 mt-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-white">

          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link to="/">
              <div className="flex items-center gap-3 text-2xl font-display font-bold tracking-tighter">
                <img src={logoImage} alt="AKA SOUNDS Logo" className="h-8 w-auto object-contain" />
                AKA SOUNDS
              </div>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              The sonic architect of a dark, futuristic underworld. Delivering the heaviest industrial sound design for the modern mainstage.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[11px] font-bold tracking-widest uppercase text-white/40 mb-2">Navigation</h4>
            <Link to="/" className="text-sm text-white/70 hover:text-white transition-colors w-fit">Home</Link>
            <a href="#" className="text-sm text-white/70 hover:text-white transition-colors w-fit">All Packs</a>
            <a href="#" className="text-sm text-white/70 hover:text-white transition-colors w-fit">Free Samples</a>
          </div>

          {/* Support & Legal */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[11px] font-bold tracking-widest uppercase text-white/40 mb-2">Support & Legal</h4>
            <Link to="/legal/contact" className="text-sm text-white/70 hover:text-white transition-colors w-fit">Contact Us</Link>
            <Link to="/legal/privacy-policy" className="text-sm text-white/70 hover:text-white transition-colors w-fit">Privacy Policy</Link>
            <Link to="/legal/terms-of-service" className="text-sm text-white/70 hover:text-white transition-colors w-fit">Terms of Service</Link>
            <Link to="/legal/refund-policy" className="text-sm text-white/70 hover:text-white transition-colors w-fit">Refund Policy</Link>
          </div>

          {/* Social / Contact Info */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[11px] font-bold tracking-widest uppercase text-white/40 mb-2">Connect</h4>
            <a href="mailto:contact@akasounds.com" className="text-sm text-white/70 hover:text-white transition-colors w-fit">contact@akasounds.com</a>
            <div className="flex gap-4 mt-2">
              <a href="https://soundcloud.com/deat_aka" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#ff5500] transition-colors">SoundCloud</a>
              <a href="https://www.instagram.com/aka_sounds/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#E1306C] transition-colors">Instagram</a>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-white/30">
          <p>© {new Date().getFullYear()} AKA SOUNDS. All rights reserved.</p>
          <p className="mt-2 md:mt-0 font-medium">100% Royalty Free Audio</p>
        </div>
      </footer>

      {/* Global Components */}
      <CookieBanner />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
