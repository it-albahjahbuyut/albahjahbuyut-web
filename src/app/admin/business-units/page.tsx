import { AdminHeader } from "@/components/admin/header";
import { getBusinessUnits } from "@/actions/business-unit";
import { BusinessUnitList } from "./business-unit-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function BusinessUnitsPage() {
    const result = await getBusinessUnits();
    const businessUnits = result.success ? result.data : [];

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
                <BusinessUnitList businessUnits={businessUnits || []} />
            </div>
        </div>
    );
}
