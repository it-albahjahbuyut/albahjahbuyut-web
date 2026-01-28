"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { createUser, updateUser, deleteUser } from "@/actions/user";
import { ALL_ROLES, getRoleDisplayName } from "@/lib/permissions";
import type { UserRole } from "@prisma/client";
import { toast } from "sonner";

interface User {
    id: string;
    name: string | null;
    email: string;
    role: UserRole;
    createdAt: Date;
}

interface UserListProps {
    users: User[];
    currentUserId: string;
}

export function UserList({ users, currentUserId }: UserListProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<UserRole>("ADMIN");

    const resetForm = () => {
        setName("");
        setEmail("");
        setPassword("");
        setRole("ADMIN");
        setEditingUser(null);
        setShowPassword(false);
    };

    const openEditDialog = (user: User) => {
        setEditingUser(user);
        setName(user.name || "");
        setEmail(user.email);
        setRole(user.role);
        setPassword("");
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (editingUser) {
                const result = await updateUser(editingUser.id, {
                    name,
                    email,
                    role,
                    ...(password && { password }),
                });

                // If user changed their own password, force logout
                if (result.shouldLogout) {
                    toast.success("Password berhasil diubah. Silakan login kembali.");
                    // Dynamic import to avoid issues with server components
                    const { signOut } = await import("next-auth/react");
                    await signOut({ callbackUrl: "/login" });
                    return;
                }

                toast.success("User berhasil diperbarui");
            } else {
                if (!password) {
                    toast.error("Password wajib diisi");
                    setIsLoading(false);
                    return;
                }
                await createUser({ name, email, password, role });
                toast.success("User berhasil dibuat");
            }
            setIsDialogOpen(false);
            resetForm();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteUser(id);
            toast.success("User berhasil dihapus");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
        }
    };

    const getRoleBadgeColor = (role: UserRole) => {
        switch (role) {
            case "SUPER_ADMIN":
                return "bg-purple-100 text-purple-800 hover:bg-purple-100";
            case "ADMIN":
                return "bg-blue-100 text-blue-800 hover:bg-blue-100";
            case "ADMIN_INFAQ":
                return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
            case "ADMIN_PSB_PAUD":
                return "bg-orange-100 text-orange-800 hover:bg-orange-100";
            case "ADMIN_PSB_SMP_SMA":
                return "bg-cyan-100 text-cyan-800 hover:bg-cyan-100";
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border">
            {/* Header with Add Button */}
            <div className="p-4 border-b flex justify-between items-center">
                <span className="text-sm text-gray-600">
                    Total: {users.length} user
                </span>
                <Dialog
                    open={isDialogOpen}
                    onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) resetForm();
                    }}
                >
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Tambah User
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingUser ? "Edit User" : "Tambah User Baru"}
                            </DialogTitle>
                            <DialogDescription>
                                {editingUser
                                    ? "Perbarui informasi user"
                                    : "Buat akun admin baru dengan role tertentu"}
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Nama <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nama lengkap"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Password{" "}
                                    {!editingUser && <span className="text-red-500">*</span>}
                                    {editingUser && (
                                        <span className="text-gray-500 font-normal">
                                            (kosongkan jika tidak diubah)
                                        </span>
                                    )}
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder={editingUser ? "••••••••" : "Password"}
                                        required={!editingUser}
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    value={role}
                                    onValueChange={(v) => setRole(v as UserRole)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ALL_ROLES.map((r) => (
                                            <SelectItem key={r} value={r}>
                                                {getRoleDisplayName(r)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <p className="text-xs text-gray-500">
                                <span className="text-red-500">*</span> Wajib diisi
                            </p>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsDialogOpen(false);
                                        resetForm();
                                    }}
                                >
                                    Batal
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {editingUser ? "Simpan" : "Buat User"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* User Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Dibuat</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">
                                {user.name || "-"}
                                {user.id === currentUserId && (
                                    <Badge variant="outline" className="ml-2 text-xs">
                                        Anda
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Badge className={getRoleBadgeColor(user.role)}>
                                    {getRoleDisplayName(user.role)}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-gray-500">
                                {new Date(user.createdAt).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => openEditDialog(user)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>

                                    {user.id !== currentUserId && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Hapus User?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Anda yakin ingin menghapus user{" "}
                                                        <strong>{user.name || user.email}</strong>?
                                                        Tindakan ini tidak dapat dibatalkan.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(user.id)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Hapus
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
