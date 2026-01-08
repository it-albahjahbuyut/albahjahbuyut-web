import Link from "next/link";
import { db } from "@/lib/db";
import { UnitCard } from "@/components/public/UnitCard";
import { DonationCard } from "@/components/public/DonationCard";
import { NewsItem } from "@/components/public/NewsItem";
import { SchemaOrg } from "@/components/seo/SchemaOrg";
import { ArrowRight, BookOpenCheck, GraduationCap, Heart, Users } from "lucide-react";

export default async function HomePage() {
    // Fetch data from database
    const [units, featuredDonation, latestNews] = await Promise.all([
        db.unit.findMany({
            where: { isActive: true },
            orderBy: { order: "asc" },
        }),
        db.donationProgram.findFirst({
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
        }),
        db.post.findMany({
            where: { status: "PUBLISHED" },
            orderBy: { publishedAt: "desc" },
            take: 3,
        }),
    ]);

    return (
        <>
            {/* Schema.org Structured Data for SEO */}
            <SchemaOrg />
            
            {/* Hero Section */}
            <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-emerald-900">
                {/* Background Pattern */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/80 via-emerald-900/90 to-emerald-950" />

                {/* Decorative Elements */}
                <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/20 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full bg-emerald-500/20 blur-3xl" />

                {/* Content */}
                <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
                    {/* Badge */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-gold-400" />
                        <span className="text-sm font-medium text-emerald-100">
                            Pendaftaran Santri Baru Telah Dibuka
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="mb-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                        Membangun{" "}
                        <span className="bg-gradient-to-r from-gold-400 to-gold-500 bg-clip-text text-transparent">
                            Generasi Qur&apos;ani
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-emerald-100/90 sm:text-xl">
                        Pondok Pesantren Al-Bahjah Buyut mengintegrasikan pendidikan formal berkualitas dengan
                        pembelajaran Al-Qur&apos;an dan kitab kuning untuk mencetak generasi Muslim yang unggul.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/psb"
                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-gold-500/30 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-gold-500/40"
                        >
                            Daftar Sekarang
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                            href="/profil"
                            className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                        >
                            Tentang Kami
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
                        {[
                            { icon: Users, value: "500+", label: "Santri Aktif" },
                            { icon: GraduationCap, value: "4", label: "Program Unggulan" },
                            { icon: BookOpenCheck, value: "100+", label: "Hafidz Al-Qur'an" },
                            { icon: Heart, value: "15+", label: "Tahun Berdedikasi" },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                                    <stat.icon className="h-6 w-6 text-gold-400" />
                                </div>
                                <p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
                                <p className="text-sm text-emerald-200">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                    <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/30 p-1.5">
                        <div className="h-2 w-1 animate-bounce rounded-full bg-white/70" />
                    </div>
                </div>
            </section>

            {/* Unit Cards Section */}
            <section className="py-20 lg:py-28">
                <div className="mx-auto max-w-7xl px-4 lg:px-8">
                    {/* Section Header */}
                    <div className="mb-14 text-center">
                        <span className="mb-3 inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
                            Program Pendidikan
                        </span>
                        <h2 className="mb-4 text-3xl font-bold text-slate-800 sm:text-4xl lg:text-5xl">
                            Unit Pendidikan Kami
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-slate-600">
                            Pilih program yang sesuai dengan minat dan bakat putra-putri Anda
                        </p>
                    </div>

                    {/* Unit Grid */}
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {units.map((unit, index) => (
                            <UnitCard key={unit.id} unit={unit} index={index} />
                        ))}
                    </div>

                    {units.length === 0 && (
                        <div className="rounded-2xl bg-emerald-50 p-12 text-center">
                            <GraduationCap className="mx-auto mb-4 h-12 w-12 text-emerald-300" />
                            <p className="text-lg text-emerald-700">
                                Data unit pendidikan belum tersedia.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Donation Widget Section */}
            {featuredDonation && (
                <section className="bg-gradient-to-br from-emerald-50 to-slate-100 py-20 lg:py-28">
                    <div className="mx-auto max-w-7xl px-4 lg:px-8">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            {/* Text Content */}
                            <div>
                                <span className="mb-3 inline-block rounded-full bg-gold-100 px-4 py-1.5 text-sm font-semibold text-gold-700">
                                    💝 Program Infaq
                                </span>
                                <h2 className="mb-4 text-3xl font-bold text-slate-800 sm:text-4xl">
                                    Berikan Senyuman untuk Santri Kami
                                </h2>
                                <p className="mb-6 text-lg leading-relaxed text-slate-600">
                                    Setiap donasi Anda akan membantu pengembangan fasilitas pesantren dan kesejahteraan
                                    santri. Jadilah bagian dari kebaikan yang terus mengalir.
                                </p>
                                <Link
                                    href="/infaq"
                                    className="inline-flex items-center gap-2 text-lg font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
                                >
                                    Lihat Semua Program
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </div>

                            {/* Donation Card */}
                            <DonationCard program={featuredDonation} featured />
                        </div>
                    </div>
                </section>
            )}

            {/* Latest News Section */}
            <section className="py-20 lg:py-28">
                <div className="mx-auto max-w-7xl px-4 lg:px-8">
                    {/* Section Header */}
                    <div className="mb-14 flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div>
                            <span className="mb-3 inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
                                Berita & Kegiatan
                            </span>
                            <h2 className="text-3xl font-bold text-slate-800 sm:text-4xl">
                                Kabar Terbaru
                            </h2>
                        </div>
                        <Link
                            href="/berita"
                            className="inline-flex items-center gap-2 text-base font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
                        >
                            Lihat Semua Berita
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {/* News Grid */}
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {latestNews.map((post, index) => (
                            <NewsItem key={post.id} post={post} index={index} />
                        ))}
                    </div>

                    {latestNews.length === 0 && (
                        <div className="rounded-2xl bg-slate-100 p-12 text-center">
                            <p className="text-lg text-slate-600">
                                Belum ada berita yang dipublikasikan.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-br from-emerald-800 to-emerald-900 py-20">
                <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
                    <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                        Siap Bergabung dengan Keluarga Al-Bahjah Buyut?
                    </h2>
                    <p className="mb-8 text-lg text-emerald-100">
                        Daftarkan putra-putri Anda sekarang dan jadilah bagian dari generasi Qur&apos;ani.
                    </p>
                    <Link
                        href="/psb"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all hover:scale-105"
                    >
                        Daftar Sekarang
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </section>
        </>
    );
}
