"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { unitSchema, type UnitInput } from "@/lib/validations";
import { auth } from "@/lib/auth";

export async function getUnits() {
    try {
        const units = await db.unit.findMany({
            orderBy: { order: "asc" },
        });
        return { success: true, data: units };
    } catch (error) {
        console.error("Failed to fetch units:", error);
        return { success: false, error: "Gagal mengambil data unit" };
    }
}

export async function getUnit(id: string) {
    try {
        const unit = await db.unit.findUnique({
            where: { id },
        });
        if (!unit) {
            return { success: false, error: "Unit tidak ditemukan" };
        }
        return { success: true, data: unit };
    } catch (error) {
        console.error("Failed to fetch unit:", error);
        return { success: false, error: "Gagal mengambil data unit" };
    }
}

export async function updateUnit(id: string, data: UnitInput) {
    try {
        const session = await auth();
        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const validated = unitSchema.parse(data);

        const unit = await db.unit.update({
            where: { id },
            data: {
                ...validated,
                updatedAt: new Date(),
            },
        });

        revalidatePath("/admin/units");
        revalidatePath(`/admin/units/${id}`);
        revalidatePath(`/${unit.slug}`);

        return { success: true, data: unit };
    } catch (error) {
        console.error("Failed to update unit:", error);
        return { success: false, error: "Gagal memperbarui unit" };
    }
}

export async function createUnit(data: UnitInput) {
    try {
        const session = await auth();
        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const validated = unitSchema.parse(data);

        const unit = await db.unit.create({
            data: validated,
        });

        revalidatePath("/admin/units");

        return { success: true, data: unit };
    } catch (error) {
        console.error("Failed to create unit:", error);
        return { success: false, error: "Gagal membuat unit" };
    }
}

export async function deleteUnit(id: string) {
    try {
        const session = await auth();
        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        await db.unit.delete({ where: { id } });

        revalidatePath("/admin/units");

        return { success: true };
    } catch (error) {
        console.error("Failed to delete unit:", error);
        return { success: false, error: "Gagal menghapus unit" };
    }
}
