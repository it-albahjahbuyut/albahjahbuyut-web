"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Unit } from "@prisma/client";
import { updateUnit } from "@/actions/unit";
import { unitSchema, type UnitInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
