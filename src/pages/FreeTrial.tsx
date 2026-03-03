import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Download, ShieldCheck } from 'lucide-react';

export default function FreeTrial() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !name) return;

        setStatus('loading');

        const formUrl = "https://script.google.com/macros/s/AKfycbxBsljsf32rB9fkdAytjXWeQJpWa4T45t7beTlzGLqAstYNBSMAnnhgmdLlftqa69nu/exec";

        const data = new URLSearchParams();
        data.append("nombre", name.trim() + " (Free Trial)");
        data.append("email", email.trim());

        try {
            // mode: 'no-cors' is required for Google Apps Script web apps to avoid CORS errors.
            await fetch(formUrl, {
                method: 'POST',
                mode: 'no-cors',
                body: data
            });

            setStatus('success');
            // We do NOT clear the form so they remember what they entered, and we show the download button
        } catch (error) {
            console.error("Subscription error:", error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    return (
        <div className="min-h-[80vh] pt-32 pb-24 px-6 flex items-center justify-center relative">
            {/* Background elements */}
            <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-xl relative z-10"
            >
                <div className="bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                    <div className="text-center mb-10 relative">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-6 mx-auto">
                            <Download size={28} className="text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight text-white mb-4 uppercase">
                            Unlock Free Trial
                        </h1>
                        <p className="text-white/60 text-lg">
                            Enter your details below to get instant access to 45MB of pure industrial hard techno.
                        </p>
                    </div>

                    {status === 'success' ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-6"
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 text-green-500 mb-6">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Access Granted!</h3>
                            <p className="text-white/60 mb-8">Your download is ready. Click the button below to start.</p>

                            <a
                                href="https://drive.google.com/uc?export=download&id=1F7xlw1tfxOkQcN-ivYbjhuXkIIZAJTi-"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center gap-3 bg-white text-black font-extrabold text-lg uppercase tracking-widest px-8 py-5 rounded-xl hover:bg-white/90 transition-all active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                            >
                                <Download size={24} />
                                Download Sample Pack
                            </a>
                            <p className="text-white/40 text-xs mt-4">
                                <strong>Note:</strong> Since the file is 32MB, Google Drive will ask for a virus scan confirmation. Click <strong>"Download anyway"</strong> to receive your file.
                            </p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-white/80 ml-1">Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    disabled={status === 'loading'}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5 mb-2">
                                <label className="text-sm font-bold text-white/80 ml-1">E-mail Address *</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    disabled={status === 'loading'}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
                                />
                            </div>

                            {status === 'error' && (
                                <p className="text-red-400 text-sm font-medium text-center bg-red-400/10 py-2 rounded-lg">
                                    Oops! Something went wrong. Please try again.
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full flex items-center justify-center gap-3 bg-white text-black font-extrabold text-sm uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                            >
                                {status === 'loading' ? (
                                    <span className="animate-pulse">Processing...</span>
                                ) : (
                                    <>
                                        Get Access Now
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs text-white/40 mt-4 flex items-center justify-center gap-1.5">
                                <ShieldCheck size={14} />
                                Your data is secure. We don't spam.
                            </p>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
