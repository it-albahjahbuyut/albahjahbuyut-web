import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { UnitDetailClient } from "@/components/public/UnitDetailClient";

interface UnitDetailPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const units = await db.unit.findMany({
        where: { isActive: true },
        select: { slug: true },
    });

    return units.map((unit) => ({
        slug: unit.slug,
    }));
}

export async function generateMetadata({ params }: UnitDetailPageProps) {
    const { slug } = await params;
    const unit = await db.unit.findUnique({
        where: { slug },
        select: { name: true, description: true },
    });

    if (!unit) {
        return {
            title: "Unit Tidak Ditemukan | Al-Bahjah Buyut",
        };
    }

    return {
        title: `${unit.name} | Pondok Pesantren Al-Bahjah Buyut`,
        description:
            unit.description || `Informasi lengkap tentang program ${unit.name} di Pesantren Al-Bahjah Buyut`,
    };
}

export default async function UnitDetailPage({ params }: UnitDetailPageProps) {
    const { slug } = await params;

    const unit = await db.unit.findUnique({
        where: { slug },
        include: {
            socialMedia: {
                where: { isActive: true },
                orderBy: { order: "asc" },
            },
            galleries: {
                where: { isActive: true },
                orderBy: { order: "asc" },
            },
        },
    });

    if (!unit) {
        notFound();
    }

    // Parse facilities if stored as JSON string or newline-separated text
    let facilities: string[] = [];
    if (unit.facilities) {
        try {
            const parsed = JSON.parse(unit.facilities);
            facilities = Array.isArray(parsed) ? parsed : [unit.facilities];
        } catch {
            // If not valid JSON, treat as single facility or split by newlines
            facilities = unit.facilities.split("\n").filter((f: string) => f.trim());
        }
    }

    // Get clean description text (strip HTML if present)
    const descriptionHtml = unit.description || `<p>Program ${unit.name} di Pondok Pesantren Al-Bahjah Buyut dirancang untuk memberikan pendidikan terbaik bagi santri dengan menggabungkan kurikulum modern dan nilai-nilai keislaman yang kuat.</p>`;

    // Get clean curriculum text (strip HTML if present)
    const curriculumHtml = unit.curriculum || "";

    return (
        <UnitDetailClient
            unit={unit}
            descriptionHtml={descriptionHtml}
            curriculumHtml={curriculumHtml}
            facilities={facilities}
        />
    );
}
