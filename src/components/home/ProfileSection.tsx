"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function ProfileSection() {
    return (
        <section className="pt-20 lg:pt-32 pb-24 bg-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -z-10 hidden lg:block" />

            <div className="container mx-auto px-6 md:px-12 lg:px-24">
                <div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-16">

                    {/* Text Side (Now Left) */}
                    <div className="w-full lg:w-7/12">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left"
                        >
                            <span className="text-gold-600 font-bold tracking-[0.2em] text-xs uppercase mb-4 block">
                                Tentang Kami
                            </span>

                            <h2 className="text-4xl lg:text-5xl font-bold text-emerald-950 mb-8 tracking-tight leading-[1.1]">
                                Ahlan Wa Sahlan <br />
                                <span className="text-emerald-800/60 font-light">di Al-Bahjah Buyut</span>
                            </h2>

                            <div className="relative mb-8">
                                <Quote className="w-10 h-10 text-emerald-900/10 absolute -top-4 -left-2 lg:-left-6" />
                                <blockquote className="relative z-10 text-xl text-emerald-950 font-serif italic leading-relaxed">
                                    "Pendidikan bukan hanya tentang mengisi kepala dengan ilmu, tetapi juga menyalakan pelita iman di dalam hati."
                                </blockquote>
                            </div>

                            <p className="text-emerald-900/60 leading-relaxed mb-8 text-sm lg:text-base font-light">
                                Lembaga Pengembangan Dakwah (LPD) Al-Bahjah Buyut hadir sebagai oase ilmu dan akhlak. Kami berkomitmen menyediakan lingkungan belajar yang kondusif, penuh berkah, dan bersanad jelas kepada Rasulullah SAW.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <Link
                                    href="/profil"
                                    className="px-8 py-3 bg-emerald-950 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-emerald-900 transition-all shadow-lg hover:shadow-emerald-900/20"
                                >
                                    Profil Lengkap
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* Image Side (Now Right) */}
                    <div className="w-full lg:w-5/12 relative">
                        <div className="grid grid-cols-2 gap-4 lg:gap-6">
                            {/* Buya Yahya */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="relative"
                            >
                                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-xl shadow-emerald-900/10">
                                    <Image
                                        src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Buya_Yahya.jpg"
                                        alt="Buya Yahya"
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent opacity-80" />

                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-center">
                                        <h3 className="text-base font-bold uppercase tracking-wider mb-0.5">Buya Yahya</h3>
                                        <p className="text-emerald-100/90 text-[10px] font-bold tracking-widest uppercase">Pengasuh LPD Al-Bahjah</p>
                                    </div>
                                </div>

                            </motion.div>

                            {/* Abah Sayf */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="relative mt-8 lg:mt-12"
                            >
                                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-xl shadow-emerald-900/10">
                                    <div className="w-full h-full bg-slate-200 flex items-center justify-center relative">
                                        <Image
                                            src="https://res.cloudinary.com/dand8rpbb/image/upload/v1767976355/DSC00058_ioql27.jpg"
                                            alt="Abah Sayf Abu Hanifah"
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent opacity-80" />

                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-center">
                                        <h3 className="text-base font-bold uppercase tracking-wider mb-0.5">Abah Sayf Abu Hanifah</h3>
                                        <p className="text-emerald-100/90 text-[10px] font-bold uppercase tracking-widest">Pengasuh LPD Al-Bahjah Buyut</p>
                                    </div>
                                </div>
                                <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-slate-100 rounded-full -z-10" />
                            </motion.div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
