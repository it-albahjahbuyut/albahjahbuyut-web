import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";

interface DonationProgram {
    id: string;
    title: string;
    description: string | null;
    image: string | null;
    slug: string;
}

export function DonationSection({ program }: { program: DonationProgram | null }) {
    if (!program) return null;

    return (
        <section className="py-24 bg-white relative">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="bg-emerald-950 text-white overflow-hidden relative">
                    <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')] pointer-events-none" />

                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 p-10 lg:p-20 items-center">
                        <div className="max-w-xl">
                            <FadeIn>
                                <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
                                    <Heart className="w-4 h-4" />
                                    Program Infaq
                                </div>

                                <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight leading-none text-white">
                                    Mari Berbagi Kebaikan
                                </h2>
                                <p className="text-emerald-100/80 text-lg leading-relaxed mb-10 font-light">
                                    {program.description || "Sisihkan sebagian harta Anda untuk membantu pembangunan dan operasional pesantren. Insya Allah menjadi amal jariyah yang tak terputus."}
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Link
                                        href={`/infaq/${program.slug}`}
                                        className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-emerald-950 text-sm font-bold tracking-widest hover:bg-emerald-100 transition-all"
                                    >
                                        Infaq Sekarang
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                    <Link
                                        href="/infaq"
                                        className="inline-flex items-center justify-center px-8 py-3.5 bg-transparent border border-emerald-700 text-emerald-100 text-sm font-bold tracking-widest hover:bg-emerald-900 transition-all"
                                    >
                                        Program Lain
                                    </Link>
                                </div>
                            </FadeIn>
                        </div>

                        <div className="flex items-center justify-center">
                            <FadeIn delay={0.3} className="w-full max-w-sm">
                                <div className="aspect-[4/3] bg-emerald-900 relative shadow-2xl border-4 border-emerald-900 mb-6">
                                    {program.image ? (
                                        <Image
                                            src={program.image}
                                            alt={program.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-emerald-700">
                                            <Heart className="w-16 h-16" />
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold mb-2 uppercase tracking-wide truncate">{program.title}</h3>
                                <div className="h-1 w-full bg-emerald-900/50 mb-4">
                                    <div className="h-full bg-emerald-500 w-3/4" />
                                </div>
                                <div className="flex justify-between text-xs text-emerald-400 font-bold uppercase tracking-wider">
                                    <span>Terkumpul</span>
                                    <span className="text-white">Sedang Berjalan</span>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
