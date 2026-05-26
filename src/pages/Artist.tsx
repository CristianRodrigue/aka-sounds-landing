import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowLeft, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

import deatPortrait from '../assets/deat_portrait.png';
import picsartImage from '../assets/Picsart_26-03-01_20-54-57-417.jpg.jpeg';

// --- BILINGUAL CONTENT DICTIONARY ---
const content = {
    en: {
        nav: { back: "BACK TO AKA SOUNDS" },
        hero: { 
            sub: "THE PRODUCER",
            genres: "MAIN GENRE: HARD DANCE",
            subgenres: "XTRA RAW / RAWSTYLE / HARDTECHNO"
        },
        journey: {
            title: "OUR JOURNEY",
            items: [
                { year: "2015", title: "THE INCEPTION", desc: "Started producing EDM under the alias MFB5. It began as a hobby, learning empirically by replicating tutorials and tracks, gradually evolving into more complex structures and compositions." },
                { year: "2016-2019", title: "ANALOG ERA", desc: "Stepped away from production to embrace the live stage, playing electric guitar, bass, and drums. Explored various genres, shifting from melodic sounds to raw aggression." },
                { year: "2019-2023", title: "PUNK BEATDOWN", desc: "Formed a Hardcore Punk Beatdown band. Spent 4 years writing, playing, and living the relentless energy of the punk scene." },
                { year: "2024", title: "DEAT AKA INITIATED", desc: "Originally an experiment in heavy electronic music, it quickly turned into a serious endeavor. Took advanced Hardstyle production masterclasses with Neroz Productions, mastering powerful kicks and complex composition. Found the true calling: Hard Dance and massive electronic music designed strictly for festival arenas." },
                { year: "PRESENT", title: "AKA SOUNDS", desc: "AKA SOUNDS expands into the full DEAT AKA universe: hard electronic music, visual releases, sonic experiments, and selected tools from the archive." }
            ]
        },
        music: { title: "TOP TRACKS", listenOn: "Listen on" },
        footer: { follow: "Follow DEAT AKA" }
    },
    es: {
        nav: { back: "VOLVER A AKA SOUNDS" },
        hero: { 
            sub: "EL PRODUCTOR",
            genres: "GÉNERO PRINCIPAL: HARD DANCE",
            subgenres: "XTRA RAW / RAWSTYLE / HARDTECHNO"
        },
        journey: {
            title: "NUESTRA HISTORIA",
            items: [
                { year: "2015", title: "EL INICIO", desc: "Inicios en la producción de EDM con el proyecto MFB5. Empezó como un hobbie empírico, imitando tutoriales y canciones, creando poco a poco estructuras más complejas." },
                { year: "2016-2019", title: "ERA ANALÓGICA", desc: "Alejamiento de la producción para vivir la etapa artística en vivo tocando guitarra eléctrica, bajo y batería. Transición de géneros melódicos hacia lo más agresivo." },
                { year: "2019-2023", title: "PUNK BEATDOWN", desc: "Fundación de una banda de Hardcore Punk Beatdown. 4 años inmerso en la energía pura y la brutalidad de la escena punk." },
                { year: "2024", title: "DEAT AKA INICIADO", desc: "Inició como experimento de música fuerte y se convirtió en un proyecto serio. Clases avanzadas de producción Hardstyle con Neroz Productions, aprendiendo secretos y creación de kicks potentes. El sonido definitivo: Hard Dance y electrónica pesada masiva diseñada para festivales." },
                { year: "PRESENTE", title: "AKA SOUNDS", desc: "AKA SOUNDS se expande hacia el universo completo de DEAT AKA: música electrónica pesada, visuales, experimentos sonoros y herramientas seleccionadas del archivo." }
            ]
        },
        music: { title: "MEJORES TRACKS", listenOn: "Escuchar en" },
        footer: { follow: "Sigue a DEAT AKA" }
    }
};

const tracks = [
    {
        id: '1', 
        title: 'This is a... F#cking Hardtechno',
        spotify: 'https://open.spotify.com/intl-es/track/1E52eF1SJPK3V8ymlRjd0h?si=53f27089d6ef427a',
        soundcloud: 'https://soundcloud.com/deat_aka/this-is-a-f-cking-hardtechno?si=b527ad7408e94e1080c7255a85fe481f',
        youtube: '#',
        image: 'https://i1.sndcdn.com/artworks-b9qwKc4HmfNg8L3q-AI5djg-t500x500.png'
    },
    {
        id: '2', 
        title: 'XXL',
        spotify: 'https://open.spotify.com/intl-es/track/7pk7aN6he0398VsGEhzGXj?si=3e99d0573a75458f',
        soundcloud: 'https://soundcloud.com/deat_aka/xxl?si=db830f33c4834ab79d76572185af2c01',
        youtube: '#',
        image: 'https://i1.sndcdn.com/artworks-e3LsFmJb8ojve70X-LDdTBQ-t500x500.png'
    },
    {
        id: '3', 
        title: 'I Want To Leave',
        spotify: 'https://open.spotify.com/intl-es/track/1BeQHxwK0xpvm5wbTY4pfU?si=6a93ad07d0a94d8d',
        soundcloud: 'https://soundcloud.com/deat_aka/i-want-to-leave?si=75e38f8496284327952ed7518bb55736', 
        youtube: '#',
        image: 'https://i1.sndcdn.com/artworks-SCBGBUd6KaPTbNdD-Agmsuw-t500x500.jpg'
    },
    {
        id: '4', 
        title: 'Мама Приют',
        spotify: 'https://open.spotify.com/intl-es/track/3tSPiAkKoTb4kU2VJjmDd0?si=2cf049e09752465e',
        soundcloud: null, 
        youtube: '#',
        image: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02a7d2868ea5ecd32bd796f098'
    }
];

export default function Artist() {
    const { scrollYProgress } = useScroll();
    const yParallax = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const [lang, setLang] = useState<'en'|'es'>('en');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const t = content[lang];

    return (
        <div className="bg-white text-[#111111] font-sans min-h-screen selection:bg-[#111111] selection:text-white">
            
            {/* MINIMAL HEADER */}
            <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference text-white">
                <Link to="/" className="text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase hover:opacity-50 transition-opacity flex items-center gap-3">
                    <ArrowLeft size={16} /> {t.nav.back}
                </Link>
                <div className="flex gap-4 text-xs font-bold tracking-[0.2em]">
                    <button onClick={() => setLang('en')} className={`${lang === 'en' ? 'opacity-100 underline decoration-2 underline-offset-8' : 'opacity-40 hover:opacity-100'} transition-all`}>EN</button>
                    <span className="opacity-40">/</span>
                    <button onClick={() => setLang('es')} className={`${lang === 'es' ? 'opacity-100 underline decoration-2 underline-offset-8' : 'opacity-40 hover:opacity-100'} transition-all`}>ES</button>
                </div>
            </header>

            {/* HERO SECTION - JUUN.J STYLE */}
            <section className="relative min-h-screen flex flex-col items-center justify-center p-6 pt-32 overflow-hidden">
                <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full max-w-md md:max-w-xl aspect-[3/4] overflow-hidden bg-zinc-200 mb-16 relative"
                    >
                        {/* High fashion editorial portrait style: Grayscale, high contrast */}
                        <motion.img 
                            style={{ y: yParallax }}
                            src={deatPortrait} 
                            alt="DEAT AKA" 
                            className="w-full h-[120%] object-cover object-top grayscale contrast-125"
                        />
                    </motion.div>

                    <div className="text-center w-full">
                        <motion.h1 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-[14vw] sm:text-[11vw] leading-[0.8] font-display font-black tracking-tighter uppercase whitespace-pre-line"
                        >
                            {`KNOW\nDEAT AKA`}
                        </motion.h1>
                        <motion.p 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="mt-12 text-xs md:text-sm font-bold tracking-[0.4em] uppercase opacity-40 mb-12"
                        >
                            {t.hero.sub}
                        </motion.p>

                        {/* Genres and Socials (Hero) */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-col items-center gap-6"
                        >
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase bg-black text-white px-4 py-2">
                                    {t.hero.genres}
                                </span>
                                <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase opacity-60">
                                    {t.hero.subgenres}
                                </span>
                            </div>

                            <div className="flex gap-8 mt-6 opacity-40 hover:opacity-100 transition-opacity duration-500 text-[#111111]">
                                 <a href="https://open.spotify.com/intl-es/artist/2J50ThxDETbxoqoT4KP9bU" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors scale-125">
                                     <span className="sr-only">Spotify</span>
                                     <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.62 14.4c-.16.27-.52.36-.78.2-.84-.53-1.88-.8-2.92-.8-1.57 0-3.15.54-4.23 1.25-.28.18-.63.1-.81-.18-.18-.28-.1-.63.18-.81 1.25-.8 3.03-1.42 4.86-1.42 1.2 0 2.4.32 3.4.95.28.15.37.52.2.8zM17.4 14c-.2.33-.65.45-1 .25-1-.62-2.3-1-3.6-1-1.76 0-3.5.6-4.9 1.45-.35.2-.8.1-1-.25-.2-.35-.1-.8.25-1 1.6-1 3.55-1.7 5.65-1.7 1.5 0 2.95.45 4.1 1.15.36.2.47.65.25 1zm.14-2.58c-1.25-.78-2.9-1.25-4.64-1.25-2.07 0-4.05.68-5.7 1.7-.42.26-.96.14-1.22-.26-.26-.4-.14-.96.26-1.22 1.83-1.12 4.02-1.88 6.36-1.88 1.95 0 3.8.53 5.25 1.42.4.24.53.78.27 1.2-.24.4-.78.53-1.2.27z"/></svg>
                                 </a>
                                 <a href="https://soundcloud.com/deat_aka" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors scale-125">
                                     <span className="sr-only">SoundCloud</span>
                                     <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12h2v6H1zm4-3h2v9H5zm4-2h2v11H9zm4-1h2v12h-2zm4 2h2v10h-2zm4 3h2v7h-2z"/></svg>
                                 </a>
                                 <a href="https://instagram.com/deat_aka" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors scale-125">
                                     <span className="sr-only">Instagram</span>
                                     <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                 </a>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </section>

            {/* MUSIC PLAYER SECTION - THE ARSENAL */}
            <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col border-b border-[#111111]/20 pb-8 mb-20">
                    <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter uppercase">
                        {t.music.title}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {tracks.map((track, i) => (
                        <div key={track.id} className="group relative flex flex-col">
                            <div className="w-full aspect-square bg-zinc-100 mb-8 flex justify-center items-center overflow-hidden relative transition-all duration-700">
                                <img src={track.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Play fill="currentColor" size={24} className="ml-1" />
                                </div>
                            </div>
                            
                            <h3 className="text-lg md:text-xl font-display font-black tracking-tight mb-6 uppercase line-clamp-2 min-h-[56px]">{track.title}</h3>
                            
                            <div className="mt-auto">
                                <p className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-4">{t.music.listenOn}:</p>
                                <div className="flex flex-col gap-2">
                                    <a href={track.spotify} target="_blank" rel="noopener noreferrer" className="text-[10px] md:text-xs font-bold px-6 py-3 text-center border border-[#111111]/20 hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-colors uppercase tracking-widest w-full">Spotify</a>
                                    {track.soundcloud && (
                                        <a href={track.soundcloud} target="_blank" rel="noopener noreferrer" className="text-[10px] md:text-xs font-bold px-6 py-3 text-center border border-[#111111]/20 hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-colors uppercase tracking-widest w-full">SoundCloud</a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* TIMELINE SECTION - THE MANIFESTO */}
            <section className="py-32 px-6 md:px-12 max-w-4xl mx-auto relative z-10">
                <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter uppercase text-center mb-32">
                    {t.journey.title}
                </h2>

                <div className="space-y-32">
                    {t.journey.items.map((item, i) => (
                        <div key={i} className={`relative flex flex-col md:flex-row items-start justify-between md:odd:flex-row-reverse group`}>
                            {/* Graphic Year Background */}
                            <div className="text-[80px] md:text-[120px] font-display font-black tracking-tighter leading-none text-[#111111]/5 mb-6 md:mb-0 md:w-1/2 md:text-center select-none">
                                {item.year}
                            </div>

                            {/* Content */}
                            <div className={`md:w-1/2 md:px-12 flex flex-col justify-center`}>
                                <div className="text-sm font-bold tracking-[0.2em] uppercase mb-6 text-[#111111]/40">
                                    {item.year} <span className="mx-2">—</span> {item.title}
                                </div>
                                <p className="text-base md:text-lg font-medium leading-relaxed opacity-80">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FOOTER & SOCIALS */}
            <footer className="py-24 mt-20 flex flex-col items-center justify-center relative z-10 border-t border-[#111111]/10">

                {/* Social Icons using SVGs (Footer) */}
                <div className="flex gap-8 mb-20 opacity-40 hover:opacity-100 transition-opacity duration-500 text-[#111111]">
                     <a href="https://open.spotify.com/intl-es/artist/2J50ThxDETbxoqoT4KP9bU" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors scale-125">
                         <span className="sr-only">Spotify</span>
                         <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.62 14.4c-.16.27-.52.36-.78.2-.84-.53-1.88-.8-2.92-.8-1.57 0-3.15.54-4.23 1.25-.28.18-.63.1-.81-.18-.18-.28-.1-.63.18-.81 1.25-.8 3.03-1.42 4.86-1.42 1.2 0 2.4.32 3.4.95.28.15.37.52.2.8zM17.4 14c-.2.33-.65.45-1 .25-1-.62-2.3-1-3.6-1-1.76 0-3.5.6-4.9 1.45-.35.2-.8.1-1-.25-.2-.35-.1-.8.25-1 1.6-1 3.55-1.7 5.65-1.7 1.5 0 2.95.45 4.1 1.15.36.2.47.65.25 1zm.14-2.58c-1.25-.78-2.9-1.25-4.64-1.25-2.07 0-4.05.68-5.7 1.7-.42.26-.96.14-1.22-.26-.26-.4-.14-.96.26-1.22 1.83-1.12 4.02-1.88 6.36-1.88 1.95 0 3.8.53 5.25 1.42.4.24.53.78.27 1.2-.24.4-.78.53-1.2.27z"/></svg>
                     </a>
                     <a href="https://soundcloud.com/deat_aka" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors scale-125">
                         <span className="sr-only">SoundCloud</span>
                         <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12h2v6H1zm4-3h2v9H5zm4-2h2v11H9zm4-1h2v12h-2zm4 2h2v10h-2zm4 3h2v7h-2z"/></svg>

                     </a>
                     <a href="https://instagram.com/deat_aka" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors scale-125">
                         <span className="sr-only">Instagram</span>
                         <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                     </a>
                </div>
                
                <Link to="/" className="text-xs font-bold tracking-[0.2em] uppercase border-b border-[#111111]/20 pb-1 hover:border-[#111111] transition-colors">
                    {t.nav.back}
                </Link>
            </footer>
        </div>
    );
}
