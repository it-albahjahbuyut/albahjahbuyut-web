import Image from "next/image";
import Link from "next/link";
import { Target, User } from "lucide-react";
import { db } from "@/lib/db";
import { UnitCard } from "@/components/public/UnitCard";

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
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
        },
        {
            name: "Abah Sayf Abu Hanifah",
            role: "Pengasuh Al-Bahjah Buyut",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
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
                    <span className="inline-block px-3 py-1 mb-4 border border-gold-400 text-gold-400 text-xs font-bold uppercase tracking-widest">
                        Tentang Kami
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tighter mb-4">
                        Profil Al-Bahjah Buyut
                    </h1>
                    <p className="text-emerald-100/80 font-serif italic text-lg max-w-3xl mx-auto">
                        Membangun peradaban mulia di bawah naungan Al-Qur'an dan Sunnah Rasulullah SAW.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
                        {/* Main Content (History & Programs) */}
                        <div className="lg:col-span-12 xl:col-span-8 space-y-20">
                            {/* History */}
                            <div className="space-y-6">
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
                            </div>

                            {/* Tokoh Pesantren (Figures) */}
                            <div className="space-y-8">
                                <h2 className="text-3xl font-bold text-emerald-950 uppercase tracking-tight flex items-center gap-3">
                                    <span className="w-1.5 h-8 bg-gold-500 rounded-full"></span>
                                    Tokoh & Pimpinan
                                </h2>
                                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                                    {figures.map((figure, idx) => (
                                        <div key={idx} className="group bg-slate-50 rounded-xl overflow-hidden border border-slate-100 hover:shadow-lg transition-all duration-300">
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
                                    ))}
                                </div>
                            </div>

                            {/* Programs */}
                            <div className="space-y-8">
                                <h2 className="text-3xl font-bold text-emerald-950 uppercase tracking-tight flex items-center gap-3">
                                    <span className="w-1.5 h-8 bg-gold-500 rounded-full"></span>
                                    Program Unggulan
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {units.map((unit, i) => (
                                        <UnitCard key={unit.id} unit={unit} index={i} />
                                    ))}
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
                                            "Terwujudnya lembaga dakwah dan pendidikan yang mampu mencetak kader ulama dan da'i yang berakhlak mulia."
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
                                            "Menyelenggarakan pendidikan Islam yang berkualitas.",
                                            "Membangun lingkungan kondusif untuk karakter santri.",
                                            "Mengembangkan dakwah yang rahmatan lil 'alamin.",
                                            "Memberdayakan potensi umat melalui program sosial."
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
