import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { db } from '@/lib/db';
import {
    UserPlus,
    Clock,
    CheckCircle2,
    XCircle,
    FileCheck,
    ExternalLink,
    Filter
} from 'lucide-react';
import type { PSBStatus } from '@/actions/psb-actions';
import PSBUnitFilter from '@/components/admin/PSBUnitFilter';
import PSBBulkActions from '@/components/admin/PSBBulkActions';
import PSBSyncActions from '@/components/admin/PSBSyncActions';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
    title: 'Kelola Pendaftaran PSB | Admin Al-Bahjah Buyut',
    description: 'Kelola data pendaftaran santri baru',
};

const statusConfig: Record<PSBStatus, { label: string; color: string; icon: typeof Clock }> = {
    PENDING: {
        label: 'Menunggu',
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: Clock
    },
    VERIFIED: {
        label: 'Terverifikasi',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: FileCheck
    },
    ACCEPTED: {
        label: 'Diterima',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: CheckCircle2
    },
    REJECTED: {
        label: 'Ditolak',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle
    },
};

interface PSBRegistrationWithRelations {
    id: string;
    registrationNumber: string;
    namaLengkap: string;
    noHpOrangTua: string | null;
    status: PSBStatus;
    driveFolderUrl: string | null;
    createdAt: Date;
    unit: { name: string };
    documents: { id: string }[];
    emailStatus: string | null;
}

interface StatItem {
    status: PSBStatus;
    _count: number;
}

// Loading skeleton for stats
function StatsSkeleton() {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border p-5">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16" />
                </div>
            ))}
        </div>
    );
}

// Loading skeleton for table
function TableSkeleton() {
    return (
        <div className="bg-white rounded-xl border overflow-hidden">
            <div className="p-4 border-b">
                <Skeleton className="h-6 w-48" />
            </div>
            <div className="divide-y">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-4 flex items-center gap-4">
                        <Skeleton className="h-5 w-24" />
                        <div className="flex-1 space-y-1">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-3 w-28" />
                        </div>
                        <Skeleton className="h-6 w-16 rounded" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// Async component for stats
async function PSBStats() {
    const [globalStats, missingDocsCount] = await Promise.all([
        db.pSBRegistration.groupBy({
            by: ['status'],
            _count: true,
        }) as unknown as Promise<StatItem[]>,
        // Count registrations with Drive folder but no documents
        db.pSBRegistration.count({
            where: {
                driveFolderId: { not: null },
                documents: { none: {} },
            },
        }),
    ]);

    const statCounts = {
        PENDING: globalStats.find((s: StatItem) => s.status === 'PENDING')?._count || 0,
        VERIFIED: globalStats.find((s: StatItem) => s.status === 'VERIFIED')?._count || 0,
        ACCEPTED: globalStats.find((s: StatItem) => s.status === 'ACCEPTED')?._count || 0,
        REJECTED: globalStats.find((s: StatItem) => s.status === 'REJECTED')?._count || 0,
        total: globalStats.reduce((acc: number, s: StatItem) => acc + s._count, 0),
    };

    return (
        <>
            {/* Sync Actions - Only shows if there are issues */}
            <PSBSyncActions
                missingDocsCount={missingDocsCount}
                unsyncedSpreadsheetCount={0}
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <div className="bg-white rounded-xl border p-5">
                    <p className="text-sm text-gray-500">Total Pendaftar</p>
                    <p className="text-3xl font-bold text-gray-900">{statCounts.total}</p>
                </div>
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
                    <p className="text-sm text-amber-700">Menunggu</p>
                    <p className="text-3xl font-bold text-amber-800">{statCounts.PENDING}</p>
                </div>
                <div className="bg-blue-50 rounded-xl border border-blue-200 p-5">
                    <p className="text-sm text-blue-700">Terverifikasi</p>
                    <p className="text-3xl font-bold text-blue-800">{statCounts.VERIFIED}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-5">
                    <p className="text-sm text-emerald-700">Diterima</p>
                    <p className="text-3xl font-bold text-emerald-800">{statCounts.ACCEPTED}</p>
                </div>
                <div className="bg-red-50 rounded-xl border border-red-200 p-5">
                    <p className="text-sm text-red-700">Ditolak</p>
                    <p className="text-3xl font-bold text-red-800">{statCounts.REJECTED}</p>
                </div>
            </div>
        </>
    );
}

// Async component for table content
async function PSBTableContent({ params }: { params: { status?: string; unit?: string } }) {
    const [registrations, units, globalStats, filteredStats] = await Promise.all([
        db.pSBRegistration.findMany({
            where: {
                ...(params.status && { status: params.status as PSBStatus }),
                ...(params.unit && { unitId: params.unit }),
            },
            include: {
                unit: true,
                documents: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        }) as unknown as Promise<PSBRegistrationWithRelations[]>,
        db.unit.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
        }),
        db.pSBRegistration.groupBy({
            by: ['status'],
            _count: true,
        }) as unknown as Promise<StatItem[]>,
        params.unit
            ? db.pSBRegistration.groupBy({
                by: ['status'],
                where: { unitId: params.unit },
                _count: true,
            }) as unknown as Promise<StatItem[]>
            : Promise.resolve(null),
    ]);

    const actualFilteredStats = filteredStats || globalStats;
    const filteredCounts = {
        PENDING: actualFilteredStats.find((s: StatItem) => s.status === 'PENDING')?._count || 0,
        VERIFIED: actualFilteredStats.find((s: StatItem) => s.status === 'VERIFIED')?._count || 0,
        ACCEPTED: actualFilteredStats.find((s: StatItem) => s.status === 'ACCEPTED')?._count || 0,
        REJECTED: actualFilteredStats.find((s: StatItem) => s.status === 'REJECTED')?._count || 0,
    };

    const currentUnitName = params.unit
        ? units.find(u => u.id === params.unit)?.name
        : undefined;

    return (
        <>
            {/* Filters */}
            <div className="bg-white rounded-xl border p-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Filter className="w-4 h-4" />
                        <span className="text-sm font-medium">Filter:</span>
                    </div>

                    {/* Status filter */}
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href="/admin/psb"
                            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${!params.status
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            Semua
                        </Link>
                        {(Object.entries(statusConfig) as [PSBStatus, typeof statusConfig[PSBStatus]][]).map(([key, config]) => (
                            <Link
                                key={key}
                                href={`/admin/psb?status=${key}${params.unit ? `&unit=${params.unit}` : ''}`}
                                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${params.status === key
                                    ? config.color
                                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {config.label}
                            </Link>
                        ))}
                    </div>

                    {/* Unit filter */}
                    <PSBUnitFilter units={units} currentUnit={params.unit} />
                </div>
            </div>

            {/* Bulk Actions */}
            <PSBBulkActions
                currentFilter={{
                    unitId: params.unit,
                    status: params.status as PSBStatus | undefined,
                }}
                counts={filteredCounts}
                unitName={currentUnitName}
            />

            {/* Table */}
            <div className="bg-white rounded-xl border overflow-hidden">
                {registrations.length === 0 ? (
                    <div className="p-12 text-center">
                        <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Belum ada data pendaftaran</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        No. Pendaftaran
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Nama
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Unit
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Berkas
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Tanggal
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {registrations.map((reg: PSBRegistrationWithRelations) => {
                                    const statusInfo = statusConfig[reg.status];
                                    const StatusIcon = statusInfo.icon;

                                    return (
                                        <tr key={reg.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4">
                                                <span className="font-mono text-sm font-medium text-gray-900">
                                                    {reg.registrationNumber}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{reg.namaLengkap}</p>
                                                    <p className="text-sm text-gray-500">{reg.noHpOrangTua}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="inline-flex px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded">
                                                    {reg.unit.name}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-600">
                                                        {reg.documents.length} file
                                                    </span>
                                                    {reg.driveFolderUrl && (
                                                        <a
                                                            href={reg.driveFolderUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-800"
                                                            title="Buka di Google Drive"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                {reg.emailStatus ? (
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${reg.emailStatus === 'opened' ? 'bg-green-100 text-green-700' :
                                                        reg.emailStatus === 'clicked' ? 'bg-purple-100 text-purple-700' :
                                                            reg.emailStatus === 'delivered' ? 'bg-blue-100 text-blue-700' :
                                                                reg.emailStatus === 'bounced' ? 'bg-red-100 text-red-700' :
                                                                    'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {reg.emailStatus === 'opened' ? 'Dibaca' :
                                                            reg.emailStatus === 'clicked' ? 'Diklik' :
                                                                reg.emailStatus === 'delivered' ? 'Terkirim' :
                                                                    reg.emailStatus === 'bounced' ? 'Gagal' :
                                                                        'Terikirim'}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${statusInfo.color}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {statusInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-500">
                                                {new Date(reg.createdAt).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    timeZone: 'Asia/Jakarta'
                                                })}
                                            </td>
                                            <td className="px-4 py-4">
                                                <Link
                                                    href={`/admin/psb/${reg.id}`}
                                                    className="text-sm font-medium text-emerald-600 hover:text-emerald-800"
                                                >
                                                    Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

export default async function AdminPSBPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; unit?: string }>;
}) {
    const params = await searchParams;

    return (
        <div className="p-6 lg:p-8">
            {/* Header - Shows instantly */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <UserPlus className="w-8 h-8 text-emerald-600" />
                    Pendaftaran PSB
                </h1>
                <p className="text-gray-500 mt-1">
                    Kelola data pendaftaran santri baru
                </p>
            </div>

            {/* Stats - Streams in */}
            <Suspense fallback={<StatsSkeleton />}>
                <PSBStats />
            </Suspense>

            {/* Filters and Table - Streams in */}
            <Suspense fallback={<TableSkeleton />}>
                <PSBTableContent params={params} />
            </Suspense>
        </div>
    );
}
