import { AdminHeader } from "@/components/admin/header";
import { DonationForm } from "../donation-form";

export default function NewDonationPage() {
    return (
        <div>
            <AdminHeader
                title="Tambah Program Donasi"
                description="Buat program donasi atau infaq baru"
            />
            <div className="p-6">
                <div className="max-w-2xl">
                    <DonationForm />
                </div>
            </div>
        </div>
    );
}
