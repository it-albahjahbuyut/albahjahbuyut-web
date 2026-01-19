"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { businessUnitSchema, type BusinessUnitInput } from "@/lib/validations";
import { auth } from "@/lib/auth";

export async function getBusinessUnits() {
    try {
        const businessUnits = await db.businessUnit.findMany({
            orderBy: { order: "asc" },
            include: {
                images: {
                    orderBy: { order: "asc" },
                },
            },
        });
        return { success: true, data: businessUnits };
    } catch (error) {
        console.error("Failed to fetch business units:", error);
        return { success: false, error: "Gagal mengambil data unit usaha" };
    }
}

export async function getActiveBusinessUnits() {
    try {
        const businessUnits = await db.businessUnit.findMany({
            where: { isActive: true },
            orderBy: { order: "asc" },
            include: {
                images: {
                    orderBy: { order: "asc" },
                },
            },
        });
        return { success: true, data: businessUnits };
    } catch (error) {
        console.error("Failed to fetch active business units:", error);
        return { success: false, error: "Gagal mengambil data unit usaha" };
    }
}

export async function getBusinessUnit(id: string) {
    try {
        const businessUnit = await db.businessUnit.findUnique({
            where: { id },
            include: {
                images: {
                    orderBy: { order: "asc" },
                },
            },
        });
        if (!businessUnit) {
            return { success: false, error: "Unit usaha tidak ditemukan" };
        }
        return { success: true, data: businessUnit };
    } catch (error) {
        console.error("Failed to fetch business unit:", error);
        return { success: false, error: "Gagal mengambil data unit usaha" };
    }
}

export async function getBusinessUnitBySlug(slug: string) {
    try {
        const businessUnit = await db.businessUnit.findUnique({
            where: { slug },
            include: {
                images: {
                    orderBy: { order: "asc" },
                },
            },
        });
        if (!businessUnit) {
            return { success: false, error: "Unit usaha tidak ditemukan" };
        }
        return { success: true, data: businessUnit };
    } catch (error) {
        console.error("Failed to fetch business unit:", error);
        return { success: false, error: "Gagal mengambil data unit usaha" };
    }
}

export async function createBusinessUnit(data: BusinessUnitInput) {
    try {
        const session = await auth();
        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const validated = businessUnitSchema.parse(data);

        // Check if slug already exists
        const existingSlug = await db.businessUnit.findUnique({
            where: { slug: validated.slug },
        });

        if (existingSlug) {
            return { success: false, error: "Slug sudah digunakan" };
        }

        // Extract gallery images
        const { galleryImages, ...unitData } = validated;

        const businessUnit = await db.businessUnit.create({
            data: {
                ...unitData,
                images: galleryImages?.length
                    ? {
                          create: galleryImages.map((url, index) => ({
                              imageUrl: url,
                              order: index,
                          })),
                      }
                    : undefined,
            },
            include: {
                images: true,
            },
        });

        revalidatePath("/admin/business-units");
        revalidatePath("/unit-usaha");

        return { success: true, data: businessUnit };
    } catch (error) {
        console.error("Failed to create business unit:", error);
        return { success: false, error: "Gagal membuat unit usaha" };
    }
}

export async function updateBusinessUnit(id: string, data: BusinessUnitInput) {
    try {
        const session = await auth();
        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const validated = businessUnitSchema.parse(data);

        // Check if slug already exists (excluding current unit)
        const existingSlug = await db.businessUnit.findFirst({
            where: {
                slug: validated.slug,
                NOT: { id },
            },
        });

        if (existingSlug) {
            return { success: false, error: "Slug sudah digunakan" };
        }

        // Extract gallery images
        const { galleryImages, ...unitData } = validated;

        // Delete existing images
        await db.businessUnitImage.deleteMany({
            where: { businessUnitId: id },
        });

        const businessUnit = await db.businessUnit.update({
            where: { id },
            data: {
                ...unitData,
                updatedAt: new Date(),
                images: galleryImages?.length
                    ? {
                          create: galleryImages.map((url, index) => ({
                              imageUrl: url,
                              order: index,
                          })),
                      }
                    : undefined,
            },
            include: {
                images: true,
            },
        });

        revalidatePath("/admin/business-units");
        revalidatePath(`/admin/business-units/${id}`);
        revalidatePath("/unit-usaha");
        revalidatePath(`/unit-usaha/${businessUnit.slug}`);

        return { success: true, data: businessUnit };
    } catch (error) {
        console.error("Failed to update business unit:", error);
        return { success: false, error: "Gagal memperbarui unit usaha" };
    }
}

export async function deleteBusinessUnit(id: string) {
    try {
        const session = await auth();
        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        await db.businessUnit.delete({ where: { id } });

        revalidatePath("/admin/business-units");
        revalidatePath("/unit-usaha");

        return { success: true };
    } catch (error) {
        console.error("Failed to delete business unit:", error);
        return { success: false, error: "Gagal menghapus unit usaha" };
    }
}

export async function toggleBusinessUnitStatus(id: string) {
    try {
        const session = await auth();
        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const businessUnit = await db.businessUnit.findUnique({
            where: { id },
        });

        if (!businessUnit) {
            return { success: false, error: "Unit usaha tidak ditemukan" };
        }

        const updated = await db.businessUnit.update({
            where: { id },
            data: { isActive: !businessUnit.isActive },
        });

        revalidatePath("/admin/business-units");
        revalidatePath("/unit-usaha");

        return { success: true, data: updated };
    } catch (error) {
        console.error("Failed to toggle business unit status:", error);
        return { success: false, error: "Gagal mengubah status unit usaha" };
    }
}
