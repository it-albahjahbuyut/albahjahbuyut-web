"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";

interface NewsItemProps {
    post: {
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        image: string | null;
        publishedAt: Date | null;
        category: string;
    };
    index?: number;
}

const categoryLabels: Record<string, string> = {
    BERITA: "Berita",
    PENGUMUMAN: "Pengumuman",
    KEGIATAN: "Kegiatan",
    PRESTASI: "Prestasi",
    ARTIKEL: "Artikel",
};

const categoryColors: Record<string, string> = {
    BERITA: "bg-emerald-100 text-emerald-700",
    PENGUMUMAN: "bg-gold-100 text-gold-700",
    KEGIATAN: "bg-blue-100 text-blue-700",
    PRESTASI: "bg-purple-100 text-purple-700",
    ARTIKEL: "bg-slate-100 text-slate-700",
};

export function NewsItem({ post, index = 0 }: NewsItemProps) {
    const formatDate = (date: Date | null) => {
        if (!date) return "-";
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(new Date(date));
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group"
        >
            <Link href={`/berita/${post.slug}`}>
                <div className="overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
                        {post.image ? (
                            <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <Newspaper className="h-16 w-16 text-slate-400" />
                            </div>
                        )}
                        {/* Category Badge */}
                        <div className="absolute left-4 top-4">
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[post.category] || categoryColors.BERITA
                                    }`}
                            >
                                {categoryLabels[post.category] || post.category}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                        {/* Date */}
                        <div className="mb-2 flex items-center gap-1.5 text-xs text-slate-500">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formatDate(post.publishedAt)}</span>
                        </div>

                        {/* Title */}
                        <h3 className="mb-2 line-clamp-2 text-lg font-bold text-slate-800 transition-colors group-hover:text-emerald-700">
                            {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-600">
                            {post.excerpt || "Baca selengkapnya..."}
                        </p>

                        {/* Read More */}
                        <div className="flex items-center text-sm font-semibold text-emerald-600">
                            <span>Baca Selengkapnya</span>
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}
