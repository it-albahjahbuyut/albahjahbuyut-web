import Image from "next/image";
import Link from "next/link";
import { Target, User, GraduationCap, BookOpen, Scroll, BookOpenCheck, Quote } from "lucide-react";
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
        <main>
            {/* Hero Section */}
            <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center bg-emerald-950 overflow-hidden pt-32">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 fixed-bg"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1974&auto=format&fit=crop')`
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-950/90" />

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <FadeIn delay={0.2}>
                        <span className="inline-block px-3 py-1 mb-4 border border-gold-400 text-gold-400 text-xs font-bold uppercase tracking-widest">
                            Tentang Kami
                        </span>
                    </FadeIn>
                    <FadeIn delay={0.4}>
                        <h1 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tighter mb-4">
                            Profil Al-Bahjah Buyut
                        </h1>
                    </FadeIn>
                    <FadeIn delay={0.6}>
                        <p className="text-emerald-100/80 font-serif italic text-lg max-w-3xl mx-auto">
                            Membangun peradaban mulia di bawah naungan Al-Qur'an dan Sunnah Rasulullah SAW.
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
                        {/* Main Content (History & Programs) */}
                        <div className="lg:col-span-12 xl:col-span-8 space-y-20">
                            {/* History */}
                            <FadeIn className="space-y-6">
                                <h2 className="text-3xl font-bold text-emerald-950 uppercase tracking-tight flex items-center gap-3">
                                    <span className="w-1.5 h-8 bg-gold-500 rounded-full"></span>
                                    Sejarah Singkat
                                </h2>
                                <div className="prose prose-lg prose-slate text-justify">
                                    <p className="leading-loose text-slate-600">
                                        <span className="text-emerald-900 font-bold">Lembaga Pengembangan Dakwah (LPD) Al-Bahjah Buyut</span> merupakan perpanjangan tangan dari dakwah mulia yang diasuh oleh <strong>Buya Yahya</strong>. Berdiri di tengah kerinduan umat akan lembaga pendidikan yang tidak hanya mengasah intelektual, tetapi juga menempa spiritualitas.
                                    </p>
                                    <p className="leading-loose text-slate-600">
                                        Kami bermula dari majelis taklim sederhana yang kemudian berkembang menjadi pusat pendidikan terpadu. Dengan semangat khidmat kepada umat, Al-Bahjah Buyut terus bertransformasi menghadirkan fasilitas pendidikan formal dan non-formal yang berkualitas, bersanad jelas, dan berorientasi pada pembentukan akhlakul karimah.
                                    </p>
                                </div>
                            </FadeIn>

                            {/* Tokoh Pesantren (Figures) */}
                            <div className="space-y-8">
                                <FadeIn>
                                    <h2 className="text-3xl font-bold text-emerald-950 uppercase tracking-tight flex items-center gap-3">
                                        <span className="w-1.5 h-8 bg-gold-500 rounded-full"></span>
                                        Tokoh & Pimpinan
                                    </h2>
                                </FadeIn>
                                <FadeInStagger className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                                    {figures.map((figure, idx) => (
                                        <FadeIn key={idx}>
                                            <div className="group bg-slate-50 rounded-xl overflow-hidden border border-slate-100 hover:shadow-lg transition-all duration-300 h-full">
                                                <div className="relative aspect-[3/4] bg-emerald-100 overflow-hidden">
                                                    {figure.image ? (
                                                        <Image
                                                            src={figure.image}
                                                            alt={figure.name}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-emerald-300">
                                                            <User className="w-20 h-20" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                                </div>
                                                <div className="p-4 text-center relative -mt-10">
                                                    <div className="bg-white rounded-lg p-3 shadow-md border-b-4 border-gold-500">
                                                        <h3 className="font-bold text-emerald-950 text-sm">{figure.name}</h3>
                                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{figure.role}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </FadeIn>
                                    ))}
                                </FadeInStagger>
                            </div>

                            {/* Programs */}
                            <div className="space-y-8">
                                <h2 className="text-3xl font-bold text-emerald-950 uppercase tracking-tight flex items-center gap-3">
                                    <span className="w-1.5 h-8 bg-gold-500 rounded-full"></span>
                                    Program Unggulan
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {units.map((unit) => {
                                        // Icon logic
                                        const unitIcons: any = {
                                            smpiqu: GraduationCap,
                                            smaiqu: BookOpen,
                                            tafaqquh: Scroll,
                                            tahfidz: BookOpenCheck,
                                        };
                                        const Icon = unitIcons[unit.slug] || BookOpen;

                                        // Strip HTML description
                                        const cleanDesc = unit.description ? unit.description.replace(/<[^>]*>?/gm, '') : "Program pendidikan unggulan.";

                                        return (
                                            <Link
                                                key={unit.id}
                                                href={`/pendidikan/${unit.slug}`}
                                                className="group relative block bg-emerald-50/50 overflow-hidden min-h-[280px] rounded-2xl hover:bg-emerald-900 transition-all duration-500 border border-emerald-100/50 hover:border-emerald-900 shadow-sm hover:shadow-xl"
                                            >
                                                {/* Large Background Icon */}
                                                <div className="absolute top-8 right-8 text-emerald-900/5 group-hover:text-white/10 transition-colors duration-500">
                                                    <Icon className="w-32 h-32 stroke-[1px]" />
                                                </div>

                                                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                                                    <div>
                                                        {/* Small Icon Badge */}
                                                        <div className="w-12 h-12 rounded-full border border-emerald-900/10 flex items-center justify-center mb-6 text-emerald-900 group-hover:border-white/20 group-hover:text-gold-400 transition-all duration-500 bg-white group-hover:bg-white/10">
                                                            <Icon className="w-5 h-5" />
                                                        </div>

                                                        {/* Title */}
                                                        <h3 className="text-2xl font-bold text-emerald-950 mb-4 group-hover:text-white transition-colors duration-500">
                                                            {unit.name}
                                                        </h3>

                                                        {/* Description */}
                                                        <p className="text-emerald-900/60 text-sm leading-relaxed max-w-sm group-hover:text-emerald-100/90 transition-colors duration-500 line-clamp-3">
                                                            {cleanDesc}
                                                        </p>
                                                    </div>

                                                    {/* Footer / CTA */}
                                                    <div className="flex items-center gap-4">
                                                        <span className="w-8 h-[1px] bg-emerald-900/20 group-hover:bg-white/30 transition-colors duration-500" />
                                                        <span className="text-xs font-bold tracking-widest text-emerald-900 group-hover:text-gold-400 transition-colors duration-500 uppercase">
                                                            Selengkapnya
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar (Visi Misi) */}
                        <div className="lg:col-span-12 xl:col-span-4 mt-12 xl:mt-0">
                            <div className="sticky top-32 space-y-8">
                                {/* Visi Card */}
                                <div className="relative overflow-hidden rounded-2xl bg-emerald-900 text-white p-8 lg:p-10 shadow-xl">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Target className="w-40 h-40" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="inline-block px-3 py-1 rounded bg-emerald-800 text-gold-400 text-xs font-bold tracking-widest mb-6">
                                            Visi
                                        </div>
                                        <p className="text-xl md:text-2xl font-serif leading-relaxed text-emerald-50">
                                            "Membangun Masyarakat Berakhlak Mulia, Bersendikan Al-Qu’ran dan Sunah Rasulullah SAW"
                                        </p>
                                    </div>
                                </div>

                                {/* Moto Card */}
                                <div className="bg-gold-500 rounded-2xl p-8 lg:p-10 shadow-xl text-emerald-950 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Quote className="w-32 h-32" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="inline-block px-3 py-1 rounded bg-emerald-950/10 text-emerald-950 text-xs font-bold uppercase tracking-widest mb-4">
                                            Moto
                                        </div>
                                        <p className="text-xl md:text-3xl font-bold font-serif italic leading-tight">
                                            “Tinggalan Kami Jika Tidak Berakhlak”
                                        </p>
                                    </div>
                                </div>

                                {/* Misi Card */}
                                <div className="bg-white rounded-2xl border border-slate-200 p-8 lg:p-10 shadow-lg">
                                    <div className="inline-block px-3 py-1 rounded bg-slate-100 text-emerald-900 text-xs font-bold uppercase tracking-widest mb-6">
                                        Misi Kami
                                    </div>
                                    <ul className="space-y-6">
                                        {[
                                            "Mengamalkan nilai-nilai Al-Qu’ran dan ajaran Rasulullah SAW sesuai dengan Manhajiah Islam Ahlusunah Waljama’ah, Asy-‘Ariyah, Asshuffiyah/Maturdiyah, Shufiyah dan Bermadzhab.",
                                            "Menghadirkan dakwah Islam dalam seluruh kehidupan masyarakat.",
                                            "Mewujudkan kemandirian ekonomi, pendidikan dan kebudayaan yang bersendikan syariah Islam.",
                                            "Mencetak para penghafal Al-Qur’an dan para Ulama yang akan menjadi duta pada perubahan kemuliaan peradaban.",
                                            "Mengkader para profesional dan enterpreneur yang beriman dan bertakwa dan menjadi pejuang dakwah Islam.",
                                            "Mengoptimalkan dan menguasai penggunan teknologi informasi dan media sebagai kekuatan mendoroong perjuangan dakwah islam."
                                        ].map((misi, idx) => (
                                            <li key={idx} className="flex gap-4 group">
                                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold flex items-center justify-center group-hover:bg-gold-500 group-hover:text-emerald-950 transition-colors">
                                                    {idx + 1}
                                                </span>
                                                <span className="text-slate-600 font-medium leading-relaxed group-hover:text-emerald-900 transition-colors">{misi}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gold-500 py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-emerald-950 uppercase tracking-tighter mb-8">
                        Mari Bergabung Bersama Kami
                    </h2>
                    <p className="text-emerald-900/80 text-lg mb-10 max-w-2xl mx-auto font-medium">
                        Jadilah bagian dari perjuangan dakwah Rasulullah SAW melalui Al-Bahjah Buyut.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/psb"
                            className="bg-emerald-950 text-white px-10 py-5 font-bold uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-xl hover:-translate-y-1"
                        >
                            Daftar Santri Baru
                        </Link>
                        <Link
                            href="/infaq"
                            className="bg-white text-emerald-950 px-10 py-5 font-bold uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-xl hover:-translate-y-1 border-2 border-emerald-950"
                        >
                            Salurkan Infaq
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
