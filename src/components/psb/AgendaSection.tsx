"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { Info } from "lucide-react";

export function AgendaSection() {
    const agendaItems = [
        { time: "03.00", activity: "Bangun Persiapan Qiyamullail" },
        { time: "03.30", activity: "Qiyamullail" },
        { time: "03.50", activity: "Bil Jahr (Al-Qur'an)", note: "Kecuali Malam Jumat" },
        { time: "04.20", activity: "Persiapan Sholat Shubuh" },
        { time: "04.30", activity: "Sholat Shubuh" },
        { time: "05.00", activity: "Hifidz Pagi / Murojaah Al-Qur'an", note: "Kecuali Hari Jumat" },
        { time: "05.45", activity: "Riyadhoh", note: "Kecuali Sabtu dan Ahad" },
        { time: "05.55", activity: "Tandzif Pagi" },
        { time: "06.10", activity: "Futhur (sarapan) & Persiapan KBM" },
        { time: "07.15", activity: "Sholat Dhuha" },
        { time: "07.30", activity: "Masuk KBM Formal" },
        { time: "12.00", activity: "Sholat Dzuhur", note: "Kecuali Jumat" },
        { time: "12.15", activity: "Ilqo Bahasa (Inggris)" },
        { time: "12.30", activity: "Ghoda (makan siang)" },
        { time: "12.45", activity: "Istirahat Siang" },
        { time: "13.30", activity: "Masuk KBM Formal Siang", note: "Kecuali Jumat, Sabtu, Ahad" },
        { time: "15.30", activity: "Sholat Ashar" },
        { time: "15.50", activity: "Ilqo Bahasa (Arab)" },
        { time: "16.00", activity: "Tandzif Sore" },
        { time: "16.15", activity: "Laundry" },
        { time: "17.00", activity: "Asya (makan malam)", note: "Jumat & Ahad Ba'da Maghrib" },
        { time: "17.30", activity: "Wajib Sudah di Masjid" },
        { time: "18.00", activity: "Sholat Maghrib" },
        { time: "18.45", activity: "KBM Tahsin Al-Qur'an", note: "Kecuali Kamis dan Jum'at" },
        { time: "19.30", activity: "KBM Diniyah", note: "Kecuali Kamis dan Jum'at" },
        { time: "20.30", activity: "Sholat Isya" },
        { time: "20.50", activity: "Tandzif Malam" },
        { time: "21.00", activity: "Persiapan Murojaah Malam", note: "Kecuali Jumat dan Sabtu" },
        { time: "21.30", activity: "Murojaah Malam", note: "Kecuali Jumat dan Sabtu" },
        { time: "22.00", activity: "Persiapan Tidur Malam" },
        { time: "22.30", activity: "Tidur Malam" },
    ];

    return (
        <section className="py-24 bg-white relative">
            <div className="container mx-auto px-4 lg:px-8 max-w-3xl relative z-10">
                <FadeIn className="text-center mb-16">
                    <span className="text-emerald-600 font-bold tracking-widest text-xs uppercase bg-emerald-50 px-3 py-1 rounded-full">
                        Kegiatan Harian
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-emerald-950 mt-4">
                        Agenda Harian Santri
                    </h2>
                </FadeIn>

                <div className="relative border-l border-slate-200 ml-4 sm:ml-0 md:pl-8 space-y-0">
                    {agendaItems.map((item, i) => (
                        <FadeIn key={i} delay={0.02 * i}>
                            <div className="group relative pl-8 pb-8 last:pb-0 sm:pl-10">
                                {/* Dot on timeline */}
                                <div className="absolute left-[-5px] sm:left-[-5px] md:left-[27px] top-2 w-2.5 h-2.5 rounded-full ring-4 ring-white bg-slate-300 group-hover:bg-emerald-500 group-hover:scale-125 transition-all duration-300" />

                                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-8 group-hover:translate-x-1 transition-transform duration-300">
                                    {/* Time */}
                                    <div className="font-mono text-sm sm:text-base font-bold text-emerald-600 w-16 shrink-0">
                                        {item.time}
                                    </div>

                                    {/* Activity */}
                                    <div className="flex-1 pb-4 border-b border-slate-50 group-last:border-0">
                                        <h4 className="font-semibold text-slate-700 text-lg group-hover:text-emerald-950 transition-colors">
                                            {item.activity}
                                        </h4>
                                        {item.note && (
                                            <p className="text-sm text-slate-400 mt-1 italic flex items-center gap-1.5">
                                                <Info className="w-3.5 h-3.5 text-slate-300" />
                                                {item.note}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
