import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Send } from 'lucide-react';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) return;

        setStatus('loading');

        const formUrl = "https://script.google.com/macros/s/AKfycbxBsljsf32rB9fkdAytjXWeQJpWa4T45t7beTlzGLqAstYNBSMAnnhgmdLlftqa69nu/exec";

        const data = new URLSearchParams();
        data.append("nombre", name.trim() || "Productor Anónimo");
        data.append("email", email.trim());

        try {
            // mode: 'no-cors' is required for Google Apps Script web apps to avoid CORS errors.
            // When using URLSearchParams, the browser sets Content-Type to application/x-www-form-urlencoded
            // which Google Apps Script needs to populate e.parameter correctly.
            await fetch(formUrl, {
                method: 'POST',
                mode: 'no-cors',
                body: data
            });

            setStatus('success');
            setEmail('');
            setName('');

            // Revert back to idle after 5 seconds
            setTimeout(() => setStatus('idle'), 5000);

        } catch (error) {
            console.error("Newsletter subscription error:", error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    return (
        <div className="relative w-full rounded-[3rem] overflow-hidden bg-zinc-950 border border-white/10 my-24 group">
            {/* Background elements */}
            <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2 group-hover:bg-white/10 transition-colors duration-1000" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 lg:gap-8 p-8 md:p-16">

                {/* Left Side - Typography Art */}
                <div className="hidden lg:flex flex-col justify-center overflow-hidden relative min-h-[300px]">
                    <div className="absolute inset-0 flex flex-col justify-center opacity-5 whitespace-nowrap pointer-events-none select-none">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="text-[4rem] font-display font-black leading-none tracking-tighter uppercase transform -translate-x-10">
                                HOME FOR TECHNO PRODUCERS
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side - Form Card */}
                <div className="flex items-center justify-center lg:justify-end w-full">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 w-full max-w-md shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                        <div className="relative z-10">
                            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                Join The Community
                            </h4>

                            <h3 className="text-2xl font-display font-bold text-white mb-3">
                                Gain The Producer Advantage.
                            </h3>

                            <p className="text-white/60 text-sm leading-relaxed mb-8">
                                Receive exclusive tutorials, free sample packs, and next-level sound design secrets directly to your inbox.
                            </p>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your Name (Optional)"
                                    disabled={status === 'loading' || status === 'success'}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors text-sm disabled:opacity-50"
                                />
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Your e-mail *"
                                        required
                                        disabled={status === 'loading' || status === 'success'}
                                        className="w-full sm:flex-1 bg-black/50 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors text-sm disabled:opacity-50 min-w-0"
                                    />
                                    <button
                                        type="submit"
                                        disabled={status === 'loading' || status === 'success' || !email}
                                        className="bg-white hover:bg-white/90 text-black font-extrabold text-sm px-6 py-3.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 flex-shrink-0"
                                    >
                                        {status === 'loading' ? (
                                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                SUBSCRIBE <Send size={14} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <AnimatePresence mode="wait">
                                {status === 'success' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mt-4 p-3 bg-white/10 border border-white/20 rounded-xl flex items-start gap-3"
                                    >
                                        <CheckCircle2 size={18} className="text-white shrink-0 mt-0.5" />
                                        <span className="text-sm text-white/80">Welcome to the underground. You've been successfully added to the list.</span>
                                    </motion.div>
                                )}

                                {status === 'error' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"
                                    >
                                        <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                                        <span className="text-sm text-red-100/80">Transmission failed. Please check your connection and try again.</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
