"use client";
import Link from "next/link";
import { ArrowRight, Play, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-emerald-950">
            {/* Background Image Slider */}
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover opacity-30"
            >
                <source src="https://res.cloudinary.com/dand8rpbb/video/upload/v1767982358/Untitled_Video_-_Made_With_Clipchamp_1_aqgd2a.mp4" type="video/mp4" />
            </video>

            {/* Darker Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/20 to-emerald-950/80" />

            {/* Decorative Elements */}
            <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full bg-emerald-500/20 blur-3xl" />

            <div className="container relative z-20 mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
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
