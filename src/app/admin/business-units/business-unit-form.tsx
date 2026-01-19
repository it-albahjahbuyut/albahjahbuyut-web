"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBusinessUnit, updateBusinessUnit } from "@/actions/business-unit";
import { businessUnitSchema, type BusinessUnitInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import { X, Loader2 } from "lucide-react";

interface BusinessUnitWithImages {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    services: string | null;
    address: string | null;
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    website: string | null;
    mapUrl: string | null;
    image: string | null;
    logo: string | null;
    isActive: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    images?: { id: string; imageUrl: string; caption: string | null; order: number }[];
}

interface BusinessUnitFormProps {
    businessUnit?: BusinessUnitWithImages;
}

export function BusinessUnitForm({ businessUnit }: BusinessUnitFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const isEditing = !!businessUnit;

    const form = useForm<BusinessUnitInput>({
        resolver: zodResolver(businessUnitSchema) as never,
        defaultValues: {
            name: businessUnit?.name || "",
            slug: businessUnit?.slug || "",
            description: businessUnit?.description || "",
            services: businessUnit?.services || "",
            address: businessUnit?.address || "",
            phone: businessUnit?.phone || "",
            whatsapp: businessUnit?.whatsapp || "",
            email: businessUnit?.email || "",
            website: businessUnit?.website || "",
            mapUrl: businessUnit?.mapUrl || "",
            image: businessUnit?.image || "",
            logo: businessUnit?.logo || "",
            isActive: businessUnit?.isActive ?? true,
            order: businessUnit?.order ?? 0,
            galleryImages: businessUnit?.images?.map((img) => img.imageUrl) || [],
        },
    });

    const imageValue = form.watch("image");
    const logoValue = form.watch("logo");
    const galleryImages = form.watch("galleryImages") || [];

    // Auto-generate slug from name
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        form.setValue("name", name);
        if (!isEditing) {
            form.setValue("slug", generateSlug(name));
        }
    };

    const onSubmit = async (data: BusinessUnitInput) => {
        try {
            setIsLoading(true);

            const result = isEditing
                ? await updateBusinessUnit(businessUnit.id, data)
                : await createBusinessUnit(data);

            if (!result.success) {
                toast.error(result.error || "Gagal menyimpan unit usaha");
                return;
            }

            toast.success(
                isEditing
                    ? "Unit usaha berhasil diperbarui"
                    : "Unit usaha berhasil dibuat"
            );
            router.push("/admin/business-units");
            router.refresh();
        } catch {
            toast.error("Terjadi kesalahan");
        } finally {
            setIsLoading(false);
        }
    };

    const addGalleryImage = (url: string) => {
        const currentImages = form.getValues("galleryImages") || [];
        form.setValue("galleryImages", [...currentImages, url]);
    };

    const removeGalleryImage = (index: number) => {
        const currentImages = form.getValues("galleryImages") || [];
        form.setValue(
            "galleryImages",
            currentImages.filter((_, i) => i !== index)
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informasi Dasar</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Unit Usaha *</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            onChange={handleNameChange}
                                            placeholder="Contoh: AB Travel"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug *</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="ab-travel"
                                            disabled={isEditing}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        URL: /unit-usaha/{field.value || "slug"}
                                    </FormDescription>
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
                                        placeholder="Tulis deskripsi unit usaha..."
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="services"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Layanan</FormLabel>
                                <FormControl>
                                    <TiptapEditor
                                        content={field.value || ""}
                                        onChange={field.onChange}
                                        placeholder="Jelaskan layanan yang tersedia..."
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informasi Kontak</h3>
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Alamat</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Alamat lengkap unit usaha"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nomor Telepon</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="021-12345678"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="whatsapp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>WhatsApp</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="6281234567890"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Format: 62xxx (tanpa + atau 0)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="email@domain.com"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Website</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="url"
                                            placeholder="https://..."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="mapUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Google Maps Embed URL</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="https://www.google.com/maps/embed?..."
                                    />
                                </FormControl>
                                <FormDescription>
                                    URL embed dari Google Maps untuk menampilkan lokasi
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Images */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Gambar</h3>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Main Image */}
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gambar Utama</FormLabel>
                                    <FormDescription>
                                        Gambar banner/cover unit usaha
                                    </FormDescription>

                                    {imageValue ? (
                                        <div className="relative rounded-lg overflow-hidden border bg-muted/20 aspect-video">
                                            <Image
                                                src={imageValue}
                                                alt="Cover"
                                                fill
                                                className="object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => form.setValue("image", "")}
                                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <FormControl>
                                            <CloudinaryUpload
                                                folder="business-units"
                                                onUploadComplete={(url: string) => field.onChange(url)}
                                            />
                                        </FormControl>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Logo */}
                        <FormField
                            control={form.control}
                            name="logo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Logo</FormLabel>
                                    <FormDescription>
                                        Logo unit usaha (opsional)
                                    </FormDescription>

                                    {logoValue ? (
                                        <div className="relative rounded-lg overflow-hidden border bg-muted/20 aspect-square w-[200px]">
                                            <Image
                                                src={logoValue}
                                                alt="Logo"
                                                fill
                                                className="object-contain p-2"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => form.setValue("logo", "")}
                                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <FormControl>
                                            <CloudinaryUpload
                                                folder="business-units/logos"
                                                onUploadComplete={(url: string) => field.onChange(url)}
                                            />
                                        </FormControl>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Gallery */}
                    <FormField
                        control={form.control}
                        name="galleryImages"
                        render={() => (
                            <FormItem>
                                <FormLabel>Galeri Gambar</FormLabel>
                                <FormDescription>
                                    Tambahkan gambar untuk galeri unit usaha
                                </FormDescription>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {galleryImages.map((url, index) => (
                                        <div
                                            key={index}
                                            className="relative rounded-lg overflow-hidden border bg-muted/20 aspect-square"
                                        >
                                            <Image
                                                src={url}
                                                alt={`Gallery ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(index)}
                                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300">
                                        <CloudinaryUpload
                                            folder="business-units/gallery"
                                            onUploadComplete={addGalleryImage}
                                        />
                                    </div>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Settings */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Pengaturan</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="order"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Urutan Tampilan</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            min={0}
                                            onChange={(e) =>
                                                field.onChange(parseInt(e.target.value) || 0)
                                            }
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Semakin kecil, semakin atas posisinya
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Status Aktif</FormLabel>
                                        <FormDescription>
                                            Tampilkan unit usaha di halaman publik
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
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isLoading}
                    >
                        Batal
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditing ? "Simpan Perubahan" : "Buat Unit Usaha"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
