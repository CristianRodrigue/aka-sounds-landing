import type { ReactNode } from "react";
import { TutorialsA2Section } from "./sections/tutorials-section";
import { BrandCommunityA2Section } from "./sections/brand-community-section";
import { FreeSoundsH1Section } from "./sections/free-sounds-section";
import { SamplePacksSection } from "./sections/sample-packs-section";

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

const heroShapeRows = [
  [40, [[720, 0], [876, 180], [1032, 0], [1188, 180], [1344, 0]]],
  [92, [[824, 180], [980, 0], [1136, 180], [1292, 0]]],
  [144, [[772, 180], [928, 0], [1084, 180], [1240, 0], [1396, 180]]],
  [196, [[720, 180], [876, 0], [1032, 180], [1188, 0], [1344, 180]]],
  [248, [[824, 0], [980, 180], [1136, 0], [1292, 180]]],
  [300, [[772, 0], [928, 180], [1084, 0], [1240, 180], [1396, 0]]],
  [352, [[720, 0], [876, 180], [1032, 0], [1188, 180], [1344, 0]]],
  [404, [[824, 180], [980, 0], [1136, 180], [1292, 0]]],
  [456, [[772, 180], [928, 0], [1084, 180], [1240, 0], [1396, 180]]],
  [508, [[720, 180], [876, 0], [1032, 180], [1188, 0], [1344, 180]]],
  [560, [[824, 0], [980, 180], [1136, 0], [1292, 180]]],
  [612, [[772, 0], [928, 180], [1084, 0], [1240, 180], [1396, 0]]],
  [664, [[720, 0], [876, 180], [1032, 0], [1188, 180], [1344, 0]]],
] as const;

function HeroShapeGrid() {
  return (
    <svg className="hero-exact-shape-grid" viewBox="0 0 1440 814" preserveAspectRatio="none" aria-hidden="true">
      {heroShapeRows.flatMap(([y, cells]) => cells.map(([x, rotation]) => (
        <polygon
          key={`${x}-${y}`}
          points="15,0 30,30 0,30"
          transform={`translate(${x} ${y}) rotate(${rotation} 15 15)`}
          fill="none"
          stroke="#8A8A8A"
          strokeOpacity={0x24 / 255}
          strokeWidth="1"
        />
      )))}
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
      {positions.map(([left, top], index) => (
        <span key={`${left}-${top}`} style={{ left: `${left}%`, top: `${top}%`, transform: `rotate(${index % 2 ? 180 : 0}deg)` }} />
      ))}
    </div>
  );
}
function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="section-label">{children}</p>;
}

export function AkaHomepage() {
  return (
    <main className="aka-homepage">
      <section className="hero-section hero-exact-section section-dark" id="top">
        <HeroShapeGrid />
        <nav className="home-nav section-shell" aria-label="Primary navigation">
          <a className="brand-lockup" href="#top" aria-label="AKA Sounds home">
            <img src={`${ASSET_ROOT}/aka-logo-horizontal-white-official.png`} alt="AKA Sounds" />
          </a>
          <div className="nav-links">
            <a href="#sample-packs">SAMPLE PACKS</a>
            <a href="#free-sounds">FREE SOUNDS</a>
            <a href="#tutorials">TUTORIALS</a>
            <a href="#brand">ABOUT</a>
          </div>
          <a className="nav-cta" href="#sample-packs">BROWSE PACKS <span>→</span></a>
        </nav>

        <div className="hero-inner section-shell">
          <div className="hero-artwork artwork-frame">
            <img src={`${ASSET_ROOT}/HARDTECHNO-ESSENTIALS-VOL.-1.jpg`} alt="Hardtechno Essentials Vol. 01 artwork" />
            <div className="artwork-caption">THE WEIGHT OF SOUND&nbsp; / &nbsp;HARDTECHNO ESSENTIALS</div>
          </div>
          <div className="hero-copy">
            <SectionLabel>FEATURED SAMPLE PACK</SectionLabel>
            <h1>HARDTECHNO<br />ESSENTIALS</h1>
            <p className="hero-volume">VOL. 01</p>
            <p>Hard techno samples for modern production.</p>
            <a className="text-cta hero-primary-cta" href="#sample-packs">EXPLORE THE PACK <span>→</span></a>
            <p className="hero-meta">HARD TECHNO&nbsp; / &nbsp;SAMPLE PACK</p>
          </div>
        </div>
      </section>

      <SamplePacksSection />

      <FreeSoundsH1Section />

      <TutorialsA2Section />

      <BrandCommunityA2Section />

      <section className="newsletter-section section-light" id="newsletter">
        <ShapeGrid variant="light" layout="sample" />
        <div className="section-shell newsletter-layout">
          <div>
            <SectionLabel>06 / NEWSLETTER</SectionLabel>
            <h2>JOIN THE SIGNAL</h2>
            <p>Occasional notes from AKA SOUNDS.</p>
          </div>
          <div className="newsletter-form" aria-label="Newsletter visual form">
            <label htmlFor="newsletter-email">EMAIL ADDRESS</label>
            <input id="newsletter-email" type="email" placeholder="YOUR EMAIL" />
            <button type="button">SIGN UP <span>→</span></button>
          </div>
        </div>
      </section>

      <footer className="footer-section section-dark">
        <div className="section-shell footer-layout">
          <div className="footer-brand">
            <SectionLabel>07 / FOOTER</SectionLabel>
            <img src={`${ASSET_ROOT}/aka-logo-symbol-white-official.png`} alt="AKA Sounds" />
            <h2>STRUCTURED DIRECTORY</h2>
          </div>
          <div className="footer-columns">
            <div><span>PRODUCTS</span><a href="#sample-packs">SAMPLE PACKS</a><a href="#free-sounds">FREE SOUNDS</a></div>
            <div><span>CONTENT</span><a href="#tutorials">TUTORIALS</a></div>
            <div><span>BRAND</span><a href="#brand">ABOUT</a></div>
            <div><span>SOCIAL</span><a href="https://www.youtube.com/@Aka_sounds">YOUTUBE</a><a href="https://soundcloud.com/deat_aka">SOUNDCLOUD</a><a href="https://www.instagram.com/aka_sounds/">INSTAGRAM</a><a href="https://open.spotify.com/intl-es/artist/2J50ThxDETbxoqoT4KP9bU?si=e1WUj9Z6TfOckAKzqED8hg">SPOTIFY</a></div>
            <div><span>LEGAL</span><a href="#top">PRIVACY</a><a href="#top">TERMS</a><a href="#top">REFUNDS</a><a href="#top">CONTACT</a></div>
          </div>
          <div className="footer-bottom"><span>© AKA SOUNDS</span><span>PRODUCTS / CONTENT / BRAND</span></div>
        </div>
      </footer>
    </main>
  );
}

