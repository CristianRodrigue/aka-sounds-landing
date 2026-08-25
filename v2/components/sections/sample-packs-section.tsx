const ASSET_ROOT = "/assets";
const PREMIUM_PRODUCT_PATH = "/sounds/hardtechno-essentials-vol-1";
const FREE_TRIAL_PATH = PREMIUM_PRODUCT_PATH + "#free-trial";

const sampleShapeColumns = [-216, -60, 96, 252, 408, 564, 720, 876, 1032, 1188, 1344, 1500, 1656, 1812] as const;
const sampleShapeRows = Array.from({ length: 12 }, (_, row) => ({
  y: 30 + row * 52,
  rotations: sampleShapeColumns.map((_, index) =>
    (row + index) % 2 === 0 ? 0 : 180,
  ),
}));

function SamplePacksShapeGrid() {
  return (
    <svg
      className="sample-exact-shape-grid"
      viewBox="0 0 1440 550"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g className="sample-exact-shape-grid-track">
        {sampleShapeRows.flatMap(({ y, rotations }) =>
          sampleShapeColumns.map((x, index) => (
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
      </g>
    </svg>
  );
}

export function SamplePacksSection() {
  return (
    <section className="sample-exact-section section-light" id="sample-packs">
      <SamplePacksShapeGrid />
      <div className="sample-exact-inner">
        <p className="sample-exact-index" data-motion-reveal data-motion-delay="0">02 / PRODUCTS</p>
        <h2 className="sample-exact-heading" data-motion-reveal data-motion-delay="70">SAMPLE PACKS</h2>
        <p className="sample-exact-description" data-motion-reveal data-motion-delay="120">One premium pack, one related free trial.</p>

        <img data-motion-reveal data-motion-delay="170" className="sample-exact-premium-art"
          src={`${ASSET_ROOT}/HARDTECHNO-ESSENTIALS-VOL.-1.jpg`}
          alt="Hardtechno Essentials Vol. 01 artwork"
        />
        <div className="sample-exact-premium-copy" data-motion-reveal data-motion-delay="220">
          <p className="sample-exact-premium-label">PREMIUM SAMPLE PACK</p>
          <h3>HARDTECHNO ESSENTIALS<br />VOL. 01</h3>
          <p className="sample-exact-premium-type">PAID / SAMPLE PACK</p>
          <a className="motion-cta" href={PREMIUM_PRODUCT_PATH}>EXPLORE PACK <span className="motion-cta-arrow">→</span></a>
        </div>

        <div className="sample-exact-divider" aria-hidden="true" />
        <img data-motion-reveal data-motion-delay="280" className="sample-exact-trial-art"
          src={`${ASSET_ROOT}/HARDTECHNO-ESSENTIALS-VOL.-1-FREE-SAMPLEPACK.jpg`}
          alt="Hardtechno Essentials Vol. 01 Free Trial"
        />
        <div className="sample-exact-trial-copy" data-motion-reveal data-motion-delay="330">
          <p className="sample-exact-trial-label">RELATED FREE TRIAL</p>
          <h3>HARDTECHNO ESSENTIALS<br />VOL. 01 FREE TRIAL</h3>
          <p className="sample-exact-trial-type">FREE TRIAL / SAMPLE PACK</p>
          <a className="motion-cta" href={FREE_TRIAL_PATH}>GET FREE TRIAL <span className="motion-cta-arrow">→</span></a>
        </div>

        <div className="sample-exact-end-rule" aria-hidden="true" />
      </div>
    </section>
  );
}
