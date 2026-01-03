import { AdminHeader } from "@/components/admin/header";
import { GalleryList } from "./gallery-list";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

async function getGalleries() {
    const galleries = await db.gallery.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            unit: {
                select: { id: true, name: true },
            },
        },
    });
    return galleries;
}

async function getUnits() {
    const units = await db.unit.findMany({
        where: { isActive: true },
        select: { id: true, name: true },
        orderBy: { order: "asc" },
    });
    return units;
}

export default async function GalleriesPage() {
    const [galleries, units] = await Promise.all([getGalleries(), getUnits()]);

    return (
        <div>
            <AdminHeader
                title="Galeri"
                description="Kelola foto dan gambar pesantren"
            >
                <Link href="/admin/galleries/new">
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Foto
                    </Button>
                </Link>
            </AdminHeader>
            <div className="p-6">
                <GalleryList galleries={galleries} units={units} />
            </div>
        </div>
    );
}
