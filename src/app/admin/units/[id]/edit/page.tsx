import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { UnitEditForm } from "./unit-edit-form";

interface EditUnitPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditUnitPage({ params }: EditUnitPageProps) {
    const { id } = await params;

    const unit = await db.unit.findUnique({
        where: { id },
    });

    if (!unit) {
        notFound();
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/units">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Unit: {unit.name}</h1>
                        <p className="text-muted-foreground">Perbarui informasi unit pendidikan</p>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Informasi Unit</CardTitle>
                    <CardDescription>
                        Lengkapi informasi unit pendidikan di bawah ini
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UnitEditForm unit={unit} />
                </CardContent>
            </Card>
        </div>
    );
}
