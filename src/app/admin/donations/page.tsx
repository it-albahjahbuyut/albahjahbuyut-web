import Link from "next/link";
import { AdminHeader } from "@/components/admin/header";
import { getDonations } from "@/actions/donation";
import { DonationList } from "./donation-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function DonationsPage() {
    const result = await getDonations();
    const donations = result.success && result.data ? result.data : [];

    return (
        <div>
            <AdminHeader
                title="Program Donasi"
                description="Kelola program infaq dan donasi pesantren"
            />
            <div className="p-6">
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
            </div>
        </div>
    );
}
