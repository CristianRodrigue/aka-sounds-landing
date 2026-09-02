import Image from "next/image";
import { ProductAudioPreview } from "./product-audio-preview";
import type { ProductDetailModel } from "./product-data";
import { ProductPurchaseButton } from "./product-purchase-button";
import { MotionOrchestrator } from "../motion-orchestrator";

function ProductHeader() {
  return (
    <header className="product-v2-nav" aria-label="AKA Sounds product navigation">
      <a className="product-v2-lockup" href="/" aria-label="AKA Sounds home">
        <img className="product-v2-lockup-wordmark" src="/assets/aka-logo-horizontal-white-official.png" alt="AKA Sounds" />
        <img className="product-v2-lockup-symbol" src="/assets/aka-logo-symbol-white-official.png" alt="AKA Sounds" />
      </a>
      <nav className="product-v2-nav-links" aria-label="Primary navigation">
        <a href="/#sample-packs">SAMPLE PACKS</a>
        <a href="/#free-sounds">FREE SOUNDS</a>
        <a href="/#tutorials">TUTORIALS</a>
        <a href="/#about">ABOUT</a>
      </nav>
      <a className="product-v2-nav-cta" href="/#sample-packs">BROWSE PACKS <span aria-hidden="true">→</span></a>
    </header>
  );
}

function ProductSignalTicker() {
  return (
    <div className="signal-ticker" aria-label="AKA Sounds current signals">
      <div className="signal-ticker-viewport">
        <div className="signal-ticker-track">
          <div className="signal-ticker-sequence">
            <a href="/#sample-packs">NEW RELEASE <span>—</span> MODERN RAW KICK ARSENAL VOL. 1</a>
            <i aria-hidden="true">/</i>
            <a href="/#free-sounds">FREE SOUNDS <span>—</span> SERUM 2 HARD DANCE SCREECHES</a>
            <i aria-hidden="true">/</i>
            <a href="/#tutorials">NEW TUTORIAL <span>—</span> HARD DANCE SCREECHES / SERUM 2 TUTORIAL</a>
            <i aria-hidden="true">/</i>
          </div>
          <div className="signal-ticker-sequence" aria-hidden="true">
            <a href="/#sample-packs" tabIndex={-1}>NEW RELEASE <span>—</span> MODERN RAW KICK ARSENAL VOL. 1</a>
            <i aria-hidden="true">/</i>
            <a href="/#free-sounds" tabIndex={-1}>FREE SOUNDS <span>—</span> SERUM 2 HARD DANCE SCREECHES</a>
            <i aria-hidden="true">/</i>
            <a href="/#tutorials" tabIndex={-1}>NEW TUTORIAL <span>—</span> HARD DANCE SCREECHES / SERUM 2 TUTORIAL</a>
            <i aria-hidden="true">/</i>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductShapeGrid() {
  const triangles = Array.from({ length: 18 }, (_, index) => ({
    x: 760 + (index % 5) * 156,
    y: 76 + Math.floor(index / 5) * 110,
    rotate: (index + Math.floor(index / 5)) % 2 ? 180 : 0,
  }));

  return (
    <svg className="product-v2-shape-grid" viewBox="0 0 1440 814" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g className="product-v2-shape-grid-track">
      {triangles.map((triangle) => (
        <polygon
          key={`${triangle.x}-${triangle.y}`}
          points="15,0 30,30 0,30"
          transform={`translate(${triangle.x} ${triangle.y}) rotate(${triangle.rotate} 15 15)`}
          fill="none"
          stroke="#8A8A8A"
          strokeOpacity="0.15"
          strokeWidth="1"
        />
      ))}
      </g>
    </svg>
  );
}

function ProductImage({
  src,
  alt,
  optimized = false,
  priority = false,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  optimized?: boolean;
  priority?: boolean;
  className?: string;
  sizes: string;
}) {
  if (optimized) {
    return (
      <Image
        className={className}
        src={src}
        alt={alt}
        width={6000}
        height={6000}
        quality={100}
        priority={priority}
        sizes={sizes}
      />
    );
  }

  return <img className={className} src={src} alt={alt} />;
}
type ProductAmbientTone = "dark" | "light";
type ProductAmbientVariant = "triangles" | "rails" | "wave" | "cross";

function ProductAmbientFigure({ tone, variant }: { tone: ProductAmbientTone; variant: ProductAmbientVariant }) {
  const triangles = Array.from({ length: 12 }, (_, index) => ({
    x: 130 + (index % 4) * 310,
    y: 86 + Math.floor(index / 4) * 150,
    rotate: index % 2 ? 180 : 0,
  }));
  const stroke = tone === "light" ? "#252522" : "#f5f5ef";

  return (
    <svg
      className={"product-v2-ambient-figure product-v2-ambient-" + tone + " product-v2-ambient-" + variant}
      viewBox="0 0 1440 820"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g className="product-v2-ambient-motion">
        {variant === "triangles" ? triangles.map((triangle) => (
          <polygon
            key={String(triangle.x) + "-" + String(triangle.y)}
            points="15,0 30,30 0,30"
            transform={"translate(" + triangle.x + " " + triangle.y + ") rotate(" + triangle.rotate + " 15 15)"}
            fill="none"
            stroke={stroke}
            strokeOpacity={tone === "light" ? "0.13" : "0.08"}
            strokeWidth="1"
          />
        )) : null}
        {variant === "rails" ? (
          <>
            <path d="M72 152H468V612H690M750 612H972V152H1368" fill="none" stroke={stroke} strokeOpacity="0.1" />
            <path d="M72 238H354M1086 238H1368M72 528H420M1020 528H1368" fill="none" stroke={stroke} strokeOpacity="0.12" />
            <path d="M612 152V612M828 152V612" fill="none" stroke={stroke} strokeOpacity="0.07" />
          </>
        ) : null}
        {variant === "wave" ? (
          <>
            <path d="M0 548H210L270 486L330 610L390 548H600L660 486L720 610L780 548H990L1050 486L1110 610L1170 548H1440" fill="none" stroke={stroke} strokeOpacity="0.09" />
            <path d="M0 594H210L270 532L330 656L390 594H600L660 532L720 656L780 594H990L1050 532L1110 656L1170 594H1440" fill="none" stroke={stroke} strokeOpacity="0.06" />
          </>
        ) : null}
        {variant === "cross" ? (
          <>
            <path d="M720 72V748M72 410H1368" fill="none" stroke={stroke} strokeOpacity="0.08" />
            <path d="M520 410L720 210L920 410L720 610Z" fill="none" stroke={stroke} strokeOpacity="0.12" />
            <path d="M584 410L720 274L856 410L720 546Z" fill="none" stroke={stroke} strokeOpacity="0.06" />
          </>
        ) : null}
      </g>
    </svg>
  );
}
function ProductValueProposition({ product }: { product: ProductDetailModel }) {
  const { valueProposition } = product;

  return (
    <section className="product-v2-value section-dark">
      <ProductAmbientFigure tone="dark" variant="rails" />
      <div className="product-v2-section-shell product-v2-value-shell" data-motion-reveal>
        <div className="product-v2-value-intro">
          <p className="product-v2-section-index">03 / WHY THIS PACK</p>
          <h2>{valueProposition.headline}</h2>
          <p>{valueProposition.description}</p>
        </div>
        <div className="product-v2-value-pillars">
          {valueProposition.pillars.map((pillar, index) => (
            <article className="product-v2-value-pillar" key={pillar.title}>
              <span className="product-v2-value-number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductFooter() {
  return (
    <footer className="footer-b2-section section-dark product-v2-footer">
      <svg className="footer-b2-ambient-figure" viewBox="0 0 1440 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M72 442H494V130H684M756 130H1368V442H946" />
        <path d="M72 398H436M1004 398H1368" />
        <path d="M640 130V442M800 130V442" />
      </svg>
      <div className="footer-b2-layout" data-motion-reveal>
        <div className="footer-b2-brand">
          <p className="section-label">07 / FOOTER</p>
          <div className="footer-b2-brand-mark">
            <img className="footer-b2-lockup" src="/assets/aka-logo-horizontal-white-official.png" alt="AKA Sounds" />
          </div>
          <h2>STRUCTURED DIRECTORY</h2>
        </div>
        <nav className="footer-b2-directory" aria-label="Footer directory">
          <div><span>PRODUCTS</span><a href="/#sample-packs">SAMPLE PACKS</a><a href="/#free-sounds">FREE SOUNDS</a></div>
          <div><span>CONTENT</span><a href="/#tutorials">TUTORIALS</a></div>
          <div><span>BRAND</span><a href="/#about">ABOUT</a></div>
          <div><span>SOCIAL</span><a href="https://www.youtube.com/@Aka_sounds">YOUTUBE</a><a href="https://soundcloud.com/deat_aka">SOUNDCLOUD</a><a href="https://www.instagram.com/aka_sounds/">INSTAGRAM</a><a href="https://open.spotify.com/intl-es/artist/2J50ThxDETbxoqoT4KP9bU?si=e1WUj9Z6TfOckAKzqED8hg">SPOTIFY</a></div>
          <div><span>LEGAL</span><a href="/privacy">PRIVACY</a><a href="/terms">TERMS</a><a href="/refunds">REFUNDS</a><a href="/contact">CONTACT</a></div>
        </nav>
        <div className="footer-b2-bottom"><span>© AKA SOUNDS</span><span>PRODUCTS / CONTENT / BRAND</span></div>
      </div>
    </footer>
  );
}

export function ProductDetailPage({ product }: { product: ProductDetailModel }) {
  return (
    <main className="product-v2-page">
      <MotionOrchestrator reversible />
      <section className="product-v2-hero section-dark">
        <ProductShapeGrid />
        <ProductHeader />
        <ProductSignalTicker />
        <div className="product-v2-hero-inner">
          <div className="product-v2-artwork-frame" data-motion-reveal data-motion-delay="90">
            <ProductImage
              src={product.artwork}
              alt={product.displayName + " artwork"}
              optimized={product.optimizedArtwork}
              priority
              sizes="(max-width: 760px) 100vw, 48vw"
            />
            <div className="product-v2-artwork-caption">{product.artworkCaption.title} <span>/</span> {product.artworkCaption.detail}</div>
          </div>
          <div className="product-v2-hero-copy" data-motion-reveal data-motion-delay="140">
            <a className="product-v2-back-link" href="/#sample-packs">← BACK TO SAMPLE PACKS</a>
            <p className="product-v2-index">01 / PRODUCT DETAIL</p>
            <p className="product-v2-kicker">{product.genre}</p>
            <h1>{product.title}<br /><span>{product.volume}</span></h1>
            <p className="product-v2-description">{product.description}</p>
            <div className="product-v2-price-block">
              <span className="product-v2-price-label">CURRENT PRODUCT PRICE</span>
              <strong>{product.currentPrice}</strong>
              {product.referencePrice ? <del className="product-v2-reference-price">{product.referencePrice}</del> : null}
            </div>
            <ProductPurchaseButton priceId={product.paddlePriceId} productName={product.displayName} />
          </div>
        </div>
        <div className="product-v2-hero-meta" data-motion-reveal data-motion-delay="260">{product.heroMeta.title} <span>/</span> {product.heroMeta.detail}</div>
      </section>

      <section className="product-v2-content section-light">
        <ProductAmbientFigure tone="light" variant="triangles" />
        <div className="product-v2-section-shell" data-motion-reveal>
          <div className="product-v2-section-heading">
            <p className="product-v2-section-index">02 / INCLUDED CONTENT</p>
            <h2>INCLUDED<br />CONTENT</h2>
          </div>
          <div className="product-v2-content-list">
            {product.includedContent.map((item, index) => (
              <div className="product-v2-content-row" key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductValueProposition product={product} />

      <section className="product-v2-preview section-dark">
        <ProductAmbientFigure tone="dark" variant="wave" />
        <div className="product-v2-section-shell" data-motion-reveal>
          <div className="product-v2-preview-heading">
            <p className="product-v2-section-index">04 / AUDIO PREVIEW</p>
            <h2>SELECT<br />A SOUND.</h2>
            {product.previewContext ? <p className="product-v2-preview-context">{product.previewContext}</p> : null}
          </div>
          <ProductAudioPreview tracks={product.previewTracks} />
          {product.soundCloudTrackUrl ? (
            <div className="product-v2-soundcloud">
              <div>
                <p className="product-v2-section-index">SOUNDCLOUD DEMO</p>
                <p>THIS IS A F*CKING HARDTECHNO</p>
              </div>
              <iframe
                title={product.displayName + " SoundCloud demo"}
                src={"https://w.soundcloud.com/player/?url=" + encodeURIComponent(product.soundCloudTrackUrl) + "&color=%23000000&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false"}
                allow="autoplay"
              />
            </div>
          ) : null}
        </div>
      </section>

      <section id="free-trial" className={"product-v2-related section-light" + (product.relatedTrial.sectionTitle === "FREE EDITION" ? " product-v2-related-free-edition" : "")}>
        <ProductAmbientFigure tone="light" variant="rails" />
        <div className="product-v2-section-shell" data-motion-reveal>
          <div>
            <p className="product-v2-section-index">05 / RELATED PRODUCT</p>
            <h2>{product.relatedTrial.sectionTitle}</h2>
            <p className="product-v2-related-copy">{product.relatedTrial.title}</p>
          </div>
          <div className="product-v2-trial-module">
            <ProductImage
                src={product.relatedTrial.artwork}
                alt={product.relatedTrial.title + " artwork"}
                optimized={product.relatedTrial.optimizedArtwork}
                sizes="(max-width: 760px) 120px, 190px"
              />
            <div>
              <p className="product-v2-section-index">{product.relatedTrial.label}</p>
              <h3>
                {product.relatedTrial.titleLines.map((line) => (
                  <span className="product-v2-related-title-line" key={line}>{line}</span>
                ))}
              </h3>
              <ProductPurchaseButton
                priceId={product.relatedTrial.paddlePriceId}
                productName={product.relatedTrial.title}
                label={product.relatedTrial.sectionTitle === "FREE EDITION" ? "GET FREE EDITION" : "GET FREE TRIAL"}
                variant="text"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="product-v2-final-cta section-dark">
        <ProductAmbientFigure tone="dark" variant="cross" />
        <div className="product-v2-section-shell" data-motion-reveal>
          <p className="product-v2-section-index">06 / PURCHASE</p>
          <div className="product-v2-final-row">
            <h2>{product.title}<br /><span>{product.volume}</span></h2>
            <div className="product-v2-final-buy">
              <strong>{product.currentPrice}</strong>
              {product.referencePrice ? <del className="product-v2-reference-price">{product.referencePrice}</del> : null}
              <ProductPurchaseButton priceId={product.paddlePriceId} productName={product.displayName} compact />
            </div>
          </div>
        </div>
      </section>

      <ProductFooter />
    </main>
  );
}
