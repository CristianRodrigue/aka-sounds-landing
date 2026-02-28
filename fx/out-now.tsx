import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../src/index.css';

const scenes = [
    "OUT\nNOW",
    "HARDTECHNO\nESSENTIALS\nVOL. 1",
    "IN MY\nPAGE"
];

const OutNowAnimation = () => {
    const [invert, setInvert] = useState(false);
    const [sceneIndex, setSceneIndex] = useState(0);

    // Efecto Glitch Constante
    useEffect(() => {
        const flickerInterval = setInterval(() => {
            if (Math.random() > 0.6) {
                setInvert(true);
                setTimeout(() => setInvert(false), 30 + Math.random() * 150);
            }
        }, 80);

        return () => clearInterval(flickerInterval);
    }, []);

    // Cambio de escenas cada 2.5 segundos
    useEffect(() => {
        const sceneInterval = setInterval(() => {
            setSceneIndex((prev) => (prev + 1) % scenes.length);
        }, 2500);

        return () => clearInterval(sceneInterval);
    }, []);

    return (
        <div
            className={`relative w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden transition-colors duration-75 ${invert ? 'bg-white text-black' : 'bg-black text-white'}`}
            style={{ aspectRatio: '9/16', margin: '0 auto', maxWidth: '100%', maxHeight: '100%' }}
        >
            <div className="flex flex-col items-center justify-center w-full h-full relative z-10 px-4 md:px-8">
                <h1
                    // Usa un tamaño más grande para textos cortos, un poco más pequeño para el nombre del pack
                    className={`${sceneIndex === 1 ? 'text-[4.5rem] md:text-[6rem]' : 'text-[7rem] md:text-[10rem]'} font-display font-black leading-[0.85] uppercase tracking-tighter text-center mix-blend-difference whitespace-pre-line transition-all duration-300`}
                    style={{
                        transform: `scale(1, ${invert ? 1.2 : 1}) skew(${invert ? -8 : 0}deg)`,
                        filter: invert ? 'drop-shadow(15px 0px 0px red) drop-shadow(-15px 0px 0px cyan)' : 'none',
                        wordBreak: 'break-word'
                    }}
                >
                    {scenes[sceneIndex]}
                </h1>

                <div className="absolute bottom-24 opacity-60 text-xl font-bold tracking-[0.3em] font-mono px-6 py-2 border-y border-current mt-8">
                    AKA SOUNDS
                </div>

                {invert && <div className="absolute inset-0 bg-white/20 backdrop-invert pointer-events-none mix-blend-overlay"></div>}

                {/* Subtle scanline effect */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>
            </div>
        </div>
    );
};

const root = createRoot(document.getElementById('root')!);
root.render(<OutNowAnimation />);
