import { AdminHeader } from "@/components/admin/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { GraduationCap, Newspaper, Heart, Image } from "lucide-react";

async function getStats() {
    const [unitCount, postCount, donationCount, galleryCount] = await Promise.all([
        db.unit.count(),
        db.post.count(),
        db.donationProgram.count(),
        db.gallery.count(),
    ]);

    return { unitCount, postCount, donationCount, galleryCount };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    const cards = [
        {
            title: "Unit Pendidikan",
            value: stats.unitCount,
            description: "SMP, SMA, Tafaqquh, Tahfidz",
            icon: GraduationCap,
            color: "bg-blue-500",
        },
        {
            title: "Berita & Artikel",
            value: stats.postCount,
            description: "Total publikasi",
            icon: Newspaper,
            color: "bg-green-500",
        },
        {
            title: "Program Donasi",
            value: stats.donationCount,
            description: "Program aktif",
            icon: Heart,
            color: "bg-red-500",
        },
        {
            title: "Galeri",
            value: stats.galleryCount,
            description: "Total foto",
            icon: Image,
            color: "bg-purple-500",
        },
    ];

    return (
        <div>
            <AdminHeader
                title="Dashboard"
                description="Selamat datang di panel admin Al-Bahjah Buyut"
            />

            <div className="p-6">
                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card) => (
                        <Card key={card.title}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">
                                    {card.title}
                                </CardTitle>
                                <div className={`rounded-lg p-2 ${card.color}`}>
                                    <card.icon className="h-4 w-4 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{card.value}</div>
                                <CardDescription>{card.description}</CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-4">Aksi Cepat</h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-base">Tambah Berita</CardTitle>
                                <CardDescription>Buat artikel atau pengumuman baru</CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-base">Kelola Unit</CardTitle>
                                <CardDescription>Edit informasi unit pendidikan</CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-base">Program Donasi</CardTitle>
                                <CardDescription>Tambah atau edit program infaq</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
