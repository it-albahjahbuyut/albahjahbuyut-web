import { db } from "@/lib/db";
import { DonationCard } from "@/components/public/DonationCard";
import { Heart, Landmark } from "lucide-react";
import { FadeIn, FadeInStagger } from "@/components/animations/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Program Donasi & Infaq | Pondok Pesantren Al-Bahjah Buyut",
    description:
        "Salurkan infaq dan sedekah Anda untuk pengembangan Pondok Pesantren Al-Bahjah Buyut. Setiap kontribusi Anda akan menjadi amal jariyah.",
};

export default async function DonationPage() {
    const programs = await db.donationProgram.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-[50vh] flex items-center justify-center bg-emerald-950 overflow-hidden px-4 pt-24 pb-20">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 fixed-bg"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop')`
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
                            <h3 className="text-xl font-bold text-slate-700 uppercase tracking-wide mb-2">Belum Ada Program</h3>
                            <p className="text-slate-500">Saat ini belum ada program donasi yang dibuka.</p>
                        </div>
                    )}

                    {/* How to Donate & Confirmation */}
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Steps */}
                        <div className="bg-white p-8 lg:p-10 border border-slate-200 shadow-sm rounded-xl">
                            <h3 className="text-2xl font-bold text-emerald-950 uppercase tracking-wide mb-8 flex items-center gap-3">
                                <span className="w-1 h-8 bg-gold-500 block"></span>
                                Cara Berdonasi
                            </h3>
                            <FadeInStagger faster className="space-y-6">
                                {[
                                    "Pilih program donasi yang ingin Anda dukung.",
                                    "Salin nomor rekening tujuan yang tertera.",
                                    "Lakukan transfer melalui ATM atau Mobile Banking.",
                                    "Lakukan konfirmasi agar donasi tercatat."
                                ].map((step, idx) => (
                                    <FadeIn key={idx}>
                                        <div className="flex gap-5">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-950 text-gold-400 font-bold flex items-center justify-center text-sm border-2 border-emerald-950">
                                                {idx + 1}
                                            </div>
                                            <p className="text-slate-700 font-medium pt-1 text-lg">{step}</p>
                                        </div>
                                    </FadeIn>
                                ))}
                            </FadeInStagger>
                        </div>

                        {/* Confirmation CTA */}
                        <div className="bg-emerald-950 text-white p-8 lg:p-10 rounded-xl shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Landmark className="w-48 h-48" />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <h3 className="text-2xl font-bold uppercase tracking-wide text-gold-400">
                                    Sudah Transfer?
                                </h3>
                                <p className="text-emerald-100/80 leading-relaxed text-lg">
                                    Mohon lakukan konfirmasi donasi Anda untuk memudahkan kami dalam pencatatan dan pelaporan amanah.
                                </p>
                                <a
                                    href="https://wa.me/6281234567890?text=Assalamualaikum%2C%20saya%20ingin%20konfirmasi%20donasi"
                                    className="inline-flex w-full items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-emerald-950 px-8 py-4 font-bold uppercase tracking-widest transition-all hover:-translate-y-1 shadow-lg"
                                >
                                    Konfirmasi via WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
