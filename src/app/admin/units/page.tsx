import { AdminHeader } from "@/components/admin/header";
import { getUnits } from "@/actions/unit";
import { UnitList } from "./unit-list";

export default async function UnitsPage() {
    const result = await getUnits();
    const units = result.success ? result.data : [];

    return (
        <div>
            <AdminHeader
                title="Unit Pendidikan"
                description="Kelola informasi unit pendidikan: SMP, SMA, Tafaqquh, dan Tahfidz"
            />
            <div className="p-6">
                <UnitList units={units || []} />
            </div>
        </div>
    );
}
