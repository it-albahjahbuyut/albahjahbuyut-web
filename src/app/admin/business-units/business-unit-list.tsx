"use client";

import Link from "next/link";
import Image from "next/image";
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Edit,
    Store,
    MoreVertical,
    Trash2,
    Eye,
    EyeOff,
    ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteBusinessUnit, toggleBusinessUnitStatus } from "@/actions/business-unit";
import { toast } from "sonner";

interface BusinessUnitImage {
    id: string;
    imageUrl: string;
    caption: string | null;
    order: number;
}

interface BusinessUnitWithImages {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    services: string | null;
    address: string | null;
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    website: string | null;
    mapUrl: string | null;
    image: string | null;
    logo: string | null;
    isActive: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    images: BusinessUnitImage[];
}

interface BusinessUnitListProps {
    businessUnits: BusinessUnitWithImages[];
}

export function BusinessUnitList({ businessUnits }: BusinessUnitListProps) {
    const router = useRouter();
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const stripHtml = (html: string) => {
        return html.replace(/<[^>]*>?/gm, "");
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        try {
            const result = await deleteBusinessUnit(deleteId);
            if (result.success) {
                toast.success("Unit usaha berhasil dihapus");
                router.refresh();
            } else {
                toast.error(result.error || "Gagal menghapus unit usaha");
            }
        } catch {
            toast.error("Terjadi kesalahan");
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    };

    const handleToggleStatus = async (id: string) => {
        try {
            const result = await toggleBusinessUnitStatus(id);
            if (result.success) {
                toast.success(
                    result.data?.isActive
                        ? "Unit usaha diaktifkan"
                        : "Unit usaha dinonaktifkan"
                );
                router.refresh();
            } else {
                toast.error(result.error || "Gagal mengubah status");
            }
        } catch {
            toast.error("Terjadi kesalahan");
        }
    };

    return (
        <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {businessUnits.map((unit) => (
                    <Card key={unit.id} className="relative overflow-hidden">
                        {/* Image Header */}
                        <div className="relative h-40 bg-gradient-to-br from-emerald-500 to-emerald-700">
                            {unit.image ? (
                                <Image
                                    src={unit.image}
                                    alt={unit.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : unit.logo ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Image
                                        src={unit.logo}
                                        alt={unit.name}
                                        width={80}
                                        height={80}
                                        className="object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Store className="h-16 w-16 text-white/50" />
                                </div>
                            )}
                            {/* Status Badge */}
                            <div className="absolute top-3 right-3">
                                <Badge
                                    variant={unit.isActive ? "default" : "secondary"}
                                    className={
                                        unit.isActive
                                            ? "bg-green-500 hover:bg-green-600"
                                            : "bg-gray-500"
                                    }
                                >
                                    {unit.isActive ? "Aktif" : "Nonaktif"}
                                </Badge>
                            </div>
                            {/* Logo overlay */}
                            {unit.logo && unit.image && (
                                <div className="absolute bottom-3 left-3 w-12 h-12 rounded-lg bg-white/90 backdrop-blur p-2">
                                    <Image
                                        src={unit.logo}
                                        alt={`Logo ${unit.name}`}
                                        fill
                                        className="object-contain p-1"
                                    />
                                </div>
                            )}
                        </div>

                        <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-lg">{unit.name}</CardTitle>
                                    <CardDescription>/{unit.slug}</CardDescription>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/unit-usaha/${unit.slug}`} target="_blank">
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                Lihat Halaman
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={`/admin/business-units/${unit.id}/edit`}>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleToggleStatus(unit.id)}
                                        >
                                            {unit.isActive ? (
                                                <>
                                                    <EyeOff className="h-4 w-4 mr-2" />
                                                    Nonaktifkan
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Aktifkan
                                                </>
                                            )}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => setDeleteId(unit.id)}
                                            className="text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Hapus
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                {unit.description
                                    ? stripHtml(unit.description)
                                    : "Belum ada deskripsi"}
                            </p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/admin/business-units/${unit.id}/edit`}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {businessUnits.length === 0 && (
                <div className="text-center py-12">
                    <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">
                        Belum ada unit usaha
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Mulai dengan menambahkan unit usaha pertama Anda
                    </p>
                    <Link href="/admin/business-units/new">
                        <Button>Tambah Unit Usaha</Button>
                    </Link>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={!!deleteId}
                onOpenChange={() => setDeleteId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Unit Usaha?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Unit usaha akan dihapus
                            secara permanen beserta semua data terkait.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? "Menghapus..." : "Hapus"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
