import { Calendar, Clock, MapPin } from "lucide-react";
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
        <section className="relative py-20 lg:py-32 bg-slate-50 overflow-hidden">
            {/* Minimalist Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(#064e3b 1px, transparent 1px), linear-gradient(to right, #064e3b 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
                {/* Header - Left Aligned to match other sections */}
                <div className="max-w-xl mb-16 lg:mb-20">
                    <span className="text-gold-600 font-bold tracking-[0.2em] text-xs uppercase mb-4 block">
                        Jadwal Kegiatan
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-emerald-950 mb-6 tracking-tight leading-tight">
                        Majelis Rutin <br />
                        <span className="text-emerald-800/60 font-light">Mingguan</span>
                    </h2>
                    <p className="text-slate-600 text-lg font-light leading-relaxed">
                        Mari istiqomah menghadiri taman-taman surga di dunia melalui majelis ilmu dan dzikir untuk menutrisi hati.
                    </p>
                </div>

                <div className="grid gap-6 lg:gap-8 md:grid-cols-3">
                    {activities.map((activity) => (
                        <div key={activity.id} className="group relative h-full">
                            {/* Card Content - Clean & Minimalist */}
                            <div className="relative h-full bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 hover:border-emerald-100">

                                {/* Top Badge - Date */}
                                <div className="mb-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-wider group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {activity.schedule}
                                    </div>
                                </div>

                                {/* Title Area */}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-emerald-800 transition-colors">
                                        {activity.title}
                                    </h3>
                                    {activity.subtitle && (
                                        <p className="text-slate-500 font-medium leading-relaxed">
                                            {activity.subtitle}
                                        </p>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-slate-100 my-auto mb-6"></div>

                                {/* Details Grid */}
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-5 h-5 flex items-center justify-center shrink-0 text-gold-500 mt-0.5">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Waktu</p>
                                            <p className="text-slate-700 font-medium text-sm">{activity.time}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-5 h-5 flex items-center justify-center shrink-0 text-gold-500 mt-0.5">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Lokasi</p>
                                            <p className="text-slate-700 font-medium text-sm">{activity.location || "Masjid Al-Bahjah Buyut"}</p>
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
