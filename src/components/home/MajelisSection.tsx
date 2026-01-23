import { Calendar, Clock, MapPin } from "lucide-react";
import { db } from "@/lib/db";
import { MajelisList } from "./MajelisList";

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
                        Jadwal Majelis
                    </span>
                    <h2 className="text-4xl lg:text-5xl font-bold text-emerald-950 mb-6 tracking-tight leading-[1.1]">
                        Majelis Rutin <br /> <span className="text-emerald-600 font-light">Mingguan</span>
                    </h2>
                    <p className="text-slate-500 text-lg leading-relaxed font-light">
                        Mari istiqomah menghadiri taman-taman surga di dunia melalui majelis ilmu dan dzikir untuk menutrisi hati.
                    </p>
                </div>

                <MajelisList activities={activities} />
            </div>
        </section>
    );
}
