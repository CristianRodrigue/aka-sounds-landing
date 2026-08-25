import type { ReactNode } from "react";

type SupportPageProps = {
  index: string;
  title: string;
  description: string;
  updated?: string;
  children: ReactNode;
};

export function SupportPage({ index, title, description, updated, children }: SupportPageProps) {
  return (
    <div className="support-page">
      <SupportNavigation />
      <main className="support-page-main section-light">
        <svg className="support-page-geometry" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <path d="M80 168H440M1000 168H1360M80 704H360M1080 704H1360" />
          <path d="M760 80V330M760 570V820" />
          <polygon points="760,360 800,430 720,430" />
          <polygon points="760,540 720,470 800,470" />
        </svg>
        <div className="support-page-shell">
          <header className="support-page-intro">
            <p className="section-label">{index}</p>
            <h1>{title}</h1>
            <p className="support-page-description">{description}</p>
            {updated ? <p className="support-page-updated">LAST UPDATED / {updated}</p> : null}
          </header>
          <article className="support-page-content">{children}</article>
        </div>
      </main>
      <SupportFooter />
    </div>
  );
}

export function SupportSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="support-page-section">
      <h2>{heading}</h2>
      <div>{children}</div>
    </section>
  );
}

function SupportNavigation() {
  return (
    <header className="support-page-nav">
      <a className="support-nav-lockup" href="/" aria-label="AKA Sounds home">
        <img src="/assets/aka-logo-horizontal-white-official.png" alt="AKA Sounds" />
      </a>
      <nav className="support-nav-links" aria-label="Primary navigation">
        <a href="/#sample-packs">SAMPLE PACKS</a>
        <a href="/#free-sounds">FREE SOUNDS</a>
        <a href="/#tutorials">TUTORIALS</a>
        <a href="/#about">ABOUT</a>
      </nav>
      <a className="support-nav-cta" href="/sounds/hardtechno-essentials-vol-1">
        BROWSE PACKS <span aria-hidden="true">→</span>
      </a>
    </header>
  );
}

function SupportFooter() {
  return (
    <footer className="support-page-footer section-dark">
      <div>
        <p className="section-label">AKA SOUNDS / SUPPORT</p>
        <nav aria-label="Support pages">
          <a href="/privacy">PRIVACY</a>
          <a href="/terms">TERMS</a>
          <a href="/refunds">REFUNDS</a>
          <a href="/contact">CONTACT</a>
        </nav>
      </div>
      <span>© AKA SOUNDS</span>
    </footer>
  );
}

export function SupportNotFoundPage() {
  return (
    <div className="support-page">
      <SupportNavigation />
      <main className="support-page-main support-page-not-found section-light">
        <svg className="support-page-geometry support-page-404-geometry" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <circle className="support-404-orbit support-404-orbit-one" cx="720" cy="450" r="260" />
          <circle className="support-404-orbit support-404-orbit-two" cx="720" cy="450" r="380" />
          <path className="support-404-scan support-404-scan-one" d="M120 232H510M930 232H1320" />
          <path className="support-404-scan support-404-scan-two" d="M120 668H380M1060 668H1320" />
          <path d="M80 168H440M1000 168H1360M80 704H360M1080 704H1360" />
          <path d="M720 84V286M720 614V816" />
          <polygon points="720,326 760,396 680,396" />
          <polygon points="720,574 680,504 760,504" />
        </svg>
        <div className="support-page-not-found-content">
          <p className="section-label">AKA SOUNDS / 404</p>
          <h1>404</h1>
          <h2>SIGNAL LOST.</h2>
          <p>The frequency you&apos;re looking for doesn&apos;t exist on this band.</p>
          <a className="support-page-action" href="/">BACK TO HOME <span aria-hidden="true">→</span></a>
        </div>
      </main>
      <SupportFooter />
    </div>
  );
}