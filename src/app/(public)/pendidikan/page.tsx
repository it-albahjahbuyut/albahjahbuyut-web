import { db } from "@/lib/db";
import Link from "next/link";
import { BookOpen, GraduationCap, Scroll, BookOpenCheck, LucideIcon } from "lucide-react";
import { FadeIn, FadeInStagger } from "@/components/animations/FadeIn";

export const metadata = {
    title: "Pendidikan | Pondok Pesantren Al-Bahjah Buyut",
    description: "Program pendidikan unggulan di Al-Bahjah Buyut yang memadukan kurikulum nasional dan kepesantrenan.",
};

const unitIcons: Record<string, LucideIcon> = {
    smp: GraduationCap,
    sma: BookOpen,
    tafaqquh: Scroll,
    tahfidz: BookOpenCheck,
    "sd-qu": BookOpen, // Fallback/Extras
};

export default async function PendidikanPage() {
    const units = await db.unit.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
    });

    const stripHtml = (html: string) => {
        return html.replace(/<[^>]*>?/gm, '');
    };

    return (
        <main>
            {/* Hero Section */}
            <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center bg-emerald-950 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 fixed-bg"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')`
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-950/90" />

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <FadeIn delay={0.2}>
                        <span className="inline-block px-3 py-1 mb-4 border border-gold-400 text-gold-400 text-xs font-bold tracking-widest">
                            Program Pendidikan
                        </span>
                    </FadeIn>
                    <FadeIn delay={0.4}>
                        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-4">
                            Pendidikan Kami
                        </h1>
                    </FadeIn>
                    <FadeIn delay={0.6}>
                        <p className="text-emerald-100/80 font-serif italic text-lg max-w-3xl mx-auto">
                            Mewujudkan generasi Qur'ani yang berintelektual tinggi dan berakhlak mulia.
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 lg:px-8">
                    {/* Formal Education Section */}
                    <div className="mb-24">
                        <div className="max-w-4xl mx-auto text-center mb-16">
                            <span className="inline-block px-3 py-1 mb-4 bg-emerald-100 text-emerald-800 text-xs font-bold tracking-widest rounded-full">
                                PENDIDIKAN FORMAL
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 tracking-tight mb-8">
                                Sekolah Islam Qur'ani
                            </h2>
                            <div className="prose prose-lg prose-slate mx-auto text-slate-600 leading-relaxed">
                                <p>
                                    Pendidikan Formal merupakan salah satu divisi atau bagian dari Lembaga Pengembangan Dakwah (LPD) Al-Bahjah yang berpusat di Cirebon, Jawa Barat.
                                    Saat ini sudah tersebar puluhan cabang yang berada di Pulau Jawa, Sumatra, Kepulauan Riau, hingga Kalimantan.
                                </p>
                                <p>
                                    Pendidikan formal Al-Bahjah secara umum berfokus pada pendidikan dari jenjang <strong className="text-emerald-800">SD Islam Qurani (SDIQu)</strong>, <strong className="text-emerald-800">SMP Islam Qurani (SMPIQu)</strong>, dan <strong className="text-emerald-800">SMA Islam Qurani (SMAIQu)</strong>.
                                </p>
                                <p>
                                    Memadukan tiga kurikulum yaitu <strong>Kurikulum Pendidikan Nasional</strong>, <strong>Kurikulum Tahfidz</strong>, dan <strong>Kurikulum Kepondokan</strong>. Setiap santri baik itu SDIQu, SMPIQu, dan SMAIQu dapat mengenyam pendidikan formal dan pendidikan pondok secara beriringan.
                                </p>
                                <p className="text-sm bg-emerald-50 p-6 rounded-2xl border border-emerald-100 mt-8 not-prose">
                                    <span className="block font-bold text-emerald-900 mb-2 uppercase tracking-wide text-xs">5 Program Unggulan</span>
                                    Akhlakul Karimah • Tahfidzul Qur’an • Akademik • Madrasah Diniyah • Bahasa Asing
                                </p>
                            </div>
                        </div>

                        <FadeInStagger className="grid md:grid-cols-3 gap-6">
                            {units.filter(u => ['sdiqu', 'smpiqu', 'smaiqu'].includes(u.slug)).map((unit) => {
                                const Icon = unitIcons[unit.slug] || BookOpen;
                                // Simple card for formal
                                return (
                                    <FadeIn key={unit.id} className="h-full">
                                        <Link
                                            href={`/pendidikan/${unit.slug}`}
                                            className="group relative block bg-white border border-slate-200 overflow-hidden h-full rounded-3xl hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300"
                                        >
                                            <div className="p-8 h-full flex flex-col">
                                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                                    <Icon className="w-7 h-7" />
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-800 transition-colors">
                                                    {unit.name}
                                                </h3>
                                                <div
                                                    className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3"
                                                    dangerouslySetInnerHTML={{ __html: unit.description ? stripHtml(unit.description) : "" }}
                                                />
                                                <div className="mt-auto flex items-center gap-2 text-sm font-bold text-emerald-600 group-hover:text-emerald-800">
                                                    Lihat Detail <span className="text-lg">→</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </FadeIn>
                                );
                            })}
                        </FadeInStagger>
                    </div>

                    {/* Non-Formal Education Section */}
                    <div>
                        <div className="max-w-3xl mx-auto text-center mb-12">
                            <span className="inline-block px-3 py-1 mb-4 bg-gold-100 text-gold-800 text-xs font-bold tracking-widest rounded-full">
                                PENDIDIKAN NON-FORMAL
                            </span>
                            <h2 className="text-3xl font-bold text-emerald-950 tracking-tight mb-6">
                                Program Pesantren & Takhossus
                            </h2>
                            <p className="text-slate-600">
                                Program pendidikan diniyah dan pendalaman ilmu agama untuk mencetak kader ulama.
                            </p>
                        </div>

                        <FadeInStagger className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {units.filter(u => !['sdiqu', 'smpiqu', 'smaiqu'].includes(u.slug)).map((unit) => {
                                const Icon = unitIcons[unit.slug] || Scroll;
                                return (
                                    <FadeIn key={unit.id}>
                                        <Link
                                            href={`/pendidikan/${unit.slug}`}
                                            className="group flex flex-col md:flex-row bg-emerald-900 rounded-3xl overflow-hidden hover:bg-emerald-800 transition-colors duration-300 text-white h-full"
                                        >
                                            <div className="p-8 md:w-full flex flex-col justify-center">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gold-400">
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-white">
                                                        {unit.name}
                                                    </h3>
                                                </div>
                                                <div
                                                    className="text-emerald-100/80 text-sm leading-relaxed mb-6 line-clamp-3"
                                                    dangerouslySetInnerHTML={{ __html: unit.description ? stripHtml(unit.description) : "" }}
                                                />
                                                <div className="inline-flex items-center gap-2 text-gold-400 text-xs font-bold tracking-widest uppercase">
                                                    Selengkapnya <span className="group-hover:translate-x-1 transition-transform">→</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </FadeIn>
                                );
                            })}
                        </FadeInStagger>
                    </div>
                </div>
            </section>
        </main>
    );
}
