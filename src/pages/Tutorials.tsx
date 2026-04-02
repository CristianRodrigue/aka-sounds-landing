import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';

interface Tutorial {
    id: string;
    title: string;
    description: string;
    youtubeId: string;
}

export const tutorials: Tutorial[] = [
    {
        id: '4',
        title: 'Hardtechno Kick - Serum Tutorial',
        description: 'Learn how to synthesize a devastating Hardtechno Kick entirely within Xfer Serum.',
        youtubeId: '5bXTQvDmJY4'
    },
    {
        id: '3',
        title: 'Zaag Kick - Serum Tutorial',
        description: 'Learn how to synthesize a devastating Zaag Kick entirely within Xfer Serum.',
        youtubeId: 'F8pNBXN6XH0'
    },
    {
        id: '2',
        title: 'Industrial Techno Synths - Free Tutorial',
        description: 'Discover the secrets to crafting massive, stadium-shaking industrial synths and textures.',
        youtubeId: 'U2fTh4phhEM'
    },
    {
        id: '1',
        title: 'Reverse Bass Kick - Serum Tutorial',
        description: 'Learn how to synthesize a devastating Reverse Bass Kick entirely within Xfer Serum.',
        youtubeId: 'KCUqnmGBiF0'
    }
];

export default function Tutorials() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 relative">
            {/* Background elements */}
            <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16 relative">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-6 mx-auto">
                        <Play size={28} className="text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white mb-4 uppercase">
                        Masterclasses
                    </h1>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto">
                        Level up your production with our free YouTube tutorials. Watch the techniques and grab the free sample packs.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {tutorials.map((tutorial, index) => (
                        <motion.div
                            key={tutorial.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden flex flex-col hover:border-white/20 transition-all duration-300 group"
                        >
                            {/* YouTube Embed Container */}
                            <div className="relative w-full aspect-video bg-black">
                                <iframe 
                                    className="absolute top-0 left-0 w-full h-full"
                                    src={`https://www.youtube.com/embed/${tutorial.youtubeId}?rel=0`} 
                                    title={tutorial.title} 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                    allowFullScreen
                                ></iframe>
                            </div>

                            <div className="p-8 flex flex-col flex-1">
                                <h3 className="text-2xl font-display font-bold text-white mb-3">
                                    {tutorial.title}
                                </h3>
                                <p className="text-white/60 text-sm mb-6">
                                    {tutorial.description}
                                </p>

                                <div className="mt-auto">
                                    <a 
                                        href="#/free-trial" 
                                        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
                                    >
                                        Get the Free Pack →
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
