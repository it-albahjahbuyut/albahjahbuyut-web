"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Get all social media for a unit
export async function getUnitSocialMedia(unitId: string) {
    return db.unitSocialMedia.findMany({
        where: { unitId },
        orderBy: { order: "asc" },
    });
}

// Create social media
export async function createUnitSocialMedia(data: {
    unitId: string;
    platform: string;
    url: string;
    label?: string;
    order?: number;
}) {
    const socialMedia = await db.unitSocialMedia.create({
        data: {
            unitId: data.unitId,
            platform: data.platform,
            url: data.url,
            label: data.label,
            order: data.order ?? 0,
        },
    });
    revalidatePath("/admin/units");
    revalidatePath(`/pendidikan`);
    return socialMedia;
}

// Update social media
export async function updateUnitSocialMedia(
    id: string,
    data: {
        platform?: string;
        url?: string;
        label?: string;
        order?: number;
        isActive?: boolean;
    }
) {
    const socialMedia = await db.unitSocialMedia.update({
        where: { id },
        data,
    });
    revalidatePath("/admin/units");
    revalidatePath(`/pendidikan`);
    return socialMedia;
}

// Delete social media
export async function deleteUnitSocialMedia(id: string) {
    await db.unitSocialMedia.delete({
        where: { id },
    });
    revalidatePath("/admin/units");
    revalidatePath(`/pendidikan`);
}

// Bulk update order
export async function reorderUnitSocialMedia(items: { id: string; order: number }[]) {
    await Promise.all(
        items.map((item) =>
            db.unitSocialMedia.update({
                where: { id: item.id },
                data: { order: item.order },
            })
        )
    );
    revalidatePath("/admin/units");
    revalidatePath(`/pendidikan`);
}
