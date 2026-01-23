import { Suspense } from "react";
import { AdminHeader } from "@/components/admin/header";
import { getBusinessUnits } from "@/actions/business-unit";
import { BusinessUnitList } from "./business-unit-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

// Async component for data fetching
async function BusinessUnitsContent() {
    const result = await getBusinessUnits();
    const businessUnits = result.success ? result.data : [];
    return <BusinessUnitList businessUnits={businessUnits || []} />;
}

// Loading skeleton
function BusinessUnitsSkeleton() {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border overflow-hidden">
                    <Skeleton className="h-40 w-full" />
                    <div className="p-4 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function BusinessUnitsPage() {
    return (
        <div>
            <AdminHeader
                title="Unit Usaha"
                description="Kelola unit usaha: AB Travel, AB Mart, AB Fashion"
            >
                <Link href="/admin/business-units/new">
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Unit Usaha
                    </Button>
                </Link>
            </AdminHeader>
            <div className="p-6">
                <Suspense fallback={<BusinessUnitsSkeleton />}>
                    <BusinessUnitsContent />
                </Suspense>
            </div>
        </div>
    );
}

