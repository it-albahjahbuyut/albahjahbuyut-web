"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Gallery, Unit } from "@prisma/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { MoreHorizontal, Pencil, Trash, Eye, EyeOff } from "lucide-react";
import { deleteGallery, updateGallery } from "@/actions/gallery";
import { toast } from "sonner";

type GalleryWithUnit = Gallery & {
    unit: { id: string; name: string } | null;
};

interface GalleryListProps {
    galleries: GalleryWithUnit[];
    units: { id: string; name: string }[];
}

export function GalleryList({ galleries }: GalleryListProps) {
    const router = useRouter();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedGallery, setSelectedGallery] = useState<GalleryWithUnit | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!selectedGallery) return;

        try {
            setIsDeleting(true);
            const result = await deleteGallery(selectedGallery.id);

            if (!result.success) {
                toast.error(result.error || "Gagal menghapus galeri");
                return;
            }

            toast.success("Galeri berhasil dihapus");
            router.refresh();
        } catch {
            toast.error("Terjadi kesalahan");
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
            setSelectedGallery(null);
        }
    };

    const toggleActive = async (gallery: GalleryWithUnit) => {
        try {
            const result = await updateGallery(gallery.id, {
                title: gallery.title,
                description: gallery.description || undefined,
                imageUrl: gallery.imageUrl,
                order: gallery.order,
                isActive: !gallery.isActive,
                unitId: gallery.unitId,
            });

            if (!result.success) {
                toast.error(result.error || "Gagal memperbarui status");
                return;
            }

            toast.success(gallery.isActive ? "Galeri dinonaktifkan" : "Galeri diaktifkan");
            router.refresh();
        } catch {
            toast.error("Terjadi kesalahan");
        }
    };

    if (galleries.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border">
                <p className="text-gray-500">Belum ada foto di galeri</p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-lg border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Gambar</TableHead>
                            <TableHead>Judul</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Urutan</TableHead>
                            <TableHead className="w-[70px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {galleries.map((gallery) => (
                            <TableRow key={gallery.id}>
                                <TableCell>
                                    <div className="relative w-16 h-12 rounded overflow-hidden bg-gray-100">
                                        <Image
                                            src={gallery.imageUrl}
                                            alt={gallery.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{gallery.title}</TableCell>
                                <TableCell>{gallery.unit?.name || "-"}</TableCell>
                                <TableCell>
                                    <Badge variant={gallery.isActive ? "default" : "secondary"}>
                                        {gallery.isActive ? "Aktif" : "Nonaktif"}
                                    </Badge>
                                </TableCell>
                                <TableCell>{gallery.order}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => router.push(`/admin/galleries/${gallery.id}`)}
                                            >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => toggleActive(gallery)}>
                                                {gallery.isActive ? (
                                                    <>
                                                        <EyeOff className="mr-2 h-4 w-4" />
                                                        Nonaktifkan
                                                    </>
                                                ) : (
                                                    <>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Aktifkan
                                                    </>
                                                )}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-600"
                                                onClick={() => {
                                                    setSelectedGallery(gallery);
                                                    setIsDeleteDialogOpen(true);
                                                }}
                                            >
                                                <Trash className="mr-2 h-4 w-4" />
                                                Hapus
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Foto?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Foto &quot;{selectedGallery?.title}&quot; akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
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
