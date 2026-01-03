import { AdminHeader } from "@/components/admin/header";
import { GalleryForm } from "../gallery-form";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

async function getGallery(id: string) {
    const gallery = await db.gallery.findUnique({
        where: { id },
    });
    return gallery;
}

async function getUnits() {
    return db.unit.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
    });
}

export default async function EditGalleryPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [gallery, units] = await Promise.all([getGallery(id), getUnits()]);

    if (!gallery) {
        notFound();
    }

    return (
        <div>
            <AdminHeader
                title="Edit Foto"
                description={`Mengedit: ${gallery.title}`}
            />
            <div className="p-6">
                <GalleryForm gallery={gallery} units={units} />
            </div>
        </div>
    );
}
