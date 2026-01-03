import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Providers } from "@/components/providers";

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
        <Providers>
            <div className="min-h-screen bg-gray-50">
                <AdminSidebar />
                <main className="md:ml-64 min-h-screen">{children}</main>
            </div>
        </Providers>
    );
}
