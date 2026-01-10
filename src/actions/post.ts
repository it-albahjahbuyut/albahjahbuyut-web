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
                images: {
                    orderBy: { order: 'asc' },
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
        const { galleryImages, ...postData } = validated;

        // Use transaction to create post and images
        const post = await db.$transaction(async (tx) => {
            const newPost = await tx.post.create({
                data: {
                    ...postData,
                    authorId: session.user.id,
                    publishedAt: validated.status === "PUBLISHED" ? new Date() : null,
                },
            });

            // Create gallery images if any
            if (galleryImages && galleryImages.length > 0) {
                await tx.postImage.createMany({
                    data: galleryImages.map((url, index) => ({
                        postId: newPost.id,
                        imageUrl: url,
                        order: index,
                    })),
                });
            }

            return newPost;
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
        const { galleryImages, ...postData } = validated;

        // Get existing post to check published status
        const existing = await db.post.findUnique({ where: { id } });

        // Use transaction to update post and replace images
        const post = await db.$transaction(async (tx) => {
            const updatedPost = await tx.post.update({
                where: { id },
                data: {
                    ...postData,
                    publishedAt:
                        validated.status === "PUBLISHED" && !existing?.publishedAt
                            ? new Date()
                            : existing?.publishedAt,
                    updatedAt: new Date(),
                },
            });

            // Handle gallery images
            // First, delete existing images
            await tx.postImage.deleteMany({
                where: { postId: id },
            });

            // Then create new images if any
            if (galleryImages && galleryImages.length > 0) {
                await tx.postImage.createMany({
                    data: galleryImages.map((url, index) => ({
                        postId: id,
                        imageUrl: url,
                        order: index,
                    })),
                });
            }

            return updatedPost;
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
