"use client";

import { motion } from "framer-motion";
import { Users, Quote } from "lucide-react";
import Link from "next/link";

export function ProfileSection() {
    return (
        <section className="py-24 bg-white relative">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Image Side - Simple & Clean */}
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative w-full max-w-sm"
                        >
                            <div className="aspect-[3/4] bg-slate-100 relative overflow-hidden shadow-sm">
                                {/* Placeholder for Leader Image */}
                                <div className="absolute inset-0 bg-slate-200" />
                                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                    <Users className="w-32 h-32 opacity-50" />
                                </div>
                            </div>
                            <div className="mt-6 text-center lg:text-left border-l-4 border-emerald-900 pl-4">
                                <h3 className="text-xl font-bold text-emerald-950 uppercase tracking-widest">Buya Yahya</h3>
                                <p className="text-sm text-slate-500 uppercase tracking-wide font-medium">Pengasuh LPD Al-Bahjah</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Text Side - Minimalist */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-4xl lg:text-6xl font-bold text-emerald-950 mb-8 uppercase tracking-tight leading-none">
                                Ahlan Wa Sahlan <br />
                                <span className="text-emerald-700">Al-Bahjah Buyut</span>
                            </h2>

                            <div className="relative mb-10 max-w-lg mx-auto lg:mx-0">
                                <Quote className="w-8 h-8 text-emerald-900/20 mb-4 mx-auto lg:mx-0" />
                                <blockquote className="text-xl lg:text-2xl text-slate-800 leading-relaxed italic font-light font-serif">
                                    "Pendidikan bukan hanya tentang mengisi kepala dengan ilmu, tetapi juga menyalakan pelita iman di dalam hati."
                                </blockquote>
                            </div>

                            <p className="text-slate-600 leading-relaxed mb-10 text-base lg:text-lg font-light max-w-lg mx-auto lg:mx-0">
                                Di Al-Bahjah Buyut, kami berkomitmen menyediakan lingkungan belajar yang kondusif dan penuh berkah. Kurikulum kami dirancang untuk menyeimbangkan pencapaian akademis dengan pembentukan karakter Qur'ani.
                            </p>

                            <Link
                                href="/profil"
                                className="inline-flex items-center justify-center px-10 py-3.5 text-sm font-bold text-emerald-950 border-2 border-emerald-950 hover:bg-emerald-950 hover:text-white transition-all duration-300 uppercase tracking-widest"
                            >
                                Selengkapnya
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
