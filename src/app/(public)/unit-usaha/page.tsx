import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MapPin, Phone, Globe, ArrowRight } from "lucide-react";
import { FadeIn, FadeInStagger } from "@/components/animations/FadeIn";
import type { Metadata } from "next";

// Revalidate on every request to ensure data is always fresh after updates
export const revalidate = 0;

export const metadata: Metadata = {
    title: "Unit Usaha | Pondok Pesantren Al-Bahjah Buyut",
    description:
        "Unit usaha milik Pondok Pesantren Al-Bahjah Buyut: AB Travel, AB Mart, AB Fashion. Berbelanja sambil beramal.",
};

interface BusinessUnitImage {
    id: string;
    imageUrl: string;
    caption: string | null;
    order: number;
}

interface BusinessUnit {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    services: string | null;
    address: string | null;
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    website: string | null;
    mapUrl: string | null;
    image: string | null;
    logo: string | null;
    isActive: boolean;
    order: number;
    images: BusinessUnitImage[];
}

async function getBusinessUnits(): Promise<BusinessUnit[]> {
    try {
        const businessUnits = await db.businessUnit.findMany({
            where: { isActive: true },
            orderBy: { order: "asc" },
            include: {
                images: {
                    orderBy: { order: "asc" },
                },
            },
        });
        return businessUnits;
    } catch (error) {
        console.error("Failed to fetch business units:", error);
        return [];
    }
}

export default async function UnitUsahaPage() {
    const businessUnits = await getBusinessUnits();

    const stripHtml = (html: string) => {
        return html.replace(/<[^>]*>?/gm, "");
    };

    return (
        <main className="bg-slate-50 min-h-screen">
            {/* Hero Section - Standardized to match Infaq/Berita */}
            <section className="relative min-h-[50vh] flex items-center justify-center bg-emerald-950 overflow-hidden px-4 pt-24 pb-20">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 fixed-bg"
                    style={{
                        backgroundImage: `url('https://res.cloudinary.com/dand8rpbb/image/upload/v1768820687/WhatsApp_Image_2026-01-08_at_11.07.45_PM_ir9xhk.jpg')`
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-950/90" />

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <FadeIn delay={0.2}>
                        <span className="inline-block px-3 py-1 mb-4 border border-gold-400 text-gold-400 text-xs font-bold tracking-widest">
                            EKONOMI AL-BAHJAH BUYUT
                        </span>
                    </FadeIn>
                    <FadeIn delay={0.4}>
                        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-4">
                            Unit Usaha
                        </h1>
                    </FadeIn>
                    <FadeIn delay={0.6}>
                        <div className="max-w-3xl mx-auto">
                            <p className="text-emerald-100/80 font-serif italic text-lg leading-relaxed">
                                "Mendukung kemandirian pesantren melalui unit usaha profesional.
                                Setiap transaksi Anda adalah kontribusi nyata bagi dakwah dan pendidikan."
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Business Units Section - Grid Design */}
            <section className="relative px-4 py-20 z-20 container mx-auto max-w-7xl">
                {businessUnits.length > 0 ? (
                    <FadeInStagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {businessUnits.map((unit, index) => (
                            <FadeIn key={unit.id} delay={index * 0.1}>
                                <div className="group h-full">
                                    <Link href={`/unit-usaha/${unit.slug}`} className="block h-full">
                                        <div className="relative h-full flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                            {/* Image Container */}
                                            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 group-hover:shadow-inner">
                                                {unit.image ? (
                                                    <>
                                                        <Image
                                                            src={unit.image}
                                                            alt={unit.name}
                                                            fill
                                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-transparent group-hover:bg-emerald-950/20 transition-colors duration-300" />
                                                    </>
                                                ) : (
                                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
                                                        <span className="text-6xl font-black text-emerald-900/10 select-none">
                                                            {unit.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                )}


                                            </div>

                                            {/* Content Side */}
                                            <div className="p-6 flex flex-col flex-grow">
                                                <h3 className="text-xl font-bold text-emerald-950 mb-2 group-hover:text-emerald-700 transition-colors">
                                                    {unit.name}
                                                </h3>

                                                <div className="h-0.5 w-8 bg-gold-400 mb-4 group-hover:w-12 transition-all duration-300" />

                                                <div className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                                                    {unit.description
                                                        ? stripHtml(unit.description)
                                                        : "Informasi detail mengenai unit usaha ini belum tersedia."}
                                                </div>

                                                <div className="pt-4 mt-auto border-t border-slate-50 flex items-center justify-between">
                                                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider group-hover:tracking-widest transition-all">
                                                        Lihat Detail
                                                    </span>
                                                    <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                                        <ArrowRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </FadeIn>
                        ))}
                    </FadeInStagger>
                ) : (
                    <FadeIn>
                        <div className="bg-white rounded-[2rem] p-12 text-center shadow-xl border border-slate-100">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Globe className="w-10 h-10 text-slate-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">
                                Unit Usaha Segera Hadir
                            </h3>
                            <p className="text-slate-500 max-w-md mx-auto">
                                Kami sedang mempersiapkan layanan terbaik untuk Anda. Nantikan peluncuran unit usaha kami.
                            </p>
                        </div>
                    </FadeIn>
                )}
            </section>

            {/* Quote / Footer Section */}
            <section className="py-24 bg-white border-t border-slate-100">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <FadeIn>
                        <blockquote className="text-2xl md:text-3xl font-serif italic text-emerald-900 mb-8 leading-relaxed">
                            "Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya. Berbelanja di sini adalah salah satu wujud kemanfaatan itu."
                        </blockquote>
                        <div className="flex items-center justify-center gap-3">
                            <div className="h-px bg-slate-300 w-12" />
                            <span className="text-sm font-bold text-slate-400 tracking-widest uppercase">
                                Al-Bahjah Buyut
                            </span>
                            <div className="h-px bg-slate-300 w-12" />
                        </div>
                    </FadeIn>
                </div>
            </section>
        </main>
    );
}
