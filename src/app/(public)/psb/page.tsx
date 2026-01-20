import Link from "next/link";
import { db } from "@/lib/db";
import {
    CheckCircle2,
    FileText,
    ArrowRight,
    CreditCard,
    GraduationCap,
    MapPin,
    Phone,
    Calendar,
    Users
} from "lucide-react";
import { FadeIn, FadeInStagger } from "@/components/animations/FadeIn";
import { FAQSection } from "@/components/psb/FAQSection";

export const metadata = {
    title: "Penerimaan Santri Baru (PSB) | Pondok Pesantren Al-Bahjah Buyut",
    description: "Informasi lengkap pendaftaran santri baru Pondok Pesantren Al-Bahjah Buyut. Jadilah bagian dari kami.",
};

export default async function PSBPage() {
    const units = await db.unit.findMany({
        where: {
            isActive: true,
            // Hanya ambil unit formal untuk PSB (SD, SMP, SMA)
            OR: [
                { slug: { contains: "sd" } },
                { slug: { contains: "smp" } },
                { slug: { contains: "sma" } }
            ]
        },
        orderBy: { order: "asc" },
    });

    const flowSteps = [
        {
            title: "1. Daftar Online",
            desc: "Isi formulir biodata diri melalui website ini.",
            icon: FileText
        },
        {
            title: "2. Pembayaran",
            desc: "Transfer biaya pendaftaran & upload bukti.",
            icon: CreditCard
        },
        {
            title: "3. Tes Seleksi",
            desc: "Ikuti tes akademik, membaca Al-Qur'an & wawancara.",
            icon: GraduationCap
        },
        {
            title: "4. Pengumuman",
            desc: "Cek hasil kelulusan melalui dashboard akun.",
            icon: CheckCircle2
        }
    ];

    const requirements = [
        "Mengisi Formulir Pendaftaran Online",
        "Pas Foto 3x4 (4 lembar)",
        "Fotocopy Kartu Keluarga (KK)",
        "Fotocopy Akta Kelahiran",
        "Fotocopy KTP Orang Tua",
        "Surat Keterangan Aktif Sekolah / Ijazah"
    ];

    return (
        <main className="bg-white min-h-screen font-sans selection:bg-emerald-100 selection:text-emerald-900">
            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center justify-center bg-emerald-950 overflow-hidden px-4 pt-24 pb-20">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 fixed-bg"
                    style={{
                        backgroundImage: `url('https://res.cloudinary.com/dand8rpbb/image/upload/v1767984833/IMG_8043_tnqwdf.jpg')`
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-950/90" />

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <FadeIn delay={0.2}>
                        <span className="inline-block px-3 py-1 mb-4 border border-gold-400 text-gold-400 text-xs font-bold tracking-widest">
                            Tahun Ajaran 2026/2027
                        </span>

                    </FadeIn>
                    <FadeIn delay={0.4}>
                        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-4">
                            Penerimaan Santri Baru
                        </h1>
                    </FadeIn>
                    <FadeIn delay={0.6}>
                        <p className="text-emerald-100/80 font-serif italic text-lg max-w-3xl mx-auto mb-6">
                            Mari bergabung menjadi generasi Qur'ani berakhlak mulia bersama Al-Bahjah Buyut.
                        </p>
                    </FadeIn>
                    <FadeIn delay={0.8}>
                        <Link
                            href="/psb/status"
                            className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/30 rounded-full hover:bg-white/20 transition-all shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-1"
                        >
                            <span className="text-sm sm:text-base font-semibold tracking-wide">Sudah Daftar? Cek Status</span>
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    </FadeIn>
                </div>
            </section>

            {/* Quick Flow */}
            <section className="py-16 border-b border-slate-100">
                <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                    <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {flowSteps.map((step, i) => (
                            <FadeIn key={i} className="flex gap-4 items-start">
                                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                                    <step.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-emerald-950 mb-1">{step.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </FadeInStagger>
                </div>
            </section>

            {/* Info Grid */}
            <section className="py-24 bg-slate-50/50">
                <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
                        {/* Left: Requirements */}
                        <div className="lg:col-span-7">
                            <FadeIn>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-emerald-950 tracking-tight">Persyaratan Umum</h2>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {requirements.map((req, i) => (
                                        <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-emerald-100/50 bg-white shadow-sm hover:border-emerald-200 transition-colors">
                                            <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            </div>
                                            <span className="text-emerald-900 text-sm font-medium leading-snug">{req}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 pt-12 border-t border-slate-200/60">
                                    <h3 className="text-xl font-bold text-emerald-950 mb-6">Metode Pendaftaran</h3>
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="p-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Users className="w-5 h-5 text-emerald-700" />
                                                <h4 className="font-bold text-emerald-900">Offline (Langsung)</h4>
                                            </div>
                                            <p className="text-sm text-emerald-800/80 mb-4 line-clamp-2">Datang ke sekretariat PSB di Pondok Pesantren Al-Bahjah Buyut.</p>
                                            <div className="text-xs text-emerald-700 space-y-2 font-medium">
                                                <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Jl. Revolusi No. 45 Desa Buyut</p>
                                                <p className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Senin - Ahad (08.00 - 15.00)</p>
                                            </div>
                                        </div>
                                        <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-gold-300 hover:shadow-md transition-all group">
                                            <div className="flex items-center gap-2 mb-3">
                                                <GlobeIcon className="w-5 h-5 text-gold-500" />
                                                <h4 className="font-bold text-emerald-950">Online (Website)</h4>
                                            </div>
                                            <p className="text-sm text-slate-500 mb-4">Daftar dari mana saja melalui website ini 24 jam.</p>
                                            <Link href="#units" className="text-xs font-bold text-gold-600 group-hover:text-gold-700 flex items-center gap-1 uppercase tracking-wider">
                                                Pilih Jenjang & Daftar <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>

                        {/* Right: Test Info & Help */}
                        <div className="lg:col-span-5 space-y-10">
                            <FadeIn delay={0.2}>
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                    <h3 className="text-lg font-bold text-emerald-950 mb-4 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <FileText className="w-4 h-4" />
                                        </span>
                                        Pelaksanaan Tes
                                    </h3>
                                    <ul className="space-y-3">
                                        {[
                                            "Tes Pengetahuan Akademik",
                                            "Tes Psikologi",
                                            "Tes Baca Tulis Al-Qur'an",
                                            "Tes Wawancara",
                                            "Tes Ubudiyah"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-slate-600 text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                                                <span className="font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.3}>
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                    <h3 className="text-lg font-bold text-emerald-950 mb-6 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <Calendar className="w-4 h-4" />
                                        </span>
                                        Jadwal Seleksi
                                    </h3>
                                    <div className="space-y-0">
                                        <div className="border-l-2 border-emerald-500 pl-6 pb-6 relative">
                                            <div className="absolute top-[2px] -left-[7px] w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white" />
                                            <div className="font-bold text-emerald-950 text-base">Gelombang 1</div>
                                            <div className="text-emerald-600 font-medium text-sm mt-0.5">April 2026 M</div>
                                            <div className="text-slate-400 text-xs mt-0.5">Syawwal-Dzulqaidah 1447 H</div>
                                        </div>
                                        <div className="border-l-2 border-slate-200 pl-6 relative">
                                            <div className="absolute top-[2px] -left-[7px] w-3 h-3 rounded-full bg-slate-300 ring-4 ring-white" />
                                            <div className="font-bold text-emerald-950 text-base">Gelombang 2</div>
                                            <div className="text-emerald-600 font-medium text-sm mt-0.5">Mei 2026 M</div>
                                            <div className="text-slate-400 text-xs mt-0.5">Dzulqaidah-Dzulhijjah 1447 H</div>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.4}>
                                <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-2xl p-6 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <GraduationCap size={100} />
                                    </div>
                                    <h3 className="text-lg font-bold mb-1 opacity-90">Daftar Ulang</h3>
                                    <div className="text-2xl font-bold text-gold-400 mb-2">Juni 2026 M</div>
                                    <div className="text-emerald-200 text-sm font-light">Dzulhijjah 1447 H - Muharam 1448 H</div>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </section>

            {/* Units Section */}
            <section id="units" className="py-24 bg-white">
                <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                    <FadeIn className="text-center mb-16">
                        <span className="text-emerald-600 font-bold tracking-widest text-xs uppercase bg-emerald-50 px-3 py-1 rounded-full">Jenjang Pendidikan</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-emerald-950 mt-4">Mulai Pendaftaran</h2>
                    </FadeIn>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {units.map((unit) => (
                            <FadeIn key={unit.id}>
                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:border-gold-400 hover:shadow-xl hover:shadow-gold-500/5 transition-all duration-300 flex flex-col h-full group relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-gold-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="mb-6">
                                        <div className="text-2xl font-bold text-emerald-950 group-hover:text-emerald-700 transition-colors">{unit.name}</div>
                                        <div className="h-1 w-12 bg-slate-100 mt-2 rounded-full group-hover:bg-gold-400 transition-colors duration-300" />
                                    </div>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3">
                                        {unit.description?.replace(/<[^>]*>?/gm, "") || "Program pendidikan unggulan berbasis pesantren."}
                                    </p>
                                    <div className="mt-auto grid grid-cols-2 gap-3">
                                        <Link
                                            href={`/pendidikan/${unit.slug}`}
                                            className="py-3 px-4 rounded-xl border border-slate-200 text-center text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                                        >
                                            Detail
                                        </Link>
                                        <Link
                                            href={unit.registrationLink || `/psb/daftar/${unit.slug}`}
                                            target={unit.registrationLink ? "_blank" : "_self"}
                                            className="py-3 px-4 rounded-xl bg-emerald-950 text-center text-sm font-semibold text-white hover:bg-emerald-800 transition-colors shadow-lg shadow-emerald-900/10"
                                        >
                                            Daftar
                                        </Link>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Program Unggulan & Ekstrakurikuler */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
                        {/* Program Unggulan */}
                        <FadeIn>
                            <h3 className="text-2xl font-bold text-emerald-950 mb-8 border-l-4 border-gold-400 pl-4">Program Unggulan</h3>
                            <div className="grid gap-4">
                                {[
                                    "Akhlakul Karimah",
                                    "Kurikulum Tahfidzul Qur'an",
                                    "Kurikulum Diniyah",
                                    "Kurikulum Kedinasan",
                                    "Program Bahasa Arab & Bahasa Inggris"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-emerald-50 hover:border-emerald-200 hover:shadow-md transition-all duration-300 group">
                                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <span className="text-emerald-900 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        {/* Ekstrakurikuler */}
                        <FadeIn delay={0.2}>
                            <h3 className="text-2xl font-bold text-emerald-950 mb-8 border-l-4 border-emerald-500 pl-4">Ekstrakurikuler</h3>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    "Pramuka", "Hadroh", "Futsal", "English Club",
                                    "Bola Voli", "Science Club", "Bola Basket", "Tari Japin"
                                ].map((item, i) => (
                                    <span key={i} className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-medium hover:border-gold-400 hover:text-emerald-900 hover:bg-gold-50/50 transition-colors cursor-default shadow-sm">
                                        {item}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-8 p-4 bg-emerald-100/50 rounded-xl border border-emerald-100 flex gap-3 text-emerald-800 text-sm">
                                <Users className="w-5 h-5 shrink-0" />
                                <p>Ekstrakurikuler di atas tersedia khusus untuk jenjang SMPIQu dan SMAIQu.</p>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Rincian Biaya */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                    <FadeIn className="mb-16">
                        <span className="text-gold-600 font-bold tracking-widest text-xs uppercase mb-2 block">Transparansi</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-emerald-950">Rincian Biaya Pendidikan</h2>
                        <p className="text-slate-500 mt-2 text-lg">Tahun Pelajaran 2026/2027</p>
                    </FadeIn>

                    <FadeIn>
                        <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 border border-slate-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-emerald-950 text-white">
                                            <th className="py-6 px-8 font-bold uppercase tracking-wider text-sm">Rincian Pembayaran</th>
                                            <th className="py-6 px-6 font-bold uppercase tracking-wider text-sm text-center">SMPIQu & SMAIQu</th>
                                            <th className="py-6 px-6 font-bold uppercase tracking-wider text-sm text-center bg-emerald-900">SDIQu</th>
                                            <th className="py-6 px-6 font-bold uppercase tracking-wider text-sm text-center">PAUDQu</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {[
                                            { item: "Biaya Pendaftaran", smpSma: "Rp 500.000", sd: "Rp 400.000", paud: "Rp 50.000" },
                                            { item: "Infaq Perlengkapan Sekolah & Boarding", smpSma: "Rp 4.700.000", sd: "Rp 1.600.000", paud: "Rp 800.000" },
                                            { item: "Program Kegiatan Sekolah", smpSma: "Rp 4.600.000", sd: "Rp 1.650.000", paud: "Rp 600.000" },
                                            { item: "Infaq Sarana & Pengembangan", smpSma: "Rp 2.600.000", sd: "Rp 2.500.000", paud: "Rp 800.000" },
                                            { item: "AB Sehat (1 Tahun)", smpSma: "-", sd: "Rp 600.000", paud: "Rp 600.000" },
                                            { item: "SPP Bulan Pertama", smpSma: "Rp 2.000.000", sd: "Rp 750.000", paud: "Rp 250.000" },
                                        ].map((row, i) => (
                                            <tr key={i} className="hover:bg-emerald-50/50 transition-colors group">
                                                <td className="py-5 px-8 text-slate-700 font-medium group-hover:text-emerald-900 transition-colors">{row.item}</td>
                                                <td className="py-5 px-6 text-center text-slate-600 font-mono font-medium">{row.smpSma}</td>
                                                <td className="py-5 px-6 text-center text-slate-600 font-mono font-medium bg-slate-50/50 group-hover:bg-emerald-100/20">{row.sd}</td>
                                                <td className="py-5 px-6 text-center text-slate-600 font-mono font-medium">{row.paud}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-gold-50 border-t-2 border-gold-400">
                                            <td className="py-6 px-8 font-bold text-emerald-950 text-lg">TOTAL BIAYA MASUK</td>
                                            <td className="py-6 px-6 font-bold text-emerald-950 text-center font-mono text-lg">Rp 15.000.000</td>
                                            <td className="py-6 px-6 font-bold text-emerald-950 text-center font-mono text-lg bg-gold-100/50">Rp 7.500.000</td>
                                            <td className="py-6 px-6 font-bold text-emerald-950 text-center font-mono text-lg">Rp 2.500.000</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.2} className="mt-16">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-emerald-950 text-lg">Transfer SMPIQu</h4>
                                        <p className="text-slate-500 text-sm">Bank Muamalat</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                    <div className="text-2xl font-mono font-bold text-emerald-950 tracking-wider">7459910020100186</div>
                                    <div className="text-xs font-bold text-emerald-600 mt-1 uppercase tracking-widest">SMPIQU AL BAHJAH BUYUT</div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center text-gold-600">
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-emerald-950 text-lg">Transfer SMAIQu</h4>
                                        <p className="text-slate-500 text-sm">Bank Muamalat</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                    <div className="text-2xl font-mono font-bold text-emerald-950 tracking-wider">7459910020100187</div>
                                    <div className="text-xs font-bold text-gold-600 mt-1 uppercase tracking-widest">SMAIQU AL BAHJAH BUYUT</div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Program Spesial Grade */}
            <section className="py-24 bg-gradient-to-b from-emerald-50 to-white">
                <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                    <FadeIn className="text-center mb-16">
                        <span className="text-gold-600 font-bold tracking-widest text-xs uppercase mb-2 bg-gold-50 px-4 py-1.5 rounded-full inline-block">Penawaran Spesial</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-emerald-950 mt-4">Program Spesial Santri</h2>
                        <p className="text-slate-500 mt-3 text-lg max-w-2xl mx-auto">Kesempatan hemat dengan program pembayaran cepat dalam 1 bulan</p>
                    </FadeIn>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Grade A */}
                        <FadeIn>
                            <div className="bg-white rounded-3xl border-2 border-gold-400 shadow-xl shadow-gold-500/10 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gold-400 to-gold-500" />
                                <div className="bg-gradient-to-br from-gold-50 to-white p-6 border-b border-gold-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">Program</span>
                                            <h3 className="text-2xl font-bold text-emerald-950 mt-1">Santri Grade A</h3>
                                        </div>
                                        <div className="w-14 h-14 rounded-full bg-gold-100 flex items-center justify-center text-gold-600">
                                            <GraduationCap className="w-7 h-7" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    {/* Santri Umum */}
                                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Users className="w-4 h-4 text-emerald-600" />
                                            <span className="font-bold text-emerald-950">Santri Umum</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500 text-sm">Biaya Normal</span>
                                                <span className="text-slate-400 line-through font-mono">Rp 23.000.000</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-emerald-600 text-sm font-medium">Promo Pembayaran 1 Bulan</span>
                                                <span className="text-emerald-700 font-bold font-mono text-lg">Rp 20.000.000</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                                <span className="text-slate-500 text-sm">SPP per Bulan</span>
                                                <span className="text-slate-700 font-semibold font-mono">Rp 2.150.000</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Santri Lanjutan */}
                                    <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <ArrowRight className="w-4 h-4 text-gold-500" />
                                            <span className="font-bold text-emerald-950">Santri Lanjutan</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500 text-sm">Biaya Normal</span>
                                                <span className="text-slate-400 line-through font-mono">Rp 20.000.000</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-emerald-600 text-sm font-medium">Promo Pembayaran 1 Bulan</span>
                                                <span className="text-emerald-700 font-bold font-mono text-lg">Rp 18.000.000</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        {/* Grade B */}
                        <FadeIn delay={0.2}>
                            <div className="bg-white rounded-3xl border-2 border-emerald-200 shadow-xl shadow-emerald-500/10 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-emerald-500" />
                                <div className="bg-gradient-to-br from-emerald-50 to-white p-6 border-b border-emerald-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Program</span>
                                            <h3 className="text-2xl font-bold text-emerald-950 mt-1">Santri Grade B</h3>
                                            <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full mt-2 inline-block">50% Beasiswa</span>
                                        </div>
                                        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <GraduationCap className="w-7 h-7" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    {/* Santri Umum */}
                                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Users className="w-4 h-4 text-emerald-600" />
                                            <span className="font-bold text-emerald-950">Santri Umum</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500 text-sm">Biaya Normal</span>
                                                <span className="text-slate-400 line-through font-mono">Rp 15.000.000</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-emerald-600 text-sm font-medium">Promo Pembayaran 1 Bulan</span>
                                                <span className="text-emerald-700 font-bold font-mono text-lg">Rp 12.500.000</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Santri Lanjutan */}
                                    <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <ArrowRight className="w-4 h-4 text-gold-500" />
                                            <span className="font-bold text-emerald-950">Santri Lanjutan</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500 text-sm">Biaya Normal</span>
                                                <span className="text-slate-400 line-through font-mono">Rp 13.000.000</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-emerald-600 text-sm font-medium">Promo Pembayaran 1 Bulan</span>
                                                <span className="text-emerald-700 font-bold font-mono text-lg">Rp 10.000.000</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Promo Note */}
                    <FadeIn delay={0.3} className="mt-10">
                        <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 rounded-2xl p-6 text-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-gold-400 font-bold text-lg mb-1">Promo Terbatas!</p>
                                <p className="text-emerald-100/80 text-sm max-w-xl mx-auto">Manfaatkan kesempatan hemat dengan program spesial pembayaran cepat dalam 1 bulan. Segera daftarkan putra/putri Anda sebelum kuota terpenuhi.</p>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* FAQ Section */}
            <FAQSection />

            {/* Catatan Penting */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
                    <FadeIn>
                        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold text-emerald-950">Catatan Penting</h3>
                            </div>

                            <div className="space-y-4 mb-8">
                                {[
                                    "Biaya pendaftaran tidak dapat dikembalikan (non-refundable)",
                                    "Pembayaran dapat dilakukan secara bertahap sesuai kesepakatan",
                                    "Calon santri yang diterima wajib melunasi seluruh biaya sebelum masuk asrama",
                                    "Simpan bukti transfer untuk diupload saat pendaftaran"
                                ].map((note, i) => (
                                    <div key={i} className="flex gap-3 items-start text-sm text-slate-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                        <span className="leading-relaxed">{note}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
                                <p className="text-sm text-slate-500 font-medium">Butuh bantuan pendaftaran?</p>
                                <Link
                                    href="https://wa.me/6289676539390"
                                    target="_blank"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                                >
                                    <Phone className="w-4 h-4" />
                                    Hubungi Panitia
                                </Link>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>
        </main >
    );
}

function GlobeIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" x2="22" y1="12" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    );
}
