import { db } from "@/lib/db";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
