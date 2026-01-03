"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

const gallerySchema = z.object({
    title: z.string().min(1, "Judul wajib diisi"),
    description: z.string().optional(),
    imageUrl: z.string().url("URL gambar tidak valid"),
    order: z.number().default(0),
    isActive: z.boolean().default(true),
    unitId: z.string().optional().nullable(),
});

export type GalleryInput = z.infer<typeof gallerySchema>;

export async function getGalleries(options?: {
    isActive?: boolean;
    unitId?: string;
    limit?: number;
}) {
    try {
        const where: Record<string, unknown> = {};

        if (options?.isActive !== undefined) {
            where.isActive = options.isActive;
        }
        if (options?.unitId) {
            where.unitId = options.unitId;
        }

        const galleries = await db.gallery.findMany({
            where,
            orderBy: { order: "asc" },
            take: options?.limit || 100,
            include: {
                unit: {
                    select: { id: true, name: true },
                },
            },
        });

        return { success: true, data: galleries };
    } catch (error) {
        console.error("Failed to fetch galleries:", error);
        return { success: false, error: "Gagal mengambil data galeri" };
    }
}

export async function getGallery(id: string) {
    try {
        const gallery = await db.gallery.findUnique({
            where: { id },
            include: {
                unit: {
                    select: { id: true, name: true },
                },
            },
        });

        if (!gallery) {
            return { success: false, error: "Galeri tidak ditemukan" };
        }

        return { success: true, data: gallery };
    } catch (error) {
        console.error("Failed to fetch gallery:", error);
        return { success: false, error: "Gagal mengambil data galeri" };
    }
}

export async function createGallery(data: GalleryInput) {
    try {
        const session = await auth();
        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const validated = gallerySchema.parse(data);

        const gallery = await db.gallery.create({
            data: validated,
        });

        revalidatePath("/admin/galleries");
        revalidatePath("/galeri");

        return { success: true, data: gallery };
    } catch (error) {
        console.error("Failed to create gallery:", error);
        return { success: false, error: "Gagal membuat galeri" };
    }
}

export async function updateGallery(id: string, data: GalleryInput) {
    try {
        const session = await auth();
        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const validated = gallerySchema.parse(data);

        const gallery = await db.gallery.update({
            where: { id },
            data: {
                ...validated,
                updatedAt: new Date(),
            },
        });

        revalidatePath("/admin/galleries");
        revalidatePath(`/admin/galleries/${id}`);
        revalidatePath("/galeri");

        return { success: true, data: gallery };
    } catch (error) {
        console.error("Failed to update gallery:", error);
        return { success: false, error: "Gagal memperbarui galeri" };
    }
}

export async function deleteGallery(id: string) {
    try {
        const session = await auth();
        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        await db.gallery.delete({ where: { id } });

        revalidatePath("/admin/galleries");
        revalidatePath("/galeri");

        return { success: true };
    } catch (error) {
        console.error("Failed to delete gallery:", error);
        return { success: false, error: "Gagal menghapus galeri" };
    }
}
