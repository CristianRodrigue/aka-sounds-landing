"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MotionOrchestrator } from "./motion-orchestrator";

type Language = "en" | "es";

const content = {
  en: {
    nav: { back: "BACK TO AKA SOUNDS" },
    hero: { sub: "THE PRODUCER", genres: "MAIN GENRE: HARD DANCE", subgenres: "XTRA RAW / RAWSTYLE / HARDTECHNO" },
    journey: {
      title: "OUR JOURNEY",
      items: [
        { year: "2015", title: "THE INCEPTION", desc: "Started producing EDM under the alias MFB5. It began as a hobby, learning empirically by replicating tutorials and tracks, gradually evolving into more complex structures and compositions." },
        { year: "2016-2019", title: "ANALOG ERA", desc: "Stepped away from production to embrace the live stage, playing electric guitar, bass, and drums. Explored various genres, shifting from melodic sounds to raw aggression." },
        { year: "2019-2023", title: "PUNK BEATDOWN", desc: "Formed a Hardcore Punk Beatdown band. Spent 4 years writing, playing, and living the relentless energy of the punk scene." },
        { year: "2024", title: "DEAT AKA INITIATED", desc: "Originally an experiment in heavy electronic music, it quickly turned into a serious endeavor. Took advanced Hardstyle production masterclasses with Neroz Productions, mastering powerful kicks and complex composition. Found the true calling: Hard Dance and massive electronic music designed strictly for festival arenas." },
        { year: "PRESENT", title: "AKA SOUNDS", desc: "AKA SOUNDS expands into the full DEAT AKA universe: hard electronic music, visual releases, sonic experiments, and selected tools from the archive." },
      ],
    },
    music: { title: "TOP TRACKS", listenOn: "Listen on" },
    footer: { follow: "Follow DEAT AKA" },
  },
  es: {
    nav: { back: "VOLVER A AKA SOUNDS" },
    hero: { sub: "EL PRODUCTOR", genres: "GÉNERO PRINCIPAL: HARD DANCE", subgenres: "XTRA RAW / RAWSTYLE / HARDTECHNO" },
    journey: {
      title: "NUESTRA HISTORIA",
      items: [
        { year: "2015", title: "EL INICIO", desc: "Inicios en la producción de EDM con el proyecto MFB5. Empezó como un hobbie empírico, imitando tutoriales y canciones, creando poco a poco estructuras más complejas." },
        { year: "2016-2019", title: "ERA ANALÓGICA", desc: "Alejamiento de la producción para vivir la etapa artística en vivo tocando guitarra eléctrica, bajo y batería. Transición de géneros melódicos hacia lo más agresivo." },
        { year: "2019-2023", title: "PUNK BEATDOWN", desc: "Fundación de una banda de Hardcore Punk Beatdown. 4 años inmerso en la energía pura y la brutalidad de la escena punk." },
        { year: "2024", title: "DEAT AKA INICIADO", desc: "Inició como experimento de música fuerte y se convirtió en un proyecto serio. Clases avanzadas de producción Hardstyle con Neroz Productions, aprendiendo secretos y creación de kicks potentes. El sonido definitivo: Hard Dance y electrónica pesada masiva diseñada para festivales." },
        { year: "PRESENTE", title: "AKA SOUNDS", desc: "AKA SOUNDS se expande hacia el universo completo de DEAT AKA: música electrónica pesada, visuales, experimentos sonoros y herramientas seleccionadas del archivo." },
      ],
    },
    music: { title: "MEJORES TRACKS", listenOn: "Escuchar en" },
    footer: { follow: "Sigue a DEAT AKA" },
  },
} as const;

const tracks = [
  { id: "x_x", title: "x_x", spotify: "https://open.spotify.com/track/7tX0EwJoe1Gn05NhTQurJT?si=81a798e7d878438f", soundcloud: "https://soundcloud.com/deat_aka/x_x?si=4655cc42245b40d6a1bd6bff2d09b50c&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing", image: "https://i1.sndcdn.com/artworks-IIR9V8y2uy2XyFyF-U8pTmw-t500x500.jpg" },
  { id: "baddie-girls", title: "Baddie Girls", spotify: "https://open.spotify.com/track/0EwV2SfUNfKBNV0apCUZYy?si=3201186ee65b4e5f", soundcloud: "https://soundcloud.com/deat_aka/baddie-girls?si=caac0d95e1634fe3ae44fc0a660c8ad9&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing", image: "https://i1.sndcdn.com/artworks-XEoOF6UALyGwcVut-R2ikvg-t500x500.jpg" },
  { id: "5", title: "init", spotify: "https://open.spotify.com/intl-es/track/1zwJidnmvDWecYlAoq3uEP?si=ad89509d1b31460f", soundcloud: "https://soundcloud.com/deat_aka/init?si=53593b94ba0c471a956ef171dcc22f87&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing", image: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0265fbbfe7c6e45cdabd70af52" },
  { id: "1", title: "This is a... F#cking Hardtechno", spotify: "https://open.spotify.com/intl-es/track/1E52eF1SJPK3V8ymlRjd0h?si=53f27089d6ef427a", soundcloud: "https://soundcloud.com/deat_aka/this-is-a-f-cking-hardtechno?si=b527ad7408e94e1080c7255a85fe481f", image: "https://i1.sndcdn.com/artworks-b9qwKc4HmfNg8L3q-AI5djg-t500x500.png" },
  { id: "2", title: "XXL", spotify: "https://open.spotify.com/intl-es/track/7pk7aN6he0398VsGEhzGXj?si=3e99d0573a75458f", soundcloud: "https://soundcloud.com/deat_aka/xxl?si=db830f33c4834ab79d76572185af2c01", image: "https://i1.sndcdn.com/artworks-e3LsFmJb8ojve70X-LDdTBQ-t500x500.png" },
  { id: "3", title: "I Want To Leave", spotify: "https://open.spotify.com/intl-es/track/1BeQHxwK0xpvm5wbTY4pfU?si=6a93ad07d0a94d8d", soundcloud: "https://soundcloud.com/deat_aka/i-want-to-leave?si=75e38f8496284327952ed7518bb55736", image: "https://i1.sndcdn.com/artworks-SCBGBUd6KaPTbNdD-Agmsuw-t500x500.jpg" },
  { id: "4", title: "Мама Приют", spotify: "https://open.spotify.com/intl-es/track/3tSPiAkKoTb4kU2VJjmDd0?si=2cf049e09752465e", soundcloud: null, image: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02a7d2868ea5ecd32bd796f098" },
] as const;

function SocialIcon({ kind }: { kind: "spotify" | "soundcloud" | "instagram" }) {
  if (kind === "spotify") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.62 14.4c-.16.27-.52.36-.78.2-.84-.53-1.88-.8-2.92-.8-1.57 0-3.15.54-4.23 1.25-.28.18-.63.1-.81-.18-.18-.28-.1-.63.18-.81 1.25-.8 3.03-1.42 4.86-1.42 1.2 0 2.4.32 3.4.95.28.15.37.52.2.8zM17.4 14c-.2.33-.65.45-1 .25-1-.62-2.3-1-3.6-1-1.76 0-3.5.6-4.9 1.45-.35.2-.8.1-1-.25-.2-.35-.1-.8.25-1 1.6-1 3.55-1.7 5.65-1.7 1.5 0 2.95.45 4.1 1.15.36.2.47.65.25 1zm.14-2.58c-1.25-.78-2.9-1.25-4.64-1.25-2.07 0-4.05.68-5.7 1.7-.42.26-.96.14-1.22-.26-.26-.4-.14-.96.26-1.22 1.83-1.12 4.02-1.88 6.36-1.88 1.95 0 3.8.53 5.25 1.42.4.24.53.78.27 1.2-.24.4-.78.53-1.2.27z" /></svg>;
  }
  if (kind === "soundcloud") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1 12h2v6H1zm4-3h2v9H5zm4-2h2v11H9zm4-1h2v12h-2zm4 2h2v10h-2zm4 3h2v7h-2z" /></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><path d="M17.5 6.5h.01" /></svg>;
}

function SocialLinks() {
  return (
    <div className="deat-profile-social-links">
      <a href="https://open.spotify.com/intl-es/artist/2J50ThxDETbxoqoT4KP9bU" target="_blank" rel="noopener noreferrer" aria-label="DEAT AKA on Spotify"><SocialIcon kind="spotify" /></a>
      <a href="https://soundcloud.com/deat_aka" target="_blank" rel="noopener noreferrer" aria-label="DEAT AKA on SoundCloud"><SocialIcon kind="soundcloud" /></a>
      <a href="https://instagram.com/deat_aka" target="_blank" rel="noopener noreferrer" aria-label="DEAT AKA on Instagram"><SocialIcon kind="instagram" /></a>
    </div>
  );
}

export function DeatAkaProfile() {
  const [lang, setLang] = useState<Language>("en");
  const portraitRef = useRef<HTMLImageElement>(null);
  const t = content[lang];

  useEffect(() => {
    window.scrollTo(0, 0);
    const portrait = portraitRef.current;
    if (!portrait) return;
    const onScroll = () => {
      portrait.style.transform = `translate3d(0, ${Math.min(window.scrollY * 0.08, 150)}px, 0)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="deat-profile">
      <MotionOrchestrator reversible />
      <header className="deat-profile-header" data-motion-reveal data-motion-delay="0">
        <Link href="/" className="deat-profile-back"><span aria-hidden="true">←</span>{t.nav.back}</Link>
        <div className="deat-profile-language" aria-label="Language selector">
          <button type="button" onClick={() => setLang("en")} className={lang === "en" ? "is-active" : ""}>EN</button>
          <span>/</span>
          <button type="button" onClick={() => setLang("es")} className={lang === "es" ? "is-active" : ""}>ES</button>
        </div>
      </header>

      <section className="deat-profile-hero">
        <div className="deat-profile-portrait-wrap motion-scale-in" data-motion-reveal data-motion-delay="90">
          <img ref={portraitRef} src="/assets/deat_portrait.png" alt="DEAT AKA" className="deat-profile-portrait" />
        </div>
        <div className="deat-profile-hero-copy" data-motion-reveal data-motion-delay="140">
          <h1>KNOW<br />DEAT AKA</h1>
          <p className="deat-profile-sub">{t.hero.sub}</p>
          <div className="deat-profile-genre-block">
            <span>{t.hero.genres}</span>
            <small>{t.hero.subgenres}</small>
          </div>
          <SocialLinks />
        </div>
      </section>

      <section className="deat-profile-music">
        <div className="deat-profile-section-heading" data-motion-reveal data-motion-delay="0"><h2>{t.music.title}</h2></div>
        <div className="deat-profile-track-grid">
          {tracks.map((track, index) => (
            <article key={track.id} className="deat-profile-track-card" data-motion-reveal data-motion-delay={String(index * 70 + 120)}>
              <div className="deat-profile-track-artwork"><img src={track.image} alt={`${track.title} artwork`} loading="lazy" /><span className="deat-profile-track-play" aria-hidden="true">▶</span></div>
              <h3>{track.title}</h3>
              <p>{t.music.listenOn}:</p>
              <div className="deat-profile-track-links">
                <a href={track.spotify} target="_blank" rel="noopener noreferrer">Spotify</a>
                {track.soundcloud ? <a href={track.soundcloud} target="_blank" rel="noopener noreferrer">SoundCloud</a> : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="deat-profile-journey">
        <h2 data-motion-reveal data-motion-delay="0">{t.journey.title}</h2>
        <div className="deat-profile-journey-list">
          {t.journey.items.map((item, index) => (
            <article key={item.year} className="deat-profile-journey-item" data-motion-reveal data-motion-delay={String(index * 90 + 90)}>
              <div className="deat-profile-journey-year" aria-hidden="true">{item.year}</div>
              <div className="deat-profile-journey-copy"><div>{item.year} <span>—</span> {item.title}</div><p>{item.desc}</p></div>
            </article>
          ))}
        </div>
      </section>

      <footer className="deat-profile-footer">
        <div data-motion-reveal data-motion-delay="0"><SocialLinks /></div>
        <p data-motion-reveal data-motion-delay="90">{t.footer.follow}</p>
        <Link href="/" data-motion-reveal data-motion-delay="160">{t.nav.back}</Link>
      </footer>
    </main>
  );
}
