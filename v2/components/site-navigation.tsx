import Link from "next/link";

type SiteNavigationProps = {
  home?: boolean;
};

const links = [
  ["SAMPLE PACKS", "sample-packs"],
  ["FREE SOUNDS", "free-sounds"],
  ["TUTORIALS", "tutorials"],
  ["ABOUT", "about"],
] as const;

export function SiteNavigation({ home = false }: SiteNavigationProps) {
  const hrefFor = (anchor: string) => home ? `#${anchor}` : `/#${anchor}`;

  return (
    <header className="site-nav" aria-label="Primary navigation">
      <Link className="site-nav-lockup" href={home ? "#top" : "/"} aria-label="AKA Sounds home">
        <img className="site-nav-lockup-wordmark" src="/assets/aka-logo-horizontal-white-official.png" alt="AKA Sounds" />
        <img className="site-nav-lockup-symbol" src="/assets/aka-logo-symbol-white-official.png" alt="AKA Sounds" />
      </Link>
      <nav className="site-nav-links" aria-label="Primary navigation links">
        {links.map(([label, anchor]) => <Link key={anchor} href={hrefFor(anchor)}>{label}</Link>)}
      </nav>
      <Link className="site-nav-cta" href={hrefFor("sample-packs")}>
        BROWSE PACKS <span aria-hidden="true">→</span>
      </Link>
    </header>
  );
}
