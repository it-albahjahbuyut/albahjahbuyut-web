import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
    return (
        <div className="space-y-8 pb-10 animate-in fade-in-50 duration-300">
            {/* Header Skeleton */}
            <div className="bg-white border-b px-6 py-6">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-72" />
            </div>

            <div className="px-6">
                {/* Stats Grid Skeleton */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-lg border p-6 space-y-3">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-4 rounded" />
                            </div>
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    ))}
                </div>

                {/* Content Area Skeleton */}
                <div className="bg-white rounded-lg border overflow-hidden">
                    {/* Table Header */}
                    <div className="border-b p-4 flex justify-between items-center">
                        <div>
                            <Skeleton className="h-5 w-40 mb-2" />
                            <Skeleton className="h-3 w-56" />
                        </div>
                        <Skeleton className="h-9 w-32 rounded-full" />
                    </div>

                    {/* Table Rows */}
                    <div className="divide-y">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="p-4 flex items-center gap-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
