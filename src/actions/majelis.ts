"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

const majelisSchema = z.object({
    title: z.string().min(1, "Judul wajib diisi"),
    subtitle: z.string().optional().nullable(),
    schedule: z.string().min(1, "Jadwal wajib diisi"),
    time: z.string().min(1, "Waktu wajib diisi"),
    location: z.string().optional().nullable(),
    order: z.number().default(0),
    isActive: z.boolean().default(true),
});

export type MajelisInput = z.infer<typeof majelisSchema>;

export async function getMajelisList(options?: {
    isActive?: boolean;
    limit?: number;
}) {
    try {
        const where: Record<string, unknown> = {};

        if (options?.isActive !== undefined) {
            where.isActive = options.isActive;
        }

        const majelisList = await db.majelis.findMany({
            where,
            orderBy: { order: "asc" },
            take: options?.limit || 100,
        });

        return { success: true, data: majelisList };
    } catch (error) {
        console.error("Failed to fetch majelis:", error);
        return { success: false, error: "Gagal mengambil data majelis" };
    }
}

export async function getMajelis(id: string) {
    try {
        const majelis = await db.majelis.findUnique({
            where: { id },
        });

        if (!majelis) {
            return { success: false, error: "Majelis tidak ditemukan" };
        }

        return { success: true, data: majelis };
    } catch (error) {
        console.error("Failed to fetch majelis:", error);
        return { success: false, error: "Gagal mengambil data majelis" };
    }
}

export async function createMajelis(data: MajelisInput) {
    try {
        const session = await auth();
        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const validated = majelisSchema.parse(data);

        const majelis = await db.majelis.create({
            data: validated,
        });

        revalidatePath("/admin/majelis");
        revalidatePath("/");

        return { success: true, data: majelis };
    } catch (error) {
        console.error("Failed to create majelis:", error);
        return { success: false, error: "Gagal membuat majelis" };
    }
}

export async function updateMajelis(id: string, data: MajelisInput) {
    try {
        const session = await auth();
        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const validated = majelisSchema.parse(data);

        const majelis = await db.majelis.update({
            where: { id },
            data: {
                ...validated,
                updatedAt: new Date(),
            },
        });

        revalidatePath("/admin/majelis");
        revalidatePath(`/admin/majelis/${id}`);
        revalidatePath("/");

        return { success: true, data: majelis };
    } catch (error) {
        console.error("Failed to update majelis:", error);
        return { success: false, error: "Gagal memperbarui majelis" };
    }
}

export async function deleteMajelis(id: string) {
    try {
        const session = await auth();
        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        await db.majelis.delete({ where: { id } });

        revalidatePath("/admin/majelis");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Failed to delete majelis:", error);
        return { success: false, error: "Gagal menghapus majelis" };
    }
}
