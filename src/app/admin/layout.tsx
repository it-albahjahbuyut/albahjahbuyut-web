import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="h-screen bg-gray-50 overflow-hidden">
            <AdminSidebar userRole={session.user.role} />
            <main className="md:ml-64 h-full overflow-y-auto">{children}</main>
        </div>
    );
}
