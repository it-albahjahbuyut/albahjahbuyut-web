import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // Ensure we use Node.js runtime, not Edge

export async function GET() {
    try {
        const setting = await db.siteSetting.findUnique({
            where: { key: "maintenance_mode" },
        });

        if (!setting) {
            return NextResponse.json({ enabled: false, message: "" });
        }

        const value = JSON.parse(setting.value);
        return NextResponse.json({
            enabled: value.enabled === true,
            message: value.message || "",
        });
    } catch (error) {
        console.error("Failed to get maintenance status:", error);
        return NextResponse.json({ enabled: false, message: "" });
    }
}
