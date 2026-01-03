"use client";

import { useState } from "react";
import { Unit } from "@prisma/client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Edit, GraduationCap } from "lucide-react";
import { UnitForm } from "./unit-form";

interface UnitListProps {
    units: Unit[];
}

export function UnitList({ units }: UnitListProps) {
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);

    return (
        <>
            <div className="grid gap-6 md:grid-cols-2">
                {units.map((unit) => (
                    <Card key={unit.id} className="relative">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                        <GraduationCap className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{unit.name}</CardTitle>
                                        <CardDescription>/{unit.slug}</CardDescription>
                                    </div>
                                </div>
                                <Badge variant={unit.isActive ? "default" : "secondary"}>
                                    {unit.isActive ? "Aktif" : "Nonaktif"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                                {unit.description || "Belum ada deskripsi"}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingUnit(unit)}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {units.length === 0 && (
                <div className="text-center py-12">
                    <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Belum ada unit</h3>
                    <p className="text-gray-500">
                        Jalankan seed untuk menambahkan data unit awal
                    </p>
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={!!editingUnit} onOpenChange={() => setEditingUnit(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Unit: {editingUnit?.name}</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi unit pendidikan
                        </DialogDescription>
                    </DialogHeader>
                    {editingUnit && (
                        <UnitForm
                            unit={editingUnit}
                            onSuccess={() => setEditingUnit(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
