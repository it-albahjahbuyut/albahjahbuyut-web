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
    // Prisma Decimal type, will be converted to number
    targetAmount: { toNumber(): number } | number;
    currentAmount: { toNumber(): number } | number;
}

// Format currency to Indonesian Rupiah
function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function DonationSection({ program }: { program: DonationProgram | null }) {
    if (!program) {
        return (
            <section className="py-24 bg-white relative">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="bg-slate-50 rounded-3xl p-12 md:p-16 text-center flex flex-col items-center justify-center border border-slate-100 relative overflow-hidden group">
                        {/* Decorative Pattern Background */}
                        <div className="absolute inset-0 opacity-[0.03]"
                            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
                        />

                        <div className="relative z-10 max-w-lg">
                            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">
                                Belum ada program infaq aktif
                            </h3>
                            <p className="text-slate-600 mb-8 leading-relaxed font-light text-lg">
                                Saat ini kami sedang mempersiapkan program kebaikan selanjutnya. Mari bersama-sama menebar manfaat untuk umat.
                            </p>
                            <Link
                                href="/infaq"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-slate-900 border border-slate-200 rounded-full font-semibold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 shadow-sm hover:shadow-lg"
                            >
                                <span>Lihat Program</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-white relative">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="bg-emerald-950 text-white overflow-hidden relative rounded-3xl">
                    <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')] pointer-events-none" />

                    <div className="relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-16 p-6 md:p-10 lg:p-20 items-center">
                        <div className="max-w-xl">
                            <FadeIn>
                                <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
                                    <Heart className="w-4 h-4" />
                                    Program Infaq
                                </div>

                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight leading-none text-white">
                                    Mari Berbagi Kebaikan
                                </h2>
                                <p className="text-emerald-100/80 text-lg leading-relaxed mb-8 md:mb-10 font-light">
                                    {program.description || "Sisihkan sebagian harta Anda untuk membantu pembangunan dan operasional pesantren. Insya Allah menjadi amal jariyah yang tak terputus."}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href={`/infaq/${program.slug}`}
                                        className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-emerald-950 text-sm font-bold tracking-widest hover:bg-emerald-100 transition-all w-full sm:w-auto rounded-lg"
                                    >
                                        Infaq Sekarang
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                    <Link
                                        href="/infaq"
                                        className="inline-flex items-center justify-center px-8 py-3.5 bg-transparent border border-emerald-700 text-emerald-100 text-sm font-bold tracking-widest hover:bg-emerald-900 transition-all w-full sm:w-auto rounded-lg"
                                    >
                                        Program Lain
                                    </Link>
                                </div>
                            </FadeIn>
                        </div>

                        <div className="flex items-center justify-center">
                            <FadeIn delay={0.3} className="w-full max-w-sm">
                                <Link
                                    href={`/infaq/${program.slug}`}
                                    className="block aspect-[4/3] bg-emerald-900 relative shadow-2xl border-4 border-emerald-900 mb-6 rounded-xl overflow-hidden group"
                                >
                                    {program.image ? (
                                        <Image
                                            src={program.image}
                                            alt={program.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-emerald-700">
                                            <Heart className="w-16 h-16" />
                                        </div>
                                    )}
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-emerald-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-white font-bold text-sm uppercase tracking-wider">Lihat Detail</span>
                                    </div>
                                </Link>
                                <h3 className="text-xl font-bold mb-2 uppercase tracking-wide truncate text-center lg:text-left">{program.title}</h3>
                                {(() => {
                                    const current = typeof program.currentAmount === 'number'
                                        ? program.currentAmount
                                        : program.currentAmount.toNumber();
                                    const target = typeof program.targetAmount === 'number'
                                        ? program.targetAmount
                                        : program.targetAmount.toNumber();
                                    const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;

                                    return (
                                        <>
                                            <div className="h-2 w-full bg-emerald-900/50 mb-4 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                                                <div className="flex flex-col">
                                                    <span className="text-emerald-400">Terkumpul</span>
                                                    <span className="text-white text-sm normal-case">{formatCurrency(current)}</span>
                                                </div>
                                                <div className="flex flex-col text-right">
                                                    <span className="text-emerald-400">{percentage.toFixed(0)}%</span>
                                                    <span className="text-white/70 text-[10px] normal-case">dari {formatCurrency(target)}</span>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
