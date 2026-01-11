import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FadeIn, FadeInStagger } from "@/components/animations/FadeIn";

export const metadata = {
    title: "Pendidikan | Pondok Pesantren Al-Bahjah Buyut",
    description: "Program pendidikan unggulan di Al-Bahjah Buyut yang memadukan kurikulum nasional dan kepesantrenan.",
};

export default async function PendidikanPage() {
    const units = await db.unit.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
    });

    const stripHtml = (html: string) => {
        return html.replace(/<[^>]*>?/gm, '');
    };

    const formalUnits = units.filter(u => ['sdiqu', 'smpiqu', 'smaiqu'].includes(u.slug));
    const nonFormalUnits = units.filter(u => !['sdiqu', 'smpiqu', 'smaiqu'].includes(u.slug));

    return (
        <main className="bg-white min-h-screen">
            {/* Hero Section with Background - Matched to PSB Page Style */}
            <section className="relative min-h-[60vh] flex items-center justify-center bg-emerald-950 overflow-hidden px-4 pt-24 pb-20 text-center">
                {/* Background Image */}
                {/* Background Video */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover opacity-30"
                >
                    <source src="https://res.cloudinary.com/dand8rpbb/video/upload/v1767984439/Untitled_Video_-_Made_With_Clipchamp_rpbfw1.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-950/90" />

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <FadeIn delay={0.4}>
                        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-4">
                            Pendidikan
                        </h1>
                    </FadeIn>
                    <FadeIn delay={0.6}>
                        <div className="max-w-3xl mx-auto">
                            <p className="text-emerald-100/80 font-serif italic text-lg leading-relaxed">
                                Kami memadukan <span className="text-gold-400 font-medium not-italic font-sans">kurikulum nasional</span> dan <span className="text-gold-400 font-medium not-italic font-sans">kepesantrenan</span> untuk membentuk generasi Qur'ani yang cerdas dan berakhlak mulia.
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Formal Education List */}
            <section className="px-4 md:px-8 py-24 container mx-auto max-w-7xl">
                <FadeIn>
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-900/50">Pendidikan Formal</span>
                    </div>
                </FadeIn>

                <div className="space-y-0 border-t border-slate-200">
                    {formalUnits.map((unit, index) => (
                        <FadeIn key={unit.id} delay={index * 0.1}>
                            <Link href={`/pendidikan/${unit.slug}`} className="group block">
                                <div className="border-b border-slate-200 py-16 flex flex-col lg:flex-row lg:items-baseline gap-8 lg:gap-20 hover:bg-slate-50/50 transition-colors duration-500 px-4 lg:px-8 -mx-4 lg:-mx-8">
                                    <div className="lg:w-1/3">
                                        <div className="flex items-baseline gap-6">
                                            <span className="text-sm font-medium text-slate-300">0{index + 1}</span>
                                            <h3 className="text-4xl text-emerald-950 font-bold group-hover:text-emerald-700 transition-colors tracking-tight">
                                                {unit.name}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="lg:w-1/2">
                                        <div className="text-slate-500 text-lg leading-relaxed mb-8 line-clamp-3 font-light">
                                            {unit.description ? stripHtml(unit.description) : "Deskripsi program belum tersedia."}
                                        </div>
                                        <div className="flex items-center gap-3 text-emerald-950 font-medium group-hover:gap-5 transition-all duration-300">
                                            <span className="uppercase text-xs tracking-widest">Selengkapnya</span>
                                            <ArrowUpRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* Non-Formal / Pesantren Section */}
            {/* Non-Formal / Pesantren Section */}
            {nonFormalUnits.length > 0 && (
                <section className="px-4 md:px-8 pb-32 container mx-auto max-w-6xl">
                    <FadeIn delay={0.2}>
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-2 h-2 bg-gold-500 rounded-full" />
                            <span className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-900/50">Program Pesantren</span>
                        </div>
                    </FadeIn>

                    <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                        {nonFormalUnits.map((unit, index) => (
                            <FadeIn key={unit.id} delay={index * 0.1}>
                                <Link href={`/pendidikan/${unit.slug}`} className="group block h-full">
                                    <div className="h-full p-8 md:p-10 rounded-3xl border border-slate-200 bg-white hover:border-gold-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">

                                        <div className="relative z-10">
                                            <h3 className="text-2xl font-bold text-emerald-950 mb-4">{unit.name}</h3>
                                            <div className="text-slate-500 leading-relaxed font-light line-clamp-3 mb-8">
                                                {unit.description ? stripHtml(unit.description) : ""}
                                            </div>
                                        </div>

                                        <div className="relative z-10 flex items-center justify-between mt-auto">
                                            <span className="text-sm font-bold text-gold-600 uppercase tracking-wider group-hover:text-gold-700 transition-colors">Lihat Program</span>
                                            <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-white transition-all duration-300">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </div>
                                        </div>

                                        {/* Subtle Hover Decor */}
                                        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gold-50/50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                </Link>
                            </FadeIn>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
