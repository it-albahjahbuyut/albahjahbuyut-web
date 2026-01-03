import Link from "next/link";

export function FeaturesSection() {
    return (
        <section className="relative bg-zinc-900 text-white">
            {/* Main Banner Area */}
            <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat fixed-bg"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1974&auto=format&fit=crop')`
                    }}
                >
                    <div className="absolute inset-0 bg-black/70" /> {/* Dark overlay */}
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <p className="text-emerald-400 font-serif italic text-xl md:text-3xl mb-6 tracking-wide drop-shadow-md">
                        Mengamalkan Nilai-Nilai Al-Qur'an Dan Ajaran Rasulullah SAW.
                    </p>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter mb-10 max-w-5xl mx-auto leading-none drop-shadow-lg">
                        Lembaga Pengembangan Dakwah <br />
                        <span className="text-gold-400">Al-Bahjah Buyut</span>
                    </h2>
                    <Link
                        href="https://wa.me/6281234567890"
                        className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white text-sm md:text-base font-bold py-4 px-10 rounded-sm uppercase tracking-widest transition-all duration-300 transform hover:-translate-y-1 border-b-4 border-gold-500 hover:border-gold-400 shadow-xl shadow-emerald-900/50"
                    >
                        Hubungi Kami
                    </Link>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-emerald-800 py-16 text-white border-t-4 border-gold-400">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                        <div className="space-y-2 group cursor-default">
                            <div className="text-5xl md:text-6xl font-bold tracking-tight text-white group-hover:text-gold-400 transition-colors duration-300">55</div>
                            <div className="text-sm md:text-base uppercase tracking-widest font-medium text-emerald-200 group-hover:text-white transition-colors">Pengajar</div>
                        </div>
                        <div className="space-y-2 group cursor-default">
                            <div className="text-5xl md:text-6xl font-bold tracking-tight text-white group-hover:text-gold-400 transition-colors duration-300">550+</div>
                            <div className="text-sm md:text-base uppercase tracking-widest font-medium text-emerald-200 group-hover:text-white transition-colors">Alumni</div>
                        </div>
                        <div className="space-y-2 group cursor-default">
                            <div className="text-5xl md:text-6xl font-bold tracking-tight text-white group-hover:text-gold-400 transition-colors duration-300">25+</div>
                            <div className="text-sm md:text-base uppercase tracking-widest font-medium text-emerald-200 group-hover:text-white transition-colors">Fasilitas Sekolah</div>
                        </div>
                        <div className="space-y-2 group cursor-default">
                            <div className="text-5xl md:text-6xl font-bold tracking-tight text-white group-hover:text-gold-400 transition-colors duration-300">20+</div>
                            <div className="text-sm md:text-base uppercase tracking-widest font-medium text-emerald-200 group-hover:text-white transition-colors">Ekstrakulikuler</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
