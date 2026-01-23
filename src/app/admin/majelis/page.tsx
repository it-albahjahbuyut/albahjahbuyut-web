import { Suspense } from "react";
import { AdminHeader } from "@/components/admin/header";
import { MajelisList } from "./majelis-list";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

// Async component for data fetching
async function MajelisContent() {
    const majelisList = await db.majelis.findMany({
        orderBy: { order: "asc" },
    });
    return <MajelisList majelisList={majelisList} />;
}

// Loading skeleton
function MajelisSkeleton() {
    return (
        <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border p-4 flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                </div>
            ))}
        </div>
    );
}

export default function MajelisPage() {
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
                <Suspense fallback={<MajelisSkeleton />}>
                    <MajelisContent />
                </Suspense>
            </div>
        </div>
    );
}

