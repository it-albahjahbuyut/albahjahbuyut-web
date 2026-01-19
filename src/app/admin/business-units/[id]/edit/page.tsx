import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Store } from "lucide-react";
import { BusinessUnitForm } from "../../business-unit-form";

interface EditBusinessUnitPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBusinessUnitPage({ params }: EditBusinessUnitPageProps) {
    const { id } = await params;

    const businessUnit = await db.businessUnit.findUnique({
        where: { id },
        include: {
            images: {
                orderBy: { order: "asc" },
            },
        },
    });

    if (!businessUnit) {
        notFound();
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/business-units">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                        <Store className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Edit: {businessUnit.name}</h1>
                        <p className="text-muted-foreground">Perbarui informasi unit usaha</p>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Informasi Unit Usaha</CardTitle>
                    <CardDescription>
                        Lengkapi informasi unit usaha di bawah ini
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <BusinessUnitForm businessUnit={businessUnit} />
                </CardContent>
            </Card>
        </div>
    );
}
