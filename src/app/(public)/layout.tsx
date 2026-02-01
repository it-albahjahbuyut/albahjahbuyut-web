import { db } from "@/lib/db";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { redirect } from "next/navigation";

// Force dynamic to ensure maintenance check is always fresh
export const dynamic = "force-dynamic";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Check maintenance mode first
    // Skip maintenance mode check in development environment
    let isMaintenanceMode = false;
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (!isDevelopment) {
        try {
            const maintenanceSetting = await db.siteSetting.findUnique({
                where: { key: "maintenance_mode" },
            });

            if (maintenanceSetting) {
                const value = JSON.parse(maintenanceSetting.value);
                isMaintenanceMode = value.enabled === true;
            }
        } catch (error) {
            console.error("Failed to check maintenance mode:", error);
        }

        // Redirect after try-catch to avoid catching NEXT_REDIRECT
        if (isMaintenanceMode) {
            redirect("/maintenance");
        }
    }

    // Fetch units for navbar dropdown with error handling
    let units: { id: string; name: string; slug: string }[] = [];

    try {
        units = await db.unit.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                slug: true,
            },
            orderBy: { order: "asc" },
        });
    } catch (error) {
        console.error("Failed to fetch units:", error);
        // Continue with empty units array if database is unavailable
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <Navbar units={units} />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
