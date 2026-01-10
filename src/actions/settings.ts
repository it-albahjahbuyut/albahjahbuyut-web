"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getMaintenanceMode() {
    try {
        const setting = await db.siteSetting.findUnique({
            where: { key: "maintenance_mode" },
        });

        if (!setting) {
            return { enabled: false, message: "" };
        }

        const value = JSON.parse(setting.value);
        return {
            enabled: value.enabled || false,
            message: value.message || "",
        };
    } catch (error) {
        console.error("Failed to get maintenance mode:", error);
        return { enabled: false, message: "" };
    }
}

export async function setMaintenanceMode(enabled: boolean, message?: string) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "SUPER_ADMIN") {
            return { success: false, error: "Unauthorized - Only Super Admin can change maintenance mode" };
        }

        const value = JSON.stringify({
            enabled,
            message: message || "Website sedang dalam pemeliharaan.",
        });

        await db.siteSetting.upsert({
            where: { key: "maintenance_mode" },
            update: {
                value,
                updatedBy: session.user.id,
            },
            create: {
                key: "maintenance_mode",
                value,
                description: "Enable/disable maintenance mode for public pages",
                updatedBy: session.user.id,
            },
        });

        revalidatePath("/admin/settings");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Failed to set maintenance mode:", error);
        return { success: false, error: "Gagal mengubah mode maintenance" };
    }
}

export async function getSiteSettings() {
    try {
        const settings = await db.siteSetting.findMany();
        const result: Record<string, unknown> = {};

        for (const setting of settings) {
            try {
                result[setting.key] = JSON.parse(setting.value);
            } catch {
                result[setting.key] = setting.value;
            }
        }

        return { success: true, data: result };
    } catch (error) {
        console.error("Failed to get site settings:", error);
        return { success: false, error: "Gagal mengambil pengaturan" };
    }
}
