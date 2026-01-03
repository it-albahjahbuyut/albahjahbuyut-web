"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Post, Unit } from "@prisma/client";
import { createPost, updatePost } from "@/actions/post";
import { postSchema, type PostInput } from "@/lib/validations";
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
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { TiptapEditor } from "@/components/editor/tiptap";
import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";

interface PostFormProps {
    post?: Post;
    units: Unit[];
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

export function PostForm({ post, units }: PostFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const isEditing = !!post;

    const form = useForm<PostInput>({
        resolver: zodResolver(postSchema) as never,
        defaultValues: {
            title: post?.title || "",
            slug: post?.slug || "",
            content: post?.content || "",
            excerpt: post?.excerpt || "",
            image: post?.image || "",
            category: post?.category || "BERITA",
            status: post?.status || "DRAFT",
            featured: post?.featured || false,
            unitId: post?.unitId || undefined,
        },
    });

    const watchTitle = form.watch("title");
    const watchImage = form.watch("image");

    const handleTitleChange = (value: string) => {
        form.setValue("title", value);
        if (!isEditing && !form.getValues("slug")) {
            form.setValue("slug", generateSlug(value));
        }
    };

    const onSubmit = async (data: PostInput) => {
        try {
            setIsLoading(true);

            const result = isEditing
                ? await updatePost(post.id, data)
                : await createPost(data);

            if (!result.success) {
                toast.error(result.error || "Gagal menyimpan artikel");
                return;
            }

            toast.success(isEditing ? "Artikel berhasil diperbarui" : "Artikel berhasil dibuat");
            router.push("/admin/posts");
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
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Judul Artikel</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    onChange={(e) => handleTitleChange(e.target.value)}
                                                    placeholder="Masukkan judul artikel..."
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
                                                <Input
                                                    {...field}
                                                    placeholder="judul-artikel"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                URL: /berita/{field.value || "..."}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="excerpt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ringkasan</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="Ringkasan singkat artikel..."
                                                    rows={3}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Konten</FormLabel>
                                            <FormControl>
                                                <TiptapEditor
                                                    content={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Tulis konten artikel..."
                                                />
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
                            <CardContent className="pt-6 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                                    <SelectItem value="PUBLISHED">Published</SelectItem>
                                                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kategori</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih kategori" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="BERITA">Berita</SelectItem>
                                                    <SelectItem value="PENGUMUMAN">Pengumuman</SelectItem>
                                                    <SelectItem value="KEGIATAN">Kegiatan</SelectItem>
                                                    <SelectItem value="PRESTASI">Prestasi</SelectItem>
                                                    <SelectItem value="ARTIKEL">Artikel</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="unitId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Unit Terkait</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih unit (opsional)" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="">Tidak ada</SelectItem>
                                                    {units.map((unit) => (
                                                        <SelectItem key={unit.id} value={unit.id}>
                                                            {unit.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Hubungkan artikel dengan unit tertentu
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gambar Utama</FormLabel>
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
                                                <UploadDropzone
                                                    endpoint="postImage"
                                                    onClientUploadComplete={(res) => {
                                                        if (res?.[0]) {
                                                            form.setValue("image", res[0].ufsUrl);
                                                            toast.success("Gambar berhasil diupload");
                                                        }
                                                    }}
                                                    onUploadError={(error: Error) => {
                                                        toast.error(`Upload gagal: ${error.message}`);
                                                    }}
                                                />
                                            )}
                                            <FormMessage />
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
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600"
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
