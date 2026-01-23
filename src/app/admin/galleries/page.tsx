import { Suspense } from "react";
import { AdminHeader } from "@/components/admin/header";
import { GalleryList } from "./gallery-list";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

// Async component for data fetching
async function GalleriesContent() {
    const [galleries, units] = await Promise.all([
        db.gallery.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                unit: {
                    select: { id: true, name: true },
                },
            },
        }),
        db.unit.findMany({
            where: { isActive: true },
            select: { id: true, name: true },
            orderBy: { order: "asc" },
        }),
    ]);

    return <GalleryList galleries={galleries} units={units} />;
}

// Loading skeleton
function GalleriesSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border overflow-hidden">
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-3 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function GalleriesPage() {
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
                <Suspense fallback={<GalleriesSkeleton />}>
                    <GalleriesContent />
                </Suspense>
            </div>
        </div>
    );
}

