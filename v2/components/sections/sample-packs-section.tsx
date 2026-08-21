const ASSET_ROOT = "/assets";

const sampleShapeRows = Array.from({ length: 10 }, (_, row) => ({
  y: 30 + row * 52,
  rotations: row % 2 === 0 ? [0, 180, 0, 180, 0] : [180, 0, 180, 0, 180],
}));

function SamplePacksShapeGrid() {
  return (
    <svg
      className="sample-exact-shape-grid"
      viewBox="0 0 1440 550"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {sampleShapeRows.flatMap(({ y, rotations }) =>
        [720, 876, 1032, 1188, 1344].map((x, index) => (
          <polygon
            key={`${x}-${y}`}
            points="15,0 30,30 0,30"
            transform={`translate(${x} ${y}) rotate(${rotations[index]} 15 15)`}
            fill="none"
            stroke="#202020"
            strokeOpacity={0x12 / 255}
            strokeWidth="1"
          />
        )),
      )}
    </svg>
  );
}

export function SamplePacksSection() {
  return (
    <section className="sample-exact-section section-light" id="sample-packs">
      <SamplePacksShapeGrid />
      <div className="sample-exact-inner">
        <p className="sample-exact-index">02 / PRODUCTS</p>
        <h2 className="sample-exact-heading">SAMPLE PACKS</h2>
        <p className="sample-exact-description">One premium pack, one related free trial.</p>

        <img
          className="sample-exact-premium-art"
          src={`${ASSET_ROOT}/HARDTECHNO-ESSENTIALS-VOL.-1.jpg`}
          alt="Hardtechno Essentials Vol. 01"
        />
        <div className="sample-exact-premium-copy">
          <p className="sample-exact-premium-label">PREMIUM SAMPLE PACK</p>
          <h3>HARDTECHNO ESSENTIALS<br />VOL. 01</h3>
          <p className="sample-exact-premium-type">PAID / SAMPLE PACK</p>
          <a href="#top">EXPLORE PACK →</a>
        </div>

        <div className="sample-exact-divider" aria-hidden="true" />
        <img
          className="sample-exact-trial-art"
          src={`${ASSET_ROOT}/HARDTECHNO-ESSENTIALS-VOL.-1-FREE-SAMPLEPACK.jpg`}
          alt="Hardtechno Essentials Vol. 01 Free Trial"
        />
        <div className="sample-exact-trial-copy">
          <p className="sample-exact-trial-label">RELATED FREE TRIAL</p>
          <h3>HARDTECHNO ESSENTIALS<br />VOL. 01 FREE TRIAL</h3>
          <p className="sample-exact-trial-type">FREE TRIAL / SAMPLE PACK</p>
          <a href="#free-sounds">GET FREE TRIAL →</a>
        </div>

        <div className="sample-exact-end-rule" aria-hidden="true" />
      </div>
    </section>
  );
}
