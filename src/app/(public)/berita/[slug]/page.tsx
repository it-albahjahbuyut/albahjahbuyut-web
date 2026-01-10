import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, User, ArrowLeft } from "lucide-react";

/**
 * Format content to ensure proper HTML paragraph structure
 * If content doesn't have HTML tags, wrap paragraphs in <p> tags
 */
function formatContent(content: string): string {
    if (!content) return "";

    // Check if content already has HTML paragraph tags
    const hasHtmlTags = /<(p|div|h[1-6]|ul|ol|blockquote)[\s>]/i.test(content);

    if (hasHtmlTags) {
        // Content already has HTML structure, return as-is
        return content;
    }

    // Content is plain text - wrap each paragraph in <p> tags
    // Split by double newlines (paragraph breaks) or single newlines
    const paragraphs = content
        .split(/\n\n+|\n/)
        .map(p => p.trim())
        .filter(p => p.length > 0);

    // Wrap each paragraph in <p> tags
    return paragraphs
        .map(p => `<p>${p}</p>`)
        .join('\n');
}

interface NewsDetailPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NewsDetailPageProps) {
    const { slug } = await params;
    const post = await db.post.findUnique({
        where: { slug },
    });

    if (!post) {
        return {
            title: "Berita Tidak Ditemukan",
        };
    }

    return {
        title: `${post.title} | Al-Bahjah Buyut`,
        description: post.excerpt || post.content.substring(0, 160),
    };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
    const { slug } = await params;

    const post = await db.post.findUnique({
        where: { slug },
        include: {
            author: true,
            unit: true,
            images: {
                orderBy: { order: "asc" }
            }
        },
    });

    if (!post) {
        notFound();
    }

    // Fetch related/other posts (excluding current one)
    const recentPosts = await db.post.findMany({
        where: {
            status: "PUBLISHED",
            id: { not: post.id },
        },
        orderBy: { publishedAt: "desc" },
        take: 3,
    });

    return (
        <main className="bg-white min-h-screen">
            {/* Hero / Header */}
            <div className="relative h-[50vh] min-h-[400px] flex items-end pb-12 bg-emerald-950">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 fixed-bg"
                    style={{
                        backgroundImage: post.image ? `url('${post.image}')` : `url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop')`
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/50 to-transparent" />

                <div className="relative z-10 container mx-auto px-4 lg:px-8">
                    <Link
                        href="/berita"
                        className="inline-flex items-center gap-2 text-gold-400 text-xs font-bold tracking-widest hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Berita
                    </Link>

                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <span className="bg-gold-500 text-emerald-950 text-xs font-bold px-3 py-1 tracking-wider rounded-sm">
                            {post.category}
                        </span>
                        {post.unit && (
                            <span className="bg-emerald-900/80 text-emerald-100 border border-emerald-700 text-xs font-bold px-3 py-1 tracking-wider rounded-sm">
                                Unit: {post.unit.name}
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-4xl">
                        {post.title}
                    </h1>
                </div>
            </div>

            {/* Content Area */}
            <div className="container mx-auto px-4 lg:px-8 py-16">
                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Main Article */}
                    <div className="lg:col-span-8">
                        {/* Meta Info */}
                        <div className="flex items-center gap-6 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-100 font-medium uppercase tracking-wide">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-emerald-600" />
                                {post.publishedAt ? format(post.publishedAt, "dd MMMM yyyy", { locale: id }) : "Draft"}
                            </div>
                            {post.author && (
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-emerald-600" />
                                    {post.author.name}
                                </div>
                            )}
                        </div>

                        {/* Article Content */}
                        <article
                            className="prose prose-lg prose-slate max-w-none 
                            prose-headings:font-bold prose-headings:text-emerald-950 prose-headings:tracking-tight
                            prose-p:text-slate-700 prose-p:leading-relaxed
                            prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
                            prose-img:rounded-xl prose-img:shadow-lg
                            prose-strong:text-emerald-900
                            prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b-2 prose-h2:border-emerald-500 prose-h2:pb-2
                            prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3"
                            dangerouslySetInnerHTML={{
                                __html: formatContent(post.content)
                            }}
                        />

                        {/* Activity Gallery */}
                        {post.images && post.images.length > 0 && (
                            <div className="mt-12 pt-12 border-t border-slate-100">
                                <h3 className="text-xl font-bold text-emerald-950 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-1 bg-gold-500 rounded-full"></span>
                                    Galeri Kegiatan
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {post.images.map((img, index) => (
                                        <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300">
                                            <Image
                                                src={img.imageUrl}
                                                alt={`Dokumentasi ${post.title} - ${index + 1}`}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-12">
                        {/* Recent Posts */}
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 sticky top-24">
                            <h3 className="text-lg font-bold text-emerald-950 uppercase tracking-wide mb-6 border-l-4 border-gold-500 pl-3">
                                Berita Lainnya
                            </h3>
                            <div className="space-y-6">
                                {recentPosts.length > 0 ? (
                                    recentPosts.map(recent => (
                                        <div key={recent.id} className="group">
                                            <Link href={`/berita/${recent.slug}`} className="flex gap-4 items-start">
                                                <div className="relative w-20 h-20 flex-shrink-0 bg-slate-200 rounded-lg overflow-hidden">
                                                    {recent.image && (
                                                        <Image
                                                            src={recent.image}
                                                            alt={recent.title}
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform"
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-gold-600 uppercase tracking-wider block mb-1">
                                                        {recent.publishedAt ? format(recent.publishedAt, "dd MMM yyyy", { locale: id }) : ""}
                                                    </span>
                                                    <h4 className="text-sm font-bold text-emerald-900 group-hover:text-emerald-600 transition-colors line-clamp-2 uppercase leading-snug">
                                                        {recent.title}
                                                    </h4>
                                                </div>
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-500 text-sm">Tidak ada berita lain.</p>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
