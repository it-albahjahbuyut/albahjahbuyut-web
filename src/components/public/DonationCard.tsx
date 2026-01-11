"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Copy, Check, Landmark, ArrowRight } from "lucide-react";
import { useState } from "react";

interface DonationCardProps {
    program: {
        id: string;
        title: string;
        slug: string;
        description: string;
        image: string | null;
        targetAmount: { toString(): string } | number | string;
        currentAmount: { toString(): string } | number | string;
        bankName: string;
        accountNumber: string;
        accountName: string | null;
    };
    index?: number;
    featured?: boolean;
}

export function DonationCard({ program, index = 0, featured = false }: DonationCardProps) {
    const [copied, setCopied] = useState(false);

    const target = Number(program.targetAmount);
    const current = Number(program.currentAmount);
    const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(program.accountNumber);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`overflow-hidden rounded-2xl bg-white shadow-lg ${featured ? "ring-2 ring-gold-500" : ""
                }`}
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-800">
                {program.image ? (
                    <Image
                        src={program.image}
                        alt={program.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <Landmark className="h-20 w-20 text-white/30" />
                    </div>
                )}
                {featured && (
                    <div className="absolute right-4 top-4 rounded-full bg-gold-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                        ⭐ Unggulan
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="mb-2 text-lg font-bold text-emerald-900">{program.title}</h3>
                <p className="mb-4 line-clamp-2 text-sm text-slate-600">
                    {program.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="mb-2 flex justify-between text-sm">
                        <span className="font-semibold text-emerald-700">
                            {formatCurrency(current)}
                        </span>
                        <span className="text-slate-500">
                            dari {formatCurrency(target)}
                        </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${percentage}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-gold-500"
                        />
                    </div>
                    <p className="mt-1 text-right text-xs text-slate-500">
                        {percentage.toFixed(1)}% tercapai
                    </p>
                </div>

                {/* Bank Info */}
                <div className="rounded-xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                        <Landmark className="h-4 w-4 text-emerald-600" />
                        <span className="font-semibold text-slate-700">{program.bankName}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <p className="font-mono text-lg font-bold text-emerald-800">
                                {program.accountNumber}
                            </p>
                            {program.accountName && (
                                <p className="text-xs text-slate-500">a.n. {program.accountName}</p>
                            )}
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors hover:bg-emerald-200"
                            title="Salin nomor rekening"
                        >
                            {copied ? (
                                <Check className="h-5 w-5 text-emerald-600" />
                            ) : (
                                <Copy className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Detail Link */}
                <Link
                    href={`/infaq/${program.slug}`}
                    className="flex items-center justify-center gap-2 w-full mt-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-xl transition-all group"
                >
                    Lihat Detail
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        </motion.div>
    );
}
