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
                        backgroundImage: `url('https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop')`
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-950/90" />

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <FadeIn delay={0.2}>
                        <span className="inline-block px-3 py-1 mb-4 border border-gold-400 text-gold-400 text-xs font-bold tracking-widest">
                            Tahun Ajaran 2025/2026
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
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-lg hover:bg-white/20 transition-colors"
                        >
                            <span className="text-sm font-semibold">Sudah Daftar? Cek Status Pendaftaran</span>
                            <ArrowRight className="w-4 h-4" />
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
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
                        {/* Left: Requirements */}
                        <div className="lg:col-span-7">
                            <FadeIn>
                                <h2 className="text-3xl font-bold text-emerald-950 mb-8 tracking-tight">Persyaratan Umum</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {requirements.map((req, i) => (
                                        <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                                <div className="w-2 h-2 rounded-full bg-emerald-600" />
                                            </div>
                                            <span className="text-slate-700 text-sm font-medium">{req}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 pt-12 border-t border-slate-100">
                                    <h3 className="text-xl font-bold text-emerald-950 mb-6">Metode Pendaftaran</h3>
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="p-6 rounded-2xl border border-emerald-100 bg-emerald-50/30">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Users className="w-5 h-5 text-emerald-700" />
                                                <h4 className="font-bold text-emerald-900">Offline (Langsung)</h4>
                                            </div>
                                            <p className="text-sm text-slate-600 mb-4">Datang ke sekretariat PSB di Pondok Pesantren Al-Bahjah Buyut.</p>
                                            <div className="text-xs text-slate-500 space-y-1">
                                                <p className="flex items-center gap-2"><MapPin className="w-3 h-3" /> Jl. Revolusi No. 45 Desa Buyut</p>
                                                <p className="flex items-center gap-2"><Calendar className="w-3 h-3" /> Senin - Ahad (08.00 - 15.00)</p>
                                            </div>
                                        </div>
                                        <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
                                            <div className="flex items-center gap-2 mb-3">
                                                <GlobeIcon className="w-5 h-5 text-emerald-700" />
                                                <h4 className="font-bold text-emerald-900">Online (Website)</h4>
                                            </div>
                                            <p className="text-sm text-slate-600 mb-4">Daftar dari mana saja melalui website ini 24 jam.</p>
                                            <Link href="#units" className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
                                                Pilih Jenjang & Daftar <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>

                        {/* Right: Test Info & Help */}
                        <div className="lg:col-span-5 space-y-8">
                            <FadeIn delay={0.2}>
                                <div className="bg-emerald-900 text-white rounded-3xl p-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                                        <GraduationCap size={150} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">?</span>
                                        Materi Seleksi
                                    </h3>
                                    <ul className="space-y-4 relative z-10">
                                        {[
                                            "Tes Potensi Akademik",
                                            "Baca Tulis Al-Qur'an (Tahsin)",
                                            "Wawancara Calon Santri",
                                            "Wawancara Wali Santri",
                                            "Tes Praktik Ibadah"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-emerald-100/90 text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="border border-slate-200 rounded-3xl p-8 bg-white relative">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Layanan Informasi</div>
                                            <div className="text-lg font-bold text-emerald-950">0896 7653 9390</div>
                                        </div>
                                    </div>
                                    <p className="text-slate-500 text-sm">
                                        Hubungi kami via WhatsApp jika mengalami kendala saat pendaftaran.
                                    </p>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </section>

            {/* Units Section */}
            <section id="units" className="py-24 bg-slate-50">
                <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                    <FadeIn className="text-center mb-16">
                        <span className="text-emerald-600 font-medium tracking-wider text-sm">PILIHAN JENJANG PENDIDIKAN</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-emerald-950 mt-2">Mulai Pendaftaran</h2>
                    </FadeIn>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {units.map((unit) => (
                            <FadeIn key={unit.id}>
                                <div className="bg-white rounded-3xl p-8 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
                                    <div className="mb-6">
                                        <div className="text-2xl font-bold text-emerald-950">{unit.name}</div>
                                        <div className="h-1 w-12 bg-gold-400 mt-2 rounded-full" />
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
                                            className="py-3 px-4 rounded-xl bg-emerald-950 text-center text-sm font-semibold text-white hover:bg-emerald-900 transition-colors group-hover:bg-gold-500 group-hover:text-white"
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
        </main>
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
