import { AdminHeader } from "@/components/admin/header";
import { MajelisList } from "./majelis-list";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

async function getMajelisList() {
    const majelisList = await db.majelis.findMany({
        orderBy: { order: "asc" },
    });
    return majelisList;
}

export default async function MajelisPage() {
    const majelisList = await getMajelisList();

    return (
        <div>
            <AdminHeader
                title="Majelis Rutin"
                description="Kelola jadwal kegiatan majelis rutin mingguan"
            >
                <Link href="/admin/majelis/new">
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Majelis
                    </Button>
                </Link>
            </AdminHeader>
            <div className="p-6">
                <MajelisList majelisList={majelisList} />
            </div>
        </div>
    );
}
