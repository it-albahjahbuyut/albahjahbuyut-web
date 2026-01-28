import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { canAccessPath } from "@/lib/permissions";

export default async function DonationsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    // Check if user has access to donations
    if (!canAccessPath(session.user.role, "/admin/donations")) {
        redirect("/admin");
    }

    return <>{children}</>;
}
