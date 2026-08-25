const communityChannels = [
  {
    name: "YOUTUBE",
    action: "WATCH →",
    href: "https://www.youtube.com/@Aka_sounds",
    row: "youtube",
  },
  {
    name: "SOUNDCLOUD",
    action: "LISTEN →",
    href: "https://soundcloud.com/deat_aka",
    row: "soundcloud",
  },
  {
    name: "INSTAGRAM",
    action: "FOLLOW →",
    href: "https://www.instagram.com/aka_sounds/",
    row: "instagram",
  },
  {
    name: "SPOTIFY",
    action: "LISTEN →",
    href: "https://open.spotify.com/intl-es/artist/2J50ThxDETbxoqoT4KP9bU?si=e1WUj9Z6TfOckAKzqED8hg",
    row: "spotify",
  },
] as const;

export function BrandCommunityA2Section() {
  return (
    <section className="brand-a2-section" id="about">
      <svg className="brand-a2-ambient-figure" viewBox="0 0 1440 950" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M72 680H604V846H72M72 724H438M72 768H348" />
        <path d="M684 618L760 542L836 618L760 694Z" />
        <path d="M684 618H836M760 542V694" />
        <path className="brand-a2-ambient-square" d="M520 548H648V676H520Z" />
        <path className="brand-a2-ambient-square-cross" d="M584 548V676M520 612H648" />
        <path className="brand-a2-ambient-signal" d="M920 792H1270M920 816H1160" />
      </svg>
      <div className="brand-a2-inner">
        <a className="brand-a2-lockup" data-motion-reveal data-motion-delay="0" href="#top" aria-label="AKA Sounds home">
          <img src="/assets/aka-logo-horizontal-white-official.png" alt="AKA Sounds" />
        </a>

        <div className="brand-a2-divider" aria-hidden="true" />
        <div className="brand-a2-symbol-field motion-scale-in" data-motion-reveal data-motion-delay="100" aria-hidden="true">
          <img src="/assets/aka-logo-symbol-white-official.png" alt="" />
        </div>

        <p className="brand-a2-index">05 / BRAND</p>
        <h2 className="brand-a2-manifesto" data-motion-reveal data-motion-delay="160" aria-label="Built for hard dance.">
          <span className="brand-a2-manifesto-line brand-a2-manifesto-line-one">BUILT FOR</span>
          <span className="brand-a2-manifesto-line brand-a2-manifesto-line-two">HARD DANCE.</span>
        </h2>
        <p className="brand-a2-genre">RAWSTYLE&nbsp; / &nbsp;HARDTECHNO&nbsp; / &nbsp;SOUND DESIGN</p>
        <p className="brand-a2-offer">SAMPLE PACKS&nbsp; / &nbsp;PRESETS&nbsp; / &nbsp;TUTORIALS</p>
        <p className="brand-a2-support" data-motion-reveal data-motion-delay="300">SOUND DESIGN FOR THE HARDER SIDE OF MUSIC.</p>

        <div className="brand-a2-community" data-motion-reveal data-motion-delay="390">
          <p className="brand-a2-community-label">COMMUNITY / LIVE CHANNELS</p>
          {communityChannels.map((channel) => (
            <a
              className={`brand-a2-channel brand-a2-channel-${channel.row}`}
              href={channel.href}
              target="_blank"
              rel="noreferrer"
              key={channel.name}
            >
              <span className="brand-a2-channel-name">{channel.name}</span>
              <span className="brand-a2-channel-action">{channel.action}</span>
            </a>
          ))}
          <div className="brand-a2-community-rule brand-a2-community-rule-one" aria-hidden="true" />
          <div className="brand-a2-community-rule brand-a2-community-rule-two" aria-hidden="true" />
        </div>

        <div className="brand-a2-footer-rule" aria-hidden="true" />
        <p className="brand-a2-footer-meta" data-motion-reveal data-motion-delay="560">AKA SOUNDS&nbsp; / &nbsp;COMMUNITY CHANNELS</p>
      </div>
    </section>
  );
}
