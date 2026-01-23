import Link from "next/link";
import { Suspense } from "react";
import { AdminHeader } from "@/components/admin/header";
import { getPosts } from "@/actions/post";
import { PostList } from "./post-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Async component for data fetching
async function PostsContent() {
    const result = await getPosts();
    const posts = result.success ? result.data : [];

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-sm text-gray-500">
                        Total: {posts?.length || 0} artikel
                    </p>
                </div>
                <Link href="/admin/posts/new">
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Artikel
                    </Button>
                </Link>
            </div>
            <PostList posts={posts || []} />
        </>
    );
}

// Loading skeleton
function PostsSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-36" />
            </div>
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg border p-4 flex items-center gap-4">
                        <Skeleton className="h-16 w-24 rounded" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function PostsPage() {
    return (
        <div>
            <AdminHeader
                title="Berita & Artikel"
                description="Kelola berita, pengumuman, dan artikel pesantren"
            />
            <div className="p-6">
                <Suspense fallback={<PostsSkeleton />}>
                    <PostsContent />
                </Suspense>
            </div>
        </div>
    );
}

