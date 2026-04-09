import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { db } from '@/lib/db';
import { getFormConfig } from '@/lib/psb-config';
import PSBForm from '@/components/psb/PSBForm';

interface PageProps {
    params: Promise<{ unit: string }>;
}

// Enable ISR caching for better performance
export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { unit: unitSlug } = await params;
    const unit = await db.unit.findUnique({
        where: { slug: unitSlug },
        select: { name: true },
    });

    if (!unit) {
        return {
            title: 'Unit Tidak Ditemukan | PSB Al-Bahjah Buyut',
        };
    }

    return {
        title: `Pendaftaran ${unit.name} | PSB Al-Bahjah Buyut`,
        description: `Formulir pendaftaran santri baru ${unit.name} Pondok Pesantren Al-Bahjah Buyut`,
    };
}

export default async function PSBDaftarPage({ params }: PageProps) {
    const { unit: unitSlug } = await params;

    // Get unit data
    const unit = await db.unit.findUnique({
        where: { slug: unitSlug, isActive: true },
        select: { id: true, name: true, slug: true },
    });

    if (!unit) {
        notFound();
    }

    // Get form configuration for this unit
    const formConfig = getFormConfig(unitSlug);

    return (
        <main className="bg-gradient-to-b from-emerald-50 to-white min-h-screen">
            {/* Header */}
            <section className="bg-emerald-950 pt-32 pb-16">
                <div className="container mx-auto px-4 lg:px-8">
                    <Link
                        href="/psb"
                        className="inline-flex items-center gap-2 text-emerald-300 hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Pilihan Unit
                    </Link>
                    <span className="inline-block px-3 py-1 mb-4 border border-gold-400 text-gold-400 text-xs font-bold tracking-widest">
                        Pendaftaran Online
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                        Daftar {unit.name}
                    </h1>
                    <p className="text-emerald-100/80 text-lg max-w-2xl">
                        Lengkapi formulir pendaftaran berikut dengan data yang benar dan upload berkas yang diperlukan.
                    </p>
                </div>
            </section>

            {/* Form Section — rendered immediately, no animation delay */}
            <section className="py-12">
                <div className="container mx-auto px-4 lg:px-8">
                    <PSBForm
                        unitId={unit.id}
                        unitName={unit.name}
                        unitSlug={unit.slug}
                        fields={formConfig.fields}
                        documents={formConfig.documents}
                    />
                </div>
            </section>
        </main>
    );
}
