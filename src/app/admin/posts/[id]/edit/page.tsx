import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/header";
import { PostForm } from "../../post-form";
import { getPost } from "@/actions/post";
import { getUnits } from "@/actions/unit";

interface EditPostPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
    const { id } = await params;
    const [postResult, unitsResult] = await Promise.all([
        getPost(id),
        getUnits(),
    ]);

    if (!postResult.success || !postResult.data) {
        notFound();
    }

    const units = unitsResult.success ? unitsResult.data : [];

    return (
        <div>
            <AdminHeader
                title="Edit Artikel"
                description={postResult.data.title}
                showBackButton={true}
            />
            <div className="p-6">
                <div className="max-w-4xl">
                    <PostForm post={postResult.data} units={units || []} />
                </div>
            </div>
        </div>
    );
}
