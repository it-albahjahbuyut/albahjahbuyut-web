import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Landmark, ArrowLeft, Calendar, Target, Heart, Share2, MessageCircle } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import type { Metadata } from "next";
import { CopyButton } from "@/components/ui/copy-button";
import { ShareButton } from "@/components/ui/share-button";
import { InfaqGallery } from "./infaq-gallery";

interface PageProps {
    params: Promise<{ slug: string }>;
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

// Format date
function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const program = await db.donationProgram.findUnique({
        where: { slug },
    });

    if (!program) {
        return {
            title: "Program Tidak Ditemukan | Al-Bahjah Buyut",
        };
    }

    return {
        title: `${program.title} | Program Infaq Al-Bahjah Buyut`,
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

    return (
        <main className="bg-slate-50 min-h-screen">
            {/* Hero Section with Image */}
            {/* Hero Section with Image */}
            <section className="relative min-h-[60vh] flex items-end bg-emerald-950 overflow-hidden">
                {/* Background Image */}
                {program.image ? (
                    <Image
                        src={program.image}
                        alt={program.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-emerald-950" />
                )}

                {/* Dark Overlay for consistency */}
                <div className="absolute inset-0 bg-emerald-950/60" />

                {/* Bottom Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/80 to-transparent" />

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 lg:px-8 pb-12 pt-32">
                    <FadeIn>
                        <Link
                            href="/infaq"
                            className="inline-flex items-center gap-2 text-emerald-100/80 hover:text-white transition-colors mb-6 text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Daftar Program
                        </Link>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <div className="flex flex-wrap gap-3 mb-4">
                            {program.isFeatured && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-500 text-emerald-950 text-xs font-bold rounded-full">
                                    <Heart className="w-3 h-3" />
                                    Program Unggulan
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 text-xs font-medium rounded-full">
                                <Calendar className="w-3 h-3" />
                                Mulai {formatDate(program.startDate)}
                            </span>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4 max-w-3xl">
                            {program.title}
                        </h1>
                    </FadeIn>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 lg:py-16">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Left Column - Description */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Progress Card */}
                            {/* Progress Card - Minimalist */}
                            <FadeIn>
                                <div className="bg-white rounded-[2rem] border border-slate-100 p-8">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-slate-500 font-medium text-sm uppercase tracking-wider mb-1">Terkumpul</p>
                                            <p className="text-4xl lg:text-5xl font-bold text-emerald-950 tracking-tight">
                                                {formatCurrency(current)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="inline-flex items-center justify-center px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                                                {percentage.toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-6 mt-6">
                                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-2 text-xs font-medium text-slate-400">
                                            <span>0%</span>
                                            <span>Target: {formatCurrency(target)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50/50 p-3 rounded-xl">
                                        <Target className="w-4 h-4 text-emerald-600" />
                                        <p className="text-xs font-medium">Bantu kami mencapai target kebaikan ini.</p>
                                    </div>
                                </div>
                            </FadeIn>

                            {/* Description Card */}
                            {/* Description Section - Redesigned */}
                            <FadeIn delay={0.1}>
                                <div className="bg-white rounded-[2rem] border border-slate-100 p-8 lg:p-12 relative overflow-hidden group">
                                    {/* Decorative Background */}
                                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-8">
                                            <span className="w-1 h-8 bg-gold-500 rounded-full" />
                                            <h2 className="text-2xl font-bold text-emerald-950 tracking-tight">
                                                Tentang Program
                                            </h2>
                                        </div>

                                        <div className="prose prose-lg prose-emerald max-w-none">
                                            <p className="text-slate-600 leading-[2] font-light whitespace-pre-line">
                                                {program.description}
                                            </p>
                                        </div>


                                    </div>
                                </div>
                            </FadeIn>

                            {/* Gallery Section */}
                            {program.images && program.images.length > 0 && (
                                <FadeIn delay={0.15}>
                                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 lg:p-8">
                                        <h2 className="text-xl font-bold text-emerald-950 mb-6 flex items-center gap-2">
                                            <span className="w-8 h-1 bg-gold-500 rounded-full"></span>
                                            Dokumentasi & Perencanaan
                                        </h2>
                                        <InfaqGallery
                                            images={program.images.map(img => ({
                                                id: img.id,
                                                imageUrl: img.imageUrl,
                                                caption: img.caption
                                            }))}
                                            title={program.title}
                                        />
                                    </div>
                                </FadeIn>
                            )}

                            {/* Share Section */}
                            <FadeIn delay={0.2}>
                                <div className="bg-gradient-to-r from-emerald-50 to-gold-50 rounded-2xl p-6 lg:p-8 border border-emerald-100">
                                    <h3 className="font-bold text-emerald-950 mb-3 flex items-center gap-2">
                                        <Share2 className="w-5 h-5 text-emerald-600" />
                                        Sebarkan Kebaikan
                                    </h3>
                                    <p className="text-slate-600 text-sm mb-4">
                                        Bagikan program ini kepada keluarga dan teman-teman Anda. Setiap share adalah pahala yang mengalir.
                                    </p>
                                    <ShareButton
                                        title={program.title}
                                        description={program.description.slice(0, 100)}
                                    />
                                </div>
                            </FadeIn>
                        </div>

                        {/* Right Column - Donation Info */}
                        <div className="lg:col-span-1">
                            <FadeIn delay={0.15}>
                                <div className="sticky top-24 space-y-6">
                                    {/* Bank Info Card */}
                                    {/* Bank Info Card - Minimalist */}
                                    <div className="bg-white rounded-[2rem] border border-slate-100 p-8">
                                        <h3 className="font-bold text-emerald-950 mb-6 flex items-center gap-2">
                                            <Landmark className="w-5 h-5 text-emerald-600" />
                                            Informasi Rekening
                                        </h3>

                                        <div className="bg-slate-50 rounded-2xl p-6 mb-6 group hover:bg-emerald-50/50 transition-colors border border-transparent hover:border-emerald-100">
                                            <p className="text-xs uppercase tracking-widest text-slate-500 mb-4 font-semibold">
                                                {program.bankName}
                                            </p>
                                            <div className="flex items-center justify-between gap-3 mb-2">
                                                <p className="font-mono text-2xl lg:text-3xl font-bold text-emerald-950 tracking-tighter">
                                                    {program.accountNumber}
                                                </p>
                                                <CopyButton textToCopy={program.accountNumber} />
                                            </div>
                                            {program.accountName && (
                                                <p className="text-sm text-slate-500 font-medium">
                                                    a.n. {program.accountName}
                                                </p>
                                            )}
                                        </div>

                                        {/* WhatsApp Confirmation */}
                                        <a
                                            href={`https://wa.me/6282228682623?text=Assalamualaikum%2C%20saya%20ingin%20konfirmasi%20donasi%20untuk%20program%20${encodeURIComponent(program.title)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full bg-emerald-950 hover:bg-emerald-900 text-white py-4 px-6 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/10 hover:shadow-emerald-900/20 group"
                                        >
                                            <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            Konfirmasi Donasi
                                        </a>
                                    </div>

                                    {/* Quick Guide - Minimalist */}
                                    <div className="bg-white rounded-[2rem] border border-slate-100 p-8">
                                        <h4 className="font-bold text-emerald-950 mb-6 text-sm uppercase tracking-wider">
                                            Cara Berdonasi
                                        </h4>
                                        <ol className="space-y-4 text-sm">
                                            {[
                                                "Salin nomor rekening di atas",
                                                "Transfer via ATM / E-Banking",
                                                "Klik tombol Konfirmasi Donasi",
                                                "Kirimkan bukti transfer",
                                            ].map((step, idx) => (
                                                <li key={idx} className="flex gap-4 items-start group">
                                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-50 border border-slate-100 text-slate-400 font-bold text-xs flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-colors">
                                                        {idx + 1}
                                                    </span>
                                                    <span className="text-slate-600 font-medium pt-0.5">{step}</span>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
