const ASSET_ROOT = "/assets";
const PREMIUM_PRODUCT_PATH = "/sounds/hardtechno-essentials-vol-1";
const NEW_PREMIUM_PRODUCT_PATH = "/sounds/modern-raw-kick-arsenal-vol-1";

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
        <p className="sample-exact-description" data-motion-reveal data-motion-delay="120">Two premium packs.</p>

        <div className="sample-catalog-grid" aria-label="Sample pack catalog">
          <article className="sample-catalog-card sample-catalog-card-new" data-motion-reveal data-motion-delay="170">
            <img
              className="sample-catalog-art"
              src={`${ASSET_ROOT}/modern-raw-kick-arsenal-vol-1-cover.png`}
              alt="Modern Raw Kick Arsenal Vol. 1 Full Edition artwork"
            />
            <div className="sample-catalog-copy">
              <p className="sample-catalog-label">NEW / PREMIUM SAMPLE PACK</p>
              <h3>MODERN RAW KICK<br />ARSENAL VOL. 1</h3>
              <p className="sample-catalog-type">FULL EDITION / $19.99</p>
              <a className="motion-cta" href={NEW_PREMIUM_PRODUCT_PATH}>EXPLORE PACK <span className="motion-cta-arrow">→</span></a>
            </div>
          </article>

          <article className="sample-catalog-card" data-motion-reveal data-motion-delay="230">
            <img
              className="sample-catalog-art"
              src={`${ASSET_ROOT}/HARDTECHNO-ESSENTIALS-VOL.-1.jpg`}
              alt="Hardtechno Essentials Vol. 01 artwork"
            />
            <div className="sample-catalog-copy">
              <p className="sample-catalog-label">PREMIUM SAMPLE PACK</p>
              <h3>HARDTECHNO ESSENTIALS<br />VOL. 01</h3>
              <p className="sample-catalog-type">FULL EDITION / $14.99</p>
              <a className="motion-cta" href={PREMIUM_PRODUCT_PATH}>EXPLORE PACK <span className="motion-cta-arrow">→</span></a>
            </div>
          </article>

        </div>

        <div className="sample-catalog-end-rule" aria-hidden="true" />
        <p className="sample-catalog-footer">2 PREMIUM PACKS</p>
      </div>
    </section>
  );
}
