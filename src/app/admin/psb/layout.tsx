import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { canAccessPath, getAllowedPSBUnitSlugs } from "@/lib/permissions";
import { db } from "@/lib/db";

// Context to share allowed units with child components
export interface PSBLayoutContext {
    allowedUnitIds: string[] | null; // null = full access
    userRole: string;
}

export default async function PSBLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    // Check if user has access to PSB
    if (!canAccessPath(session.user.role, "/admin/psb")) {
        redirect("/admin");
    }

    // Get allowed unit slugs for this role
    const allowedSlugs = getAllowedPSBUnitSlugs(session.user.role);

    // If role has restrictions, get unit IDs from database
    let allowedUnitIds: string[] | null = null;
    if (allowedSlugs && allowedSlugs.length > 0) {
        const units = await db.unit.findMany({
            where: { slug: { in: allowedSlugs } },
            select: { id: true },
        });
        allowedUnitIds = units.map(u => u.id);
    }

    // Store in a header that can be read by page
    // This is a workaround since Next.js doesn't have built-in context for layouts
    return (
        <div data-allowed-units={allowedUnitIds ? JSON.stringify(allowedUnitIds) : "all"} data-user-role={session.user.role}>
            {children}
        </div>
    );
}

