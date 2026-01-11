import Link from "next/link";
import { FadeIn, FadeInStagger } from "@/components/animations/FadeIn";

export function FeaturesSection() {
    return (
        <section className="relative bg-emerald-950 text-white">
            {/* Main Banner Area */}
            <div className="relative py-16 lg:py-24 flex items-center justify-center overflow-hidden">
                {/* Background Image with Parallax-like fixed attachment */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-40"
                    style={{
                        backgroundImage: `url('https://res.cloudinary.com/dand8rpbb/image/upload/v1768123892/WhatsApp_Image_2026-01-08_at_11.07.43_PM_vpzgeu.jpg')`
                    }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-emerald-900/60 to-emerald-950/90" />

                <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-24 py-10"> {/* Adjusted padding */}
                    <FadeIn>
                        <span className="text-gold-500 font-bold tracking-[0.2em] text-xs uppercase mb-4 block">
                            Visi & Misi
                        </span>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tighter mb-6 max-w-5xl text-white leading-[1.1] text-left">
                            Lembaga Pengembangan Dakwah <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-200">
                                Al-Bahjah Buyut
                            </span>
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.4}>
                        <p className="text-emerald-100/90 font-serif italic text-lg md:text-xl mb-10 tracking-wide max-w-2xl leading-relaxed text-left">
                            "Mengamalkan Nilai-Nilai Al-Qur'an Dan Ajaran Rasulullah SAW."
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.6} className="flex flex-col sm:flex-row items-start justify-start gap-6 mb-12">
                        <Link
                            href="https://wa.me/6282318611707"
                            className="group relative px-8 py-4 bg-gold-500 text-emerald-950 font-bold tracking-widest text-xs overflow-hidden rounded-full transition-all hover:bg-white hover:text-emerald-950 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                        >
                            <span className="relative z-10">Hubungi Kami</span>
                        </Link>
                    </FadeIn>
                </div>
            </div>

            {/* Stats Bar - Minimalist */}
            <div className="lg:absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/20 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <FadeInStagger className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
                        {[
                            { number: "55", label: "Pengajar" },
                            { number: "550+", label: "Alumni" },
                            { number: "25+", label: "Fasilitas" },
                            { number: "20+", label: "Ekstrakulikuler" },
                        ].map((stat, idx) => (
                            <FadeIn key={idx}>
                                <div className="py-8 text-center group cursor-default hover:bg-white/5 transition-colors">
                                    <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-gold-400 transition-colors bg-clip-text">
                                        {stat.number}
                                    </div>
                                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400/80 group-hover:text-white transition-colors">
                                        {stat.label}
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </FadeInStagger>
                </div>
            </div>
        </section>
    );
}
