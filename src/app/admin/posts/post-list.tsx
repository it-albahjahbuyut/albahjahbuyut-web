"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Post, User, Unit } from "@prisma/client";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Trash2, Eye, Newspaper } from "lucide-react";
import { deletePost } from "@/actions/post";
import { toast } from "sonner";

type PostWithRelations = Post & {
    author: Pick<User, "id" | "name" | "email"> | null;
    unit: Pick<Unit, "id" | "name" | "slug"> | null;
};

interface PostListProps {
    posts: PostWithRelations[];
}

const categoryLabels: Record<string, string> = {
    BERITA: "Berita",
    PENGUMUMAN: "Pengumuman",
    KEGIATAN: "Kegiatan",
    PRESTASI: "Prestasi",
    ARTIKEL: "Artikel",
};

const statusColors: Record<string, string> = {
    DRAFT: "bg-yellow-100 text-yellow-800",
    PUBLISHED: "bg-green-100 text-green-800",
    ARCHIVED: "bg-gray-100 text-gray-800",
};

export function PostList({ posts }: PostListProps) {
    const router = useRouter();
    const [deletingPost, setDeletingPost] = useState<PostWithRelations | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deletingPost) return;

        try {
            setIsDeleting(true);
            const result = await deletePost(deletingPost.id);

            if (!result.success) {
                toast.error(result.error || "Gagal menghapus artikel");
                return;
            }

            toast.success("Artikel berhasil dihapus");
            router.refresh();
        } catch {
            toast.error("Terjadi kesalahan");
        } finally {
            setIsDeleting(false);
            setDeletingPost(null);
        }
    };

    if (posts.length === 0) {
        return (
            <div className="text-center py-12">
                <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Belum ada artikel</h3>
                <p className="text-gray-500 mb-4">
                    Mulai buat artikel pertama Anda
                </p>
                <Link href="/admin/posts/new">
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-600">
                        Tambah Artikel
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Judul</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Penulis</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.map((post) => (
                            <TableRow key={post.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        {post.image ? (
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="h-10 w-10 rounded object-cover"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                                                <Newspaper className="h-5 w-5 text-gray-400" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium line-clamp-1">{post.title}</p>
                                            <p className="text-sm text-gray-500">/{post.slug}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">
                                        {categoryLabels[post.category]}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge className={statusColors[post.status]}>
                                        {post.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {post.author?.name || "Unknown"}
                                </TableCell>
                                <TableCell>
                                    {new Date(post.createdAt).toLocaleDateString("id-ID")}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/berita/${post.slug}`} target="_blank">
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/admin/posts/${post.id}/edit`}>
                                            <Button variant="ghost" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setDeletingPost(post)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deletingPost} onOpenChange={() => setDeletingPost(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Artikel</DialogTitle>
                        <DialogDescription>
                            Anda yakin ingin menghapus artikel <strong>{deletingPost?.title}</strong>?
                            Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeletingPost(null)}
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
