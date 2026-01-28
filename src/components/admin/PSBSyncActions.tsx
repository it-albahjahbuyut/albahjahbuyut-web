'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    RefreshCw,
    Database,
    FileSpreadsheet,
    Loader2,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import {
    syncAllMissingDocuments,
    syncAllUnsyncedToSpreadsheet
} from '@/actions/psb-actions';

interface PSBSyncActionsProps {
    unsyncedSpreadsheetCount?: number;
    missingDocsCount?: number;
}

export default function PSBSyncActions({
    unsyncedSpreadsheetCount = 0,
    missingDocsCount = 0
}: PSBSyncActionsProps) {
    const router = useRouter();
    const [isSyncingDocs, setIsSyncingDocs] = useState(false);
    const [isSyncingSheet, setIsSyncingSheet] = useState(false);
    const [result, setResult] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const handleSyncAllDocs = async () => {
        setIsSyncingDocs(true);
        setResult(null);

        try {
            const response = await syncAllMissingDocuments();
            setResult({
                type: response.success ? 'success' : 'error',
                message: response.message,
            });

            if (response.success && response.totalSynced > 0) {
                router.refresh();
            }
        } catch (error) {
            setResult({
                type: 'error',
                message: error instanceof Error ? error.message : 'Terjadi kesalahan',
            });
        } finally {
            setIsSyncingDocs(false);
        }
    };

    const handleSyncAllSheet = async () => {
        setIsSyncingSheet(true);
        setResult(null);

        try {
            const response = await syncAllUnsyncedToSpreadsheet();
            setResult({
                type: response.success ? 'success' : 'error',
                message: response.message,
            });

            if (response.success) {
                router.refresh();
            }
        } catch (error) {
            setResult({
                type: 'error',
                message: error instanceof Error ? error.message : 'Terjadi kesalahan',
            });
        } finally {
            setIsSyncingSheet(false);
        }
    };

    // Don't show if nothing needs syncing (unless there's a result message)
    const hasIssues = unsyncedSpreadsheetCount > 0 || missingDocsCount > 0;

    if (!hasIssues && !result) {
        return null;
    }

    return (
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-blue-600" />
                    <div>
                        <p className="text-sm font-medium text-blue-900">
                            Sinkronisasi Data
                        </p>
                        {hasIssues && (
                            <p className="text-xs text-blue-700">
                                {missingDocsCount > 0 && (
                                    <span>{missingDocsCount} pendaftaran perlu sync dokumen</span>
                                )}
                                {missingDocsCount > 0 && unsyncedSpreadsheetCount > 0 && ' • '}
                                {unsyncedSpreadsheetCount > 0 && (
                                    <span>{unsyncedSpreadsheetCount} belum di spreadsheet</span>
                                )}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {missingDocsCount > 0 && (
                        <button
                            onClick={handleSyncAllDocs}
                            disabled={isSyncingDocs || isSyncingSheet}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSyncingDocs ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Syncing...</span>
                                </>
                            ) : (
                                <>
                                    <Database className="w-4 h-4" />
                                    <span>Sync Dokumen dari Drive</span>
                                </>
                            )}
                        </button>
                    )}

                    {unsyncedSpreadsheetCount > 0 && (
                        <button
                            onClick={handleSyncAllSheet}
                            disabled={isSyncingDocs || isSyncingSheet}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSyncingSheet ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Syncing...</span>
                                </>
                            ) : (
                                <>
                                    <FileSpreadsheet className="w-4 h-4" />
                                    <span>Sync ke Spreadsheet</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Result Message */}
            {result && (
                <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${result.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200'
                    : 'bg-red-50 border border-red-200'
                    }`}>
                    {result.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <p className={`text-sm ${result.type === 'success' ? 'text-emerald-800' : 'text-red-800'
                        }`}>
                        {result.message}
                    </p>
                </div>
            )}
        </div>
    );
}
