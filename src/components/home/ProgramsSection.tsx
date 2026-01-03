import Link from "next/link";
import { ArrowUpRight, ArrowRight, GraduationCap, BookOpen, Scroll, BookOpenCheck, LucideIcon, Sparkles } from "lucide-react";

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

export function ProgramsSection({ units }: { units: Unit[] }) {
    // Transform units into the new 'programs' structure as implied by the diff
    const programs: Program[] = units.map(unit => ({
        slug: unit.slug,
        name: unit.name,
        desc: unit.description || "Program pendidikan unggulan yang memadukan kurikulum nasional dan kepesantrenan untuk membentuk karakter mulia.",
        icon: unitIcons[unit.slug] || BookOpen, // Use the existing unitIcons mapping
    }));

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-4 lg:px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-3xl">
                        <div className="text-emerald-900 font-bold tracking-widest text-xs uppercase mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                            Jenjang Pendidikan
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-emerald-950 mb-4 uppercase tracking-tight">Program Unggulan</h2>
                        <p className="text-slate-600 text-lg leading-relaxed max-w-xl font-light">
                            Pilihan program pendidikan yang dirancang untuk kebutuhan zaman, memadukan ilmu agama dan ilmu umum.
                        </p>
                    </div>

                    <Link
                        href="/pendidikan"
                        className="hidden md:inline-flex items-center justify-center px-8 py-3 bg-white border-2 border-emerald-950 text-emerald-950 font-bold hover:bg-emerald-950 hover:text-white transition-all duration-300 uppercase tracking-widest text-sm"
                    >
                        Lihat Semua
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {programs.map((program) => (
                        <Link
                            key={program.slug}
                            href={`/pendidikan/${program.slug}`}
                            className="group relative bg-white p-8 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 border border-slate-200 hover:border-emerald-600 h-full flex flex-col"
                        >
                            <div className="relative z-10 flex-1 flex flex-col">
                                <div className="w-12 h-12 bg-emerald-100/50 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white text-emerald-800 transition-colors duration-300">
                                    <program.icon className="w-6 h-6" />
                                </div>

                                <h3 className="text-lg font-bold text-emerald-950 mb-3 group-hover:text-emerald-700 transition-colors uppercase tracking-wide">
                                    {program.name}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                                    {program.desc}
                                </p>

                                <div className="flex items-center text-emerald-900 font-bold text-xs tracking-widest group-hover:gap-2 transition-all uppercase border-b-2 border-transparent group-hover:border-emerald-900 w-fit pb-1">
                                    Selengkapnya
                                    <ArrowRight className="ml-2 w-3.5 h-3.5" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link
                        href="/pendidikan"
                        className="inline-flex w-full items-center justify-center px-6 py-3.5 bg-emerald-950 text-white font-bold hover:bg-emerald-800 transition-all uppercase tracking-widest text-sm"
                    >
                        Lihat Semua
                    </Link>
                </div>
            </div>
        </section>
    );
}
