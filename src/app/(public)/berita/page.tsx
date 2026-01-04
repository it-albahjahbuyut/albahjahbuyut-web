import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";

export const metadata = {
    title: "Berita & Kegiatan | Pondok Pesantren Al-Bahjah Buyut",
    description: "Informasi terbaru seputar kegiatan, prestasi, dan kajian di Pondok Pesantren Al-Bahjah Buyut.",
};

export default async function NewsPage() {
    const posts = await db.post.findMany({
        where: {
            status: "PUBLISHED",
        },
        orderBy: {
            publishedAt: "desc",
        },
        include: {
            author: { select: { name: true } },
            unit: { select: { name: true } },
        },
    });

    return (
        <main className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center bg-emerald-950 overflow-hidden pt-32">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 fixed-bg"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop')`
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-950/90" />

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <span className="inline-block px-3 py-1 mb-4 border border-gold-400 text-gold-400 text-xs font-bold tracking-widest">
                        Halaman Berita
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-4">
                        Kabar Pesantren
                    </h1>
                    <p className="text-emerald-100/80 font-serif italic text-lg">
                        Kabar terbaru dari keluarga besar Al-Bahjah Buyut
                    </p>
                </div>
            </section>

            {/* News List */}
            <section className="py-20">
                <div className="container mx-auto px-4 lg:px-8">
                    {posts.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <article key={post.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100">
                                    {/* Image */}
                                    <div className="relative h-56 overflow-hidden bg-slate-200">
                                        {post.image ? (
                                            <Image
                                                src={post.image}
                                                alt={post.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-400">
                                                <Newspaper className="w-12 h-12" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-gold-500 text-emerald-950 text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-sm shadow-sm">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 font-medium uppercase tracking-wide">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                                                {post.publishedAt ? format(post.publishedAt, "dd MMMM yyyy", { locale: id }) : "Draft"}
                                            </div>
                                            {post.unit && (
                                                <div className="flex items-center gap-1 text-emerald-700">
                                                    <span>•</span>
                                                    <span>{post.unit.name}</span>
                                                </div>
                                            )}
                                        </div>

                                        <h2 className="text-xl font-bold text-emerald-950 mb-3 uppercase tracking-tight leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                                            <Link href={`/berita/${post.slug}`}>
                                                {post.title}
                                            </Link>
                                        </h2>

                                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6 font-light">
                                            {post.excerpt || post.content.replace(/<[^>]*>?/gm, '').substring(0, 120) + "..."}
                                        </p>

                                        <Link
                                            href={`/berita/${post.slug}`}
                                            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-gold-600 uppercase tracking-widest transition-colors"
                                        >
                                            Baca Selengkapnya
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Newspaper className="w-10 h-10 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700 mb-2">Belum ada berita</h3>
                            <p className="text-slate-500">Nantikan informasi terbaru dari kami.</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
