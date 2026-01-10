"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Unit } from "@prisma/client";
import { updateUnit } from "@/actions/unit";
import { unitSchema, type UnitInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CloudinaryUpload } from "@/components/ui/cloudinary-upload";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { TiptapEditor } from "@/components/editor/tiptap";

interface UnitFormProps {
    unit: Unit;
    onSuccess?: () => void;
}

export function UnitForm({ unit, onSuccess }: UnitFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<UnitInput>({
        resolver: zodResolver(unitSchema) as never,
        defaultValues: {
            name: unit.name,
            slug: unit.slug,
            description: unit.description || "",
            curriculum: unit.curriculum || "",
            facilities: unit.facilities || "",
            registrationLink: unit.registrationLink || "",
            image: unit.image || "",
            isActive: unit.isActive,
            order: unit.order,
        },
    });

    const onSubmit = async (data: UnitInput) => {
        try {
            setIsLoading(true);
            const result = await updateUnit(unit.id, data);

            if (!result.success) {
                toast.error(result.error || "Gagal memperbarui unit");
                return;
            }

            toast.success("Unit berhasil diperbarui");
            router.refresh();
            onSuccess?.();
        } catch {
            toast.error("Terjadi kesalahan");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Unit</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled />
                                </FormControl>
                                <FormDescription>Nama unit tidak dapat diubah</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled />
                                </FormControl>
                                <FormDescription>URL path unit</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Deskripsi</FormLabel>
                            <FormControl>
                                <TiptapEditor
                                    content={field.value || ""}
                                    onChange={field.onChange}
                                    placeholder="Tulis deskripsi unit..."
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="curriculum"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Kurikulum</FormLabel>
                            <FormControl>
                                <TiptapEditor
                                    content={field.value || ""}
                                    onChange={field.onChange}
                                    placeholder="Jelaskan kurikulum yang digunakan..."
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="facilities"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fasilitas</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="Daftar fasilitas (satu per baris)"
                                    rows={4}
                                />
                            </FormControl>
                            <FormDescription>
                                Masukkan daftar fasilitas, satu per baris
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="registrationLink"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Link Pendaftaran</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="url"
                                    placeholder="https://..."
                                />
                            </FormControl>
                            <FormDescription>
                                Link ke form pendaftaran online
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Image Upload Field */}
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gambar Cover</FormLabel>
                            <FormDescription className="mb-3">
                                Gambar ini akan ditampilkan di halaman utama dan hero section detail unit.
                            </FormDescription>

                            {/* Current Image Preview */}
                            {field.value && (
                                <div className="relative mb-4 rounded-lg overflow-hidden border bg-muted/20 aspect-video max-w-sm">
                                    <Image
                                        src={field.value}
                                        alt="Preview gambar unit"
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => field.onChange("")}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            {/* URL Input */}
                            <div className="space-y-4">
                                <div>
                                    <FormLabel className="text-sm text-muted-foreground">Masukkan URL Gambar</FormLabel>
                                    <Input
                                        placeholder="https://example.com/image.jpg"
                                        value={field.value || ""}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>

                                {/* Divider */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">atau upload</span>
                                    </div>
                                </div>

                                {/* Cloudinary Upload */}
                                <FormControl>
                                    <CloudinaryUpload
                                        folder="abbuyut/units"
                                        onUploadComplete={(url: string) => field.onChange(url)}
                                        onUploadError={(error: string) => toast.error(error)}
                                        disabled={isLoading}
                                    />
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onSuccess}
                        disabled={isLoading}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                        {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
