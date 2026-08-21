const ASSET_ROOT = "/assets";

const freeSounds = [
  { title: ["SERUM 2 HARD DANCE", "SCREECHES"], art: "Cover_FREE_SCREECH_Cyan.png" },
  { title: ["SERUM 2 HARDTECHNO", "KICK"], art: "AkasoundsProductCover-Hardtechno.jpeg" },
  { title: ["SERUM 2 ZAAG KICK"], art: "AkasoundsProductCover-ZaagKick.jpeg" },
  { title: ["SERUM 2 REVERSE", "BASS KICK"], art: "AkasoundsProductCover.jpeg" },
] as const;

const shapeTriangles = [
  [520, 185, 0],
  [848, 210, 180],
  [1210, 250, 0],
  [540, 560, 180],
  [910, 610, 0],
] as const;

function FreeSoundsH1KineticType() {
  return (
    <div className="free-h1-kinetic" aria-hidden="true">
      <span className="free-h1-kinetic-hard">HARD</span>
      <span className="free-h1-kinetic-free">FREE</span>
      <span className="free-h1-kinetic-sound">SOUND</span>
      <span className="free-h1-kinetic-aka">AKA</span>
    </div>
  );
}

function FreeSoundsH1ShapeGrid() {
  return (
    <svg className="free-h1-shape-grid" viewBox="0 0 1440 860" preserveAspectRatio="none" aria-hidden="true">
      {shapeTriangles.map(([x, y, rotation]) => (
        <polygon
          key={`${x}-${y}`}
          points="15,0 30,30 0,30"
          transform={`translate(${x} ${y}) rotate(${rotation} 15 15)`}
          fill="none"
          stroke="#8A8A8A"
          strokeOpacity={0x12 / 255}
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

export function FreeSoundsH1Section() {
  return (
    <section className="free-h1-section section-dark" id="free-sounds">
      <FreeSoundsH1ShapeGrid />
      <FreeSoundsH1KineticType />
      <div className="free-h1-inner">
        <p className="free-h1-index">03 / FREE SOUNDS</p>
        <h2 className="free-h1-heading">FREE SOUNDS</h2>
        <p className="free-h1-description">Free sounds for download and testing.</p>
        <a className="free-h1-explore" href="#free-sounds">EXPLORE ALL SOUNDS →</a>
        <div className="free-h1-top-rule" aria-hidden="true" />
        <div className="free-h1-rail" aria-label="Free Sounds products">
          {freeSounds.map((sound) => (
            <article className="free-h1-product" key={sound.art}>
              <img className="free-h1-artwork" src={`${ASSET_ROOT}/${sound.art}`} alt={`${sound.title.join(" ")} artwork`} />
              <div className="free-h1-module-rule" aria-hidden="true" />
              <p className="free-h1-label">FREE SOUND</p>
              <h3 className="free-h1-product-title">
                {sound.title.map((line) => <span className="free-h1-product-title-line" key={line}>{line}</span>)}
              </h3>
              <a className="free-h1-action" href="#free-sounds">GET FREE SOUND →</a>
            </article>
          ))}
        </div>
        <div className="free-h1-progress-track" aria-hidden="true" />
        <div className="free-h1-progress-position" aria-hidden="true" />
        <span className="free-h1-next-arrow" aria-hidden="true">→</span>
        <div className="free-h1-end-rule" aria-hidden="true" />
        <p className="free-h1-rail-meta">HORIZONTAL RAIL&nbsp; / &nbsp;4 FREE SOUNDS&nbsp; / &nbsp;DRAG TO EXPLORE</p>
      </div>
    </section>
  );
}
