import { db } from "@/lib/db";
import { Image as ImageIcon } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { GalleryGrid } from "./gallery-grid";

export const metadata = {
    title: "Galeri | Pondok Pesantren Al-Bahjah Buyut",
    description: "Galeri kegiatan dan dokumentasi Pondok Pesantren Al-Bahjah Buyut.",
};

export default async function GalleryPage() {
    const galleries = await db.gallery.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
    });

    return (
        <main>
            {/* Hero Section */}
            <section className="relative min-h-[50vh] flex items-center justify-center bg-emerald-950 overflow-hidden px-4 pt-24 pb-20">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 fixed-bg"
                    style={{
                        backgroundImage: `url('https://res.cloudinary.com/dand8rpbb/image/upload/v1767984690/DSC00034_xsnbmq.jpg')`
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-950/90" />

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <FadeIn delay={0.2}>
                        <span className="inline-block px-3 py-1 mb-4 border border-gold-400 text-gold-400 text-xs font-bold tracking-widest">
                            Dokumentasi
                        </span>
                    </FadeIn>
                    <FadeIn delay={0.4}>
                        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-4">
                            Galeri Pesantren
                        </h1>
                    </FadeIn>
                    <FadeIn delay={0.6}>
                        <p className="text-emerald-100/80 font-serif italic text-lg max-w-3xl mx-auto">
                            Merekam jejak kebaikan dan kegiatan santri dalam menuntut ilmu.
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="py-20 bg-emerald-50/30">
                <div className="container mx-auto px-4 lg:px-8">
                    {galleries.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-emerald-100/50 shadow-sm">
                            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-300">
                                <ImageIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-emerald-950 mb-2">Belum ada foto</h3>
                            <p className="text-emerald-900/60">Galeri foto akan segera diperbarui.</p>
                        </div>
                    ) : (
                        <GalleryGrid
                            galleries={galleries.map(g => ({
                                id: g.id,
                                title: g.title,
                                description: g.description,
                                imageUrl: g.imageUrl,
                            }))}
                        />
                    )}
                </div>
            </section>
        </main>
    );
}

