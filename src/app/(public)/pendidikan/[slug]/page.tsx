import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import {
    ArrowLeft,
    BookOpen,
    GraduationCap,
    Calendar,
    CheckCircle2,
    Building2,
    ArrowRight,
} from "lucide-react";

interface UnitDetailPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const units = await db.unit.findMany({
        where: { isActive: true },
        select: { slug: true },
    });

    return units.map((unit) => ({
        slug: unit.slug,
    }));
}

export async function generateMetadata({ params }: UnitDetailPageProps) {
    const { slug } = await params;
    const unit = await db.unit.findUnique({
        where: { slug },
        select: { name: true, description: true },
    });

    if (!unit) {
        return {
            title: "Unit Tidak Ditemukan | Al-Bahjah Buyut",
        };
    }

    return {
        title: `${unit.name} | Pondok Pesantren Al-Bahjah Buyut`,
        description:
            unit.description || `Informasi lengkap tentang program ${unit.name} di Pesantren Al-Bahjah Buyut`,
    };
}

export default async function UnitDetailPage({ params }: UnitDetailPageProps) {
    const { slug } = await params;

    const unit = await db.unit.findUnique({
        where: { slug },
    });

    if (!unit) {
        notFound();
    }

    // Parse facilities if stored as JSON string or newline-separated text
    let facilities: string[] = [];
    if (unit.facilities) {
        try {
            const parsed = JSON.parse(unit.facilities);
            facilities = Array.isArray(parsed) ? parsed : [unit.facilities];
        } catch {
            // If not valid JSON, treat as single facility or split by newlines
            facilities = unit.facilities.split("\n").filter((f) => f.trim());
        }
    }

    // Helper function to strip HTML tags for plain text display
    function stripHtml(html: string): string {
        return html.replace(/<[^>]*>/g, "").trim();
    }

    // Get clean description text (strip HTML if present)
    const descriptionHtml = unit.description || `<p>Program ${unit.name} di Pondok Pesantren Al-Bahjah Buyut dirancang untuk memberikan pendidikan terbaik bagi santri dengan menggabungkan kurikulum modern dan nilai-nilai keislaman yang kuat.</p>`;

    // Get clean curriculum text (strip HTML if present)
    const curriculumHtml = unit.curriculum || "";

    return (
        <>
            {/* Hero Section */}
            <section className="relative h-[50vh] min-h-[400px] flex items-center bg-zinc-900 overflow-hidden pt-32">
                {/* Background Image */}
                {unit.image ? (
                    <Image
                        src={unit.image}
                        alt={unit.name}
                        fill
                        className="object-cover opacity-40"
                        priority
                    />
                ) : (
                    <div
                        className="absolute inset-0 opacity-10 bg-cover bg-center"
                        style={{
                            backgroundImage: `url("https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1974&auto=format&fit=crop")`,
                        }}
                    />
                )}

                <div className="absolute inset-0 bg-black/60" />

                {/* Content */}
                <div className="relative z-10 w-full container mx-auto px-4 lg:px-8">
                    <Link
                        href="/"
                        className="mb-8 inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Link>

                    <div className="max-w-4xl">
                        <span className="inline-block px-3 py-1 mb-4 border border-gold-500 text-gold-400 text-xs font-bold uppercase tracking-widest">
                            Unit Pendidikan
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-tighter leading-none mb-6">
                            {unit.name}
                        </h1>
                        <p className="text-xl md:text-2xl text-emerald-100 font-serif italic">
                            Membangun Generasi Qur'ani Berakhlak Mulia
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid gap-16 lg:grid-cols-12">
                        {/* Main Content Column */}
                        <div className="lg:col-span-8">
                            {/* Description */}
                            <div className="mb-16">
                                <h2 className="text-2xl font-bold text-emerald-950 uppercase tracking-wide mb-6 border-l-4 border-gold-500 pl-4">
                                    Tentang {unit.name}
                                </h2>
                                <div
                                    className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed font-light"
                                    dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                                />
                            </div>

                            {/* Curriculum */}
                            {curriculumHtml && (
                                <div className="mb-16">
                                    <h2 className="text-2xl font-bold text-emerald-950 uppercase tracking-wide mb-8 border-l-4 border-gold-500 pl-4">
                                        Kurikulum Pendidikan
                                    </h2>
                                    <div className="bg-slate-50 p-8 border border-slate-100">
                                        <div
                                            className="prose prose-slate max-w-none text-slate-700"
                                            dangerouslySetInnerHTML={{ __html: curriculumHtml }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Facilities */}
                            {facilities.length > 0 && (
                                <div className="mb-12">
                                    <h2 className="text-2xl font-bold text-emerald-950 uppercase tracking-wide mb-8 border-l-4 border-gold-500 pl-4">
                                        Fasilitas Penunjang
                                    </h2>
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        {facilities.map((facility, index) => (
                                            <div
                                                key={index}
                                                className="group flex items-center gap-4 p-6 bg-white border border-slate-200 hover:bg-emerald-950 hover:border-emerald-950 transition-all duration-300"
                                            >
                                                <div className="flex h-12 w-12 items-center justify-center bg-slate-100 group-hover:bg-emerald-800 transition-colors">
                                                    <CheckCircle2 className="h-6 w-6 text-emerald-600 group-hover:text-gold-400" />
                                                </div>
                                                <span className="font-bold text-slate-700 group-hover:text-white uppercase tracking-wide text-sm">{facility}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar Column */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-24 space-y-8">
                                {/* Registration Card */}
                                <div className="bg-emerald-950 text-white p-8 border-t-8 border-gold-500">
                                    <h3 className="text-2xl font-bold tracking-wide mb-2 line-clamp-2">
                                        Gabung Bersama Kami
                                    </h3>
                                    <p className="text-emerald-200/80 mb-8 font-light leading-relaxed">
                                        Jadilah bagian dari keluarga besar Al-Bahjah Buyut. Pendaftaran dibuka untuk tahun ajaran baru.
                                    </p>

                                    <div className="space-y-4">
                                        <Link
                                            href={unit.registrationLink || "/psb"}
                                            className="flex w-full items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-emerald-950 py-4 text-sm font-bold tracking-widest transition-all hover:-translate-y-1"
                                        >
                                            Daftar Sekarang
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>

                                        <a
                                            href="https://wa.me/6281234567890"
                                            className="flex w-full items-center justify-center gap-2 border border-emerald-700 hover:bg-emerald-900 text-white py-4 text-sm font-bold tracking-widest transition-all"
                                        >
                                            Konsultasi WA
                                        </a>
                                    </div>
                                </div>

                                {/* Quick Info */}
                                <div className="bg-slate-50 p-8 border border-slate-200">
                                    <h4 className="font-bold text-emerald-950 uppercase tracking-widest text-xs mb-6">Informasi Kontak</h4>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3 text-sm text-slate-600">
                                            <span className="font-bold text-emerald-700 min-w-[80px]">Alamat:</span>
                                            <span>Desa Buyut, Kec. Gunungjati, Cirebon</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm text-slate-600">
                                            <span className="font-bold text-emerald-700 min-w-[80px]">Email:</span>
                                            <span>info@albahjahbuyut.sch.id</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm text-slate-600">
                                            <span className="font-bold text-emerald-700 min-w-[80px]">Telepon:</span>
                                            <span>+62 812-3456-7890</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
