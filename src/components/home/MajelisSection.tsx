import { Calendar, Clock, MapPin } from "lucide-react";
import { db } from "@/lib/db";

interface MajelisData {
    id: string;
    title: string;
    subtitle: string | null;
    teacher: string | null;
    schedule: string;
    time: string;
    location: string | null;
}

async function getMajelisList(): Promise<MajelisData[]> {
    try {
        const majelisList = await db.majelis.findMany({
            where: { isActive: true },
            orderBy: { order: "asc" },
            select: {
                id: true,
                title: true,
                subtitle: true,
                teacher: true,
                schedule: true,
                time: true,
                location: true,
            },
        });
        return majelisList;
    } catch (error) {
        console.error("Failed to fetch majelis:", error);
        return [
            {
                id: "1",
                title: "Kajian Akhlak",
                subtitle: "Kajian Kitab Akhlaqul Banin",
                teacher: "Abah Sayf Abu Hanifah",
                schedule: "Rabu Pagi",
                time: "05.30 WIB - Selesai",
                location: "LPD Al Bahjah Buyut"
            },
            {
                id: "2",
                title: "Kajian Kitab Al-Hikam",
                subtitle: "Kitab Al-Hikam",
                teacher: "Abah Sayf Abu Hanifah",
                schedule: "Setiap Ahad Sore",
                time: "16.00 WIB - Selesai",
                location: "LPD Al-Bahjah Buyut"
            },
            {
                id: "3",
                title: "Majelis Keliling",
                subtitle: "Majelis Keliling di Cirebon",
                teacher: "Abah Sayf Abu Hanifah",
                schedule: "Setiap Sabtu Malam Ahad",
                time: "20.00 WIB (Ba'da Isha)",
                location: "Masjid di Cirebon"
            }
        ];
    }
}

export async function MajelisSection() {
    const activities = await getMajelisList();

    if (activities.length === 0) {
        return null;
    }

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Header */}
                <div className="max-w-2xl mb-16">
                    <span className="text-gold-600 font-bold tracking-[0.2em] text-xs uppercase mb-4 block">
                        Jadwal Kegiatan
                    </span>
                    <h2 className="text-4xl lg:text-5xl font-bold text-emerald-950 mb-6 tracking-tight leading-[1.1]">
                        Majelis Rutin <br /> <span className="text-emerald-600 font-light">Mingguan</span>
                    </h2>
                    <p className="text-slate-500 text-lg leading-relaxed font-light">
                        Mari istiqomah menghadiri taman-taman surga di dunia melalui majelis ilmu dan dzikir untuk menutrisi hati.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="group bg-slate-50 p-8 transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 border border-transparent hover:border-emerald-100"
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
                    ))}
                </div>
            </div>
        </section>
    );
}
