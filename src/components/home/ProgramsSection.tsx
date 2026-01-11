import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, GraduationCap, BookOpen, Scroll, BookOpenCheck, LucideIcon, Sparkles } from "lucide-react";
import { FadeIn, FadeInStagger } from "@/components/animations/FadeIn";

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
    image: string | null;
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
        image: unit.image,
    }));

    return (
        <section className="pt-20 pb-32 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 lg:px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="max-w-2xl">
                        <FadeIn>
                            <span className="text-gold-600 font-bold tracking-[0.2em] text-xs uppercase mb-4 block">
                                Jenjang Pendidikan
                            </span>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <h2 className="text-4xl lg:text-5xl font-bold text-emerald-950 mb-6 tracking-tight leading-[1.1]">
                                Program <br /> <span className="text-gold-500">Unggulan.</span>
                            </h2>
                        </FadeIn>
                        <FadeIn delay={0.4}>
                            <p className="text-emerald-900/60 text-lg leading-relaxed font-light">
                                Menyiapkan generasi masa depan yang intelek dan berakhlak mulia melalui paduan kurikulum nasional dan nilai-nilai pesantren.
                            </p>
                        </FadeIn>
                    </div>

                    <FadeIn delay={0.6}>
                        <Link
                            href="/pendidikan"
                            className="group hidden md:inline-flex items-center gap-4 text-emerald-950 font-bold tracking-widest text-sm uppercase hover:text-gold-600 transition-colors"
                        >
                            Lihat Semua Program
                            <span className="w-12 h-[1px] bg-emerald-950 group-hover:w-20 transition-all duration-300" />
                        </Link>
                    </FadeIn>
                </div>

                <FadeInStagger className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {programs.map((program, index) => {
                        let defaultImage = "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1974&auto=format&fit=crop";
                        if (program.slug.includes('smp')) defaultImage = "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop";
                        if (program.slug.includes('sma')) defaultImage = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop";
                        if (program.slug.includes('tahfidz')) defaultImage = "https://images.unsplash.com/photo-1606233400587-c1dcb8dc2286?q=80&w=2070&auto=format&fit=crop";

                        return (
                            <FadeIn
                                key={program.slug}
                                className="h-full"
                            >
                                <Link
                                    href={`/pendidikan/${program.slug}`}
                                    className="group relative flex flex-col h-[320px] w-full overflow-hidden rounded-2xl border border-emerald-800 bg-emerald-950 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                                >
                                    {/* Background Image with Gradient */}
                                    <div className="absolute inset-0">
                                        <Image
                                            src={program.image || defaultImage}
                                            alt={program.name}
                                            fill
                                            className="object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-50"
                                        />
                                        {/* Gradient overlay: Solid on left, clear on right for image visibility */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/90 to-transparent" />
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10 flex h-full flex-col p-8 md:p-10">
                                        <h3 className="mb-4 text-3xl font-bold text-white group-hover:text-gold-400 transition-colors pt-4">
                                            {program.name}
                                        </h3>

                                        <p className="mb-6 line-clamp-2 text-emerald-100/90 text-lg leading-relaxed font-light">
                                            {program.desc}
                                        </p>

                                        <div className="mt-auto">
                                            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gold-400 group-hover:text-white transition-colors border-b border-transparent group-hover:border-white pb-1">
                                                Selengkapnya <ArrowRight className="h-4 w-4" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </FadeIn>
                        );
                    })}
                </FadeInStagger>

                <div className="mt-12 text-center md:hidden">
                    <Link
                        href="/pendidikan"
                        className="inline-flex items-center justify-center px-8 py-4 bg-emerald-950 text-white font-bold rounded-full text-sm tracking-widest hover:bg-emerald-900 transition-all shadow-lg shadow-emerald-900/20"
                    >
                        Lihat Semua
                    </Link>
                </div>
            </div>
        </section>
    );
}
