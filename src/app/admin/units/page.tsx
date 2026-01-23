import { Suspense } from "react";
import { AdminHeader } from "@/components/admin/header";
import { getUnits } from "@/actions/unit";
import { UnitList } from "./unit-list";
import { Skeleton } from "@/components/ui/skeleton";

// Async component for data fetching
async function UnitsContent() {
    const result = await getUnits();
    const units = result.success ? result.data : [];
    return <UnitList units={units || []} />;
}

// Loading skeleton
function UnitsSkeleton() {
    return (
        <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
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

export default function UnitsPage() {
    return (
        <div>
            <AdminHeader
                title="Unit Pendidikan"
                description="Kelola informasi unit pendidikan: SMP, SMA, Tafaqquh, dan Tahfidz"
            />
            <div className="p-6">
                <Suspense fallback={<UnitsSkeleton />}>
                    <UnitsContent />
                </Suspense>
            </div>
        </div>
    );
}

