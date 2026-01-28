import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isSuperAdmin } from "@/lib/permissions";
import { getUsers } from "@/actions/user";
import { UserList } from "./user-list";

export default async function UsersPage() {
    const session = await auth();

    if (!session?.user || !isSuperAdmin(session.user.role)) {
        redirect("/admin");
    }

    const users = await getUsers();

    return (
        <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Kelola User
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Kelola akun admin dan hak akses
                    </p>
                </div>
            </div>

            <UserList users={users} currentUserId={session.user.id} />
        </div>
    );
}
