import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { MajelisForm } from "../majelis-form";

async function getMajelis(id: string) {
    const majelis = await db.majelis.findUnique({
        where: { id },
    });
    return majelis;
}

export default async function EditMajelisPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const majelis = await getMajelis(id);

    if (!majelis) {
        notFound();
    }

    return <MajelisForm majelis={majelis} />;
}
