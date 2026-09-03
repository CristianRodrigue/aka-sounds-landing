import type { ReactNode } from "react";
import Link from "next/link";
import { SiteNavigation } from "./site-navigation";

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
  return <SiteNavigation />;
}

function SupportFooter() {
  return (
    <footer className="footer-b2-section section-dark support-page-directory-footer">
      <svg className="footer-b2-ambient-figure" viewBox="0 0 1440 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M72 442H494V130H684M756 130H1368V442H946" />
        <path d="M72 398H436M1004 398H1368" />
        <path d="M640 130V442M800 130V442" />
      </svg>
      <div className="footer-b2-layout">
        <div className="footer-b2-brand">
          <p className="section-label">07 / SUPPORT</p>
          <div className="footer-b2-brand-mark">
            <img className="footer-b2-lockup" src="/assets/aka-logo-horizontal-white-official.png" alt="AKA Sounds" />
          </div>
          <h2>STRUCTURED DIRECTORY</h2>
        </div>
        <nav className="footer-b2-directory" aria-label="Footer directory">
          <div><span>PRODUCTS</span><Link href="/#sample-packs">SAMPLE PACKS</Link><Link href="/#free-sounds">FREE SOUNDS</Link></div>
          <div><span>CONTENT</span><Link href="/#tutorials">TUTORIALS</Link></div>
          <div><span>BRAND</span><Link href="/#about">ABOUT</Link><Link href="/deat_aka">DEAT AKA</Link></div>
          <div><span>SOCIAL</span><a href="https://www.youtube.com/@Aka_sounds">YOUTUBE</a><a href="https://soundcloud.com/deat_aka">SOUNDCLOUD</a><a href="https://www.instagram.com/aka_sounds/">INSTAGRAM</a><a href="https://open.spotify.com/intl-es/artist/2J50ThxDETbxoqoT4KP9bU?si=e1WUj9Z6TfOckAKzqED8hg">SPOTIFY</a></div>
          <div><span>LEGAL</span><Link href="/privacy">PRIVACY</Link><Link href="/terms">TERMS</Link><Link href="/refunds">REFUNDS</Link><Link href="/contact">CONTACT</Link></div>
        </nav>
        <div className="footer-b2-bottom"><span>© AKA SOUNDS</span><span>PRODUCTS / CONTENT / BRAND</span></div>
      </div>
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
          <Link className="support-page-action" href="/">BACK TO HOME <span aria-hidden="true">→</span></Link>
        </div>
      </main>
      <SupportFooter />
    </div>
  );
}
