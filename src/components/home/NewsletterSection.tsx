'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { subscribeNewsletter } from '@/actions/newsletter-actions';

export default function NewsletterSection() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) return;

        setIsSubmitting(true);
        setStatus('idle');

        const result = await subscribeNewsletter(email, undefined, 'homepage');

        setIsSubmitting(false);
        setStatus(result.success ? 'success' : 'error');
        setMessage(result.message);

        if (result.success) {
            setEmail('');
        }
    };

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center">

                    <h2 className="text-2xl md:text-3xl font-bold text-emerald-950 mb-4 tracking-tight">
                        Dapatkan update terbaru tentang kegiatan, pengumuman, dan berita dari Al-Bahjah Buyut.
                    </h2>
                    <p className="text-slate-500 text-base md:text-lg mb-10 leading-relaxed font-light">
                        Langsung ke kotak masuk email Anda tanpa spam.
                    </p>

                    {status === 'success' ? (
                        <div className="p-8 bg-emerald-50/50 rounded-3xl border border-emerald-100 animate-in fade-in zoom-in duration-500">
                            <div className="flex flex-col items-center gap-4">
                                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-emerald-950">Terima Kasih!</h3>
                                    <p className="text-slate-600">{message}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 p-1.5 bg-slate-50 border border-slate-200 rounded-2xl md:rounded-[2rem] transition-all focus-within:bg-white focus-within:border-emerald-500/30 focus-within:shadow-xl focus-within:shadow-emerald-900/5">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Alamat email anda..."
                                    required
                                    className="flex-1 px-6 py-4 bg-transparent text-emerald-950 placeholder-slate-400 focus:outline-none text-base"
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !email}
                                    className="px-8 py-4 bg-emerald-700 text-white font-bold rounded-xl md:rounded-[1.5rem] hover:bg-emerald-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-md active:scale-[0.98]"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <span>Daftar</span>
                                            <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {status === 'error' && (
                                <p className="mt-4 text-red-600 text-sm font-medium animate-in slide-in-from-top-2">{message}</p>
                            )}

                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 font-normal">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
                                <span>Berhenti berlangganan kapan saja.</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Subtle background element */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
        </section>
    );
}
