import { AdminHeader } from "@/components/admin/header";
import { GalleryForm } from "../gallery-form";
import { db } from "@/lib/db";

async function getUnits() {
    return db.unit.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
    });
}

export default async function NewGalleryPage() {
    const units = await getUnits();

    return (
        <div>
            <AdminHeader
                title="Tambah Foto Baru"
                description="Upload foto baru ke galeri"
            />
            <div className="p-6">
                <GalleryForm units={units} />
            </div>
        </div>
    );
}
