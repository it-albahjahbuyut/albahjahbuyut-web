"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDonation, updateDonation } from "@/actions/donation";
import { donationSchema, type DonationInput } from "@/lib/validations";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CloudinaryUpload, CloudinaryMultiUpload } from "@/components/ui/cloudinary-upload";
import { X, Sparkles, Loader2, Trash2, ImageIcon } from "lucide-react";
import { SerializedDonation } from "@/lib/types";

interface DonationFormProps {
    donation?: SerializedDonation;
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

export function DonationForm({ donation }: DonationFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isAiGenerating, setIsAiGenerating] = useState(false);
    const isEditing = !!donation;

    const form = useForm<DonationInput>({
        resolver: zodResolver(donationSchema) as never,
        defaultValues: {
            title: donation?.title || "",
            slug: donation?.slug || "",
            description: donation?.description || "",
            image: donation?.image || "",
            targetAmount: donation ? Number(donation.targetAmount) : 0,
            currentAmount: donation ? Number(donation.currentAmount) : 0,
            bankName: donation?.bankName || "",
            accountNumber: donation?.accountNumber || "",
            accountName: donation?.accountName || "",
            isActive: donation?.isActive ?? true,
            isFeatured: donation?.isFeatured ?? false,
            endDate: donation?.endDate || undefined,
            galleryImages: donation?.images?.map((img: { imageUrl: string }) => img.imageUrl) || [],
        },
    });

    const watchImage = form.watch("image");
    const watchTitle = form.watch("title");
    const watchGalleryImages = form.watch("galleryImages") || [];

    const handleTitleChange = (value: string) => {
        form.setValue("title", value);
        if (!isEditing && !form.getValues("slug")) {
            form.setValue("slug", generateSlug(value));
        }
    };

    const handleAiGenerate = async () => {
        const title = form.getValues("title");
        const image = form.getValues("image");

        if (!title) {
            toast.error("Masukkan judul program terlebih dahulu");
            return;
        }

        try {
            setIsAiGenerating(true);
            toast.info("Generating deskripsi dengan AI...");

            const response = await fetch("/api/ai/generate-caption", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    imageUrl: image || undefined,
                    type: "donation",
                }),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || "Gagal generate deskripsi");
            }

            // Update form fields with AI-generated content
            if (result.data.slug && !form.getValues("slug")) {
                form.setValue("slug", result.data.slug);
            }
            if (result.data.summary || result.data.content) {
                // Combine summary and content for donation description
                const description = result.data.content || result.data.summary;
                form.setValue("description", description.replace(/<[^>]*>/g, '')); // Strip HTML tags for textarea
            }

            toast.success("Deskripsi berhasil di-generate dengan AI!");
        } catch (error) {
            console.error("AI generation error:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Gagal generate deskripsi dengan AI"
            );
        } finally {
            setIsAiGenerating(false);
        }
    };

    const onSubmit = async (data: DonationInput) => {
        try {
            setIsLoading(true);

            const result = isEditing
                ? await updateDonation(donation.id, data)
                : await createDonation(data);

            if (!result.success) {
                toast.error(result.error || "Gagal menyimpan program");
                return;
            }

            toast.success(isEditing ? "Program berhasil diperbarui" : "Program berhasil dibuat");
            router.push("/admin/donations");
            router.refresh();
        } catch {
            toast.error("Terjadi kesalahan");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Program</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Judul Program</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            onChange={(e) => handleTitleChange(e.target.value)}
                                            placeholder="Contoh: Infaq Pembangunan Masjid"
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
                                    <FormLabel>Slug URL</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="infaq-pembangunan-masjid" />
                                    </FormControl>
                                    <FormDescription>
                                        URL: /donasi/{field.value || "..."}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Deskripsi</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Jelaskan tujuan dan manfaat program donasi ini..."
                                            rows={4}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="image"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Gambar Program</FormLabel>
                                    {watchImage ? (
                                        <div className="relative">
                                            <img
                                                src={watchImage}
                                                alt="Preview"
                                                className="w-full h-40 object-cover rounded-lg"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 h-8 w-8"
                                                onClick={() => form.setValue("image", "")}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <CloudinaryUpload
                                            folder="abbuyut/donations"
                                            onUploadComplete={(url) => {
                                                form.setValue("image", url);
                                                toast.success("Gambar berhasil diupload");
                                            }}
                                            onUploadError={(error) => {
                                                toast.error(`Upload gagal: ${error}`);
                                            }}
                                        />
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* AI Generate Button */}
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-300 hover:from-purple-500/20 hover:to-pink-500/20"
                            onClick={handleAiGenerate}
                            disabled={isAiGenerating || !watchTitle}
                        >
                            {isAiGenerating ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                                    Generate dengan AI
                                </>
                            )}
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                            Generate slug dan deskripsi otomatis berdasarkan judul{watchImage ? " dan gambar" : ""}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Target & Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="targetAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Target Donasi (Rp)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                placeholder="10000000"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="currentAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Jumlah Terkumpul (Rp)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                placeholder="0"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Update manual jumlah yang sudah terkumpul
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(value === "true")}
                                        defaultValue={field.value ? "true" : "false"}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="true">Aktif</SelectItem>
                                            <SelectItem value="false">Nonaktif</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Highlight di Beranda</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(value === "true")}
                                        defaultValue={field.value ? "true" : "false"}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="true">Ya</SelectItem>
                                            <SelectItem value="false">Tidak</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Tampilkan program ini di halaman depan website
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                {/* Gallery Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="w-5 h-5" />
                            Galeri Dokumentasi
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="galleryImages"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <FormLabel>Foto Dokumentasi & Perencanaan</FormLabel>
                                            {field.value && field.value.length > 0 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8"
                                                    onClick={() => field.onChange([])}
                                                >
                                                    Hapus Semua
                                                </Button>
                                            )}
                                        </div>

                                        <CloudinaryMultiUpload
                                            folder="abbuyut/donations/gallery"
                                            onUploadComplete={(urls) => {
                                                // Use form.getValues to get fresh values, avoiding stale closure
                                                const currentImages = form.getValues("galleryImages") || [];
                                                const newImages = [...currentImages, ...urls];
                                                form.setValue("galleryImages", newImages, { shouldDirty: true });
                                                toast.success(`${urls.length} gambar ditambahkan`);
                                            }}
                                            onUploadError={(err) => toast.error(err)}
                                        />

                                        {/* Image Grid */}
                                        {field.value && field.value.length > 0 ? (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                                {field.value.map((url, index) => (
                                                    <div key={`${url}-${index}`} className="relative group aspect-square bg-slate-100 rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                                                        <img
                                                            src={url}
                                                            alt={`Galeri ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newImages = [...field.value];
                                                                newImages.splice(index, 1);
                                                                field.onChange(newImages);
                                                            }}
                                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm z-10"
                                                            title="Hapus gambar"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                        <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm text-white text-[10px] p-1.5 opacity-0 group-hover:opacity-100 transition-opacity truncate text-center">
                                                            Gambar {index + 1}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 border-2 border-dashed rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                                <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                                                    <ImageIcon className="w-8 h-8 opacity-20" />
                                                    <p className="text-sm italic">
                                                        Belum ada foto dokumentasi. Upload foto perencanaan atau progress program.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Rekening</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="bankName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Bank</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Contoh: Bank Syariah Indonesia" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="accountNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nomor Rekening</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="1234567890" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="accountName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Atas Nama</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Yayasan Al-Bahjah Buyut" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isLoading}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        className="bg-gradient-to-r from-green-500 to-emerald-600"
                        disabled={isLoading}
                    >
                        {isLoading ? "Menyimpan..." : isEditing ? "Perbarui" : "Simpan"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
