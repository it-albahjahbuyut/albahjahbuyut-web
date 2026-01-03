import { AdminHeader } from "@/components/admin/header";
import { PostForm } from "../post-form";
import { getUnits } from "@/actions/unit";

export default async function NewPostPage() {
    const unitsResult = await getUnits();
    const units = unitsResult.success ? unitsResult.data : [];

    return (
        <div>
            <AdminHeader
                title="Tambah Artikel"
                description="Buat artikel atau berita baru"
            />
            <div className="p-6">
                <div className="max-w-4xl">
                    <PostForm units={units || []} />
                </div>
            </div>
        </div>
    );
}
