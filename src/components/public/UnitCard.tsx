"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
    BookOpen,
    GraduationCap,
    BookOpenCheck,
    Scroll,
    type LucideIcon,
} from "lucide-react";

interface UnitCardProps {
    unit: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        image: string | null;
    };
    index?: number;
}

const unitIcons: Record<string, LucideIcon> = {
    smpiqu: GraduationCap,
    smaiqu: BookOpen,
    tafaqquh: Scroll,
    tahfidz: BookOpenCheck,
};

export function UnitCard({ unit, index = 0 }: UnitCardProps) {
    const Icon = unitIcons[unit.slug] || BookOpen;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
        >
            <Link href={`/pendidikan/${unit.slug}`}>
                <div className="group relative h-full overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-800">
                        {unit.image ? (
                            <Image
                                src={unit.image}
                                alt={unit.name}
                                fill
                                className="object-cover z-10 transition-transform duration-500 group-hover:scale-110"
                                loading="eager"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <Icon className="h-20 w-20 text-white/30" />
                            </div>
                        )}
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-transparent to-transparent" />

                        {/* Icon Badge */}
                        <div className="absolute bottom-4 left-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gold-500 shadow-lg">
                            <Icon className="h-7 w-7 text-white" />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                        <h3 className="mb-2 text-xl font-bold text-emerald-900 transition-colors group-hover:text-emerald-700">
                            {unit.name}
                        </h3>
                        <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                            {unit.description ? unit.description.replace(/<[^>]*>?/gm, "") : "Program pendidikan unggulan di Pesantren Al-Bahjah Buyut."}
                        </p>

                        {/* Arrow */}
                        <div className="mt-4 flex items-center text-sm font-semibold text-emerald-600">
                            <span>Lihat Detail</span>
                            <svg
                                className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Decorative Border */}
                    <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 via-gold-500 to-emerald-500 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
            </Link>
        </motion.div>
    );
}
