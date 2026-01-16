"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Majelis } from "@prisma/client";
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
import { MoreHorizontal, Pencil, Trash, Eye, EyeOff, Calendar, Clock, User } from "lucide-react";
import { deleteMajelis, updateMajelis } from "@/actions/majelis";
import { toast } from "sonner";

interface MajelisListProps {
    majelisList: Majelis[];
}

export function MajelisList({ majelisList }: MajelisListProps) {
    const router = useRouter();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedMajelis, setSelectedMajelis] = useState<Majelis | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!selectedMajelis) return;

        try {
            setIsDeleting(true);
            const result = await deleteMajelis(selectedMajelis.id);

            if (!result.success) {
                toast.error(result.error || "Gagal menghapus majelis");
                return;
            }

            toast.success("Majelis berhasil dihapus");
            router.refresh();
        } catch {
            toast.error("Terjadi kesalahan");
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
            setSelectedMajelis(null);
        }
    };

    const toggleActive = async (majelis: Majelis) => {
        try {
            const result = await updateMajelis(majelis.id, {
                title: majelis.title,
                subtitle: majelis.subtitle,
                teacher: majelis.teacher,
                schedule: majelis.schedule,
                time: majelis.time,
                location: majelis.location,
                order: majelis.order,
                isActive: !majelis.isActive,
            });

            if (!result.success) {
                toast.error(result.error || "Gagal memperbarui status");
                return;
            }

            toast.success(majelis.isActive ? "Majelis dinonaktifkan" : "Majelis diaktifkan");
            router.refresh();
        } catch {
            toast.error("Terjadi kesalahan");
        }
    };

    if (majelisList.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Belum ada jadwal majelis</p>
                <p className="text-sm text-gray-400">Klik tombol "Tambah Majelis" untuk menambahkan jadwal baru</p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-lg border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Majelis</TableHead>
                            <TableHead>Jadwal</TableHead>
                            <TableHead>Waktu</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Urutan</TableHead>
                            <TableHead className="w-[70px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {majelisList.map((majelis) => (
                            <TableRow key={majelis.id}>
                                <TableCell>
                                    <div>
                                        <p className="font-medium">{majelis.title}</p>
                                        {majelis.subtitle && (
                                            <p className="text-sm text-gray-500">{majelis.subtitle}</p>
                                        )}
                                        {majelis.teacher && (
                                            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                                                <User className="h-3 w-3" />
                                                {majelis.teacher}
                                            </p>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        {majelis.schedule}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        {majelis.time}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={majelis.isActive ? "default" : "secondary"}>
                                        {majelis.isActive ? "Aktif" : "Nonaktif"}
                                    </Badge>
                                </TableCell>
                                <TableCell>{majelis.order}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => router.push(`/admin/majelis/${majelis.id}`)}
                                            >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => toggleActive(majelis)}>
                                                {majelis.isActive ? (
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
                                                    setSelectedMajelis(majelis);
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
                        <AlertDialogTitle>Hapus Majelis?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Majelis &quot;{selectedMajelis?.title}&quot; akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
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
