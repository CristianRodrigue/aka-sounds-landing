export function HomepageVisualIntro() {
  return (
    <section className="visual-intro" aria-labelledby="visual-intro-title">
      <div className="visual-intro-fallback" aria-hidden="true" />
      <iframe
        className="visual-intro-media"
        src="https://www.youtube.com/embed/b9OFXRXgnhY?autoplay=1&mute=1&loop=1&playlist=b9OFXRXgnhY&controls=0&showinfo=0&rel=0&playsinline=1&iv_load_policy=3&disablekb=1&fs=0&color=white"
        title="AKA Sounds video background"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        loading="eager"
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