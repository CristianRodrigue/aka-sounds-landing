import type { ReactNode } from "react";

const ASSET_ROOT = "/assets";

const freeSounds = [
  { title: "Serum 2 Hard Dance Screeches", art: "Cover_FREE_SCREECH_Cyan.png" },
  { title: "Serum 2 Hardtechno Kick", art: "AkasoundsProductCover-Hardtechno.jpeg" },
  { title: "Serum 2 Zaag Kick", art: "AkasoundsProductCover-ZaagKick.jpeg" },
  { title: "Serum 2 Reverse Bass Kick", art: "AkasoundsProductCover.jpeg" },
];

const tutorials = [
  {
    title: "Hard Dance Screeches - Serum Tutorial",
    video: "https://www.youtube.com/watch?v=1EmJVlGZBG4",
    thumbnail: "https://i.ytimg.com/vi/1EmJVlGZBG4/hqdefault.jpg",
  },
  {
    title: "Hardtechno Kick - Serum Tutorial",
    video: "https://www.youtube.com/watch?v=5bXTQvDmJY4",
    thumbnail: "https://i.ytimg.com/vi/5bXTQvDmJY4/hqdefault.jpg",
  },
  {
    title: "Zaag Kick - Serum Tutorial",
    video: "https://www.youtube.com/watch?v=F8pNBXN6XH0",
    thumbnail: "https://i.ytimg.com/vi/F8pNBXN6XH0/hqdefault.jpg",
  },
  {
    title: "Industrial Techno Synths - Free Tutorial",
    video: "https://www.youtube.com/watch?v=U2fTh4phhEM",
    thumbnail: "https://i.ytimg.com/vi/U2fTh4phhEM/hqdefault.jpg",
  },
  {
    title: "Reverse Bass Kick - Serum Tutorial",
    video: "https://www.youtube.com/watch?v=KCUqnmGBiF0",
    thumbnail: "https://i.ytimg.com/vi/KCUqnmGBiF0/hqdefault.jpg",
  },
];

const shapeColumns = {
  even: [50, 60.83, 71.67, 82.5, 93.33],
  odd: [57.22, 68.06, 78.89, 89.72],
};

function makeShapePositions(rows: number, sectionHeight: number, start: number, step: number) {
  return Array.from({ length: rows }, (_, row) =>
    (row % 2 === 0 ? shapeColumns.even : shapeColumns.odd).map((left) => [left, ((start + row * step) / sectionHeight) * 100] as [number, number]),
  ).flat();
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

function KineticType() {
  return (
    <div className="kinetic-type" aria-hidden="true">
      <span className="kinetic-word kinetic-hard kinetic-hard-offset">HARD</span>
      <span className="kinetic-word kinetic-hard">HARD</span>
      <span className="kinetic-word kinetic-sound">SOUND</span>
      <span className="kinetic-word kinetic-free">FREE</span>
      <span className="kinetic-word kinetic-aka">AKA</span>
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="section-label">{children}</p>;
}

export function AkaHomepage() {
  return (
    <main className="aka-homepage">
      <section className="hero-section section-dark" id="top">
        <ShapeGrid variant="dark" layout="hero" />
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

      <section className="sample-section section-light" id="sample-packs">
        <ShapeGrid variant="light" layout="sample" />
        <div className="section-shell sample-layout">
          <div className="sample-intro">
            <SectionLabel>02 / SAMPLE PACKS</SectionLabel>
            <h2>SAMPLE PACKS</h2>
            <p>One premium pack, one related free trial.</p>
          </div>
          <div className="sample-products">
            <article className="premium-product">
              <img src={`${ASSET_ROOT}/HARDTECHNO-ESSENTIALS-VOL.-1.jpg`} alt="Hardtechno Essentials Vol. 01" />
              <div>
                <span className="product-kicker">PREMIUM PACK</span>
                <h3>HARDTECHNO ESSENTIALS<br />VOL. 01</h3>
                <a className="dark-cta" href="#top">EXPLORE PACK <span>→</span></a>
              </div>
            </article>
            <article className="trial-product">
              <img src={`${ASSET_ROOT}/HARDTECHNO-ESSENTIALS-VOL.-1-FREE-SAMPLEPACK.jpg`} alt="Hardtechno Essentials Vol. 01 Free Trial" />
              <div>
                <span className="product-kicker">RELATED FREE TRIAL</span>
                <h3>HARDTECHNO ESSENTIALS<br />VOL. 01 FREE TRIAL</h3>
                <a className="dark-cta" href="#free-sounds">GET FREE TRIAL <span>→</span></a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="free-section section-dark" id="free-sounds">
        <ShapeGrid variant="dark" reduced layout="free" />
        <KineticType />
        <div className="section-shell free-layout">
          <div className="free-intro">
            <SectionLabel>03 / FREE SOUNDS</SectionLabel>
            <h2>FREE SOUNDS</h2>
            <p>Sound design tools from the AKA SOUNDS archive.</p>
          </div>
          <div className="free-grid">
            {freeSounds.map((sound) => (
              <article className="free-product" key={sound.title}>
                <img src={`${ASSET_ROOT}/${sound.art}`} alt={`${sound.title} artwork`} />
                <div className="free-product-copy">
                  <span>FREE SOUND</span>
                  <h3>{sound.title}</h3>
                  <a className="text-cta" href="#free-sounds">GET FREE SOUND <span>→</span></a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="tutorials-section section-light" id="tutorials">
        <div className="section-shell tutorials-layout">
          <div className="tutorial-feature">
            <SectionLabel>04 / TUTORIALS</SectionLabel>
            <a href={tutorials[0].video} target="_blank" rel="noreferrer" className="tutorial-feature-link">
              <img src={tutorials[0].thumbnail} alt={tutorials[0].title} />
              <div className="tutorial-play">WATCH <span>↗</span></div>
            </a>
            <span className="product-kicker">FEATURED CONTENT</span>
            <h2>HARD DANCE SCREECHES<br />/ SERUM TUTORIAL</h2>
          </div>
          <div className="tutorial-index">
            <SectionLabel>QUICK CONTENT INDEX</SectionLabel>
            <p className="tutorial-intro">Past production videos and tools from the AKA SOUNDS archive.</p>
            {tutorials.slice(1).map((tutorial) => (
              <a className="tutorial-row" href={tutorial.video} target="_blank" rel="noreferrer" key={tutorial.title}>
                <img src={tutorial.thumbnail} alt="" />
                <span>{tutorial.title}</span>
                <b>↗</b>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="brand-section section-dark" id="brand">
        <div className="section-shell brand-layout">
          <div className="brand-copy">
            <SectionLabel>05 / BRAND + COMMUNITY</SectionLabel>
            <h2>BUILT FOR<br />HARD DANCE.</h2>
            <p>Sound design for the harder side of music.</p>
            <p className="brand-meta">RAWSTYLE&nbsp; / &nbsp;HARDTECHNO&nbsp; / &nbsp;SOUND DESIGN</p>
          </div>
          <div className="brand-symbol">
            <img src={`${ASSET_ROOT}/aka-logo-symbol-white-official.png`} alt="AKA Sounds symbol" />
          </div>
          <div className="community-index">
            <SectionLabel>COMMUNITY / LIVE CHANNELS</SectionLabel>
            <a href="https://www.youtube.com/@Aka_sounds" target="_blank" rel="noreferrer"><span>YOUTUBE</span><b>WATCH →</b></a>
            <a href="https://soundcloud.com/deat_aka" target="_blank" rel="noreferrer"><span>SOUNDCLOUD</span><b>LISTEN →</b></a>
            <a href="https://www.instagram.com/aka_sounds/" target="_blank" rel="noreferrer"><span>INSTAGRAM</span><b>FOLLOW →</b></a>
            <a href="https://open.spotify.com/intl-es/artist/2J50ThxDETbxoqoT4KP9bU?si=e1WUj9Z6TfOckAKzqED8hg" target="_blank" rel="noreferrer"><span>SPOTIFY</span><b>LISTEN →</b></a>
          </div>
        </div>
      </section>

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




