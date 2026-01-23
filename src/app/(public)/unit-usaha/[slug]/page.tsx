import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    MapPin,
    Phone,
    Mail,
    Globe,
    MessageCircle,
    ExternalLink,
    CheckCircle2,
    Calendar,
    Clock,
    ArrowUpRight
} from "lucide-react";
import { FadeIn, FadeInStagger } from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

// Revalidate on every request to ensure data is always fresh after updates
export const revalidate = 0;

interface BusinessUnitDetailPageProps {
    params: Promise<{ slug: string }>;
}

interface BusinessUnitImage {
    id: string;
    imageUrl: string;
    caption: string | null;
    order: number;
}

export async function generateStaticParams() {
    const businessUnits = await db.businessUnit.findMany({
        where: { isActive: true },
        select: { slug: true },
    });

    return businessUnits.map((unit: { slug: string }) => ({
        slug: unit.slug,
    }));
}

export async function generateMetadata({ params }: BusinessUnitDetailPageProps) {
    const { slug } = await params;
    const unit = await db.businessUnit.findUnique({
        where: { slug },
        select: { name: true, description: true },
    });

    if (!unit) {
        return {
            title: "Unit Usaha Tidak Ditemukan | Al-Bahjah Buyut",
        };
    }

    const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, "");

    return {
        title: `${unit.name} | Unit Usaha Al-Bahjah Buyut`,
        description: unit.description
            ? stripHtml(unit.description).substring(0, 160)
            : `Informasi lengkap tentang ${unit.name} - Unit Usaha Pondok Pesantren Al-Bahjah Buyut`,
    };
}

export default async function BusinessUnitDetailPage({
    params,
}: BusinessUnitDetailPageProps) {
    const { slug } = await params;

    const unit = await db.businessUnit.findUnique({
        where: { slug },
        include: {
            images: {
                orderBy: { order: "asc" },
            },
        },
    });

    if (!unit || !unit.isActive) {
        notFound();
    }

    // Parse services if stored as HTML
    const servicesHtml = unit.services || "";

    return (
        <main className="bg-slate-50 min-h-screen font-sans">
            {/* Hero Section - Standardized */}
            <section className="relative min-h-[50vh] flex items-end bg-emerald-950 overflow-hidden px-4 pt-24 pb-12">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    {unit.image ? (
                        <OptimizedImage
                            src={unit.image}
                            alt={unit.name}
                            fill
                            className="object-cover opacity-40 fixed-bg"
                            priority
                        />
                    ) : (
                        <div className="absolute inset-0 opacity-30 fixed-bg">
                            <OptimizedImage
                                src="https://res.cloudinary.com/dand8rpbb/image/upload/v1767934623/WhatsApp_Image_2026-01-08_at_11.07.46_PM_1_uzkquu.jpg"
                                alt="Unit Usaha Background"
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent" />
                    <div className="absolute inset-0 bg-emerald-950/30" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 container mx-auto px-4 lg:px-8">
                    <FadeIn>
                        <Link
                            href="/unit-usaha"
                            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/10 mb-8"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali
                        </Link>
                        <div className="max-w-4xl">
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-500 text-emerald-950 text-xs font-bold uppercase tracking-wider rounded-full">
                                    Unit Usaha
                                </span>
                                {unit.address && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 text-white/90 text-xs font-medium rounded-full backdrop-blur-sm">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {unit.address}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                                {unit.name}
                            </h1>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Main Content - Editorial Design */}
            <section className="container mx-auto px-4 lg:px-8 py-20 max-w-7xl relative z-20">
                <div className="grid lg:grid-cols-12 gap-16">
                    {/* Content Column */}
                    <div className="lg:col-span-8 space-y-20">

                        {/* Description - Editorial Style */}
                        {unit.description && (
                            <FadeIn>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-px w-12 bg-gold-400" />
                                        <span className="text-sm font-bold tracking-widest uppercase text-slate-400">Tentang Unit Info</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 leading-tight">
                                        Mengenal Lebih Dekat <br /> <span className="text-emerald-700">{unit.name}</span>
                                    </h2>
                                    <div className="prose prose-lg prose-slate max-w-none prose-p:leading-loose text-slate-600 font-serif">
                                        <div dangerouslySetInnerHTML={{ __html: unit.description }} />
                                    </div>
                                </div>
                            </FadeIn>
                        )}

                        {/* Services - Feature Grid Style */}
                        {servicesHtml && (
                            <FadeIn delay={0.1}>
                                <div className="relative">
                                    {/* Decorative background for services */}
                                    <div className="absolute -left-8 -right-8 top-0 bottom-0 bg-slate-50 rounded-3xl -z-10" />

                                    <div className="p-4 md:p-8">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="p-2 bg-emerald-100/50 rounded-lg text-emerald-700">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <h3 className="text-xl font-bold text-emerald-950 uppercase tracking-wide">
                                                Layanan & Keunggulan
                                            </h3>
                                        </div>

                                        <div className="prose prose-lg prose-emerald max-w-none 
                                            prose-ul:grid prose-ul:grid-cols-1 prose-ul:md:grid-cols-2 prose-ul:gap-x-12 prose-ul:gap-y-4 prose-ul:p-0 
                                            prose-li:flex prose-li:items-start prose-li:gap-3 prose-li:m-0 prose-li:p-4 prose-li:rounded-xl prose-li:bg-white prose-li:shadow-sm prose-li:border prose-li:border-slate-100/50
                                            prose-li:marker:content-none prose-p:hidden">
                                            <div dangerouslySetInnerHTML={{ __html: servicesHtml }} />
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        )}

                        {/* Gallery - Masonry Feel */}
                        {unit.images && unit.images.length > 0 && (
                            <FadeIn delay={0.2}>
                                <div className="space-y-8 pt-8 border-t border-slate-100">
                                    <h2 className="text-2xl font-bold text-emerald-950">
                                        Galeri Aktivitas
                                    </h2>
                                    <div className="columns-1 md:columns-2 gap-6 space-y-6">
                                        {unit.images.map((image: BusinessUnitImage, index: number) => (
                                            <div
                                                key={image.id}
                                                className="group relative overflow-hidden rounded-2xl shadow-lg break-inside-avoid"
                                            >
                                                <OptimizedImage
                                                    src={image.imageUrl}
                                                    alt={image.caption || `${unit.name} - Gambar ${index + 1}`}
                                                    width={800}
                                                    height={600}
                                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                                                {image.caption && (
                                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <p className="text-white text-sm font-medium">
                                                            {image.caption}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </FadeIn>
                        )}

                        {/* Map - Smart Handling */}
                        {unit.mapUrl && (
                            <FadeIn delay={0.3}>
                                {unit.mapUrl.includes("google.com/maps/embed") ? (
                                    <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 h-[400px]">
                                        <iframe
                                            src={unit.mapUrl}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            className="grayscale hover:grayscale-0 transition-all duration-700"
                                        />
                                    </div>
                                ) : (
                                    <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 h-[250px] bg-slate-100 relative group">
                                        {/* Fallback for non-embed links (e.g. share links) */}
                                        <Image
                                            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000"
                                            alt="Map Placeholder"
                                            fill
                                            className="object-cover opacity-60 group-hover:opacity-70 transition-opacity"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <a
                                                href={unit.mapUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-white/90 backdrop-blur text-emerald-950 px-8 py-4 rounded-full font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-3"
                                            >
                                                <MapPin className="w-5 h-5 text-red-500" />
                                                Buka di Google Maps
                                                <ArrowUpRight className="w-4 h-4 ml-1 opacity-50" />
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </FadeIn>
                        )}
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-8">
                            <FadeIn delay={0.2}>
                                {/** Contact Minimalist */}
                                <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative">
                                    <h3 className="font-bold text-lg text-emerald-950 mb-8 border-b border-slate-100 pb-4">
                                        Hubungi Kami
                                    </h3>

                                    <div className="space-y-6">
                                        {unit.address && (
                                            <div className="flex gap-4">
                                                <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-1" />
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Lokasi</p>
                                                    <p className="text-slate-600 text-sm leading-relaxed">
                                                        {unit.address}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {unit.phone && (
                                            <div className="flex gap-4">
                                                <Phone className="w-5 h-5 text-gold-500 shrink-0 mt-1" />
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Telepon</p>
                                                    <a href={`tel:${unit.phone}`} className="text-emerald-800 font-medium hover:underline">
                                                        {unit.phone}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        {unit.email && (
                                            <div className="flex gap-4">
                                                <Mail className="w-5 h-5 text-gold-500 shrink-0 mt-1" />
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Email</p>
                                                    <a href={`mailto:${unit.email}`} className="text-emerald-800 font-medium hover:underline">
                                                        {unit.email}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        {unit.website && (
                                            <div className="flex gap-4">
                                                <Globe className="w-5 h-5 text-gold-500 shrink-0 mt-1" />
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Website</p>
                                                    <a href={unit.website} target="_blank" rel="noopener noreferrer" className="text-emerald-800 font-medium hover:underline flex items-center gap-1">
                                                        Kunjungi Situs <ArrowUpRight className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-8 space-y-3">
                                        {unit.whatsapp && (
                                            <a
                                                href={`https://wa.me/${unit.whatsapp.replace(/[^0-9]/g, "")}?text=Assalamu'alaikum, saya ingin bertanya tentang ${unit.name}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block"
                                            >
                                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-14 rounded-xl text-base shadow-emerald-900/10 shadow-lg">
                                                    <MessageCircle className="w-5 h-5 mr-2" />
                                                    Chat WhatsApp
                                                </Button>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
