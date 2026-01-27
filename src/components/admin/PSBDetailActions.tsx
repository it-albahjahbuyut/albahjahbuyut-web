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
    FileText
} from 'lucide-react';
import { updatePSBStatus, deletePSBRegistration, adminUploadDocument, PSBStatus } from '@/actions/psb-actions';

interface PSBDetailActionsProps {
    registrationId: string;
    currentStatus: PSBStatus;
    notes?: string | null;
    driveFolderId?: string | null;
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
    driveFolderId
}: PSBDetailActionsProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

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

