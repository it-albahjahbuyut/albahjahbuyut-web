import { Metadata } from 'next';
import PSBStatusChecker from '@/components/psb/PSBStatusChecker';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Cek Status Pendaftaran | PSB Al-Bahjah Buyut',
    description: 'Cek status pendaftaran santri baru Pondok Pesantren Al-Bahjah Buyut',
};

interface PSBStatusPageProps {
    searchParams: Promise<{ no?: string }>;
}

export default async function PSBStatusPage({ searchParams }: PSBStatusPageProps) {
    const params = await searchParams;
    const initialNumber = params.no || undefined;

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
                        Kembali ke PSB
                    </Link>
                    <div className="mb-4">
                        <span className="inline-block px-3 py-1 border border-gold-400 text-gold-400 text-xs font-bold tracking-widest">
                            Cek Status
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                        Status Pendaftaran
                    </h1>
                    <p className="text-emerald-100/80 text-lg max-w-2xl">
                        Masukkan nomor pendaftaran untuk mengecek status pendaftaran Anda.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-12">
                <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
                    <PSBStatusChecker initialNumber={initialNumber} />
                </div>
            </section>
        </main>
    );
}
