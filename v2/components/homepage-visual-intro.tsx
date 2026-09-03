const CLOUDINARY_HERO_VIDEO_URL = "https://res.cloudinary.com/drrx9rcec/video/upload/v1788403254/DEAT_AKA_-_init_for_AKA_SOUNDS_PAGEmp4_jt6pmj.mp4";

export function HomepageVisualIntro() {
  const heroVideoUrl = process.env.NEXT_PUBLIC_HERO_VIDEO_URL || CLOUDINARY_HERO_VIDEO_URL;

  return (
    <section className="visual-intro" aria-labelledby="visual-intro-title">
      <div className="visual-intro-fallback" aria-hidden="true" />
      <video
        className="visual-intro-media"
        src={heroVideoUrl}
        poster="/assets/HARDTECHNO-ESSENTIALS-VOL.-1.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        tabIndex={-1}
        aria-hidden="true"
      />
      <div className="visual-intro-overlay" aria-hidden="true" />
      <div className="visual-intro-vignette" aria-hidden="true" />
      <div className="visual-intro-copy">
        <p className="visual-intro-kicker">LATEST VISUAL RELEASE</p>
        <h1 className="visual-intro-title" id="visual-intro-title">
          <span>AKA SOUNDS</span>
        </h1>
        <p className="visual-intro-tagline">SOUND DESIGN FOR HEAVY MUSIC.</p>
        <a className="visual-intro-scroll" href="#featured-product">EXPLORE AKA SOUNDS <span>↓</span></a>
      </div>
    </section>
  );
}
