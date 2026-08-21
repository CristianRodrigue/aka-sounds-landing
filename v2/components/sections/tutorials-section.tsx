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
      <div className="tutorials-exact-inner">
        <p className="tutorials-exact-index">04 / TUTORIALS</p>
        <h2 className="tutorials-exact-heading">TUTORIALS</h2>
        <p className="tutorials-exact-description">Past production videos and tools from the AKA SOUNDS archive.</p>

        <p className="tutorials-exact-feature-label">FEATURED TUTORIAL</p>
        <a className="tutorials-exact-feature-thumbnail" href={featuredTutorial.video} target="_blank" rel="noreferrer">
          <img src={featuredTutorial.thumbnail} alt={featuredTutorial.title} />
        </a>
        <div className="tutorials-exact-feature-rule" aria-hidden="true" />
        <h3 className="tutorials-exact-feature-title">{featuredTutorial.title}</h3>
        <p className="tutorials-exact-feature-meta">SERUM&nbsp; / &nbsp;HARDSTYLE&nbsp; / &nbsp;RAWSTYLE</p>
        <a className="tutorials-exact-feature-action" href={featuredTutorial.video} target="_blank" rel="noreferrer">
          WATCH TUTORIAL →
        </a>

        <div className="tutorials-exact-archive" aria-label="Tutorial archive index">
          <p className="tutorials-exact-archive-label">ARCHIVE INDEX</p>
          {archiveTutorials.map((tutorial, index) => (
            <article className={`tutorials-exact-row tutorials-exact-row-${index + 1}`} key={tutorial.video}>
              <a className="tutorials-exact-row-thumbnail" href={tutorial.video} target="_blank" rel="noreferrer">
                <img src={tutorial.thumbnail} alt={tutorial.title} />
              </a>
              <a className="tutorials-exact-row-title" href={tutorial.video} target="_blank" rel="noreferrer">
                {tutorial.title}
              </a>
              <a className="tutorials-exact-row-action" href={tutorial.video} target="_blank" rel="noreferrer">
                WATCH TUTORIAL →
              </a>
            </article>
          ))}
        </div>

        <div className="tutorials-exact-footer-rule" aria-hidden="true" />
        <p className="tutorials-exact-footer-meta">WATCH&nbsp; / &nbsp;TUTORIAL ARCHIVE</p>
      </div>
    </section>
  );
}
