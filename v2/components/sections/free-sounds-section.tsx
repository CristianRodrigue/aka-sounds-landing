import Image from "next/image";
import Link from "next/link";
import { ProductPurchaseButton } from "../product-detail/product-purchase-button";

const ASSET_ROOT = "/assets";

type FreeSound = {
  readonly title: readonly string[];
  readonly art: string;
  readonly priceId: string;
  readonly relatedProductHref?: string;
  readonly label?: string;
  readonly optimized?: boolean;
  readonly details?: string;
};

const freeSounds: readonly FreeSound[] = [
  {
    title: ["MODERN RAW KICK", "ARSENAL VOL. 1"],
    art: "modern-raw-kick-arsenal-vol-1-free-edition-cover.jpg",
    priceId: "pri_01m0zn4mt890s0fp4xym0jpj9s",
    relatedProductHref: "/sounds/modern-raw-kick-arsenal-vol-1#free-trial",
    label: "FREE EDITION",
    details: "13 RAW KICK SAMPLES / 3 FULL KICKS / 10 COMPONENTS",
    optimized: true,
  },
  {
    title: ["SERUM 2 HARD DANCE", "SCREECHES"],
    art: "Cover_FREE_SCREECH_Cyan.png",
    priceId: "pri_01knt149kwqhp35wa0hwb4gwqn",
  },
  {
    title: ["SERUM 2 HARDTECHNO", "KICK"],
    art: "AkasoundsProductCover-Hardtechno.jpeg",
    priceId: "pri_01kn7gspy845ttqp6m8mn4jgkr",
  },
  {
    title: ["SERUM 2 ZAAG KICK"],
    art: "AkasoundsProductCover-ZaagKick.jpeg",
    priceId: "pri_01kmnmnp5fr08h43fsfa2qbcqt",
  },
  {
    title: ["SERUM 2 REVERSE", "BASS KICK"],
    art: "AkasoundsProductCover.jpeg",
    priceId: "pri_01kkwnrqgq7xcd5hhpxg99ae6p",
  },
  {
    title: ["HARDTECHNO ESSENTIALS", "VOL. 01 FREE TRIAL"],
    art: "HARDTECHNO-ESSENTIALS-VOL.-1-FREE-SAMPLEPACK.jpg",
    priceId: "pri_01kkd2y0pdsxvg234s8zvfshqj",
    relatedProductHref: "/sounds/hardtechno-essentials-vol-1#free-trial",
    label: "FREE TRIAL",
  },
];

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
      <span className="free-h1-kinetic-hard" data-motion-drift>HARD</span>
      <span className="free-h1-kinetic-free" data-motion-drift>FREE</span>
      <span className="free-h1-kinetic-sound" data-motion-drift>SOUND</span>
      <span className="free-h1-kinetic-aka" data-motion-drift>AKA</span>
    </div>
  );
}

function FreeSoundsH1ShapeGrid() {
  return (
    <svg className="free-h1-shape-grid" viewBox="0 0 1440 860" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
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
        <p className="free-h1-index" data-motion-reveal data-motion-delay="0">03 / FREE SOUNDS</p>
        <h2 className="free-h1-heading" data-motion-reveal data-motion-delay="70">FREE SOUNDS</h2>
        <p className="free-h1-description" data-motion-reveal data-motion-delay="120">Free sounds for download and testing.</p>
        <div className="free-h1-top-rule" aria-hidden="true" />
        <div className="free-h1-rail" aria-label="Free Sounds products" data-motion-rail>
          {freeSounds.map((sound, index) => (
            <article className={`free-h1-product${sound.details ? " free-h1-product-with-details" : ""}`} key={sound.art} data-motion-reveal data-motion-delay={String(index * 70 + 220)}>
              {sound.optimized ? (
                <Image
                  className="free-h1-artwork"
                  src={`${ASSET_ROOT}/${sound.art}`}
                  alt={`${sound.title.join(" ")} artwork`}
                  width={6000}
                  height={6000}
                  quality={100}
                  sizes="(max-width: 760px) 68vw, 260px"
                />
              ) : (
                <img className="free-h1-artwork" src={`${ASSET_ROOT}/${sound.art}`} alt={`${sound.title.join(" ")} artwork`} />
              )}
              <div className="free-h1-module-rule" aria-hidden="true" />
              <p className="free-h1-label">{sound.label ?? "FREE SOUND"}</p>
              <h3 className="free-h1-product-title">
                {sound.title.map((line) => <span className="free-h1-product-title-line" key={line}>{line}</span>)}
              </h3>
              {sound.details ? <p className="free-h1-product-details">{sound.details}</p> : null}
              {sound.relatedProductHref ? (
                <Link className="free-h1-action motion-cta" href={sound.relatedProductHref}>
                  GET FREE SOUND <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <ProductPurchaseButton
                  priceId={sound.priceId}
                  productName={sound.title.join(" ")}
                  label="GET FREE SOUND"
                  variant="custom"
                  buttonClassName="free-h1-action motion-cta"
                />
              )}
            </article>
          ))}
        </div>
        <div className="free-h1-progress-track" aria-hidden="true" />
        <div className="free-h1-progress-position" role="progressbar" aria-label="Free Sounds rail progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0} />
        <div className="free-h1-rail-controls" aria-label="Free Sounds rail navigation">
          <button type="button" className="free-h1-rail-arrow free-h1-previous-arrow" data-free-rail-prev aria-label="Previous free sound" disabled>←</button>
          <button type="button" className="free-h1-rail-arrow free-h1-next-arrow" data-free-rail-next aria-label="Next free sound">→</button>
        </div>
        <div className="free-h1-end-rule" aria-hidden="true" />
        <p className="free-h1-rail-meta">HORIZONTAL RAIL&nbsp; / &nbsp;6 FREE SOUNDS&nbsp; / &nbsp;DRAG TO EXPLORE</p>
      </div>
    </section>
  );
}
