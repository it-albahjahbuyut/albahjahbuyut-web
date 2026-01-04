import { db } from "@/lib/db";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";

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
            <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center bg-emerald-950 overflow-hidden pt-32">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 fixed-bg"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1512418490979-5931b66aa21c?q=80&w=2070&auto=format&fit=crop')`
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-950/90" />

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <span className="inline-block px-3 py-1 mb-4 border border-gold-400 text-gold-400 text-xs font-bold tracking-widest">
                        Dokumentasi
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-4">
                        Galeri Pesantren
                    </h1>
                    <p className="text-emerald-100/80 font-serif italic text-lg max-w-3xl mx-auto">
                        Merekam jejak kebaikan dan kegiatan santri dalam menuntut ilmu.
                    </p>
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
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                            {galleries.map((gallery) => (
                                <div key={gallery.id} className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500">
                                    <div className="relative">
                                        <Image
                                            src={gallery.imageUrl}
                                            alt={gallery.title}
                                            width={800}
                                            height={600}
                                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                            <h3 className="text-white font-bold text-lg mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{gallery.title}</h3>
                                            {gallery.description && (
                                                <p className="text-emerald-100/80 text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 line-clamp-2">
                                                    {gallery.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
