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
            <div className="h-screen bg-gray-50 overflow-hidden">
                <AdminSidebar />
                <main className="md:ml-64 h-full overflow-y-auto">{children}</main>
            </div>
        </Providers>
    );
}
