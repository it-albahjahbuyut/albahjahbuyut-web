import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/button";

interface DonationProgram {
    id: string;
    title: string;
    description: string | null;
    image: string | null;
    slug: string;
    targetAmount: { toNumber(): number } | number;
    currentAmount: { toNumber(): number } | number;
    hideProgress?: boolean;
}

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
            <section className="py-12 md:py-24 bg-slate-50 relative">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="bg-white rounded-3xl p-8 md:p-16 text-center flex flex-col items-center justify-center border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="relative z-10 max-w-lg">
                            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">
                                Belum ada program infaq aktif
                            </h3>
                            <p className="text-slate-600 mb-8 leading-relaxed font-light text-lg">
                                Saat ini kami sedang mempersiapkan program kebaikan selanjutnya. Mari bersama-sama menebar manfaat untuk umat.
                            </p>
                            <Button asChild className="rounded-none bg-emerald-950 text-white hover:bg-emerald-900">
                                <Link href="/infaq">
                                    Lihat Program Lain <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const current = typeof program.currentAmount === 'number'
        ? program.currentAmount
        : program.currentAmount.toNumber();
    const target = typeof program.targetAmount === 'number'
        ? program.targetAmount
        : program.targetAmount.toNumber();
    const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;

    // Logic:
    // 1. Show the floating card if we have anything to show (collected > 0 or target > 0)
    //    UNLESS hideProgress is explicitly true in admin.
    const showStatsCard = !program.hideProgress && (target > 0 || current > 0);

    // 2. Even if we show the card (because collected > 0), we might want to hide the bar 
    //    if there's no target (target = 0).
    const showProgressDetails = target > 0;

    return (
        <section className="py-12 md:py-20 bg-slate-50 relative">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Main Card Container - Changed to White */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/40 border border-slate-100">
                    <div className="grid lg:grid-cols-2 lg:h-[500px]">

                        {/* Left Column: Content */}
                        <div className="p-6 md:p-10 lg:p-14 order-2 lg:order-1 flex flex-col justify-center">
                            <FadeIn>
                                <div className="inline-flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-widest mb-4 bg-emerald-50 px-3 py-1 rounded-none w-fit">
                                    Program Infaq
                                </div>

                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-slate-900 leading-tight">
                                    {program.title}
                                </h2>

                                <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8 font-light line-clamp-4">
                                    {program.description || "Sisihkan sebagian harta Anda untuk membantu pembangunan dan operasional pesantren. Insya Allah menjadi amal jariyah yang tak terputus."}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="rounded-none bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-8 text-base shadow-lg shadow-emerald-600/20"
                                    >
                                        <Link href={`/infaq/${program.slug}`}>
                                            Infaq Sekarang
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="lg"
                                        className="rounded-none border-slate-200 text-slate-600 hover:bg-slate-50 h-12 px-8 text-base"
                                    >
                                        <Link href="/infaq">
                                            Program Lain
                                        </Link>
                                    </Button>
                                </div>
                            </FadeIn>
                        </div>

                        {/* Right Column: Image & Stats */}
                        <div className="relative h-[300px] lg:h-full bg-slate-100 order-1 lg:order-2 overflow-hidden">
                            {program.image ? (
                                <>
                                    {/* Blurred Background */}
                                    <Image
                                        src={program.image}
                                        alt={program.title}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        className="object-cover blur-xl scale-110 opacity-50"
                                        priority
                                    />
                                    {/* Main Image */}
                                    <Image
                                        src={program.image}
                                        alt={program.title}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        className="object-contain z-10 relative"
                                        priority
                                    />
                                </>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                    <Heart className="w-20 h-20" />
                                </div>
                            )}

                            {/* Floating Stats Card - only show if there's progress */}
                            {showStatsCard && (
                                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 bg-gradient-to-t from-black/60 to-transparent">
                                    <FadeIn delay={0.2} className="bg-white rounded-none p-5 shadow-lg shadow-black/5 border border-slate-100 w-full relative z-20">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="space-y-1">
                                                <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Terkumpul</p>
                                                <p className="font-bold text-slate-900 text-lg md:text-xl leading-none">
                                                    {formatCurrency(current)}
                                                </p>
                                            </div>
                                            {showProgressDetails && (
                                                <div className="flex flex-col items-end pl-4">
                                                    <span className="inline-flex items-center justify-center bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-none min-w-[3.5rem]">
                                                        {percentage.toFixed(0)}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {showProgressDetails && (
                                            <>
                                                <div className="h-3 w-full bg-slate-200 rounded-none overflow-hidden mb-2">
                                                    <div
                                                        className="h-full bg-emerald-500 rounded-none transition-all duration-1000 ease-out relative"
                                                        style={{ width: `${Math.max(percentage, 2)}%` }}
                                                    />
                                                </div>
                                                <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                                                    <span>Progres Donasi</span>
                                                    <span>Target: {formatCurrency(target)}</span>
                                                </div>
                                            </>
                                        )}
                                    </FadeIn>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
