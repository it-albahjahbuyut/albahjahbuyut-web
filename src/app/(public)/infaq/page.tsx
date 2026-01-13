import { db } from "@/lib/db";
import { DonationCard } from "@/components/public/DonationCard";
import { Heart, ArrowRight } from "lucide-react";
import { FadeIn, FadeInStagger } from "@/components/animations/FadeIn";
import type { Metadata } from "next";

// Revalidate every 60 seconds to reduce database load
export const revalidate = 60;

export const metadata: Metadata = {
    title: "Program Infaq & Donasi | Pondok Pesantren Al-Bahjah Buyut",
    description:
        "Salurkan infaq dan sedekah Anda untuk pengembangan Pondok Pesantren Al-Bahjah Buyut. Setiap kontribusi Anda akan menjadi amal jariyah.",
};

async function getDonationPrograms() {
    try {
        const programs = await db.donationProgram.findMany({
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
        });
        return programs;
    } catch (error) {
        console.error("Failed to fetch donation programs:", error);
        return [];
    }
}

export default async function DonationPage() {
    const programs = await getDonationPrograms();

    return (
        <main className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-[50vh] flex items-center justify-center bg-emerald-950 overflow-hidden px-4 pt-24 pb-20">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 fixed-bg"
                    style={{
                        backgroundImage: `url('https://res.cloudinary.com/dand8rpbb/image/upload/v1767934623/WhatsApp_Image_2026-01-08_at_11.07.46_PM_1_uzkquu.jpg')`
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-950/90" />

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <FadeIn delay={0.2}>
                        <span className="inline-block px-3 py-1 mb-4 border border-gold-400 text-gold-400 text-xs font-bold tracking-widest">
                            Amal Jariyah
                        </span>
                    </FadeIn>
                    <FadeIn delay={0.4}>
                        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-4">
                            Program Infaq & Donasi
                        </h1>
                    </FadeIn>
                    <FadeIn delay={0.6}>
                        <p className="text-emerald-100/80 font-serif italic text-lg max-w-3xl mx-auto">
                            "Perumpamaan orang yang menginfakkan hartanya di jalan Allah seperti sebutir biji yang menumbuhkan tujuh tangkai."
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 lg:px-8">
                    {/* Section Header */}
                    <FadeIn className="mb-16 text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-emerald-950 tracking-wide mb-4">
                            Program Pilihan
                        </h2>
                        <div className="w-16 h-1 bg-gold-500 mx-auto mb-6"></div>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            Pilih peluang kebaikan Anda hari ini. Setiap rupiah yang Anda infaqkan akan menjadi saksi kebaikan di akhirat kelak.
                        </p>
                    </FadeIn>

                    {/* Programs Grid */}
                    {programs.length > 0 ? (
                        <FadeInStagger className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-24">
                            {programs.map((program, index) => (
                                <FadeIn key={program.id}>
                                    <DonationCard
                                        program={{
                                            id: program.id,
                                            title: program.title,
                                            slug: program.slug,
                                            description: program.description,
                                            image: program.image,
                                            targetAmount: program.targetAmount.toString(),
                                            currentAmount: program.currentAmount.toString(),
                                            bankName: program.bankName,
                                            accountNumber: program.accountNumber,
                                            accountName: program.accountName,
                                            categoryLabel: program.categoryLabel,
                                        }}
                                        index={index}
                                    />
                                </FadeIn>
                            ))}
                        </FadeInStagger>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center mb-24">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-emerald-950 tracking-wide mb-2">Belum Ada Program</h3>
                            <p className="text-slate-500">Saat ini kami sedang mempersiapkan program kebaikan selanjutnya. Mari bersama-sama menebar manfaat untuk umat.</p>
                        </div>
                    )}

                    {/* Donation Guide - Integrated Panel Design */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                        {/* Process Steps Step Banner */}
                        <div className="p-8 lg:p-12">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 lg:gap-4 relative">
                                {/* Connecting Line (Desktop) */}
                                <div className="hidden lg:block absolute top-6 left-16 right-16 h-0.5 bg-slate-100" />

                                {[
                                    { title: "Pilih Program", desc: "Pilih peluang amal Anda" },
                                    { title: "Salin Rekening", desc: "Copy nomor rekening" },
                                    { title: "Lakukan Transfer", desc: "Via ATM / E-Banking" },
                                    { title: "Konfirmasi", desc: "Kirimi kami bukti transfer" }
                                ].map((step, idx) => (
                                    <div key={idx} className="relative z-10 flex lg:flex-col items-center gap-4 lg:gap-6 w-full lg:text-center group">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border-2 border-slate-100 text-slate-400 font-bold flex items-center justify-center text-lg transition-all duration-300 group-hover:border-gold-500 group-hover:text-gold-500 group-hover:scale-110 shadow-sm">
                                            {idx + 1}
                                        </div>
                                        <div className="pt-1 lg:pt-0">
                                            <h4 className="font-bold text-emerald-950 text-lg mb-1">{step.title}</h4>
                                            <p className="text-slate-500 text-sm">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Integrated CTA Section */}
                        <div className="bg-emerald-950 p-8 lg:px-12 lg:py-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                            {/* Decorative Background Pattern */}
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none" />
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                            <div className="relative z-10 text-center md:text-left">
                                <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-3">
                                    Sudah Melakukan Transfer?
                                </h3>
                                <p className="text-emerald-100/80 text-sm max-w-xl font-light">
                                    Mohon konfirmasi donasi Anda agar tercatat dalam sistem kami.
                                </p>
                            </div>

                            <a
                                href="https://wa.me/6282228682623?text=Assalamualaikum%2C%20saya%20ingin%20konfirmasi%20donasi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative z-10 inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-emerald-950 px-8 py-3.5 rounded-full font-bold transition-all shadow-lg hover:shadow-gold-500/20 whitespace-nowrap"
                            >
                                Konfirmasi via WhatsApp
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
