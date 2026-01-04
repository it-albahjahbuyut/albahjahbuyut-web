import Link from "next/link";
import { ArrowLeft, ArrowRight, GraduationCap, BookOpen, Scroll, BookOpenCheck, LucideIcon, Sparkles } from "lucide-react";

interface Unit {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
}

interface Program {
    slug: string;
    name: string;
    desc: string;
    icon: LucideIcon;
}

const unitIcons: Record<string, LucideIcon> = {
    smp: GraduationCap,
    sma: BookOpen,
    tafaqquh: Scroll,
    tahfidz: BookOpenCheck,
};

const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '');
};

export function ProgramsSection({ units }: { units: Unit[] }) {
    const programs: Program[] = units.map(unit => ({
        slug: unit.slug,
        name: unit.name,
        desc: unit.description ? stripHtml(unit.description) : "Program pendidikan unggulan yang memadukan kurikulum nasional dan kepesantrenan untuk membentuk karakter mulia.",
        icon: unitIcons[unit.slug] || BookOpen,
    }));

    return (
        <section className="py-32 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 lg:px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="max-w-2xl">
                        <span className="text-gold-600 font-bold tracking-[0.2em] text-xs uppercase mb-4 block">
                            Jenjang Pendidikan
                        </span>
                        <h2 className="text-5xl md:text-6xl font-bold text-emerald-950 mb-6 tracking-tight leading-none">
                            Program <br /> <span className="text-gold-500">Unggulan.</span>
                        </h2>
                        <p className="text-emerald-900/60 text-lg leading-relaxed font-light">
                            Menyiapkan generasi masa depan yang intelek dan berakhlak mulia melalui paduan kurikulum nasional dan nilai-nilai pesantren.
                        </p>
                    </div>

                    <Link
                        href="/pendidikan"
                        className="group hidden md:inline-flex items-center gap-4 text-emerald-950 font-bold tracking-widest text-sm uppercase hover:text-gold-600 transition-colors"
                    >
                        Lihat Semua Program
                        <span className="w-12 h-[1px] bg-emerald-950 group-hover:w-20 transition-all duration-300" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-12 gap-6">
                    {programs.map((program, index) => {
                        // Zig-zag pattern: 0 & 3 are wide (8 cols), 1 & 2 are narrow (4 cols)
                        // Or alternating: 0 (8), 1 (4), 2 (4), 3 (8)
                        const isWide = index === 0 || index === 3;
                        const colSpan = isWide ? "col-span-12 md:col-span-8" : "col-span-12 md:col-span-4";

                        return (
                            <Link
                                key={program.slug}
                                href={`/pendidikan/${program.slug}`}
                                className={`group relative block bg-emerald-50/50 overflow-hidden ${colSpan} min-h-[280px] md:min-h-[320px] rounded-2xl md:rounded-3xl hover:bg-emerald-900 transition-all duration-500`}
                            >
                                <div className="absolute top-8 right-8 text-emerald-900/10 group-hover:text-white/10 transition-colors duration-500">
                                    <program.icon className="w-32 h-32 stroke-[1px]" />
                                </div>

                                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                                    <div>
                                        <div className="w-12 h-12 rounded-full border border-emerald-900/10 flex items-center justify-center mb-6 text-emerald-900 group-hover:border-white/20 group-hover:text-gold-400 transition-all duration-500 bg-white group-hover:bg-white/10">
                                            <program.icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold text-emerald-950 mb-4 group-hover:text-white transition-colors duration-500">
                                            {program.name}
                                        </h3>
                                        <p className="text-emerald-900/60 text-sm leading-relaxed max-w-sm group-hover:text-emerald-100/90 transition-colors duration-500 line-clamp-3">
                                            {program.desc}
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

                <div className="mt-12 text-center md:hidden">
                    <Link
                        href="/pendidikan"
                        className="inline-flex items-center justify-center px-8 py-4 bg-emerald-950 text-white font-bold rounded-full text-sm uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-lg shadow-emerald-900/20"
                    >
                        Lihat Semua
                    </Link>
                </div>
            </div>
        </section>
    );
}
