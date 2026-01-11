import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Landmark, ArrowRight, Share2, Target, Calendar, Clock, Copy, Check } from "lucide-react";
import { FadeIn, FadeInStagger } from "@/components/animations/FadeIn";
import { CopyButton } from "./copy-button";
import { ShareButton } from "./share-button";
import { InfaqGallery } from "./infaq-gallery";
import Link from "next/link";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const program = await db.donationProgram.findUnique({
        where: { slug },
    });

    if (!program || !program.isActive) {
        return null;
    }

    return {
        title: `${program.title} | Infaq Al-Bahjah Buyut`,
        description: program.description.slice(0, 160),
        openGraph: {
            title: program.title,
            description: program.description.slice(0, 160),
            images: program.image ? [program.image] : undefined,
        },
    };
}

export default async function DonationDetailPage({ params }: PageProps) {
    const { slug } = await params;

    const program = await db.donationProgram.findUnique({
        where: { slug },
        include: {
            images: {
                orderBy: { order: "asc" }
            }
        }
    });

    if (!program || !program.isActive) {
        notFound();
    }

    const target = Number(program.targetAmount);
    const current = Number(program.currentAmount);
    const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;

    // Type assertion for hideProgress if needed, though Prisma should provide it
    // @ts-ignore
    const hideProgress = program.hideProgress as boolean;

    return (
        <main className="bg-slate-50 min-h-screen pb-20">
            {/* Hero Header */}
            <div className="relative h-[60vh] bg-emerald-950 overflow-hidden flex items-end">
                {program.image && (
                    <Image
                        src={program.image}
                        alt={program.title}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent" />
                <div className="absolute inset-0 bg-emerald-950/30" />

                {/* Hero Content */}
                <div className="relative z-10 container mx-auto px-4 lg:px-8 pb-12">
                    <FadeIn>
                        <Link
                            href="/infaq"
                            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/10 mb-8"
                        >
                            <ArrowRight className="w-4 h-4 rotate-180" />
                            Kembali
                        </Link>
                        <div className="max-w-4xl">
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-500 text-emerald-950 text-xs font-bold uppercase tracking-wider rounded-full">
                                    <Target className="w-3.5 h-3.5" />
                                    Program Infaq
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 text-white/90 text-xs font-medium rounded-full backdrop-blur-sm">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {program.createdAt.toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric"
                                    })}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                                {program.title}
                            </h1>
                        </div>
                    </FadeIn>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 lg:px-8 py-16">
                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Left Column: Description */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Description */}
                        <FadeIn delay={0.1}>
                            <div className="prose prose-lg prose-slate max-w-none prose-p:leading-loose prose-headings:font-bold prose-headings:text-emerald-950 prose-a:text-emerald-600 prose-strong:text-emerald-900">
                                <p className="whitespace-pre-line text-slate-600 font-light text-lg">
                                    {program.description}
                                </p>
                            </div>
                        </FadeIn>

                        {/* Gallery Section */}
                        {program.images.length > 0 && (
                            <FadeIn delay={0.2}>
                                <div className="border-t border-slate-200 pt-12">
                                    <h3 className="text-2xl font-bold text-emerald-950 mb-8 flex items-center gap-3">
                                        <div className="w-8 h-1 bg-gold-500 rounded-full" />
                                        Dokumentasi Program
                                    </h3>
                                    <InfaqGallery
                                        images={program.images}
                                        title={program.title}
                                    />
                                </div>
                            </FadeIn>
                        )}

                        {/* Share Section */}
                        <FadeIn delay={0.3}>
                            <div className="bg-gradient-to-r from-emerald-50 to-gold-50 rounded-2xl p-6 lg:p-8 border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <h3 className="font-bold text-emerald-950 mb-2 flex items-center gap-2 text-lg">
                                        <Share2 className="w-5 h-5 text-emerald-600" />
                                        Sebarkan Kebaikan
                                    </h3>
                                    <p className="text-slate-600 text-sm max-w-md leading-relaxed">
                                        Bagikan link program ini kepada keluarga dan teman-teman Anda. Setiap share adalah pahala yang mengalir.
                                    </p>
                                </div>
                                <ShareButton title={program.title} description={program.description.slice(0, 100)} />
                            </div>
                        </FadeIn>
                    </div>

                    {/* Right Column: Donation Action (Sticky) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            <FadeIn delay={0.3} className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                {/* Progress Section */}
                                {!hideProgress && (
                                    <div className="mb-8">
                                        {target > 0 ? (
                                            <>
                                                <div className="flex justify-between items-end mb-2">
                                                    <div>
                                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Terkumpul</p>
                                                        <p className="text-2xl font-bold text-emerald-950">{formatCurrency(current)}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg">
                                                            {percentage.toFixed(0)}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-slate-400 text-right">
                                                    Target: {formatCurrency(target)}
                                                </p>
                                            </>
                                        ) : (
                                            <div className="text-center py-2 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                                                <p className="text-sm font-medium text-emerald-800">✨ Infaq Operasional & Rutin</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Bank Account */}
                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6 group transition-colors hover:bg-slate-50/80">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-emerald-600">
                                            <Landmark className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-medium">Transfer ke Bank</p>
                                            <p className="font-bold text-slate-900">{program.bankName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-2 bg-white p-3 rounded-xl border border-slate-100 mb-2">
                                        <code className="font-mono text-xl font-bold text-emerald-950 tracking-tight">
                                            {program.accountNumber}
                                        </code>
                                        <CopyButton textToCopy={program.accountNumber} />
                                    </div>
                                    {program.accountName && (
                                        <p className="text-xs text-slate-500 text-center">a.n. {program.accountName}</p>
                                    )}
                                </div>

                                {/* Call to Action */}
                                <div className="space-y-3">
                                    <a
                                        href={`https://wa.me/6282228682623?text=Assalamualaikum%2C%20saya%20ingin%20konfirmasi%20donasi%20untuk%20program%20${encodeURIComponent(program.title)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full bg-emerald-950 hover:bg-emerald-900 text-white py-4 px-6 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20 group"
                                    >
                                        Konfirmasi Donasi
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                    <p className="text-xs text-center text-slate-400 leading-relaxed px-4">
                                        Mohon konfirmasi setelah melakukan transfer agar donasi Anda tercatat.
                                    </p>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
