import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/header";
import { DonationForm } from "../../donation-form";
import { getDonation } from "@/actions/donation";
import { serializeDonation, SerializedDonation } from "@/lib/types";

interface EditDonationPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditDonationPage({ params }: EditDonationPageProps) {
    const { id } = await params;
    const result = await getDonation(id);

    if (!result.success || !result.data) {
        notFound();
    }

    // Convert Decimal to number for client component serialization
    // Type assertion needed because Prisma types may not be fully synced
    const donation = serializeDonation(result.data) as SerializedDonation;

    return (
        <div>
            <AdminHeader
                title="Edit Program Donasi"
                description={result.data.title}
            />
            <div className="p-6">
                <div className="max-w-2xl">
                    <DonationForm donation={donation} />
                </div>
            </div>
        </div>
    );
}

