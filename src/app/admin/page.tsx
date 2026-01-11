import { AdminHeader } from "@/components/admin/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import {
    GraduationCap,
    Newspaper,
    Heart,
    Image as ImageIcon,
    Users,
    ArrowUpRight,
    Calendar,
    Activity,
    Youtube,
    ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Helper components for minimalist UI
const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
        PENDING: "bg-amber-100 text-amber-700 border-amber-200",
        VERIFIED: "bg-blue-100 text-blue-700 border-blue-200",
        ACCEPTED: "bg-emerald-100 text-emerald-700 border-emerald-200",
        REJECTED: "bg-red-100 text-red-700 border-red-200",
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[status] || "bg-gray-100 text-gray-700"}`}>
            {status}
        </span>
    );
};

const MiniChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
    const max = Math.max(...data.map(d => d.value), 1); // Avoid division by zero

    return (
        <div className="flex items-end gap-2 h-24 mt-4">
            {data.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end group relative">
                    <div
                        className={`w-full rounded-t-md opacity-80 group-hover:opacity-100 transition-all duration-500 ${item.color}`}
                        style={{ height: `${(item.value / max) * 100}%` }}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {item.value} Pendaftar
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 text-center truncate w-full block">
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

async function getStats() {
    const [
        unitCount,
        postCount,
        donationCount,
        galleryCount,
        psbCount,
        recentRegistrations,
        recentDonations,
        unitsWithCount
    ] = await Promise.all([
        db.unit.count(),
        db.post.count(),
        db.donationProgram.count(),
        db.gallery.count(),
        db.pSBRegistration.count(),
        db.pSBRegistration.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                registrationNumber: true,
                namaLengkap: true,
                status: true,
                createdAt: true,
                unit: {
                    select: {
                        name: true
                    }
                }
            }
        }),
        db.donationProgram.findMany({
            take: 3,
            orderBy: { currentAmount: 'desc' }, // Program dengan donasi terbanyak
            select: { title: true, currentAmount: true, targetAmount: true }
        }),
        db.unit.findMany({
            select: {
                name: true,
                _count: {
                    select: { psbRegistrations: true }
                }
            }
        })
    ]);

    // Format data for chart
    const chartData = unitsWithCount.map((item, index) => {
        const colors = ["bg-emerald-500", "bg-blue-500", "bg-yellow-500", "bg-purple-500", "bg-rose-500"];
        return {
            label: item.name.split(' ')[0], // Take first word
            value: item._count.psbRegistrations,
            color: colors[index % colors.length]
        };
    }).sort((a, b) => b.value - a.value); // Sort by highest registration first

    return {
        unitCount,
        postCount,
        donationCount,
        galleryCount,
        psbCount,
        recentRegistrations,
        recentDonations,
        chartData
    };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    // Check system status
    const youtubeConfigured = !!process.env.YOUTUBE_API_KEY;
    const upstashConfigured = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

    return (
        <div className="space-y-8 pb-10">
            <AdminHeader
                title="Dashboard"
                description="Ringkasan aktivitas pesantren hari ini"
            />

            <div className="px-6">
                {/* 1. Main Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card className="border-none shadow-sm bg-gradient-to-br from-white to-gray-50/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Pendaftar</CardTitle>
                            <Users className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{stats.psbCount}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                Calon santri baru
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-gradient-to-br from-white to-gray-50/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Artikel & Berita</CardTitle>
                            <Newspaper className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{stats.postCount}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                Publikasi aktif
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-gradient-to-br from-white to-gray-50/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Program Infaq</CardTitle>
                            <Heart className="h-4 w-4 text-rose-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{stats.donationCount}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                Program donasi aktif
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-gradient-to-br from-white to-gray-50/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Dokumentasi</CardTitle>
                            <ImageIcon className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{stats.galleryCount}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                Foto kegiatan
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* 2. Recent Registrations (Takes up 2 cols) */}
                    <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-white border-b border-gray-100 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Pendaftar Terbaru</CardTitle>
                                <CardDescription>5 calon santri yang baru mendaftar</CardDescription>
                            </div>
                            <Link href="/admin/psb" className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-full transition-colors">
                                Lihat Semua <ArrowUpRight className="w-3 h-3" />
                            </Link>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Nama</th>
                                            <th className="px-6 py-3 font-medium">Unit</th>
                                            <th className="px-6 py-3 font-medium">Tanggal</th>
                                            <th className="px-6 py-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {stats.recentRegistrations.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500 italic">
                                                    Belum ada pendaftar baru
                                                </td>
                                            </tr>
                                        ) : (
                                            stats.recentRegistrations.map((reg) => (
                                                <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-gray-900">
                                                        {reg.namaLengkap}
                                                        <div className="text-[10px] text-gray-400 font-normal">{reg.registrationNumber}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">{reg.unit.name}</td>
                                                    <td className="px-6 py-4 text-gray-600">
                                                        {format(new Date(reg.createdAt), 'dd MMM yyyy', { locale: id })}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <StatusBadge status={reg.status} />
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Column Stack */}
                    <div className="space-y-6">
                        {/* 3. PSB Statistics Chart */}
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base">Statistik Pendaftar</CardTitle>
                                <CardDescription>Persebaran per unit</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {stats.chartData.length > 0 ? (
                                    <MiniChart data={stats.chartData} />
                                ) : (
                                    <div className="h-24 flex items-center justify-center text-xs text-gray-400 bg-gray-50 rounded-md border border-dashed border-gray-200">
                                        Belum ada data
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* 4. Top Donations */}
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base">Infaq Terpopuler</CardTitle>
                                <CardDescription>Program dengan donasi tertinggi</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {stats.recentDonations.map((program, i) => {
                                    const percent = Math.min((Number(program.currentAmount) / Number(program.targetAmount)) * 100, 100);
                                    return (
                                        <div key={i} className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className="truncate max-w-[150px]">{program.title}</span>
                                                <span className="text-emerald-600">{Math.round(percent)}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-emerald-500 rounded-full"
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>

                        {/* 5. System Health */}
                        <Card className="border-none shadow-sm bg-slate-900 text-white">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-emerald-400" />
                                    System Health
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between text-sm border-b border-slate-800 pb-2">
                                    <span className="text-slate-400 flex items-center gap-2">
                                        <Youtube className="w-3.5 h-3.5" /> YouTube API
                                    </span>
                                    <span className={youtubeConfigured ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
                                        {youtubeConfigured ? "Connected" : "Not Configured"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm border-b border-slate-800 pb-2">
                                    <span className="text-slate-400 flex items-center gap-2">
                                        <ShieldCheck className="w-3.5 h-3.5" /> Rate Limiting
                                    </span>
                                    <span className={upstashConfigured ? "text-emerald-400 font-medium" : "text-blue-400 font-medium"}>
                                        {upstashConfigured ? "Upstash Redis" : "In-Memory"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400 flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5" /> Server Time
                                    </span>
                                    <span className="text-slate-300 font-mono text-xs">
                                        {format(new Date(), 'HH:mm', { locale: id })} WIB
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
