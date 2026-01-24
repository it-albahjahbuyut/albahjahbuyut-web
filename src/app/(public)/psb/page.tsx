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
    Users,
    Mail
} from "lucide-react";
import { FadeIn, FadeInStagger } from "@/components/animations/FadeIn";
import { FAQSection } from "@/components/psb/FAQSection";
import { AgendaSection } from "@/components/psb/AgendaSection";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

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
                <div className="absolute inset-0 opacity-30 fixed-bg">
                    <OptimizedImage
                        src="https://res.cloudinary.com/dand8rpbb/image/upload/v1767984833/IMG_8043_tnqwdf.jpg"
                        alt="Background PSB"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                </div>
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
            <section id="units" className="py-24 bg-white relative">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23064e3b' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")`
                    }}
                />
                <div className="container mx-auto px-4 lg:px-8 max-w-6xl relative z-10">
                    <FadeIn className="text-center mb-16">
                        <span className="text-emerald-600 font-bold tracking-widest text-xs uppercase bg-emerald-50 px-3 py-1 rounded-full">Jenjang Pendidikan</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-emerald-950 mt-4">Mulai Pendaftaran</h2>
                    </FadeIn>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {units.map((unit) => (
                            <FadeIn key={unit.id}>
                                <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-gold-300 hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-300 flex flex-col h-full group relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-gold-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="mb-6">
                                        <div className="text-2xl font-bold text-emerald-950 group-hover:text-emerald-700 transition-colors">{unit.name}</div>
                                        <div className="h-1 w-12 bg-slate-100 mt-3 rounded-full group-hover:bg-gold-400 transition-colors duration-300" />
                                    </div>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3">
                                        {unit.description?.replace(/<[^>]*>?/gm, "") || "Program pendidikan unggulan berbasis pesantren."}
                                    </p>
                                    <div className="mt-auto grid grid-cols-2 gap-3">
                                        <Link
                                            href={`/pendidikan/${unit.slug}`}
                                            className="py-3 px-4 rounded-full border border-slate-200 text-center text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-emerald-900 transition-colors"
                                        >
                                            Detail
                                        </Link>
                                        <Link
                                            href={unit.registrationLink || `/psb/daftar/${unit.slug}`}
                                            target={unit.registrationLink ? "_blank" : "_self"}
                                            className="py-3 px-4 rounded-full bg-emerald-950 text-center text-sm font-semibold text-white hover:bg-emerald-900 transition-all shadow-lg shadow-emerald-900/10 group-hover:shadow-emerald-900/20"
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
            <section className="py-24 bg-slate-50/50">
                <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
                        {/* Program Spesial Santri */}
                        <FadeIn>
                            <h3 className="text-2xl font-bold text-emerald-950 mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-8 rounded-full bg-gold-400" />
                                Program Spesial Santri
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                                {[
                                    "Akhlakul Karimah",
                                    "Kurikulum Tahfidzul Qur'an",
                                    "Kurikulum Diniyah",
                                    "Kurikulum Kedinasan",
                                    "Program Bahasa Arab & Inggris"
                                ].map((item, i) => (
                                    <div key={i} className={`flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-900/5 transition-all duration-300 group ${i === 4 ? 'sm:col-span-2 lg:col-span-1 xl:col-span-2' : ''}`}>
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors border border-emerald-100 group-hover:border-emerald-600 shrink-0">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <span className="text-emerald-950 font-semibold text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        {/* Ekstrakurikuler */}
                        <FadeIn delay={0.2}>
                            <h3 className="text-2xl font-bold text-emerald-950 mb-8 flex items-center gap-3">
                                <span className="w-2 h-8 rounded-full bg-emerald-500" />
                                Ekstrakurikuler
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    "Pramuka", "Hadroh", "Futsal", "English Club",
                                    "Bola Voli", "Science Club", "Bola Basket", "Tari Japin"
                                ].map((item, i) => (
                                    <span key={i} className="px-5 py-2.5 rounded-full border border-slate-200 bg-white text-slate-600 font-medium hover:border-gold-400 hover:text-emerald-900 hover:bg-gold-50/50 transition-all cursor-default shadow-sm hover:shadow-md">
                                        {item}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-8 p-6 bg-emerald-50/80 rounded-2xl border border-emerald-100 flex gap-4 text-emerald-900 text-sm leading-relaxed">
                                <div className="p-2 bg-white rounded-full text-emerald-600 shrink-0 h-fit shadow-sm">
                                    <Users className="w-4 h-4" />
                                </div>
                                <p className="pt-1.5"><span className="font-bold">Catatan:</span> Ekstrakurikuler di atas tersedia khusus untuk jenjang SMPIQu dan SMAIQu.</p>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Agenda Harian */}
            <AgendaSection />

            {/* Rincian Biaya */}
            <section className="py-24 bg-white relative">
                <div className="container mx-auto px-4 lg:px-8 max-w-6xl relative z-10">
                    <FadeIn className="mb-16 text-center">
                        <span className="text-emerald-600 font-bold tracking-widest text-xs uppercase mb-2 block">Biaya Pendidikan</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-emerald-950">Rincian Biaya Pendidikan</h2>
                        <div className="flex items-center justify-center gap-3 mt-4">
                            <div className="h-px w-12 bg-slate-200" />
                            <p className="text-slate-500 font-serif italic">Tahun Pelajaran 2026/2027</p>
                            <div className="h-px w-12 bg-slate-200" />
                        </div>
                    </FadeIn>

                    <FadeIn>
                        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50/50">
                                            <th className="py-6 px-8 font-bold text-emerald-950 text-sm uppercase tracking-wider">Komponen Biaya</th>
                                            <th className="py-6 px-6 font-bold text-emerald-950 text-sm uppercase tracking-wider text-center">SMPIQu & SMAIQu</th>
                                            <th className="py-6 px-6 font-bold text-emerald-950 text-sm uppercase tracking-wider text-center bg-emerald-50/30">SDIQu</th>
                                            <th className="py-6 px-6 font-bold text-emerald-950 text-sm uppercase tracking-wider text-center">PAUDQu</th>
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
                                            <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="py-5 px-8 text-slate-700 font-medium group-hover:text-emerald-900 transition-colors">{row.item}</td>
                                                <td className="py-5 px-6 text-center text-slate-600 font-mono font-medium">{row.smpSma}</td>
                                                <td className="py-5 px-6 text-center text-slate-600 font-mono font-medium bg-emerald-50/10 group-hover:bg-emerald-50/30 transition-colors">{row.sd}</td>
                                                <td className="py-5 px-6 text-center text-slate-600 font-mono font-medium">{row.paud}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-emerald-950 text-white">
                                            <td className="py-6 px-8 font-bold text-lg">TOTAL BIAYA MASUK</td>
                                            <td className="py-6 px-6 font-bold text-center font-mono text-lg text-emerald-200">Rp 15.000.000</td>
                                            <td className="py-6 px-6 font-bold text-center font-mono text-lg bg-emerald-900 text-emerald-200">Rp 7.500.000</td>
                                            <td className="py-6 px-6 font-bold text-center font-mono text-lg text-emerald-200">Rp 2.500.000</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.2} className="mt-12">
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Rekening SMPIQu */}
                            <div className="bg-white rounded-xl p-5 border border-slate-200 hover:border-emerald-300 transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900">SMPIQu Al-Bahjah</h4>
                                        <p className="text-slate-500 text-xs">Bank Muamalat</p>
                                    </div>
                                </div>
                                <div className="font-mono text-lg font-bold text-slate-900 tracking-wide mb-1">7459 9100 2010 0186</div>
                                <p className="text-slate-500 text-sm">a.n. SMPIQU AL BAHJAH BUYUT</p>
                            </div>

                            {/* Rekening SMAIQu */}
                            <div className="bg-white rounded-xl p-5 border border-slate-200 hover:border-amber-300 transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900">SMAIQu Al-Bahjah</h4>
                                        <p className="text-slate-500 text-xs">Bank Muamalat</p>
                                    </div>
                                </div>
                                <div className="font-mono text-lg font-bold text-slate-900 tracking-wide mb-1">7459 9100 2010 0187</div>
                                <p className="text-slate-500 text-sm">a.n. SMAIQU AL BAHJAH BUYUT</p>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Catatan Angsuran */}
                    <FadeIn delay={0.3} className="mt-10">
                        <div className="bg-emerald-50/80 rounded-2xl p-6 border border-emerald-100">
                            <h4 className="font-bold text-emerald-950 mb-4 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">i</div>
                                Catatan Pembayaran
                            </h4>
                            <p className="text-slate-700 text-sm mb-4">
                                Pendaftaran daftar ulang dapat diangsur sebanyak 3x dengan ketentuan berikut:
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                    <span><span className="font-bold text-emerald-700">Angsuran pertama:</span> 70% dari total biaya daftar ulang</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                    <span><span className="font-bold text-emerald-700">Angsuran kedua:</span> 20% dari total biaya daftar ulang</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                    <span><span className="font-bold text-emerald-700">Angsuran ketiga:</span> 10% dari total biaya daftar ulang</span>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Program Spesial Grade */}
            {/* Program Spesial Grade */}
            <section className="py-20 bg-slate-50 relative">
                <div className="container mx-auto px-4 lg:px-8 max-w-4xl relative z-10">
                    <FadeIn className="text-center mb-12">
                        <span className="text-emerald-600 text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
                            Penawaran Spesial
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-emerald-950 tracking-tight mb-3">Program Spesial Santri</h2>
                        <p className="text-slate-500 max-w-md mx-auto">
                            Dapatkan penawaran biaya pendidikan khusus melalui program spesial santri kami.
                        </p>
                    </FadeIn>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Grade A */}
                        <FadeIn>
                            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                    <span className="text-sm font-bold text-emerald-600 uppercase tracking-wide">Grade A</span>
                                </div>
                                <h3 className="text-xl font-bold text-emerald-950 mb-1">Santri Reguler</h3>
                                <p className="text-slate-400 text-sm mb-6">Untuk calon santri reguler</p>

                                <div className="space-y-5">
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Santri Umum</div>
                                        <div className="text-slate-400 text-sm line-through">Rp 23.000.000</div>
                                        <div className="text-2xl font-bold text-emerald-950">Rp 20.000.000</div>
                                        <div className="text-emerald-600 text-xs font-medium mt-1">Hemat Rp 3.000.000</div>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Santri Lanjutan</div>
                                        <div className="text-slate-400 text-sm line-through">Rp 20.000.000</div>
                                        <div className="text-2xl font-bold text-emerald-950">Rp 18.000.000</div>
                                        <div className="text-emerald-600 text-xs font-medium mt-1">Hemat Rp 2.000.000</div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        {/* Grade B */}
                        <FadeIn delay={0.1}>
                            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 hover:border-amber-300 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                                    <span className="text-sm font-bold text-amber-600 uppercase tracking-wide">Grade B</span>
                                </div>
                                <h3 className="text-xl font-bold text-emerald-950 mb-1">Program Beasiswa</h3>
                                <p className="text-slate-400 text-sm mb-6">Penawaran khusus beasiswa</p>

                                <div className="space-y-5">
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Santri Umum</div>
                                        <div className="text-slate-400 text-sm line-through">Rp 15.000.000</div>
                                        <div className="text-2xl font-bold text-emerald-950">Rp 12.500.000</div>
                                        <div className="text-emerald-600 text-xs font-medium mt-1">Hemat Rp 2.500.000</div>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Santri Lanjutan</div>
                                        <div className="text-slate-400 text-sm line-through">Rp 13.000.000</div>
                                        <div className="text-2xl font-bold text-emerald-950">Rp 10.000.000</div>
                                        <div className="text-emerald-600 text-xs font-medium mt-1">Hemat Rp 3.000.000</div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>

                    <FadeIn delay={0.2} className="mt-10 text-center">
                        <p className="text-sm text-slate-400">
                            * Promo berlaku untuk pembayaran dalam 1 bulan. Kuota terbatas.
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* FAQ Section */}
            <FAQSection />

            {/* Catatan Penting */}
            <section className="py-24 bg-white relative">
                <div className="container mx-auto px-4 lg:px-8 max-w-3xl relative z-10">
                    <FadeIn>
                        <div className="bg-slate-50/50 rounded-[2rem] p-8 lg:p-10 border border-slate-200 text-center sm:text-left shadow-lg shadow-slate-200/50">
                            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-emerald-950">Catatan Penting</h3>
                                    <p className="text-slate-500 text-sm">Harap diperhatikan sebelum mendaftar</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10">
                                {[
                                    "Biaya pendaftaran tidak dapat dikembalikan (non-refundable)",
                                    "Pembayaran dapat dilakukan secara bertahap sesuai kesepakatan",
                                    "Calon santri yang diterima wajib melunasi seluruh biaya sebelum masuk asrama",
                                    "Simpan bukti transfer untuk diupload saat pendaftaran"
                                ].map((note, i) => (
                                    <div key={i} className="flex gap-4 items-start text-sm text-slate-700 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                        <span className="leading-relaxed font-medium">{note}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-slate-200">
                                <p className="text-sm text-slate-500 font-medium mb-6 text-center sm:text-left flex items-center gap-2 justify-center sm:justify-start">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                                    Butuh bantuan pendaftaran?
                                </p>
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <Link
                                        href="https://wa.me/6289676539390"
                                        target="_blank"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white text-sm font-bold rounded-full hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
                                    >
                                        <Phone className="w-4 h-4" />
                                        Hubungi Panitia
                                    </Link>
                                    <Link
                                        href="mailto:psb@albahjahbuyut.com"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 text-sm font-bold rounded-full border border-emerald-200 hover:bg-emerald-50 transition-all shadow-sm hover:shadow w-full sm:w-auto justify-center"
                                    >
                                        <Mail className="w-4 h-4" />
                                        psb@albahjahbuyut.com
                                    </Link>
                                </div>
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
