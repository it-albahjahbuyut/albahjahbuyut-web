"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Majelis } from "@prisma/client";
import { AdminHeader } from "@/components/admin/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Calendar, Clock, MapPin, User } from "lucide-react";
import { createMajelis, updateMajelis } from "@/actions/majelis";
import { toast } from "sonner";
import Link from "next/link";

interface MajelisFormProps {
    majelis?: Majelis | null;
    isNew?: boolean;
}

export function MajelisForm({ majelis, isNew = false }: MajelisFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: majelis?.title || "",
        subtitle: majelis?.subtitle || "",
        teacher: majelis?.teacher || "",
        schedule: majelis?.schedule || "",
        time: majelis?.time || "",
        location: majelis?.location || "",
        order: majelis?.order || 0,
        isActive: majelis?.isActive ?? true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error("Nama majelis wajib diisi");
            return;
        }

        if (!formData.schedule.trim()) {
            toast.error("Jadwal wajib diisi");
            return;
        }

        if (!formData.time.trim()) {
            toast.error("Waktu wajib diisi");
            return;
        }

        try {
            setIsSubmitting(true);

            const data = {
                title: formData.title.trim(),
                subtitle: formData.subtitle.trim() || null,
                teacher: formData.teacher.trim() || null,
                schedule: formData.schedule.trim(),
                time: formData.time.trim(),
                location: formData.location.trim() || null,
                order: formData.order,
                isActive: formData.isActive,
            };

            let result;
            if (isNew) {
                result = await createMajelis(data);
            } else if (majelis) {
                result = await updateMajelis(majelis.id, data);
            }

            if (!result?.success) {
                toast.error(result?.error || "Gagal menyimpan data");
                return;
            }

            toast.success(isNew ? "Majelis berhasil ditambahkan" : "Majelis berhasil diperbarui");
            router.push("/admin/majelis");
            router.refresh();
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Terjadi kesalahan");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <AdminHeader
                title={isNew ? "Tambah Majelis" : "Edit Majelis"}
                description={isNew ? "Tambahkan jadwal majelis rutin baru" : `Edit jadwal ${majelis?.title}`}
            >
                <Link href="/admin/majelis">
                    <Button variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali
                    </Button>
                </Link>
            </AdminHeader>

            <form onSubmit={handleSubmit} className="p-6">
                <div className="max-w-2xl space-y-6">
                    {/* Info Dasar */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Informasi Majelis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Nama Majelis *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Contoh: Jalsah Itsnain"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="subtitle">Deskripsi Singkat</Label>
                                <Textarea
                                    id="subtitle"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    placeholder="Contoh: Majelis Rasulullah SAW"
                                    className="mt-1"
                                    rows={2}
                                />
                            </div>

                            <div>
                                <Label htmlFor="teacher" className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Pengajar / Pengisi Majelis
                                </Label>
                                <Input
                                    id="teacher"
                                    value={formData.teacher}
                                    onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                                    placeholder="Contoh: Abah Sayf Abu Hanifah"
                                    className="mt-1"
                                />
                                <p className="text-xs text-gray-500 mt-1">Nama ustadz/ustadzah yang mengisi majelis</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Jadwal */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Jadwal & Waktu
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="schedule">Jadwal *</Label>
                                <Input
                                    id="schedule"
                                    value={formData.schedule}
                                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                                    placeholder="Contoh: Senin Malam Selasa"
                                    className="mt-1"
                                />
                                <p className="text-xs text-gray-500 mt-1">Tuliskan hari pelaksanaan majelis</p>
                            </div>

                            <div>
                                <Label htmlFor="time" className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Waktu *
                                </Label>
                                <Input
                                    id="time"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    placeholder="Contoh: 18.30 WIB (Ba'da Maghrib)"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="location" className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Lokasi
                                </Label>
                                <Input
                                    id="location"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="Contoh: Masjid Al-Bahjah Buyut"
                                    className="mt-1"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pengaturan */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Pengaturan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="order">Urutan Tampil</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    className="mt-1 w-24"
                                    min={0}
                                />
                                <p className="text-xs text-gray-500 mt-1">Semakin kecil, semakin di depan</p>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <Label>Status Aktif</Label>
                                    <p className="text-sm text-gray-500">Tampilkan majelis ini di halaman utama</p>
                                </div>
                                <Switch
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {isSubmitting ? "Menyimpan..." : "Simpan"}
                        </Button>
                        <Link href="/admin/majelis">
                            <Button type="button" variant="outline" disabled={isSubmitting}>
                                Batal
                            </Button>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
