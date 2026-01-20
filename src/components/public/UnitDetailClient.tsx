"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft,
    BookOpen,
    GraduationCap,
    Calendar,
    CheckCircle2,
    ArrowRight,
    Instagram,
    Facebook,
    Youtube,
    Twitter,
    MessageCircle,
    Globe,
} from "lucide-react";
import { FadeIn, FadeInStagger } from "@/components/animations/FadeIn";

// TikTok icon
function TikTokIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
    );
}

function getPlatformIcon(platform: string) {
    switch (platform) {
        case "instagram": return Instagram;
        case "facebook": return Facebook;
        case "youtube": return Youtube;
        case "tiktok": return TikTokIcon;
        case "twitter": return Twitter;
        case "whatsapp": return MessageCircle;
        default: return Globe;
    }
}

interface UnitDetailClientProps {
    unit: any; // We can use a more specific type if available, but 'any' is safe for now given the Prisma type complexity
    descriptionHtml: string;
    curriculumHtml: string;
    facilities: string[];
}

export function UnitDetailClient({ unit, descriptionHtml, curriculumHtml, facilities }: UnitDetailClientProps) {
    const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);

    return (
        <>
            {/* Hero Section */}
            <section className="relative min-h-[50vh] flex items-center bg-zinc-900 overflow-hidden py-32">
                {/* Background Image */}
                {unit.image ? (
                    <Image
                        src={unit.image}
                        alt={unit.name}
                        fill
                        className="object-cover opacity-50"
                        priority
                    />
                ) : (
                    <div
                        className="absolute inset-0 opacity-30 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f?q=80&w=2070&auto=format&fit=crop')`,
                        }}
                    />
                )}

                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-950/90" />

                {/* Content */}
                <div className="relative z-10 w-full container mx-auto px-4 lg:px-8">
                    <FadeIn delay={0.1}>
                        <Link
                            href="/pendidikan"
                            className="mb-8 inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest hover:text-white transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Link>
                    </FadeIn>

                    <div className="max-w-4xl">
                        <FadeIn delay={0.2}>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="inline-block px-3 py-1 border border-gold-500 text-gold-400 text-xs font-bold uppercase tracking-widest">
                                    Unit Pendidikan
                                </span>
                                {(unit.slug?.includes('smp') || unit.slug?.includes('sma')) && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest rounded-full">
                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Akreditasi A
                                    </span>
                                )}
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.3}>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-tighter leading-none mb-6">
                                {unit.name}
                            </h1>
                        </FadeIn>
                        <FadeIn delay={0.4}>
                            <p className="text-xl md:text-2xl text-emerald-100 font-serif italic">
                                Membangun Generasi Qur'ani Berakhlak Mulia
                            </p>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-20 bg-white relative">
                {/* Subtle Background Pattern */}
                <div className="absolute top-0 right-0 -z-10 w-1/3 h-1/3 opacity-5 bg-[radial-gradient(#065f46_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid gap-16 lg:grid-cols-12">
                        {/* Main Content Column */}
                        <div className="lg:col-span-8 space-y-20">
                            {/* Description */}
                            <FadeIn>
                                <h2 className="text-3xl font-bold text-emerald-950 tracking-tight mb-8 flex items-center gap-4">
                                    <span className="w-1.5 h-10 bg-gold-400 rounded-full block"></span>
                                    Tentang {unit.name}
                                </h2>
                                <div
                                    className="prose prose-lg prose-emerald max-w-none text-slate-600 leading-loose pl-5"
                                    dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                                />
                            </FadeIn>

                            {/* Visi Misi Tujuan - Only for formal units (SMP, SMA, SD) */}
                            {(unit.slug?.includes('smp') || unit.slug?.includes('sma') || unit.slug?.includes('sd')) && (
                                <FadeIn>
                                    <div className="space-y-12">
                                        {/* Visi */}
                                        <div>
                                            <h2 className="text-3xl font-bold text-emerald-950 tracking-tight mb-6 flex items-center gap-4">
                                                <span className="w-1.5 h-10 bg-emerald-500 rounded-full block"></span>
                                                Visi
                                            </h2>
                                            <div className="pl-5">
                                                <p className="text-slate-600 leading-relaxed text-lg">
                                                    Menjadi lembaga pendidikan profesional yang bisa menghadirkan generasi berkarakter islami, memiliki kecerdasan intelektual, emosi dan spiritual serta mampu mengamalkan Al-Qur&apos;an untuk diri, keluarga dan bangsa.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Misi */}
                                        <div>
                                            <h2 className="text-3xl font-bold text-emerald-950 tracking-tight mb-6 flex items-center gap-4">
                                                <span className="w-1.5 h-10 bg-emerald-500 rounded-full block"></span>
                                                Misi
                                            </h2>
                                            <ul className="pl-5 space-y-3">
                                                {[
                                                    "Membentuk generasi berkarakter silami yang ber-aqidahkan Ahlussunnah Wal Jama'ah, Al-Asy'ariyah, Sufiyah, dan bermadzhab sehingga mengantarkan peserta didik menjadi generasi kreatif, inofatif, responsif dan kritis serta dinamis yang bertanggung jawab.",
                                                    "Membekali siswa-siswi dengan akhlak yang mulia.",
                                                    "Membiasakan siswa-siswi dekat dengan Al-Qur'an."
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-1 shrink-0" />
                                                        <span className="text-slate-600 leading-relaxed">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Tujuan */}
                                        <div>
                                            <h2 className="text-3xl font-bold text-emerald-950 tracking-tight mb-6 flex items-center gap-4">
                                                <span className="w-1.5 h-10 bg-emerald-500 rounded-full block"></span>
                                                Tujuan
                                            </h2>
                                            <ul className="pl-5 space-y-3">
                                                {[
                                                    "Membentuk generasi Qur'ani sehingga menghasilkan lulusan penghafal Al-Qur'an yang berdedikasi di lingkungan masyarakat.",
                                                    "Menghasilkan lulusan yang mampu mengamalkan ilmu Agama Islam bagi pribadi, keluarga dan lingkungan masyarakat.",
                                                    "Membentuk lingkungan yang berakhlakul karimah melalui pendidikan karakter di pondok pesantren.",
                                                    "Menghasilkan lulusan yang menguasai dasar-dasar ilmu pengetahuan sains dan teknologi serta memiliki kemampuan berpikir kritis, cakap berkomunikasi, bekerjasama dan kreatifitas yang tinggi untuk menghadapi persaingan global.",
                                                    "Meningkatkan kompetensi profesionalisme guru melalui pengembangan profesi yang berkelanjutan.",
                                                    "Menyiapkan peserta didik yang cakap berbahasa Arab dan Inggris sehingga mampu bersaing secara global."
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-1 shrink-0" />
                                                        <span className="text-slate-600 leading-relaxed">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </FadeIn>
                            )}

                            {/* Curriculum */}
                            {curriculumHtml && (
                                <FadeIn>
                                    <div className="relative">
                                        <h2 className="text-3xl font-bold text-emerald-950 tracking-tight mb-8 flex items-center gap-4">
                                            <span className="w-1.5 h-10 bg-gold-400 rounded-full block"></span>
                                            Kurikulum Pendidikan
                                        </h2>
                                        <div className="prose prose-emerald max-w-none text-slate-600 pl-5">
                                            <div dangerouslySetInnerHTML={{ __html: curriculumHtml }} />
                                        </div>
                                    </div>
                                </FadeIn>
                            )}

                            {/* Facilities */}
                            {facilities.length > 0 && (
                                <FadeIn>
                                    <h2 className="text-3xl font-bold text-emerald-950 tracking-tight mb-10">
                                        Fasilitas Penunjang
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                        {facilities.map((facility, index) => (
                                            <div
                                                key={index}
                                                className="group flex items-start p-4 -ml-4 rounded-xl transition-all duration-300 hover:bg-emerald-50/50"
                                            >
                                                <div className="flex-shrink-0 mt-1">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <span className="text-lg text-slate-700 font-medium group-hover:text-emerald-900 transition-colors">
                                                        {facility}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </FadeIn>
                            )}

                            {/* Activity Gallery */}
                            {unit.galleries && unit.galleries.length > 0 && (
                                <FadeIn>
                                    <h2 className="text-3xl font-bold text-emerald-950 tracking-tight mb-10 mt-20 flex items-center gap-4">
                                        <span className="w-1.5 h-10 bg-gold-400 rounded-full block"></span>
                                        Galeri Kegiatan
                                    </h2>
                                    <FadeInStagger className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {unit.galleries.map((gallery: any) => (
                                            <FadeIn key={gallery.id}>
                                                <div
                                                    className="relative aspect-square rounded-xl overflow-hidden group bg-slate-100 shadow-sm border border-slate-200 cursor-pointer"
                                                    onClick={() => setSelectedImage({ url: gallery.imageUrl, title: gallery.title })}
                                                >
                                                    <Image
                                                        src={gallery.imageUrl}
                                                        alt={gallery.title}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                                        <p className="text-white text-center text-sm font-bold tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{gallery.title}</p>
                                                    </div>
                                                </div>
                                            </FadeIn>
                                        ))}
                                    </FadeInStagger>
                                </FadeIn>
                            )}
                        </div>

                        {/* Sidebar Column */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-32 space-y-8">
                                {/* Registration Card */}
                                <FadeIn delay={0.2}>
                                    <div className="bg-emerald-900 rounded-3xl p-8 text-center relative overflow-hidden group">
                                        {/* Abstract Shape */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800/20 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-emerald-700/30" />
                                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl -ml-16 -mb-16" />

                                        <h3 className="text-2xl font-bold text-white mb-4 relative z-10">
                                            Pendaftaran Dibuka
                                        </h3>
                                        <p className="text-emerald-100/90 mb-8 leading-relaxed relative z-10">
                                            Mari bergabung menjadi bagian dari keluarga besar Al-Bahjah Buyut.
                                        </p>

                                        <div className="space-y-3 relative z-10">
                                            <Link
                                                href={unit.registrationLink || "/psb"}
                                                className="block w-full bg-white text-emerald-950 font-bold py-4 px-6 rounded-xl hover:bg-gold-400 transition-all duration-300 transform hover:-translate-y-1 text-sm tracking-wide uppercase"
                                            >
                                                Daftar Sekarang
                                            </Link>

                                            <a
                                                href="https://wa.me/6289676539390"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full bg-emerald-800/50 text-emerald-100 font-medium py-3 px-6 rounded-xl hover:bg-emerald-800 transition-colors text-sm"
                                            >
                                                Konsultasi via WhatsApp
                                            </a>
                                        </div>
                                    </div>
                                </FadeIn>

                                {/* Contact Info */}
                                <FadeIn delay={0.4}>
                                    <div className="p-6 border-l-2 border-slate-100">
                                        <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gold-500"></div>
                                            Informasi Kontak
                                        </h4>
                                        <ul className="space-y-6">
                                            <li className="group">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Alamat</p>
                                                <p className="text-sm text-slate-600 leading-relaxed group-hover:text-emerald-800 transition-colors">
                                                    Jl. Revolusi No.45, Buyut, Kec. Gunungjati, Kabupaten Cirebon
                                                </p>
                                            </li>
                                            <li className="group">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                                                <p className="text-sm text-slate-600 group-hover:text-emerald-800 transition-colors">
                                                    info@albahjahbuyut.com
                                                </p>
                                            </li>
                                            <li className="group">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Telepon</p>
                                                <p className="text-sm text-slate-600 group-hover:text-emerald-800 transition-colors">
                                                    0896 7653 9390
                                                </p>
                                            </li>
                                        </ul>
                                    </div>
                                </FadeIn>

                                {/* Social Media Section */}
                                {unit.socialMedia && unit.socialMedia.length > 0 && (
                                    <FadeIn delay={0.5}>
                                        <div className="pt-6 border-t border-slate-100">
                                            <div className="flex gap-4">
                                                {unit.socialMedia.filter((s: any) => s.isActive).map((social: any) => {
                                                    const Icon = getPlatformIcon(social.platform);
                                                    return (
                                                        <a
                                                            key={social.id}
                                                            href={social.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-slate-400 hover:text-emerald-600 transition-colors"
                                                            title={social.label || social.platform}
                                                        >
                                                            <Icon className="w-5 h-5" />
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </FadeIn>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lightbox Overlay */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 transition-opacity duration-300"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>

                    <div className="relative w-full max-w-5xl h-full max-h-[90vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
                        <div className="relative w-full h-full">
                            <Image
                                src={selectedImage.url}
                                alt={selectedImage.title}
                                fill
                                className="object-contain"
                                sizes="100vw"
                                priority
                            />
                        </div>
                        {selectedImage.title && (
                            <div className="absolute bottom-4 left-0 right-0 text-center">
                                <span className="inline-block bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10">
                                    {selectedImage.title}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
