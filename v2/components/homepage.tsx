import type { ReactNode } from "react";
import { TutorialsA2Section } from "./sections/tutorials-section";
import { BrandCommunityA2Section } from "./sections/brand-community-section";
import { FreeSoundsH1Section } from "./sections/free-sounds-section";
import { SamplePacksSection } from "./sections/sample-packs-section";
import { NewsletterSection } from "./sections/newsletter-section";
import { MotionOrchestrator } from "./motion-orchestrator";
import { HomepageVisualIntro } from "./homepage-visual-intro";

const ASSET_ROOT = "/assets";
const shapeColumns = {
  even: [50, 60.83, 71.67, 82.5, 93.33],
  odd: [57.22, 68.06, 78.89, 89.72],
};

function makeShapePositions(rows: number, sectionHeight: number, start: number, step: number) {
  return Array.from({ length: rows }, (_, row) =>
    (row % 2 === 0 ? shapeColumns.even : shapeColumns.odd).map((left) => [left, ((start + row * step) / sectionHeight) * 100] as [number, number]),
  ).flat();
}

const heroShapePatterns = [
  [[720, 0], [876, 180], [1032, 0], [1188, 180], [1344, 0]],
  [[824, 180], [980, 0], [1136, 180], [1292, 0]],
  [[772, 180], [928, 0], [1084, 180], [1240, 0], [1396, 180]],
  [[720, 180], [876, 0], [1032, 180], [1188, 0], [1344, 180]],
  [[824, 0], [980, 180], [1136, 0], [1292, 180]],
  [[772, 0], [928, 180], [1084, 0], [1240, 180], [1396, 0]],
] as const;

const heroShapeRows = Array.from({ length: 23 }, (_, index) => [
  40 + index * 52,
  heroShapePatterns[index % heroShapePatterns.length],
] as const);
function HeroShapeGrid() {
  return (
    <svg className="hero-exact-shape-grid" viewBox="0 0 1440 814" preserveAspectRatio="none" aria-hidden="true">
      <g className="hero-exact-shape-grid-track">
        {heroShapeRows.flatMap(([y, cells]) => cells.map(([x, rotation]) => (
          <polygon
            key={`${x}-${y}`}
            points="15,0 30,30 0,30"
            transform={`translate(${x} ${y}) rotate(${rotation} 15 15)`}
            fill="none"
            stroke="#8A8A8A"
            strokeOpacity={0x2c / 255}
            strokeWidth="1"
          />
        )))}
      </g>
    </svg>
  );
}
function ShapeGrid({ variant, reduced = false, layout = "section" }: { variant: "dark" | "light"; reduced?: boolean; layout?: "hero" | "sample" | "free" | "section" }) {
  const positions = layout === "hero"
    ? makeShapePositions(13, 814, 40, 52)
    : layout === "sample"
      ? makeShapePositions(10, 550, 30, 52)
      : layout === "free"
        ? makeShapePositions(8, 700, 30, 52)
        : makeShapePositions(10, 450, 30, 52);

  return (
    <div className={`shape-grid shape-grid-${variant}${reduced ? " shape-grid-reduced" : ""}`} aria-hidden="true">
      {positions.map(([left, top], index) => <span key={`${left}-${top}`} style={{ left: `${left}%`, top: `${top}%`, transform: `rotate(${index % 2 ? 180 : 0}deg)` }} />)}
    </div>
  );
}
function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="section-label">{children}</p>;
}

export function AkaHomepage() {
  return (
    <main className="aka-homepage">
      <MotionOrchestrator reversible />
      <section className="hero-section hero-exact-section section-dark" id="top">
        <HeroShapeGrid />
        <nav className="home-nav section-shell" aria-label="Primary navigation">
          <a className="brand-lockup" href="#top" aria-label="AKA Sounds home">
            <img className="brand-lockup-wordmark" src={ASSET_ROOT + "/aka-logo-horizontal-white-official.png"} alt="AKA Sounds" />
            <img className="brand-lockup-symbol" src={ASSET_ROOT + "/aka-logo-symbol-white-official.png"} alt="AKA Sounds" />
          </a>
          <div className="nav-links">
            <a href="#sample-packs">SAMPLE PACKS</a>
            <a href="#free-sounds">FREE SOUNDS</a>
            <a href="#tutorials">TUTORIALS</a>
            <a href="#brand">ABOUT</a>
          </div>
          <a className="nav-cta" href="#sample-packs">BROWSE PACKS <span>→</span></a>
        </nav>

        <div className="signal-ticker" aria-label="AKA Sounds current signals">
          <div className="signal-ticker-viewport">
            <div className="signal-ticker-track">
              <div className="signal-ticker-sequence">
                <a href="#sample-packs">NEW RELEASE <span>—</span> HARDTECHNO ESSENTIALS VOL. 01</a>
                <i aria-hidden="true">/</i>
                <a href="#free-sounds">FREE SOUNDS <span>—</span> SERUM 2 HARD DANCE SCREECHES</a>
                <i aria-hidden="true">/</i>
                <a href="#tutorials">NEW TUTORIAL <span>—</span> HARD DANCE SCREECHES / SERUM 2 TUTORIAL</a>
                <i aria-hidden="true">/</i>
              </div>
              <div className="signal-ticker-sequence" aria-hidden="true">
                <a href="#sample-packs" tabIndex={-1}>NEW RELEASE <span>—</span> HARDTECHNO ESSENTIALS VOL. 01</a>
                <i aria-hidden="true">/</i>
                <a href="#free-sounds" tabIndex={-1}>FREE SOUNDS <span>—</span> SERUM 2 HARD DANCE SCREECHES</a>
                <i aria-hidden="true">/</i>
                <a href="#tutorials" tabIndex={-1}>NEW TUTORIAL <span>—</span> HARD DANCE SCREECHES / SERUM 2 TUTORIAL</a>
                <i aria-hidden="true">/</i>
              </div>
            </div>
          </div>
        </div>

        <HomepageVisualIntro />

        <div className="hero-inner section-shell" id="featured-product">
          <div className="hero-artwork artwork-frame" data-motion-reveal data-motion-delay="90">
            <img src={ASSET_ROOT + "/HARDTECHNO-ESSENTIALS-VOL.-1.jpg"} alt="Hardtechno Essentials Vol. 01 artwork" />
            <div className="artwork-caption">THE WEIGHT OF SOUND&nbsp; / &nbsp;HARDTECHNO ESSENTIALS</div>
          </div>
          <div className="hero-copy" data-motion-reveal data-motion-delay="140">
            <SectionLabel>FEATURED SAMPLE PACK</SectionLabel>
            <h1>HARDTECHNO<br />ESSENTIALS</h1>
            <p className="hero-volume">VOL. 01</p>
            <p>Hard techno samples for modern production.</p>
            <a className="text-cta hero-primary-cta" href="/sounds/hardtechno-essentials-vol-1">EXPLORE THE PACK <span>→</span></a>
            <p className="hero-meta">HARD TECHNO&nbsp; / &nbsp;SAMPLE PACK</p>
          </div>
        </div>
      </section>

      <SamplePacksSection />
      <FreeSoundsH1Section />
      <TutorialsA2Section />
      <BrandCommunityA2Section />
      <NewsletterSection />

      <footer className="footer-b2-section section-dark">
        <svg className="footer-b2-ambient-figure" viewBox="0 0 1440 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <path d="M72 442H494V130H684M756 130H1368V442H946" />
          <path d="M72 398H436M1004 398H1368" />
          <path d="M640 130V442M800 130V442" />
          <path className="footer-b2-scan-line footer-b2-scan-line-one" d="M72 178H520M920 178H1368" />
          <path className="footer-b2-scan-line footer-b2-scan-line-two" d="M72 302H400M1040 302H1368" />
        </svg>
        <div className="footer-b2-layout">
          <div className="footer-b2-brand" data-motion-reveal data-motion-delay="0">
            <p className="section-label" data-motion-reveal data-motion-delay="0">07 / FOOTER</p>
            <div className="footer-b2-brand-mark">
              <img className="footer-b2-lockup" src={`${ASSET_ROOT}/aka-logo-horizontal-white-official.png`} alt="AKA Sounds" />
            </div>
            <h2>STRUCTURED DIRECTORY</h2>
          </div>
          <nav className="footer-b2-directory" aria-label="Footer directory" data-motion-reveal data-motion-delay="90">
            <div><span>PRODUCTS</span><a href="#sample-packs">SAMPLE PACKS</a><a href="#free-sounds">FREE SOUNDS</a></div>
            <div><span>CONTENT</span><a href="#tutorials">TUTORIALS</a></div>
            <div><span>BRAND</span><a href="#about">ABOUT</a></div>
            <div><span>SOCIAL</span><a href="https://www.youtube.com/@Aka_sounds">YOUTUBE</a><a href="https://soundcloud.com/deat_aka">SOUNDCLOUD</a><a href="https://www.instagram.com/aka_sounds/">INSTAGRAM</a><a href="https://open.spotify.com/intl-es/artist/2J50ThxDETbxoqoT4KP9bU?si=e1WUj9Z6TfOckAKzqED8hg">SPOTIFY</a></div>
            <div><span>LEGAL</span><a href="/privacy">PRIVACY</a><a href="/terms">TERMS</a><a href="/refunds">REFUNDS</a><a href="/contact">CONTACT</a></div>
          </nav>
          <div className="footer-b2-bottom" data-motion-reveal data-motion-delay="170"><span>© AKA SOUNDS</span><span>PRODUCTS / CONTENT / BRAND</span></div>
        </div>
      </footer>
    </main>
  );
}
