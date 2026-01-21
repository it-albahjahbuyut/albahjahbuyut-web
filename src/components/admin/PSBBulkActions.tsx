'use client';

import { useState } from 'react';
import { CheckCircle2, FileCheck, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { bulkUpdatePSBStatus, PSBStatus } from '@/actions/psb-actions';

interface PSBBulkActionsProps {
    currentFilter?: {
        unitId?: string;
        status?: PSBStatus;
    };
    counts: {
        PENDING: number;
        VERIFIED: number;
        ACCEPTED: number;
        REJECTED: number;
    };
    unitName?: string;
}

const statusLabels: Record<PSBStatus, string> = {
    PENDING: 'Menunggu',
    VERIFIED: 'Terverifikasi',
    ACCEPTED: 'Diterima',
    REJECTED: 'Ditolak',
};

export default function PSBBulkActions({ currentFilter, counts, unitName }: PSBBulkActionsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
    const [showConfirm, setShowConfirm] = useState<PSBStatus | null>(null);

    const handleBulkAction = async (targetStatus: PSBStatus) => {
        setIsLoading(true);
        setResult(null);

        try {
            const response = await bulkUpdatePSBStatus(targetStatus, {
                unitId: currentFilter?.unitId,
                currentStatus: currentFilter?.status,
            });

            setResult({
                success: response.success,
                message: response.message,
            });

            // Auto-hide result after 5 seconds
            setTimeout(() => setResult(null), 5000);
        } catch {
            setResult({
                success: false,
                message: 'Terjadi kesalahan',
            });
        } finally {
            setIsLoading(false);
            setShowConfirm(null);
        }
    };

    // Count of items that will be affected
    const affectedCount = currentFilter?.status
        ? counts[currentFilter.status]
        : counts.PENDING + counts.VERIFIED + counts.ACCEPTED + counts.REJECTED;

    // Build filter description
    const filterParts: string[] = [];
    if (unitName) filterParts.push(unitName);
    if (currentFilter?.status) filterParts.push(statusLabels[currentFilter.status]);
    const filterDesc = filterParts.length > 0 ? ` (${filterParts.join(' - ')})` : '';

    if (affectedCount === 0) return null;

    return (
        <div className="bg-white rounded-xl border p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-gray-900">
                        Aksi Massal{filterDesc}
                    </p>
                    <p className="text-xs text-gray-500">
                        Ubah status <strong>{affectedCount}</strong> pendaftaran sekaligus
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {/* Terima Semua */}
                    <button
                        onClick={() => setShowConfirm('ACCEPTED')}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        Terima Semua
                    </button>

                    {/* Verifikasi Semua */}
                    <button
                        onClick={() => setShowConfirm('VERIFIED')}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FileCheck className="w-4 h-4" />
                        Verifikasi Semua
                    </button>

                    {/* Tolak Semua */}
                    <button
                        onClick={() => setShowConfirm('REJECTED')}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <XCircle className="w-4 h-4" />
                        Tolak Semua
                    </button>
                </div>
            </div>

            {/* Confirmation Dialog */}
            {showConfirm && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-amber-800">
                                Konfirmasi Aksi Massal
                            </p>
                            <p className="text-sm text-amber-700 mt-1">
                                Anda akan mengubah status <strong>{affectedCount}</strong> pendaftaran menjadi <strong>
                                    {showConfirm === 'ACCEPTED' && 'Diterima'}
                                    {showConfirm === 'VERIFIED' && 'Terverifikasi'}
                                    {showConfirm === 'REJECTED' && 'Ditolak'}
                                </strong>.
                                {['VERIFIED', 'ACCEPTED', 'REJECTED'].includes(showConfirm) && (
                                    <> Email notifikasi akan dikirim ke pendaftar yang memiliki email.</>
                                )}
                            </p>
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => handleBulkAction(showConfirm)}
                                    disabled={isLoading}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Memproses...
                                        </>
                                    ) : (
                                        'Ya, Lanjutkan'
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowConfirm(null)}
                                    disabled={isLoading}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Result Message */}
            {result && (
                <div className={`mt-4 p-4 rounded-lg ${result.success
                    ? 'bg-emerald-50 border border-emerald-200'
                    : 'bg-red-50 border border-red-200'
                    }`}>
                    <p className={`text-sm font-medium ${result.success ? 'text-emerald-800' : 'text-red-800'}`}>
                        {result.message}
                    </p>
                </div>
            )}
        </div>
    );
}
