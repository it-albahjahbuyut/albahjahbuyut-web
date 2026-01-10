import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";
import { FadeIn, FadeInStagger } from "@/components/animations/FadeIn";

interface Post {
    id: string;
    title: string;
    slug: string;
    publishedAt: Date | null;
    image: string | null;
    excerpt: string | null;
    // Assuming these new fields are part of the Post interface based on the update
    createdAt?: Date;
    content?: string;
}

export function NewsSection({ posts }: { posts: Post[] }) {
    // Removed early return to ensure section visibility

    return (
        <section className="py-24 bg-emerald-50/30">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                    <div className="max-w-3xl">
                        <FadeIn>
                            <div className="text-emerald-900 uppercase font-bold tracking-widest text-xs mb-3 flex items-center gap-2">
                                Kabar Pesantren
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <h2 className="text-4xl lg:text-5xl font-bold text-emerald-950 mb-4 tracking-tight"><span className="text-emerald-600">Berita</span> Terbaru.</h2>
                        </FadeIn>
                        <FadeIn delay={0.4}>
                            <p className="text-emerald-900/60 text-lg font-light leading-relaxed">
                                Informasi terkini kegiatan dan prestasi santri Al-Bahjah Buyut.
                            </p>
                        </FadeIn>
                    </div>
                    <FadeIn delay={0.6}>
                        <Link
                            href="/berita"
                            className="inline-flex items-center justify-center px-6 py-3 bg-white border border-emerald-200 text-emerald-950 font-bold hover:bg-emerald-950 hover:text-white hover:border-emerald-950 transition-all tracking-widest text-xs"
                        >
                            Lihat Semua
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </FadeIn>
                </div>

                <FadeInStagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <FadeIn key={post.id} className="h-full">
                                <article className="group flex flex-col bg-white border-b-2 border-emerald-100/50 hover:border-emerald-600 transition-all duration-300 h-full pb-4">
                                    <div className="aspect-video relative overflow-hidden bg-emerald-100/20 mb-6">
                                        {post.image ? (
                                            <Image
                                                src={post.image}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-all duration-500 ease-in-out group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-emerald-900/20">
                                                <Newspaper className="w-16 h-16" />
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 left-0 bg-emerald-950 text-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
                                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            }) : '-'}
                                        </div>
                                    </div>
                                    <div className="px-2 flex flex-col flex-1">
                                        <h3 className="text-xl font-bold mb-3 text-emerald-950 group-hover:text-emerald-700 transition-colors tracking-tight leading-snug line-clamp-2">
                                            <Link href={`/berita/${post.slug}`}>
                                                {post.title}
                                            </Link>
                                        </h3>
                                        <div
                                            className="text-emerald-900/60 text-sm leading-relaxed mb-6 line-clamp-3 font-light"
                                            dangerouslySetInnerHTML={{ __html: post.excerpt || "Baca selengkapnya berita terbaru dari Pondok Pesantren Al-Bahjah..." }}
                                        />
                                        <div className="mt-auto pt-4 border-t border-emerald-100/50">
                                            <Link
                                                href={`/berita/${post.slug}`}
                                                className="text-emerald-900 font-bold text-xs tracking-widest uppercase group-hover:gap-2 transition-all inline-flex items-center"
                                            >
                                                Baca Selengkapnya
                                                <ArrowRight className="ml-2 w-3 h-3" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            </FadeIn>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <div className="bg-white rounded-2xl p-12 text-center flex flex-col items-center justify-center border border-emerald-100 relative overflow-hidden">
                                {/* Decorative Pattern Background - Subtle */}
                                <div className="absolute inset-0 opacity-[0.02]"
                                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23064e3b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
                                />

                                <div className="relative z-10 max-w-md mx-auto">
                                    <h3 className="text-xl font-bold text-emerald-950 mb-3">Belum ada berita terbaru</h3>
                                    <p className="text-emerald-900/60 font-light mb-8">
                                        Nantikan update informasi terkini seputar kegiatan santri dan pondok pesantren.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </FadeInStagger>
            </div>
        </section>
    );
}
