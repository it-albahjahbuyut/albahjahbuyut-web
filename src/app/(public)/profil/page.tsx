import Image from "next/image";
import Link from "next/link";
import { Target, User, GraduationCap, BookOpen, Scroll, BookOpenCheck, Quote, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { UnitCard } from "@/components/public/UnitCard";
import { FadeIn, FadeInStagger } from "@/components/animations/FadeIn";

export const metadata = {
    title: "Profil | Pondok Pesantren Al-Bahjah Buyut",
    description: "Mengenal lebih dekat Pondok Pesantren Al-Bahjah Buyut, sejarah, visi-misi, dan nilai-nilai perjuangan.",
};

export default async function ProfilePage() {
    const units = await db.unit.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
    });

    const figures = [
        {
            name: "Buya Yahya",
            role: "Pengasuh LPD Al-Bahjah",
            // Placeholder image for Buya Yahya (using a respectful generic image or placeholder)
            image: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Buya_Yahya.jpg",
        },
        {
            name: "Abah Sayf Abu Hanifah",
            role: "Pengasuh Al-Bahjah Buyut",
            image: "https://res.cloudinary.com/dand8rpbb/image/upload/v1767976355/DSC00058_ioql27.jpg",
        },
        {
            name: "Kepala Sekolah SMPIQu",
            role: "Kepala Sekolah SMPIQu Al-Bahjah",
            image: null, // No image yet
        },
        {
            name: "Kepala Sekolah SMAIQu",
            role: "Kepala Sekolah SMAIQu Al-Bahjah",
            image: null, // No image yet
        }
    ];

    return (

        <main className="bg-white">
            {/* Hero Section */}
            <section className="relative min-h-[50vh] flex items-center justify-center bg-emerald-950 overflow-hidden px-4 pt-24 pb-20">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 fixed-bg"
                    style={{
                        backgroundImage: `url('https://res.cloudinary.com/dand8rpbb/image/upload/v1767934623/WhatsApp_Image_2026-01-08_at_11.07.46_PM_qqhota.jpg')`
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 via-emerald-950/60 to-emerald-950/90" />

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <FadeIn delay={0.2}>
                        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
                            Profil Kami
                        </h1>
                    </FadeIn>
                    <FadeIn delay={0.4}>
                        <p className="text-emerald-50/90 font-serif text-xl md:text-2xl max-w-3xl mx-auto italic leading-relaxed">
                            "Membangun peradaban mulia di bawah naungan Al-Qur'an dan Sunnah Rasulullah SAW."
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* History Section */}
            <section className="py-24 container mx-auto px-4 lg:px-8 max-w-5xl text-center">
                <FadeIn>
                    <h2 className="text-sm font-bold text-gold-600 uppercase tracking-[0.2em] mb-4">Sejarah Singkat</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-10 leading-snug">
                        Lembaga Pengembangan Dakwah (LPD) <br /> Al-Bahjah Buyut
                    </h3>
                    <div className="prose prose-lg prose-slate mx-auto text-slate-600 leading-loose">
                        <p>
                            Merupakan perpanjangan tangan dari dakwah mulia yang diasuh oleh <strong>Buya Yahya</strong>. Berdiri di tengah kerinduan umat akan lembaga pendidikan yang tidak hanya mengasah intelektual, tetapi juga menempa spiritualitas.
                        </p>
                        <p>
                            Kami bermula dari majelis taklim sederhana yang kemudian berkembang menjadi pusat pendidikan terpadu. Dengan semangat khidmat kepada umat, Al-Bahjah Buyut terus bertransformasi menghadirkan fasilitas pendidikan formal dan non-formal yang berkualitas, bersanad jelas, dan berorientasi pada pembentukan akhlakul karimah.
                        </p>
                    </div>
                </FadeIn>
            </section>

            {/* Visi Misi Section - Modern Centered Layout */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-100/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="container mx-auto px-4 lg:px-8 relative z-10">

                    {/* Visi & Moto Header */}
                    <FadeIn className="text-center max-w-4xl mx-auto mb-20">
                        <h1 className="text-sm font-bold text-gold-600 uppercase tracking-[0.2em] mb-6">Visi Kami</h1>
                        <p className="text-2xl md:text-4xl font-serif text-emerald-950 leading-tight mb-10 font-medium">
                            "Menjadi lembaga pendidikan profesional yang bisa menghadirkan generasi berkarakter islami, memiliki kecerdasan intelektual, emosi dan spiritual serta mampu mengamalkan Al-Qur'an untuk diri, keluarga dan bangsa."
                        </p>

                        <div className="inline-block relative">
                            <div className="absolute inset-0 bg-gold-400 blur opacity-20 transform rotate-2"></div>
                            <div className="relative bg-white border border-slate-100 shadow-sm rounded-full py-3 px-8 flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Moto</span>
                                <div className="w-px h-4 bg-slate-200"></div>
                                <span className="text-emerald-900 font-serif italic text-lg">"Tinggalan Kami Jika Tidak Berakhlak"</span>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Misi Grid */}
                    <div className="max-w-6xl mx-auto mb-20">
                        <FadeIn className="text-center mb-10">
                            <h3 className="text-xl font-bold text-emerald-950 inline-flex items-center gap-2 border-b-2 border-gold-400 pb-1">
                                Misi Kami
                            </h3>
                        </FadeIn>

                        <FadeInStagger className="grid md:grid-cols-3 gap-6">
                            {[
                                "Membentuk generasi berkarakter islami yang ber-aqidah Ahlussunnah Wal Jama'ah, Al-Asy'ariyah, Sufiyah, dan bermadzhab.",
                                "Membekali siswa-siswi dengan akhlak yang mulia.",
                                "Membiasakan siswa-siswi dekat dengan Al-Qur'an."
                            ].map((item, i) => (
                                <FadeIn key={i}>
                                    <div className="h-full bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-100 transition-all duration-300 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/60 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none transition-transform group-hover:scale-110" />
                                        <span className="relative z-10 text-5xl font-bold text-emerald-100 mb-4 block group-hover:text-gold-100 transition-colors">
                                            0{i + 1}
                                        </span>
                                        <p className="relative z-10 text-emerald-950 font-medium leading-relaxed">
                                            {item}
                                        </p>
                                    </div>
                                </FadeIn>
                            ))}
                        </FadeInStagger>
                    </div>

                    {/* Tujuan Grid */}
                    <div className="max-w-6xl mx-auto">
                        <FadeIn className="text-center mb-10">
                            <h3 className="text-xl font-bold text-emerald-950 inline-flex items-center gap-2 border-b-2 border-emerald-600 pb-1">
                                Tujuan
                            </h3>
                        </FadeIn>

                        <FadeInStagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                "Membentuk generasi Qur'ani penghafal Al-Qur'an yang berdedikasi.",
                                "Menghasilkan lulusan yang mampu mengamalkan ilmu Agama Islam.",
                                "Membentuk lingkungan berakhlaqul karimah melalui pendidikan karakter.",
                                "Menghasilkan lulusan yang menguasai sains, teknologi, dan berpikir kritis.",
                                "Meningkatkan kompetensi profesionalisme guru secara berkelanjutan.",
                                "Menyiapkan peserta didik yang cakap berbahasa Arab dan Inggris."
                            ].map((item, i) => (
                                <FadeIn key={i}>
                                    <div className="flex gap-4 p-5 bg-white rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-300">
                                        <div className="flex-shrink-0 w-2 bg-emerald-500 rounded-full" />
                                        <p className="text-slate-600 text-sm leading-relaxed font-medium">
                                            {item}
                                        </p>
                                    </div>
                                </FadeIn>
                            ))}
                        </FadeInStagger>
                    </div>
                </div>
            </section>

            {/* Figures Section - Minimalist Card Design */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                    <FadeIn className="text-center mb-16">
                        <h2 className="text-sm font-bold text-gold-600 uppercase tracking-[0.2em] mb-4">Struktur</h2>
                        <h3 className="text-3xl font-bold text-emerald-950">Tokoh & Pimpinan</h3>
                    </FadeIn>

                    {/* Unified Minimalist Grid Leaders */}
                    <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {figures.map((figure, idx) => (
                            <FadeIn key={idx}>
                                <div className="group text-center">
                                    {/* Image Container */}
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-slate-100 mb-4 mx-auto w-full max-w-[280px]">
                                        {figure.image ? (
                                            <Image
                                                src={figure.image}
                                                alt={figure.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                                <User className="w-16 h-16 opacity-50" />
                                            </div>
                                        )}
                                        {/* Overlay gradient on hover */}
                                        <div className="absolute inset-0 bg-emerald-950/0 group-hover:bg-emerald-950/10 transition-colors duration-300" />
                                    </div>

                                    {/* Text Content */}
                                    <div>
                                        <h4 className="text-lg font-bold text-emerald-950 mb-1 group-hover:text-emerald-700 transition-colors">
                                            {figure.name}
                                        </h4>
                                        <p className="text-slate-500 text-sm font-medium">{figure.role}</p>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </FadeInStagger>
                </div>
            </section>

            {/* Programs Section - Redesigned Minimalist Grid */}
            <section className="py-24 bg-white text-emerald-950">
                <div className="container mx-auto px-4 lg:px-8">
                    <FadeIn className="mb-16 md:flex justify-between items-end">
                        <div className="max-w-2xl">
                            <h2 className="text-sm font-bold text-gold-600 uppercase tracking-[0.2em] mb-4">Pendidikan</h2>
                            <h3 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-6">Program Unggulan</h3>
                            <p className="text-emerald-900/70 text-lg leading-relaxed">
                                Pilihan program pendidikan yang dirancang untuk membentuk generasi berkarakter Qur'ani dan berwawasan luas.
                            </p>
                        </div>
                        <Link href="/pendidikan" className="hidden md:inline-flex items-center gap-2 text-emerald-950 font-bold hover:text-gold-600 transition-colors uppercase tracking-widest text-sm">
                            Lihat Semua Program
                        </Link>
                    </FadeIn>

                    <FadeInStagger className="grid md:grid-cols-2 gap-8">
                        {units.map((unit) => {
                            const unitIcons: any = {
                                smpiqu: GraduationCap,
                                smaiqu: BookOpen,
                                tafaqquh: Scroll,
                                tahfidz: BookOpenCheck,
                            };
                            const Icon = unitIcons[unit.slug] || BookOpen;
                            const cleanDesc = unit.description ? unit.description.replace(/<[^>]*>?/gm, '') : "Program pendidikan unggulan.";

                            // Menentukan gambar default berdasarkan slug jika tidak ada gambar di database
                            let defaultImage = "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1974&auto=format&fit=crop";
                            if (unit.slug.includes('smp')) defaultImage = "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop";
                            if (unit.slug.includes('sma')) defaultImage = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop";
                            if (unit.slug.includes('tahfidz')) defaultImage = "https://images.unsplash.com/photo-1606233400587-c1dcb8dc2286?q=80&w=2070&auto=format&fit=crop";

                            return (
                                <FadeIn key={unit.id}>
                                    <Link
                                        href={`/pendidikan/${unit.slug}`}
                                        className="group relative flex flex-col h-[320px] w-full overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-950 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                                    >
                                        {/* Background Image with Gradient */}
                                        <div className="absolute inset-0 bg-emerald-950">
                                            <Image
                                                src={unit.image || defaultImage}
                                                alt={unit.name}
                                                fill
                                                className="object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-60"
                                            />
                                            {/* Gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/80 to-transparent" />
                                        </div>

                                        {/* Content */}
                                        <div className="relative z-10 flex h-full flex-col p-8">
                                            <h4 className="mb-3 text-2xl font-bold text-white group-hover:text-gold-400 transition-colors pt-4">
                                                {unit.name}
                                            </h4>

                                            <p className="mb-6 line-clamp-2 text-emerald-100/80 leading-relaxed font-light">
                                                {cleanDesc}
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
                        <Link href="/pendidikan" className="inline-flex items-center gap-2 text-gold-400 font-bold">
                            Lihat Semua Program
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
