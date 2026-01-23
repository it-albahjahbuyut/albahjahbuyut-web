import Link from "next/link";
import { Suspense } from "react";
import { AdminHeader } from "@/components/admin/header";
import { getDonations } from "@/actions/donation";
import { DonationList } from "./donation-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { serializeDonations, SerializedDonation } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

// Async component for data fetching
async function DonationsContent() {
    const result = await getDonations();
    const rawDonations = result.success && result.data ? result.data : [];
    const donations = serializeDonations(rawDonations) as SerializedDonation[];

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-sm text-gray-500">
                        Total: {donations?.length || 0} program
                    </p>
                </div>
                <Link href="/admin/donations/new">
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Program
                    </Button>
                </Link>
            </div>
            <DonationList donations={donations} />
        </>
    );
}

// Loading skeleton
function DonationsSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-40" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg border overflow-hidden">
                        <Skeleton className="h-40 w-full" />
                        <div className="p-4 space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-2 w-full rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function DonationsPage() {
    return (
        <div>
            <AdminHeader
                title="Program Donasi"
                description="Kelola program infaq dan donasi pesantren"
            />
            <div className="p-6">
                <Suspense fallback={<DonationsSkeleton />}>
                    <DonationsContent />
                </Suspense>
            </div>
        </div>
    );
}

