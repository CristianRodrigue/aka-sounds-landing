import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../src/index.css';

// Importa el logo directamente desde assets (Vite lo resuelve automáticamente)
import logoImg from '../src/assets/LOGO-AKA-SOUNDS-PNG.png';

const GlitchLogo = () => {
    const [glitches, setGlitches] = useState<{ clipTop: number; clipBottom: number; offset: number; hue: number }[]>([]);
    const [invert, setInvert] = useState(false);
    const [scale, setScale] = useState(1);
    const [glitchActive, setGlitchActive] = useState(false);

    // Generador de daño súper rápido (cada 50ms)
    useEffect(() => {
        const damageInterval = setInterval(() => {
            // 30% de probabilidad de que el logo se rompa agresivamente
            if (Math.random() > 0.7) {
                setGlitchActive(true);
                const newGlitches = Array.from({ length: Math.floor(Math.random() * 5) + 3 }).map(() => ({
                    clipTop: Math.random() * 100,
                    clipBottom: Math.random() * 100,
                    offset: (Math.random() - 0.5) * 50, // Pixeles de desplazamiento horizontal
                    hue: Math.random() * 360 // Cambio de color aleatorio para el RGB split
                }));
                setGlitches(newGlitches);

                // Invertir flash
                if (Math.random() > 0.5) setInvert(true);

                // Kick violento (escala)
                setScale(1 + Math.random() * 0.4);

                // Volver a la normalidad MUY rápido
                setTimeout(() => {
                    setGlitchActive(false);
                    setGlitches([]);
                    setInvert(false);
                    setScale(1);
                }, 50 + Math.random() * 100);
            }
        }, 40); // 40ms = 25 FPS de cálculos de ruido crudo

        return () => clearInterval(damageInterval);
    }, []);

    return (
        <div
            className={`relative w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden transition-colors duration-75 ${invert ? 'bg-white' : 'bg-black'}`}
            style={{ aspectRatio: '9/16', margin: '0 auto', maxWidth: '100%', maxHeight: '100%' }}
        >
            <div className="relative w-[80%] max-w-[400px] flex items-center justify-center">

                {/* Logo Original de Base (siempre allí, o reaccionando al scale) */}
                <img
                    src={logoImg}
                    alt="AKA SOUNDS"
                    className={`w-full object-contain transition-transform duration-75 ${invert ? 'invert' : ''}`}
                    style={{ transform: `scale(${scale})` }}
                />

                {/* Capas de Desgarramiento (Glitches) */}
                {glitchActive && glitches.map((g, i) => (
                    <img
                        key={i}
                        src={logoImg}
                        className={`absolute inset-0 w-full h-full object-contain ${invert ? 'invert' : ''} mix-blend-difference`}
                        style={{
                            // Corte horizontal usando clip-path
                            clipPath: `polygon(0 ${g.clipTop}%, 100% ${g.clipTop}%, 100% ${g.clipBottom}%, 0 ${g.clipBottom}%)`,
                            transform: `translateX(${g.offset}px) scale(${scale * 1.05})`,
                            filter: `hue-rotate(${g.hue}deg) saturate(3) drop-shadow(10px 0px 0px red) drop-shadow(-10px 0px 0px blue)`,
                            opacity: 0.8
                        }}
                    />
                ))}

                {/* Aberración Cromática Gigante Aleatoria */}
                {glitchActive && Math.random() > 0.5 && (
                    <>
                        <img src={logoImg} className={`absolute inset-0 w-full h-full object-contain mix-blend-screen opacity-50 ${invert ? 'invert' : ''}`} style={{ transform: `translateX(-20px) scale(${scale})`, filter: 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)' }} /> {/* Rojo */}
                        <img src={logoImg} className={`absolute inset-0 w-full h-full object-contain mix-blend-screen opacity-50 ${invert ? 'invert' : ''}`} style={{ transform: `translateX(20px) scale(${scale})`, filter: 'brightness(0) saturate(100%) invert(54%) sepia(93%) saturate(3023%) hue-rotate(167deg) brightness(101%) contrast(101%)' }} /> {/* Cyan */}
                    </>
                )}
            </div>

            {/* Textura de VHS / CCTV sucia */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40 mix-blend-overlay"></div>
            {invert && <div className="absolute inset-0 bg-white/10 backdrop-invert pointer-events-none mix-blend-difference"></div>}

            {/* Marca de agua estilo CCTV (Tiembla a veces) */}
            <div className={`absolute top-12 right-12 text-sm font-mono tracking-widest font-bold opacity-30 ${invert ? 'text-black' : 'text-white'} ${glitchActive ? 'translate-x-2' : ''}`}>
                REC {new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" })}
            </div>
            <div className={`absolute bottom-12 left-12 text-xs font-mono tracking-[0.4em] opacity-30 ${invert ? 'text-black' : 'text-white'} ${glitchActive ? '-translate-y-2' : ''}`}>
                SYS.FAIL.CRITICAL
            </div>
        </div>
    );
};

const root = createRoot(document.getElementById('root')!);
root.render(<GlitchLogo />);
