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
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3lna5pypNzw2uM5TlKw2kNfWSH9n14VNLmg&s",
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
                        backgroundImage: `url('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1974&auto=format&fit=crop')`
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

            {/* Vision, Mission, Moto - Standard Minimalist Layout */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-16 items-start">
                        {/* Left Side: Visi & Moto */}
                        <FadeIn>
                            <div className="space-y-12 sticky top-24">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-800">
                                            <Target className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-emerald-950">Visi Kami</h2>
                                    </div>
                                    <p className="text-xl leading-relaxed text-slate-700 font-medium">
                                        "Menjadi lembaga pendidikan profesional yang bisa menghadirkan generasi berkarakter islami, memiliki kecerdasan intelektual, emosi dan spiritual serta mampu mengamalkan Al-Qur'an untuk diri, keluarga dan bangsa."
                                    </p>
                                </div>

                                <div className="p-8 bg-emerald-900 rounded-2xl text-white relative overflow-hidden">
                                    <Quote className="absolute top-4 right-4 text-emerald-800 w-24 h-24 rotate-12 opacity-50" />
                                    <div className="relative z-10">
                                        <span className="text-gold-400 text-xs font-bold uppercase tracking-widest mb-2 block">Moto</span>
                                        <p className="text-2xl font-serif italic font-medium leading-normal">
                                            “Tinggalan Kami Jika Tidak Berakhlak”
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        {/* Right Side: Misi List */}
                        <FadeIn delay={0.2}>
                            <div className="space-y-12">
                                <div>
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-800">
                                            <Target className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-emerald-950">Misi Kami</h2>
                                    </div>
                                    <ul className="space-y-6">
                                        {[
                                            "Membentuk generasi berkarakter islami yang ber-aqidah Ahlussunnah Wal Jama'ah, Al-Asy'ariyah, Sufiyah, dan bermadzhab sehingga mengantarkan peserta didik menjadi generasi kreatif, inovatif, responsif dan kritis serta dinamis yang bertanggung jawab.",
                                            "Membekali siswa-siswi dengan akhlak yang mulia.",
                                            "Membiasakan siswa-siswi dekat dengan Al-Qur'an."
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-4">
                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-400 text-white text-sm font-bold flex items-center justify-center mt-1">
                                                    {i + 1}
                                                </span>
                                                <span className="text-slate-600 leading-relaxed text-lg">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-800">
                                            <Target className="w-5 h-5" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-emerald-950">Tujuan</h2>
                                    </div>
                                    <ul className="space-y-6">
                                        {[
                                            "Membentuk generasi Qur'ani sehingga menghasilkan lulusan penghafal Al-Qur'an yang ber-dedikasi di lingkungan masyarakat.",
                                            "Menghasilkan lulusan yang mampu mengamalkan ilmu Agama Islam bagi pribadi, keluarga dan lingkungan masyarakat.",
                                            "Membentuk lingkungan yang berakhlaqul karimah melalui pendidikan karakter di pondok pesantren.",
                                            "Menghasilkan lulusan yang menguasai dasar-dasar ilmu pengetahuan sains dan teknologi serta memiliki kemampuan berfikir kritis, cakap berkomunikasi, bekerjasama dan kreatifitas yang tinggi untuk menghadapi persaingan global.",
                                            "Meningkatkan kompetensi profesionalisme guru melalui pengembangan profesi yang berkelanjutan.",
                                            "Menyiapkan peserta didik yang cakap berbahasa Arab dan Inggris sehingga mampu bersaing secara global."
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-4">
                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white text-sm font-bold flex items-center justify-center mt-1">
                                                    {i + 1}
                                                </span>
                                                <span className="text-slate-600 leading-relaxed text-lg">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Figures Section */}
            <section className="py-24 container mx-auto px-4 lg:px-8">
                <FadeIn className="text-center mb-16">
                    <h2 className="text-sm font-bold text-gold-600 uppercase tracking-[0.2em] mb-4">Struktur</h2>
                    <h3 className="text-3xl font-bold text-emerald-950">Tokoh & Pimpinan</h3>
                </FadeIn>

                <FadeInStagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {figures.map((figure, idx) => (
                        <FadeIn key={idx}>
                            <div className="group text-center">
                                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-slate-100 group-hover:border-gold-400 transition-colors duration-300">
                                    {figure.image ? (
                                        <Image
                                            src={figure.image}
                                            alt={figure.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                            <User className="w-20 h-20" />
                                        </div>
                                    )}
                                </div>
                                <h4 className="text-xl font-bold text-emerald-950 mb-1">{figure.name}</h4>
                                <p className="text-slate-500 text-sm uppercase tracking-wider">{figure.role}</p>
                            </div>
                        </FadeIn>
                    ))}
                </FadeInStagger>
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
