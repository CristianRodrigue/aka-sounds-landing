import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import htEssentialsImg from '../assets/HARDTECHNO-ESSENTIALS-VOL.-1.jpg';

export interface Track {
    id: number;
    name: string;
    type: string;
    duration: string;
    url: string;
}

interface AudioPlayerProps {
    tracks?: Track[];
}

export default function AudioPlayer({ tracks = [] }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState('0:00');
    const [isMuted, setIsMuted] = useState(false);

    const currentTrack = tracks[currentTrackIndex];

    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play().catch(() => setIsPlaying(false));
        }
    }, [currentTrackIndex]);

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const handleNext = () => {
        if (currentTrackIndex < tracks.length - 1) {
            setCurrentTrackIndex(prev => prev + 1);
        } else {
            setCurrentTrackIndex(0); // loop back
        }
    };

    const handlePrev = () => {
        if (currentTrackIndex > 0) {
            setCurrentTrackIndex(prev => prev - 1);
        } else {
            setCurrentTrackIndex(tracks.length - 1); // loop to end
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const dur = audioRef.current.duration;
            if (dur > 0) {
                setProgress((current / dur) * 100);
            }

            // Format time
            const mins = Math.floor(current / 60);
            const secs = Math.floor(current % 60);
            setCurrentTime(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            const newTime = (Number(e.target.value) / 100) * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
            setProgress(Number(e.target.value));
        }
    };

    const handleTrackEnded = () => {
        handleNext();
    };

    if (!tracks || tracks.length === 0) return null;

    return (
        <div className="w-full bg-zinc-100 rounded-3xl p-6 shadow-xl relative mt-16 mb-16">
            <h2 className="text-center text-xs font-bold tracking-[0.2em] uppercase text-black/40 mb-2">THE NEXT GENERATION OF HARD TECHNO SOUND DESIGN</h2>
            <h3 className="text-center text-3xl font-display font-black text-black tracking-tight mb-8">THE NEXT GENERATION OF HARD TECHNO<br />SOUND DESIGN</h3>

            {/* Top Player Section */}
            <div className="bg-zinc-200/50 rounded-2xl p-4 flex flex-col md:flex-row gap-6 mb-4 items-center border border-zinc-300">
                {/* Album Art */}
                <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden shadow-md">
                    <img src={htEssentialsImg} alt="Album Art" className="w-full h-full object-cover" />
                </div>

                {/* Controls & Progress */}
                <div className="flex-1 w-full flex flex-col justify-between">
                    <div className="mb-4">
                        <div className="font-bold text-black text-lg">{currentTrack.name}</div>
                        <div className="text-xs text-black/50 font-medium">{currentTrack.type}</div>
                    </div>

                    <div className="flex flex-col gap-2">
                        {/* Progress Bar Container */}
                        <div className="flex items-center gap-3 w-full">
                            <span className="text-[10px] font-bold text-black/50 w-8">{currentTime}</span>
                            <div className="flex-1 relative flex items-center h-4 group">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={progress || 0}
                                    onChange={handleSeek}
                                    className="absolute w-full h-1 z-20 opacity-0 cursor-pointer"
                                />
                                <div className="w-full h-1 bg-zinc-300 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-black rounded-full pointer-events-none"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-black/50 w-8 text-right">{currentTrack.duration}</span>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button onClick={handlePrev} className="text-black/60 hover:text-black transition-colors">
                                    <SkipBack size={18} fill="currentColor" />
                                </button>
                                <button onClick={handlePlayPause} className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full hover:scale-105 active:scale-95 transition-all shadow-md">
                                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                                </button>
                                <button onClick={handleNext} className="text-black/60 hover:text-black transition-colors">
                                    <SkipForward size={18} fill="currentColor" />
                                </button>
                            </div>

                            <button onClick={toggleMute} className="text-black/50 hover:text-black transition-colors">
                                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Playlist */}
            <div className="bg-zinc-200/30 rounded-2xl overflow-hidden border border-zinc-300 max-h-[300px] overflow-y-auto custom-scrollbar">
                {tracks.map((track, i) => (
                    <div
                        key={track.id}
                        onClick={() => {
                            setCurrentTrackIndex(i);
                            setIsPlaying(true);
                        }}
                        className={`group flex items-center justify-between p-3 border-b border-zinc-200 cursor-pointer transition-colors ${i === currentTrackIndex ? 'bg-black/5' : 'hover:bg-zinc-200/50'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-300 relative flex-shrink-0 shadow-sm border border-zinc-200">
                                <img src={htEssentialsImg} alt="Thumbnail" className="w-full h-full object-cover" />
                                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center ${i === currentTrackIndex ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                                    {i === currentTrackIndex && isPlaying ? (
                                        <Pause size={14} className="text-white" fill="currentColor" />
                                    ) : (
                                        <Play size={14} className="text-white ml-0.5" fill="currentColor" />
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className={`font-bold text-sm ${i === currentTrackIndex ? 'text-black' : 'text-black/80'}`}>{track.name}</div>
                                <div className="text-[10px] font-medium text-black/50">{track.type}</div>
                            </div>
                        </div>
                        <div className="text-xs font-bold text-black/40 px-4">
                            {track.duration}
                        </div>
                    </div>
                ))}
            </div>

            {/* Hidden Audio Element */}
            <audio
                ref={audioRef}
                src={currentTrack?.url}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleTrackEnded}
            />
        </div>
    );
}
