import Link from "next/link";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

interface HeroSectionProps {
    videoSrc: string;
    posterSrc: string;
}

export function HeroSection({ videoSrc, posterSrc }: HeroSectionProps) {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-emerald-950">
            {/* LCP Optimization: Prioritized Background Image */}
            <div className="absolute inset-0 z-0">
                <OptimizedImage
                    src={posterSrc}
                    alt="Background Al-Bahjah Buyut"
                    fill
                    priority
                    className="object-cover"
                />
            </div>

            {/* Background Video - plays over the image */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover z-0 mix-blend-normal opacity-100"
                poster={posterSrc}
            >
                <source src={videoSrc} type="video/mp4" />
            </video>

            {/* Solid Uniform Overlay - No Gradient to ensure consistency */}
            {/* Solid Uniform Overlay - Changed to Black as requested */}
            <div className="absolute inset-0 bg-black/70 z-0" />

            {/* Decorative Elements */}
            <div className="hidden md:block absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/20 blur-3xl z-10" />
            <div className="hidden md:block absolute bottom-0 right-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full bg-emerald-500/20 blur-3xl z-10" />

            <div className="container relative z-20 mx-auto px-4 text-center">
                <div
                    className="max-w-4xl mx-auto animate-fade-in-up"
                // Removed framer-motion here for faster LCP perception (CSS animation is often lighter for Hero LCP)
                // Or keep it simple div if motion is causing delays. 
                // To keep the 'wow' effect without hydration mismatch, we can use simple CSS classes if defined, 
                // or just keep it static for the LCP element text.
                // For now, removing client-side motion only on the wrapper to speed up initial paint.
                >
                    <div className="inline-flex items-center gap-2 text-gold-400 text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-4 md:mb-6">
                        Lembaga Pengembangan Da'wah
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 md:mb-8 tracking-tighter leading-[0.9]">
                        Al-Bahjah <span className="text-emerald-500">Buyut</span>
                    </h1>

                    <p className="text-lg md:text-2xl text-white/90 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
                        Membangun Generasi Qur'ani & Berakhlak dibawah naungan Buya Yahya
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/psb"
                            className="inline-flex items-center justify-center px-6 py-2 md:px-8 md:py-3.5 text-xs md:text-base font-bold text-white border-2 border-white rounded-none hover:bg-white hover:text-emerald-950 transition-all duration-300 uppercase tracking-widest w-auto sm:min-w-[200px]"
                        >
                            Daftar Sekarang
                        </Link>
                        <Link
                            href="/profil"
                            className="inline-flex items-center justify-center px-6 py-2 md:px-8 md:py-3.5 text-xs md:text-base font-bold text-white border-2 border-emerald-600 bg-emerald-600 rounded-none hover:bg-emerald-700 hover:border-emerald-700 transition-all duration-300 uppercase tracking-widest w-auto sm:min-w-[200px]"
                        >
                            Lihat Profil
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
