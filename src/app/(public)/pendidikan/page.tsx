import { db } from "@/lib/db";
import Link from "next/link";
import { BookOpen, GraduationCap, Scroll, BookOpenCheck, LucideIcon } from "lucide-react";

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
                    <span className="inline-block px-3 py-1 mb-4 border border-gold-400 text-gold-400 text-xs font-bold tracking-widest">
                        Program Pendidikan
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-4">
                        Pendidikan Kami
                    </h1>
                    <p className="text-emerald-100/80 font-serif italic text-lg max-w-3xl mx-auto">
                        Mewujudkan generasi Qur'ani yang berintelektual tinggi dan berakhlak mulia.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl font-bold text-emerald-950 tracking-tight mb-4">
                            Daftar Program
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            Pilihlah jenjang pendidikan yang sesuai dengan kebutuhan buah hati Anda. Kami menyediakan berbagai program pendidikan formal dan non-formal yang terintegrasi.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-12 gap-6">
                        {units.map((unit, index) => {
                            const Icon = unitIcons[unit.slug] || BookOpen;
                            const description = unit.description ? stripHtml(unit.description) : "Program pendidikan unggulan.";

                            // Bento Logic: 0 & 3 wide, others narrow. Loop if more than 4 items.
                            const isWide = index % 4 === 0 || index % 4 === 3;
                            const colSpan = isWide ? "col-span-12 md:col-span-8" : "col-span-12 md:col-span-4";

                            return (
                                <Link
                                    key={unit.id}
                                    href={`/pendidikan/${unit.slug}`}
                                    className={`group relative block bg-slate-50 overflow-hidden ${colSpan} min-h-[280px] md:min-h-[350px] rounded-2xl md:rounded-3xl hover:bg-emerald-900 transition-all duration-500`}
                                >
                                    <div className="absolute top-8 right-8 text-emerald-900/5 group-hover:text-white/10 transition-colors duration-500">
                                        <Icon className="w-32 h-32 stroke-[1px]" />
                                    </div>

                                    <div className="absolute inset-0 p-8 flex flex-col justify-between">
                                        <div>
                                            <div className="w-12 h-12 rounded-full border border-emerald-900/10 flex items-center justify-center mb-6 text-emerald-900 group-hover:border-white/20 group-hover:text-gold-400 transition-all duration-500 bg-white group-hover:bg-white/10">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-bold text-emerald-950 mb-4 group-hover:text-white transition-colors duration-500">
                                                {unit.name}
                                            </h3>
                                            <p className="text-slate-500 text-sm leading-relaxed max-w-sm group-hover:text-emerald-100/90 transition-colors duration-500 line-clamp-3">
                                                {description}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className="w-8 h-[1px] bg-emerald-900/20 group-hover:bg-white/30 transition-colors duration-500" />
                                            <span className="text-xs font-bold uppercase tracking-widest text-emerald-900 group-hover:text-gold-400 transition-colors duration-500">
                                                Selengkapnya
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>
        </main>
    );
}
