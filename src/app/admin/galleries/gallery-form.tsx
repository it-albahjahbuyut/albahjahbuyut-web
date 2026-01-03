"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gallery, Unit } from "@prisma/client";
import { z } from "zod";
import { createGallery, updateGallery, type GalleryInput } from "@/actions/gallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";

const galleryFormSchema = z.object({
    title: z.string().min(1, "Judul wajib diisi"),
    description: z.string().optional(),
    imageUrl: z.string().url("URL gambar tidak valid"),
    order: z.number().default(0),
    isActive: z.boolean().default(true),
    unitId: z.string().optional().nullable(),
});

interface GalleryFormProps {
    gallery?: Gallery;
    units: Unit[];
}

export function GalleryForm({ gallery, units }: GalleryFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const isEditing = !!gallery;

    const form = useForm<GalleryInput>({
        resolver: zodResolver(galleryFormSchema) as never,
        defaultValues: {
            title: gallery?.title || "",
            description: gallery?.description || "",
            imageUrl: gallery?.imageUrl || "",
            order: gallery?.order || 0,
            isActive: gallery?.isActive ?? true,
            unitId: gallery?.unitId || null,
        },
    });

    const imageUrl = form.watch("imageUrl");

    const onSubmit = async (data: GalleryInput) => {
        try {
            setIsLoading(true);

            const result = isEditing
                ? await updateGallery(gallery.id, data)
                : await createGallery(data);

            if (!result.success) {
                toast.error(result.error || "Gagal menyimpan galeri");
                return;
            }

            toast.success(isEditing ? "Galeri berhasil diperbarui" : "Galeri berhasil dibuat");
            router.push("/admin/galleries");
            router.refresh();
        } catch {
            toast.error("Terjadi kesalahan");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardContent className="pt-6 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Judul Foto</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Contoh: Kegiatan Santri"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Deskripsi (Opsional)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Deskripsi singkat foto..."
                                                    rows={3}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gambar</FormLabel>
                                            <FormControl>
                                                <div className="space-y-4">
                                                    {imageUrl ? (
                                                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                                                            <Image
                                                                src={imageUrl}
                                                                alt="Preview"
                                                                fill
                                                                className="object-cover"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="icon"
                                                                className="absolute top-2 right-2"
                                                                onClick={() => field.onChange("")}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <UploadDropzone
                                                            endpoint="galleryImage"
                                                            onClientUploadComplete={(res) => {
                                                                if (res?.[0]?.ufsUrl) {
                                                                    field.onChange(res[0].ufsUrl);
                                                                    toast.success("Gambar berhasil diupload");
                                                                }
                                                            }}
                                                            onUploadError={(error: Error) => {
                                                                toast.error(`Gagal upload: ${error.message}`);
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="pt-6 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="unitId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Unit Terkait (Opsional)</FormLabel>
                                            <Select
                                                onValueChange={(value) =>
                                                    field.onChange(value === "none" ? null : value)
                                                }
                                                defaultValue={field.value || "none"}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih unit" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="none">Tidak ada</SelectItem>
                                                    {units.map((unit) => (
                                                        <SelectItem key={unit.id} value={unit.id}>
                                                            {unit.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Kaitkan dengan unit tertentu
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="order"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Urutan Tampilan</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Angka kecil tampil lebih dulu
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Aktif</FormLabel>
                                                <FormDescription>
                                                    Tampilkan di halaman publik
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => router.back()}
                                disabled={isLoading}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                                disabled={isLoading}
                            >
                                {isLoading ? "Menyimpan..." : isEditing ? "Perbarui" : "Simpan"}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
}
