import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { CheckCircle2, FileText, ArrowRight, Wallet, GraduationCap } from "lucide-react";

export const metadata = {
    title: "Penerimaan Santri Baru (PSB) | Pondok Pesantren Al-Bahjah Buyut",
    description: "Informasi lengkap pendaftaran santri baru Pondok Pesantren Al-Bahjah Buyut. Jadilah bagian dari kami.",
};

export default async function PSBPage() {
    const units = await db.unit.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
    });

    const steps = [
        {
            title: "Pendaftaran Online",
            desc: "Isi formulir pendaftaran melalui website resmi atau link yang tersedia.",
            icon: FileText
        },
        {
            title: "Pembayaran Formulir",
            desc: "Lakukan pembayaran biaya pendaftaran sesuai unit yang dituju.",
            icon: Wallet
        },
        {
            title: "Tes Seleksi",
            desc: "Ikuti tes seleksi akademik dan wawancara sesuai jadwal.",
            icon: GraduationCap
        },
        {
            title: "Pengumuman",
            desc: "Hasil seleksi akan diumumkan melalui website dan kontak terdaftar.",
            icon: CheckCircle2
        }
    ];

    return (
        <main className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center bg-emerald-950 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 fixed-bg"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')`
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-950/90" />

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <span className="inline-block px-3 py-1 mb-4 border border-gold-400 text-gold-400 text-xs font-bold tracking-widest">
                        Tahun Ajaran 2025/2026
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-4">
                        Penerimaan Santri Baru
                    </h1>
                    <p className="text-emerald-100/80 font-serif italic text-lg max-w-3xl mx-auto">
                        Mari bergabung menjadi generasi Qur'ani berakhlak mulia bersama Al-Bahjah Buyut.
                    </p>
                </div>
            </section>

            {/* Registration Flow */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-emerald-950 tracking-wide mb-4">
                            Alur Pendaftaran
                        </h2>
                        <div className="w-16 h-1 bg-gold-500 mx-auto mb-6"></div>
                        <p className="text-slate-600 text-lg">
                            Proses pendaftaran santri baru dilakukan secara online dan terstruktur untuk memudahkan calon wali santri.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, idx) => (
                            <div key={idx} className="relative group p-8 bg-slate-50 border border-slate-100 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-slate-300 group-hover:text-gold-500/20 transition-colors">
                                    {idx + 1}
                                </div>
                                <div className="w-14 h-14 bg-emerald-900 rounded-lg flex items-center justify-center mb-6 group-hover:bg-gold-500 transition-colors">
                                    <step.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-emerald-900 uppercase tracking-tight mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Units Selection */}
            <section className="py-20 bg-emerald-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-gold-600 text-sm font-bold uppercase tracking-widest block mb-2">Pilihan Jenjang</span>
                        <h2 className="text-3xl font-bold text-emerald-950 uppercase tracking-wide mb-6">
                            Daftar Sekarang
                        </h2>
                        <p className="text-slate-600 text-lg">
                            Pilih jenjang pendidikan yang sesuai dan mulai langkah awal pendidikan terbaik putra-putri Anda.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {units.map((unit) => (
                            <div key={unit.id} className="bg-white rounded-xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-300 border-t-8 border-gold-500">
                                <div className="p-8">
                                    <div className="mb-6">
                                        <h3 className="text-2xl font-bold text-emerald-950 uppercase tracking-tight mb-2">
                                            {unit.name}
                                        </h3>
                                        <div className="w-12 h-1 bg-slate-200 group-hover:bg-gold-500 transition-colors"></div>
                                    </div>
                                    <p className="text-slate-500 mb-8 line-clamp-3 text-sm min-h-[60px]">
                                        {unit.description || `Program unggulan ${unit.name} dengan kurikulum terpadu berbasis Islam dan standar nasional.`}
                                    </p>

                                    <div className="space-y-3">
                                        <Link
                                            href={unit.registrationLink || `/pendidikan/${unit.slug}`}
                                            target={unit.registrationLink ? "_blank" : "_self"}
                                            className="block w-full text-center bg-emerald-950 text-white font-bold py-3 uppercase tracking-wider hover:bg-gold-500 hover:text-emerald-950 transition-colors"
                                        >
                                            Daftar {unit.name}
                                        </Link>
                                        <Link
                                            href={`/pendidikan/${unit.slug}`}
                                            className="block w-full text-center border border-emerald-950 text-emerald-950 font-bold py-3 uppercase tracking-wider hover:bg-emerald-50 transition-colors"
                                        >
                                            Info Detail
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-slate-50 to-transparent"></div>
            </section>
        </main>
    );
}
