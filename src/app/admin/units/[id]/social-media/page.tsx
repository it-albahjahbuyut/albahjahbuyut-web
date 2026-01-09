import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { AdminHeader } from "@/components/admin/header";
import { UnitSocialMediaManager } from "../../social-media-manager";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnitSocialMediaPageProps {
    params: Promise<{ id: string }>;
}

export default async function UnitSocialMediaPage({ params }: UnitSocialMediaPageProps) {
    const { id } = await params;

    // TODO: After running `npx prisma db push` and `npx prisma generate`,
    // uncomment the include block to enable social media feature
    const unit = await db.unit.findUnique({
        where: { id },
        include: {
            socialMedia: {
                orderBy: { order: "asc" },
            },
        },
    });

    if (!unit) {
        notFound();
    }

    return (
        <div>
            <AdminHeader
                title={`Social Media - ${unit.name}`}
                description="Kelola link social media untuk unit pendidikan ini"
            />
            <div className="p-6">
                <div className="mb-6">
                    <Button variant="ghost" asChild>
                        <Link href="/admin/units" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Daftar Unit
                        </Link>
                    </Button>
                </div>

                <div className="max-w-3xl">
                    <UnitSocialMediaManager
                        unitId={unit.id}
                        unitName={unit.name}
                        initialData={unit.socialMedia}
                    />

                </div>
            </div>
        </div>
    );
}
