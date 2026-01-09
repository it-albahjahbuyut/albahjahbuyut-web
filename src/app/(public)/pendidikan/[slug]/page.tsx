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

    // TODO: After running `npx prisma db push` and `npx prisma generate`,
    // uncomment the include block below to enable social media feature
    const unit = await db.unit.findUnique({
        where: { slug },
        include: {
            socialMedia: {
                where: { isActive: true },
                orderBy: { order: "asc" },
            },
            galleries: {
                where: { isActive: true },
                orderBy: { order: "asc" },
            },
        },
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
            facilities = unit.facilities.split("\n").filter((f: string) => f.trim());
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
                            <span className="inline-block px-3 py-1 mb-4 border border-gold-500 text-gold-400 text-xs font-bold uppercase tracking-widest">
                                Unit Pendidikan
                            </span>
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
                                    <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                        {facilities.map((facility, index) => (
                                            <FadeIn
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
                                            </FadeIn>
                                        ))}
                                    </FadeInStagger>
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
                                            <FadeIn key={gallery.id} className="relative aspect-square rounded-xl overflow-hidden group bg-slate-100 shadow-sm border border-slate-200">
                                                <Image
                                                    src={gallery.imageUrl}
                                                    alt={gallery.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                                    <p className="text-white text-center text-sm font-bold tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{gallery.title}</p>
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
                                                href="https://wa.me/089676539390"
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
        </>
    );
}
