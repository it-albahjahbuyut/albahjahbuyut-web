"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Trash2, Heart, Banknote } from "lucide-react";
import { deleteDonation } from "@/actions/donation";
import { toast } from "sonner";
import { SerializedDonation } from "@/lib/types";

interface DonationListProps {
    donations: SerializedDonation[];
}

function formatCurrency(value: unknown): string {
    let numValue: number;
    if (typeof value === "object" && value !== null && "toString" in value) {
        numValue = Number(value.toString());
    } else {
        numValue = Number(value);
    }
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(numValue);
}

function calculateProgress(current: unknown, target: unknown): number {
    let currentNum: number;
    let targetNum: number;

    if (typeof current === "object" && current !== null && "toString" in current) {
        currentNum = Number(current.toString());
    } else {
        currentNum = Number(current);
    }

    if (typeof target === "object" && target !== null && "toString" in target) {
        targetNum = Number(target.toString());
    } else {
        targetNum = Number(target);
    }

    if (targetNum === 0) return 0;
    return Math.min((currentNum / targetNum) * 100, 100);
}

export function DonationList({ donations }: DonationListProps) {
    const router = useRouter();
    const [deletingDonation, setDeletingDonation] = useState<SerializedDonation | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deletingDonation) return;

        try {
            setIsDeleting(true);
            const result = await deleteDonation(deletingDonation.id);

            if (!result.success) {
                toast.error(result.error || "Gagal menghapus program");
                return;
            }

            toast.success("Program berhasil dihapus");
            router.refresh();
        } catch {
            toast.error("Terjadi kesalahan");
        } finally {
            setIsDeleting(false);
            setDeletingDonation(null);
        }
    };

    if (donations.length === 0) {
        return (
            <div className="text-center py-12">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Belum ada program donasi</h3>
                <p className="text-gray-500 mb-4">
                    Buat program donasi pertama
                </p>
                <Link href="/admin/donations/new">
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-600">
                        Tambah Program
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {donations.map((donation) => {
                    const progress = calculateProgress(donation.currentAmount, donation.targetAmount);

                    return (
                        <Card key={donation.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg line-clamp-2">
                                            {donation.title}
                                        </CardTitle>
                                        <CardDescription className="mt-1">
                                            /{donation.slug}
                                        </CardDescription>
                                    </div>
                                    <Badge variant={donation.isActive ? "default" : "secondary"}>
                                        {donation.isActive ? "Aktif" : "Nonaktif"}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Progress bar */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-500">Terkumpul</span>
                                            <span className="font-medium">{progress.toFixed(0)}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-500"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-sm mt-1">
                                            <span className="font-medium text-green-600">
                                                {formatCurrency(donation.currentAmount)}
                                            </span>
                                            <span className="text-gray-500">
                                                {formatCurrency(donation.targetAmount)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Bank info */}
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                        <Banknote className="h-5 w-5 text-gray-400" />
                                        <div className="text-sm">
                                            <p className="font-medium">{donation.bankName}</p>
                                            <p className="text-gray-500">{donation.accountNumber}</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Link href={`/admin/donations/${donation.id}/edit`} className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full">
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setDeletingDonation(donation)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deletingDonation} onOpenChange={() => setDeletingDonation(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Program Donasi</DialogTitle>
                        <DialogDescription>
                            Anda yakin ingin menghapus program <strong>{deletingDonation?.title}</strong>?
                            Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeletingDonation(null)}
                            disabled={isDeleting}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Menghapus..." : "Hapus"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
