"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import { FadeIn, FadeInStagger } from "@/components/animations/FadeIn";

interface MajelisData {
    id: string;
    title: string;
    subtitle: string | null;
    teacher: string | null;
    schedule: string;
    time: string;
    location: string | null;
}

interface MajelisListProps {
    activities: MajelisData[];
}

export function MajelisList({ activities }: MajelisListProps) {
    return (
        <FadeInStagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
                <FadeIn key={activity.id}>
                    <div
                        className="group bg-slate-50 p-8 transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 border border-transparent hover:border-emerald-100 h-full flex flex-col"
                    >
                        {/* Schedule Badge */}
                        <div className="inline-flex items-center gap-2 mb-6">
                            <span className="w-2 h-2 rounded-full bg-gold-500" />
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-gold-600 transition-colors">
                                {activity.schedule}
                            </span>
                        </div>

                        {/* Title */}
                        <div className="mb-10">
                            <h3 className="text-2xl font-bold text-emerald-950 mb-3 group-hover:text-emerald-700 transition-colors leading-tight">
                                {activity.title}
                            </h3>
                            {activity.subtitle && (
                                <p className="text-slate-500 font-light text-sm mb-2">
                                    {activity.subtitle}
                                </p>
                            )}
                            {activity.teacher && (
                                <p className="text-emerald-600 font-medium text-sm italic">
                                    Bersama {activity.teacher}
                                </p>
                            )}
                        </div>

                        {/* Footer Info */}
                        <div className="mt-auto space-y-3 pt-6 border-t border-slate-200 transition-colors">
                            <div className="flex items-center gap-3 text-slate-600">
                                <Clock className="w-4 h-4 shrink-0 text-gold-500" />
                                <span className="text-sm font-medium">{activity.time}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <MapPin className="w-4 h-4 shrink-0 text-gold-500" />
                                <span className="text-sm font-medium line-clamp-1">
                                    {activity.location || "Masjid Al-Bahjah Buyut"}
                                </span>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            ))}
        </FadeInStagger>
    );
}
