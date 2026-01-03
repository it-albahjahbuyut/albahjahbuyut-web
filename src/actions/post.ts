"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { postSchema, type PostInput } from "@/lib/validations";
import { auth } from "@/lib/auth";

export async function getPosts(options?: {
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    category?: "BERITA" | "PENGUMUMAN" | "KEGIATAN" | "PRESTASI" | "ARTIKEL";
    limit?: number;
    offset?: number;
}) {
    try {
        const where: Record<string, unknown> = {};

        if (options?.status) {
            where.status = options.status;
        }
        if (options?.category) {
            where.category = options.category;
        }

        const posts = await db.post.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: options?.limit || 50,
            skip: options?.offset || 0,
            include: {
                author: {
                    select: { id: true, name: true, email: true },
                },
                unit: {
                    select: { id: true, name: true, slug: true },
                },
            },
        });

        const total = await db.post.count({ where });

        return { success: true, data: posts, total };
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        return { success: false, error: "Gagal mengambil data berita" };
    }
}

export async function getPost(id: string) {
    try {
        const post = await db.post.findUnique({
            where: { id },
            include: {
                author: {
                    select: { id: true, name: true, email: true },
                },
                unit: {
                    select: { id: true, name: true, slug: true },
                },
            },
        });

        if (!post) {
            return { success: false, error: "Berita tidak ditemukan" };
        }

        return { success: true, data: post };
    } catch (error) {
        console.error("Failed to fetch post:", error);
        return { success: false, error: "Gagal mengambil data berita" };
    }
}

export async function createPost(data: PostInput) {
    try {
        const session = await auth();
        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const validated = postSchema.parse(data);

        const post = await db.post.create({
            data: {
                ...validated,
                authorId: session.user.id,
                publishedAt: validated.status === "PUBLISHED" ? new Date() : null,
            },
        });

        revalidatePath("/admin/posts");
        revalidatePath("/berita");

        return { success: true, data: post };
    } catch (error) {
        console.error("Failed to create post:", error);
        return { success: false, error: "Gagal membuat berita" };
    }
}

export async function updatePost(id: string, data: PostInput) {
    try {
        const session = await auth();
        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const validated = postSchema.parse(data);

        // Get existing post to check published status
        const existing = await db.post.findUnique({ where: { id } });

        const post = await db.post.update({
            where: { id },
            data: {
                ...validated,
                publishedAt:
                    validated.status === "PUBLISHED" && !existing?.publishedAt
                        ? new Date()
                        : existing?.publishedAt,
                updatedAt: new Date(),
            },
        });

        revalidatePath("/admin/posts");
        revalidatePath(`/admin/posts/${id}`);
        revalidatePath(`/berita/${post.slug}`);

        return { success: true, data: post };
    } catch (error) {
        console.error("Failed to update post:", error);
        return { success: false, error: "Gagal memperbarui berita" };
    }
}

export async function deletePost(id: string) {
    try {
        const session = await auth();
        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        await db.post.delete({ where: { id } });

        revalidatePath("/admin/posts");
        revalidatePath("/berita");

        return { success: true };
    } catch (error) {
        console.error("Failed to delete post:", error);
        return { success: false, error: "Gagal menghapus berita" };
    }
}
