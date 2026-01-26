"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { ArrowRight, Instagram } from "lucide-react";
import Link from "next/link";

export function GallerySection() {
    const photos = [
        {
            src: "https://res.cloudinary.com/dand8rpbb/image/upload/v1737402661/albahjahbuyut-web/activities/kbm_quran.jpg",
            caption: "KBM Al-Qur'an",
            desc: "Pembelajaran intensif Al-Qur'an dengan metode Talaqqi"
        },
        {
            src: "https://res.cloudinary.com/dand8rpbb/image/upload/v1737402661/albahjahbuyut-web/activities/jamaah.jpg",
            caption: "Sholat Berjamaah",
            desc: "Membiasakan sholat berjamaah 5 waktu di masjid"
        },
        {
            src: "https://res.cloudinary.com/dand8rpbb/image/upload/v1737402661/albahjahbuyut-web/activities/makan_bersama.jpg",
            caption: "Makan Bersama",
            desc: "Kebersamaan dan keberkahan dalam setiap hidangan"
        },
        {
            src: "https://res.cloudinary.com/dand8rpbb/image/upload/v1737402661/albahjahbuyut-web/activities/ekskul_panahan.jpg",
            caption: "Ekstrakurikuler",
            desc: "Mengembangkan bakat dan minat santri melalui kegiatan positif"
        },
        {
            src: "https://res.cloudinary.com/dand8rpbb/image/upload/v1737402662/albahjahbuyut-web/activities/kajian.jpg",
            caption: "Kajian Kitab",
            desc: "Mendalami ilmu agama melalui kajian kitab kuning"
        }
    ];

    // Placeholder images if real ones aren't available yet - using visuals relevant to Islamic boarding school
    const placeholders = [
        "https://images.unsplash.com/photo-1584663639454-1a8069e8b15a?q=80&w=800&auto=format&fit=crop", // Quran
        "https://images.unsplash.com/photo-1564123010723-6447817e078a?q=80&w=800&auto=format&fit=crop", // Mosque
        "https://images.unsplash.com/photo-1577254533024-85ba57d2a6a6?q=80&w=800&auto=format&fit=crop", // Food
        "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800&auto=format&fit=crop", // Sports/Archives (generic)
        "https://images.unsplash.com/photo-1582215234563-3561ca377507?q=80&w=800&auto=format&fit=crop"  // Study
    ];

    return (
        <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-900 to-slate-900 pointer-events-none" />

            <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10 mb-12">
                <FadeIn className="flex flex-col md:flex-row items-end justify-between gap-6">
                    <div>
                        <span className="text-emerald-400 font-bold tracking-widest text-xs uppercase mb-2 block">
                            Galeri
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mt-2">
                            Kehidupan Santri
                        </h2>
                        <p className="text-slate-400 mt-4 max-w-lg">
                            Sekilas potret kegiatan dan keseharian santri di Pondok Pesantren Al-Bahjah Buyut.
                        </p>
                    </div>

                    <Link
                        href="/galeri"
                        className="group flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-emerald-500/50 transition-all"
                    >
                        <span className="text-sm font-medium">Lihat Semua Galeri</span>
                        <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </FadeIn>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="w-full overflow-x-auto pb-12 hide-scrollbar px-4 lg:px-8">
                <div className="flex gap-6 w-max">
                    {photos.map((photo, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <div className="relative w-[300px] sm:w-[400px] aspect-[4/5] sm:aspect-[4/3] rounded-2xl overflow-hidden group">
                                <OptimizedImage
                                    src={placeholders[i]}
                                    alt={photo.caption}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                <div className="absolute bottom-0 left-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">{photo.caption}</h3>
                                    <p className="text-sm text-slate-300 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        {photo.desc}
                                    </p>
                                </div>
                            </div>
                        </FadeIn>
                    ))}

                    {/* Instagram CTA Card */}
                    <FadeIn delay={0.6}>
                        <Link
                            href="https://instagram.com/albahjahbuyut"
                            target="_blank"
                            className="relative w-[300px] sm:w-[400px] aspect-[4/5] sm:aspect-[4/3] rounded-2xl overflow-hidden group bg-gradient-to-br from-emerald-900 to-slate-900 border border-white/10 flex items-center justify-center text-center p-8 hover:border-emerald-500/50 transition-colors"
                        >
                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 p-0.5 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                                        <Instagram className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Ikuti Kami di Instagram</h3>
                                <p className="text-sm text-slate-400 mb-6">Update kegiatan terbaru setiap hari</p>
                                <span className="inline-flex items-center gap-2 text-emerald-400 text-sm font-bold uppercase tracking-wide group-hover:gap-3 transition-all">
                                    @albahjahbuyut <ArrowRight className="w-4 h-4" />
                                </span>
                            </div>
                        </Link>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
