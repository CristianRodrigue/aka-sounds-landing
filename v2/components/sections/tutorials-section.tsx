const featuredTutorial = {
  title: "HARD DANCE SCREECHES / SERUM 2 TUTORIAL",
  video: "https://www.youtube.com/watch?v=1EmJVlGZBG4",
  thumbnail: "https://i.ytimg.com/vi/1EmJVlGZBG4/hqdefault.jpg",
};

const archiveTutorials = [
  {
    title: "HARDTECHNO KICK / SERUM 2 TUTORIAL",
    video: "https://www.youtube.com/watch?v=5bXTQvDmJY4",
    thumbnail: "https://i.ytimg.com/vi/5bXTQvDmJY4/hqdefault.jpg",
  },
  {
    title: "ZAAG KICK / SERUM 2 TUTORIAL",
    video: "https://www.youtube.com/watch?v=F8pNBXN6XH0",
    thumbnail: "https://i.ytimg.com/vi/F8pNBXN6XH0/hqdefault.jpg",
  },
  {
    title: "REVERSE BASS KICK / SERUM 2 TUTORIAL",
    video: "https://www.youtube.com/watch?v=U2fTh4phhEM",
    thumbnail: "https://i.ytimg.com/vi/U2fTh4phhEM/hqdefault.jpg",
  },
  {
    title: "RAWSTYLE KICK / SERUM 2 TUTORIAL",
    video: "https://www.youtube.com/watch?v=KCUqnmGBiF0",
    thumbnail: "https://i.ytimg.com/vi/KCUqnmGBiF0/hqdefault.jpg",
  },
] as const;

export function TutorialsA2Section() {
  return (
    <section className="tutorials-exact-section section-light" id="tutorials">
      <svg className="tutorials-ambient-figure" viewBox="0 0 1440 890" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M72 236H604V670H72M788 220V732M788 294H1320M788 620H1320" />
        <path d="M1038 84V180M1146 84V180M1254 84V180" />
        <path className="tutorials-ambient-accent" d="M1348 138H1420V210M1348 376H1420V448M1348 614H1420V686M1292 772H1420" />
        <path className="tutorials-ambient-rail" d="M1068 268H1288M1188 268V300M1068 372H1288M1188 372V404M1068 476H1288M1188 476V508M1068 580H1288M1188 580V612" />
        <path className="tutorials-ambient-left" d="M18 148H62V214M18 356H52M18 604H62V670M18 754H52M18 438L44 412L70 438L44 464Z" />
        <path className="tutorials-ambient-center" d="M796 332L830 272L864 332Z M796 620L830 560L864 620Z" />
        <path className="tutorials-ambient-triangle tutorials-ambient-triangle-1" d="M16 286L40 244L64 286Z" />
        <path className="tutorials-ambient-triangle tutorials-ambient-triangle-2" d="M16 526L40 484L64 526Z" />
        <path className="tutorials-ambient-triangle tutorials-ambient-triangle-3" d="M16 776L40 734L64 776Z" />
      </svg>
      <div className="tutorials-exact-inner">
        <p className="tutorials-exact-index" data-motion-reveal data-motion-delay="0">04 / TUTORIALS</p>
        <h2 className="tutorials-exact-heading" data-motion-reveal data-motion-delay="70">TUTORIALS</h2>
        <p className="tutorials-exact-description" data-motion-reveal data-motion-delay="120">Past production videos and tools from the AKA SOUNDS archive.</p>

        <p className="tutorials-exact-feature-label" data-motion-reveal data-motion-delay="170">FEATURED TUTORIAL</p>
        <a className="tutorials-exact-feature-thumbnail" data-motion-reveal data-motion-delay="220" href={featuredTutorial.video} target="_blank" rel="noreferrer">
          <img src={featuredTutorial.thumbnail} alt={featuredTutorial.title} />
        </a>
        <div className="tutorials-exact-feature-rule" aria-hidden="true" />
        <h3 className="tutorials-exact-feature-title" data-motion-reveal data-motion-delay="290">{featuredTutorial.title}</h3>
        <p className="tutorials-exact-feature-meta" data-motion-reveal data-motion-delay="350">SERUM&nbsp; / &nbsp;HARDSTYLE&nbsp; / &nbsp;RAWSTYLE</p>
        <a className="tutorials-exact-feature-action motion-cta" data-motion-reveal data-motion-delay="400" href={featuredTutorial.video} target="_blank" rel="noreferrer">
          WATCH TUTORIAL <span className="motion-cta-arrow">→</span>
        </a>

        <div className="tutorials-exact-archive" aria-label="Tutorial archive index">
          <p className="tutorials-exact-archive-label" data-motion-reveal data-motion-delay="460">ARCHIVE INDEX</p>
          {archiveTutorials.map((tutorial, index) => (
            <article className={`tutorials-exact-row tutorials-exact-row-${index + 1}`} data-motion-reveal data-motion-delay={String(index * 70 + 520)} key={tutorial.video}>
              <a className="tutorials-exact-row-thumbnail" href={tutorial.video} target="_blank" rel="noreferrer">
                <img src={tutorial.thumbnail} alt={tutorial.title} />
              </a>
              <a className="tutorials-exact-row-title" href={tutorial.video} target="_blank" rel="noreferrer">
                {tutorial.title}
              </a>
              <a className="tutorials-exact-row-action motion-cta" href={tutorial.video} target="_blank" rel="noreferrer">
                WATCH TUTORIAL <span className="motion-cta-arrow">→</span>
              </a>
            </article>
          ))}
        </div>

        <div className="tutorials-exact-footer-rule" aria-hidden="true" />
        <p className="tutorials-exact-footer-meta" data-motion-reveal data-motion-delay="720">WATCH&nbsp; / &nbsp;TUTORIAL ARCHIVE</p>
      </div>
    </section>
  );
}
