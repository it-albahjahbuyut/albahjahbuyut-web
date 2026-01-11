"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function HeroSection() {
    const [activeVideo, setActiveVideo] = useState<{ src: string; poster: string } | null>(null);

    useEffect(() => {
        const videos = [
            {
                src: "https://res.cloudinary.com/dand8rpbb/video/upload/q_auto/v1768020274/Untitled_Video_-_Made_With_Clipchamp_2_gvcww2.mp4",
                poster: "https://res.cloudinary.com/dand8rpbb/video/upload/so_0,q_auto,f_jpg/v1768020274/Untitled_Video_-_Made_With_Clipchamp_2_gvcww2.jpg"
            },
            {
                src: "https://res.cloudinary.com/dand8rpbb/video/upload/v1767984439/Untitled_Video_-_Made_With_Clipchamp_rpbfw1.mp4",
                poster: "https://res.cloudinary.com/dand8rpbb/video/upload/so_0,q_auto,f_jpg/v1767984439/Untitled_Video_-_Made_With_Clipchamp_rpbfw1.jpg"
            }
        ];
        setActiveVideo(videos[Math.floor(Math.random() * videos.length)]);
    }, []);

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-emerald-950">
            {/* Background Video - optimized for all devices */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${activeVideo ? 'opacity-30' : 'opacity-0'}`}
                poster={activeVideo?.poster}
            >
                {activeVideo && <source src={activeVideo.src} type="video/mp4" />}
            </video>

            {/* Darker Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/20 to-emerald-950/80" />

            {/* Decorative Elements - Hidden on mobile for performance */}
            <div className="hidden md:block absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/20 blur-3xl" />
            <div className="hidden md:block absolute bottom-0 right-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full bg-emerald-500/20 blur-3xl" />

            <div className="container relative z-20 mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
                        Bumi Mahabbah <br />
                        <span className="text-emerald-600">Al-Bahjah <span className="text-gold-500">Buyut</span></span>
                    </h1>

                    <p className="text-lg md:text-2xl text-white/90 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
                        Membangun Generasi Qur'ani & Berakhlak dibawah naungan Buya Yahya
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/psb"
                            className="inline-flex items-center justify-center px-6 py-2 md:px-8 md:py-3.5 text-xs md:text-base font-bold text-white border-2 border-white rounded-none hover:bg-white hover:text-emerald-950 transition-all duration-300 uppercase tracking-widest w-auto sm:min-w-[200px]"
                        >
                            Daftar Sekarang
                        </Link>
                        <Link
                            href="/profil"
                            className="inline-flex items-center justify-center px-6 py-2 md:px-8 md:py-3.5 text-xs md:text-base font-bold text-white border-2 border-emerald-600 bg-emerald-600 rounded-none hover:bg-emerald-700 hover:border-emerald-700 transition-all duration-300 uppercase tracking-widest w-auto sm:min-w-[200px]"
                        >
                            Lihat Profil
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
