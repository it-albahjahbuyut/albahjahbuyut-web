import Link from "next/link";

export function FeaturesSection() {
    return (
        <section className="relative bg-emerald-950 text-white">
            {/* Main Banner Area */}
            <div className="relative py-20 lg:py-32 flex items-center justify-center overflow-hidden">
                {/* Background Image with Parallax-like fixed attachment */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat fixed-bg opacity-40"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1974&auto=format&fit=crop')`
                    }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-emerald-900/60 to-emerald-950/90" />

                <div className="relative z-10 container mx-auto px-4 text-center pb-10">
                    <div className="mb-6 flex justify-center">
                        <span className="h-12 w-1 bg-gold-500/80 rounded-full" />
                    </div>

                    <p className="text-emerald-100/90 font-serif italic text-lg md:text-2xl mb-6 tracking-wide max-w-4xl mx-auto leading-relaxed">
                        "Mengamalkan Nilai-Nilai Al-Qur'an Dan Ajaran Rasulullah SAW."
                    </p>

                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter mb-8 max-w-5xl mx-auto text-white leading-[1.1]">
                        Lembaga Pengembangan Dakwah <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-200">
                            Al-Bahjah Buyut
                        </span>
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
                        <Link
                            href="https://wa.me/6281234567890" // Check with user for real number
                            className="group relative px-8 py-4 bg-gold-500 text-emerald-950 font-bold uppercase tracking-widest text-xs overflow-hidden rounded-full transition-all hover:bg-white hover:text-emerald-950 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                        >
                            <span className="relative z-10">Hubungi Kami</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Bar - Minimalist */}
            <div className="lg:absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/20 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
                        {[
                            { number: "55", label: "Pengajar" },
                            { number: "550+", label: "Alumni" },
                            { number: "25+", label: "Fasilitas" },
                            { number: "20+", label: "Ekstrakulikuler" },
                        ].map((stat, idx) => (
                            <div key={idx} className="py-12 text-center group cursor-default hover:bg-white/5 transition-colors">
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-gold-400 transition-colors bg-clip-text">
                                    {stat.number}
                                </div>
                                <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400/80 group-hover:text-white transition-colors">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
