import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Store } from "lucide-react";
import { BusinessUnitForm } from "../business-unit-form";

export default function NewBusinessUnitPage() {
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
                        <h1 className="text-2xl font-bold">Tambah Unit Usaha</h1>
                        <p className="text-muted-foreground">Buat unit usaha baru</p>
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
                    <BusinessUnitForm />
                </CardContent>
            </Card>
        </div>
    );
}
