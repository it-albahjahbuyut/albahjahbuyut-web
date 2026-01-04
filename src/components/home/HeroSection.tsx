"use client";

import Link from "next/link";
import { ArrowRight, Play, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-emerald-950">
            {/* Background Image & Overlays */}
            <div className="absolute inset-0 z-0 select-none">
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=2070&auto=format&fit=crop')`
                    }}
                />

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
                        <span className="text-emerald-600">Al-Bahjah Buyut</span>
                    </h1>

                    <p className="text-lg md:text-2xl text-white/90 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
                        Membangun Generasi Qur'ani & Berakhlak dibawah naungan Buya Yahya
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/psb"
                            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white border-2 border-white rounded-none hover:bg-white hover:text-emerald-950 transition-all duration-300 uppercase tracking-widest min-w-[200px]"
                        >
                            Daftar Sekarang
                        </Link>
                        <Link
                            href="https://wa.me/6281234567890" // Replace with actual number if available, otherwise generic
                            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white border-2 border-emerald-600 bg-emerald-600 rounded-none hover:bg-emerald-700 hover:border-emerald-700 transition-all duration-300 uppercase tracking-widest min-w-[200px]"
                        >
                            Hubungi Kami
                        </Link>
                    </div>
                </motion.div>
            </div>


        </section>
    );
}
