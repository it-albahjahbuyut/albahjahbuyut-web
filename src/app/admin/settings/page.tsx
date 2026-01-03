import { AdminHeader } from "@/components/admin/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { User, Shield, Database } from "lucide-react";

export default async function SettingsPage() {
    const session = await auth();

    return (
        <div>
            <AdminHeader
                title="Pengaturan"
                description="Kelola pengaturan akun dan sistem"
            />
            <div className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Profile Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Profil Admin
                            </CardTitle>
                            <CardDescription>Informasi akun Anda</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Nama</label>
                                    <p className="font-medium">{session?.user?.name || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Email</label>
                                    <p className="font-medium">{session?.user?.email || "-"}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Role</label>
                                    <p className="font-medium">{session?.user?.role || "-"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Keamanan
                            </CardTitle>
                            <CardDescription>Pengaturan keamanan akun</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Password</label>
                                    <p className="text-sm text-gray-600">
                                        Untuk mengganti password, hubungi Super Admin
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Sesi</label>
                                    <p className="text-sm text-gray-600">
                                        Sesi login akan berakhir dalam 30 hari
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Info Card */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5" />
                                Informasi Sistem
                            </CardTitle>
                            <CardDescription>Detail teknis aplikasi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Framework</label>
                                    <p className="font-medium">Next.js 15</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Database</label>
                                    <p className="font-medium">PostgreSQL + Prisma</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Auth</label>
                                    <p className="font-medium">NextAuth v5</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
