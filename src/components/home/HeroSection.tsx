"use client";

import Link from "next/link";
import { ArrowRight, Play, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const heroImages = [
    "https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=698&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Existing
    "https://images.unsplash.com/photo-1519818187420-8e49de7adeef?q=80&w=1683&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Mosque interior
    "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Islamic architecture
    "https://images.unsplash.com/photo-1586767003402-8ade266deb64?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Quran/Reading
    "https://images.unsplash.com/photo-1537181534458-45dcee76ae90?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"  // Mosque night
];

export function HeroSection() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-emerald-950">
            {/* Background Image Slider */}
            <div className="absolute inset-0 z-0 select-none">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0, scale: 1.0 }}
                        animate={{ opacity: 1, scale: 1.1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            opacity: { duration: 1.5 },
                            scale: { duration: 6, ease: "linear" }
                        }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('${heroImages[currentImageIndex]}')`
                        }}
                    />
                </AnimatePresence>

                {/* Stronger Overlay for text readability */}
                <div className="absolute inset-0 bg-black/60 z-10" />
            </div>

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
