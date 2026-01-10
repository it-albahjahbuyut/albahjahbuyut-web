import { Calendar, Clock } from "lucide-react";
import { db } from "@/lib/db";

interface MajelisData {
    id: string;
    title: string;
    subtitle: string | null;
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
                schedule: true,
                time: true,
                location: true,
            },
        });
        return majelisList;
    } catch (error) {
        console.error("Failed to fetch majelis:", error);
        // Return default data if database fails
        return [
            {
                id: "1",
                title: "Jalsah Itsnain",
                subtitle: "Majelis Rasulullah SAW",
                schedule: "Senin Malam Selasa",
                time: "18.30 WIB (Ba'da Maghrib)",
                location: "Masjid Al-Bahjah Buyut"
            },
            {
                id: "2",
                title: "Kajian Tafsir",
                subtitle: "Tafsir Al-Jalalain Bersama Buya Yahya",
                schedule: "Setiap Rabu Pagi",
                time: "07.00 WIB - Selesai",
                location: "Masjid Al-Bahjah Buyut"
            },
            {
                id: "3",
                title: "Rotib Al-Haddad",
                subtitle: "Pembacaan Rotib & Maulid",
                schedule: "Kamis Malam Jumat",
                time: "18.30 WIB (Ba'da Maghrib)",
                location: "Masjid Al-Bahjah Buyut"
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
        <section className="py-24 bg-white border-t border-slate-100">
            <div className="container mx-auto px-6 md:px-12 lg:px-24">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-emerald-600 font-bold tracking-wider text-xs uppercase mb-3 block">
                        Jadwal Kegiatan
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                        Majelis Rutin Mingguan
                    </h2>
                    <p className="text-slate-600 text-lg leading-relaxed font-light">
                        Mari istiqomah menghadiri majelis ilmu dan dzikir untuk menutrisi hati dan mendekatkan diri kepada Allah SWT.
                    </p>
                </div>

                <div className="grid gap-6 lg:gap-8 md:grid-cols-3">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="group bg-slate-50 hover:bg-white rounded-2xl p-8 border border-slate-100 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300"
                        >
                            <div className="flex flex-col h-full">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                                        {activity.title}
                                    </h3>
                                    {activity.subtitle && (
                                        <p className="text-slate-500 text-sm font-medium">
                                            {activity.subtitle}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-auto space-y-4 pt-6 border-t border-slate-200/60 group-hover:border-emerald-100 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-colors">
                                            <Calendar className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Waktu</p>
                                            <p className="text-slate-700 font-medium">{activity.schedule}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-colors">
                                            <Clock className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Jam</p>
                                            <p className="text-slate-700 font-medium">{activity.time}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
