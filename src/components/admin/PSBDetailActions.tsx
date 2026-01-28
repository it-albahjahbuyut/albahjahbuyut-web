'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Loader2,
    CheckCircle2,
    XCircle,
    Clock,
    FileCheck,
    Trash2,
    AlertTriangle,
    Upload,
    FileText,
    RefreshCw,
    Database,
    FileSpreadsheet,
    Link2
} from 'lucide-react';
import {
    updatePSBStatus,
    deletePSBRegistration,
    adminUploadDocument,
    syncDocumentsFromDrive,
    syncRegistrationToSpreadsheet,
    updateDriveFolderUrl,
    PSBStatus
} from '@/actions/psb-actions';

interface PSBDetailActionsProps {
    registrationId: string;
    currentStatus: PSBStatus;
    notes?: string | null;
    driveFolderId?: string | null;
    driveFolderUrl?: string | null;
}

const statusOptions = [
    { value: 'PENDING' as PSBStatus, label: 'Menunggu', icon: Clock, color: 'bg-amber-500' },
    { value: 'VERIFIED' as PSBStatus, label: 'Terverifikasi', icon: FileCheck, color: 'bg-blue-500' },
    { value: 'ACCEPTED' as PSBStatus, label: 'Diterima', icon: CheckCircle2, color: 'bg-emerald-500' },
    { value: 'REJECTED' as PSBStatus, label: 'Ditolak', icon: XCircle, color: 'bg-red-500' },
];

const documentTypes = [
    { value: 'PAS_FOTO', label: 'Pas Foto 3x4' },
    { value: 'KARTU_KELUARGA', label: 'Kartu Keluarga (KK)' },
    { value: 'AKTA_KELAHIRAN', label: 'Akta Kelahiran' },
    { value: 'KTP_ORTU', label: 'KTP Orang Tua' },
    { value: 'IJAZAH_SD', label: 'Ijazah SD' },
    { value: 'IJAZAH_SMP', label: 'Ijazah SMP' },
    { value: 'IJAZAH_TK', label: 'Ijazah TK' },
    { value: 'IJAZAH', label: 'Ijazah Terakhir' },
    { value: 'BUKTI_PEMBAYARAN', label: 'Bukti Pembayaran' },
    { value: 'LAINNYA', label: 'Dokumen Lainnya' },
];

export default function PSBDetailActions({
    registrationId,
    currentStatus,
    notes: initialNotes,
    driveFolderId,
    driveFolderUrl
}: PSBDetailActionsProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Check if we have a Drive folder (either from ID or URL)
    const hasDriveFolder = !!(driveFolderId || driveFolderUrl);

    // Status update state
    const [status, setStatus] = useState<PSBStatus>(currentStatus);
    const [notes, setNotes] = useState(initialNotes || '');
    const [isUpdating, setIsUpdating] = useState(false);

    // Delete state
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Upload state
    const [selectedDocType, setSelectedDocType] = useState('PAS_FOTO');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Sync state
    const [isSyncingDocs, setIsSyncingDocs] = useState(false);
    const [isSyncingSheet, setIsSyncingSheet] = useState(false);
    const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Drive URL input state
    const [driveUrlInput, setDriveUrlInput] = useState('');
    const [isSavingDriveUrl, setIsSavingDriveUrl] = useState(false);

    // Message state
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleUpdateStatus = async () => {
        setIsUpdating(true);
        setMessage(null);

        const result = await updatePSBStatus(registrationId, status, notes);

        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            router.refresh();
        } else {
            setMessage({ type: 'error', text: result.message });
        }

        setIsUpdating(false);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        setMessage(null);

        const result = await deletePSBRegistration(registrationId);

        if (result.success) {
            router.push('/admin/psb');
        } else {
            setMessage({ type: 'error', text: result.message });
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setUploadMessage({ type: 'error', text: 'Ukuran file maksimal 5MB' });
                return;
            }
            setSelectedFile(file);
            setUploadMessage(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadMessage({ type: 'error', text: 'Pilih file terlebih dahulu' });
            return;
        }

        setIsUploading(true);
        setUploadMessage(null);

        try {
            // Convert file to base64
            const arrayBuffer = await selectedFile.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            let binary = '';
            uint8Array.forEach((byte) => {
                binary += String.fromCharCode(byte);
            });
            const base64 = btoa(binary);

            const result = await adminUploadDocument(
                registrationId,
                selectedDocType,
                selectedFile.name,
                selectedFile.type,
                base64
            );

            if (result.success) {
                setUploadMessage({ type: 'success', text: result.message });
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                router.refresh();
            } else {
                setUploadMessage({ type: 'error', text: result.message });
            }
        } catch (error) {
            setUploadMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Terjadi kesalahan saat upload'
            });
        }

        setIsUploading(false);
    };

    const handleSyncDocs = async () => {
        if (!hasDriveFolder) {
            setSyncMessage({ type: 'error', text: 'Tidak ada folder Drive terhubung' });
            return;
        }

        setIsSyncingDocs(true);
        setSyncMessage(null);

        try {
            const result = await syncDocumentsFromDrive(registrationId);
            setSyncMessage({
                type: result.success ? 'success' : 'error',
                text: result.message
            });
            if (result.success && result.synced > 0) {
                router.refresh();
            }
        } catch (error) {
            setSyncMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Terjadi kesalahan'
            });
        }

        setIsSyncingDocs(false);
    };

    const handleSyncSheet = async () => {
        setIsSyncingSheet(true);
        setSyncMessage(null);

        try {
            // Force sync when triggered manually from UI
            const result = await syncRegistrationToSpreadsheet(registrationId, true);
            setSyncMessage({
                type: result.success ? 'success' : 'error',
                text: result.message
            });
        } catch (error) {
            setSyncMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Terjadi kesalahan'
            });
        }

        setIsSyncingSheet(false);
    };

    const handleSaveDriveUrl = async () => {
        if (!driveUrlInput.trim()) {
            setSyncMessage({ type: 'error', text: 'Masukkan URL folder Drive' });
            return;
        }

        setIsSavingDriveUrl(true);
        setSyncMessage(null);

        try {
            const result = await updateDriveFolderUrl(registrationId, driveUrlInput.trim());
            setSyncMessage({
                type: result.success ? 'success' : 'error',
                text: result.message
            });
            if (result.success) {
                setDriveUrlInput('');
                router.refresh();
            }
        } catch (error) {
            setSyncMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Terjadi kesalahan'
            });
        }

        setIsSavingDriveUrl(false);
    };

    return (
        <div className="space-y-6">
            {/* Status Update */}
            <div className="bg-white rounded-xl border p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Update Status</h3>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {statusOptions.map((opt) => {
                            const Icon = opt.icon;
                            return (
                                <button
                                    key={opt.value}
                                    onClick={() => setStatus(opt.value)}
                                    className={`
                    flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                    ${status === opt.value
                                            ? `border-gray-900 ${opt.color} text-white`
                                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'}
                  `}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{opt.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Catatan Admin
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Tambahkan catatan (opsional)"
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg text-sm ${message.type === 'success'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        onClick={handleUpdateStatus}
                        disabled={isUpdating || (status === currentStatus && notes === (initialNotes || ''))}
                        className="w-full px-4 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isUpdating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                Simpan Perubahan
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Upload Document */}
            <div className="bg-white rounded-xl border p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-emerald-600" />
                    Upload Dokumen
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Jenis Dokumen
                        </label>
                        <select
                            value={selectedDocType}
                            onChange={(e) => setSelectedDocType(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            {documentTypes.map((doc) => (
                                <option key={doc.value} value={doc.value}>
                                    {doc.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pilih File
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`
                                w-full p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                                ${selectedFile
                                    ? 'border-emerald-300 bg-emerald-50'
                                    : 'border-gray-300 hover:border-emerald-400'}
                            `}
                        >
                            {selectedFile ? (
                                <div className="flex items-center gap-3">
                                    <FileText className="w-8 h-8 text-emerald-600" />
                                    <div>
                                        <p className="font-medium text-gray-900">{selectedFile.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {(selectedFile.size / 1024).toFixed(1)} KB
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">
                                        Klik untuk pilih file
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        JPG, PNG, PDF (maks 5MB)
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {uploadMessage && (
                        <div className={`p-3 rounded-lg text-sm ${uploadMessage.type === 'success'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                            {uploadMessage.text}
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={isUploading || !selectedFile}
                        className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Mengupload...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                Upload Dokumen
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Sync Data */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Sinkronisasi Data
                </h3>

                <p className="text-sm text-blue-700 mb-4">
                    Gunakan opsi ini jika data tidak sinkron antara sistem, Google Drive, atau Spreadsheet.
                </p>

                {syncMessage && (
                    <div className={`p-3 rounded-lg text-sm mb-4 ${syncMessage.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                        {syncMessage.text}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                        onClick={handleSyncDocs}
                        disabled={isSyncingDocs || !hasDriveFolder}
                        className="px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSyncingDocs ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Syncing...
                            </>
                        ) : (
                            <>
                                <Database className="w-4 h-4" />
                                Sync Dokumen dari Drive
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleSyncSheet}
                        disabled={isSyncingSheet}
                        className="px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSyncingSheet ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Syncing...
                            </>
                        ) : (
                            <>
                                <FileSpreadsheet className="w-4 h-4" />
                                Sync ke Spreadsheet
                            </>
                        )}
                    </button>
                </div>

                {!hasDriveFolder && (
                    <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-start gap-2 mb-3">
                            <Link2 className="w-4 h-4 text-amber-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-amber-800">Hubungkan Folder Drive</p>
                                <p className="text-xs text-amber-700">
                                    Paste URL folder Google Drive untuk menghubungkan dokumen
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                value={driveUrlInput}
                                onChange={(e) => setDriveUrlInput(e.target.value)}
                                placeholder="https://drive.google.com/drive/folders/..."
                                className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                onClick={handleSaveDriveUrl}
                                disabled={isSavingDriveUrl || !driveUrlInput.trim()}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSavingDriveUrl ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    'Simpan'
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 rounded-xl border border-red-200 p-6">
                <h3 className="font-semibold text-red-800 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Zona Berbahaya
                </h3>

                {showDeleteConfirm ? (
                    <div className="space-y-4">
                        <p className="text-sm text-red-700">
                            Anda yakin ingin menghapus data pendaftaran ini? Tindakan ini tidak dapat dibatalkan
                            dan akan menghapus semua berkas dari Google Drive.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Menghapus...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        Ya, Hapus
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Hapus Pendaftaran
                    </button>
                )}
            </div>
        </div>
    );
}

