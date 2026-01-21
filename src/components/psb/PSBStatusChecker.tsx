'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, CheckCircle2, XCircle, Clock, FileCheck, AlertCircle } from 'lucide-react';
import { getPSBRegistrationByNumber, PSBStatus } from '@/actions/psb-actions';

const statusConfig: Record<PSBStatus, {
    label: string;
    description: string;
    color: string;
    iconBg: string;
    iconColor: string;
    icon: typeof Clock;
}> = {
    PENDING: {
        label: 'Menunggu Verifikasi',
        description: 'Berkas pendaftaran Anda sedang dalam proses verifikasi oleh tim kami.',
        color: 'bg-amber-50 border-amber-200 text-amber-800',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        icon: Clock
    },
    VERIFIED: {
        label: 'Berkas Terverifikasi',
        description: 'Berkas pendaftaran Anda sudah terverifikasi dan lengkap. Menunggu proses seleksi.',
        color: 'bg-blue-50 border-blue-200 text-blue-800',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        icon: FileCheck
    },
    ACCEPTED: {
        label: 'Diterima',
        description: 'Selamat! Anda diterima sebagai santri baru. Silakan tunggu informasi selanjutnya.',
        color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        icon: CheckCircle2
    },
    REJECTED: {
        label: 'Tidak Diterima',
        description: 'Mohon maaf, pendaftaran Anda tidak dapat kami terima. Hubungi kami untuk informasi lebih lanjut.',
        color: 'bg-red-50 border-red-200 text-red-800',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        icon: XCircle
    },
};

interface RegistrationResult {
    registrationNumber: string;
    namaLengkap: string;
    unitName: string;
    status: PSBStatus;
    notes: string | null;
    createdAt: Date;
}

interface SearchResult {
    found: boolean;
    data?: RegistrationResult;
}

interface PSBStatusCheckerProps {
    initialNumber?: string;
}

export default function PSBStatusChecker({ initialNumber }: PSBStatusCheckerProps) {
    const [registrationNumber, setRegistrationNumber] = useState(initialNumber || '');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<SearchResult | null>(null);

    // Auto-search function (without event)
    const doSearch = async (searchNumber: string) => {
        if (!searchNumber.trim()) return;

        setIsLoading(true);
        setResult(null);

        try {
            const data = await getPSBRegistrationByNumber(searchNumber.trim().toUpperCase());

            if (data) {
                setResult({ found: true, data: data as RegistrationResult });
            } else {
                setResult({ found: false });
            }
        } catch (error) {
            console.error('Error checking status:', error);
            setResult({ found: false });
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-search when initialNumber is provided (from QR code)
    useEffect(() => {
        if (initialNumber) {
            doSearch(initialNumber);
        }
    }, [initialNumber]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        doSearch(registrationNumber);
    };

    return (
        <div className="space-y-8">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl p-8">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nomor Pendaftaran
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
                        placeholder="Contoh: PSB2501SMP..."
                        className="flex-1 px-4 py-3 border border-slate-300 rounded-lg font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !registrationNumber.trim()}
                        className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:w-auto w-full"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Search className="w-5 h-5" />
                        )}
                        <span>Cek Status</span>
                    </button>
                </div>
            </form>

            {/* Result */}
            {result && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {result.found && result.data ? (
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            {/* Status Banner */}
                            {(() => {
                                const statusInfo = statusConfig[result.data.status];
                                const StatusIcon = statusInfo.icon;

                                return (
                                    <div className={`p-4 sm:p-6 border-b ${statusInfo.color}`}>
                                        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                                            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${statusInfo.iconBg} flex items-center justify-center flex-shrink-0`}>
                                                <StatusIcon className={`w-6 h-6 sm:w-8 sm:h-8 ${statusInfo.iconColor}`} />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-lg sm:text-xl font-bold">{statusInfo.label}</h3>
                                                <p className="text-sm opacity-80">{statusInfo.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Details */}
                            <div className="p-6 space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">Nomor Pendaftaran</p>
                                        <p className="font-mono font-bold text-slate-900">{result.data.registrationNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">Unit Pendidikan</p>
                                        <p className="font-semibold text-slate-900">{result.data.unitName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">Nama Pendaftar</p>
                                        <p className="font-semibold text-slate-900">{result.data.namaLengkap}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">Tanggal Daftar</p>
                                        <p className="font-semibold text-slate-900">
                                            {new Date(result.data.createdAt).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Catatan dari Panitia */}
                                {result.data.notes && (
                                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                        <p className="text-xs text-amber-700 uppercase tracking-wide font-semibold mb-1">
                                            Catatan dari Panitia
                                        </p>
                                        <p className="text-sm text-amber-900">
                                            {result.data.notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                Data Tidak Ditemukan
                            </h3>
                            <p className="text-slate-500">
                                Nomor pendaftaran <span className="font-mono font-bold">{registrationNumber}</span> tidak ditemukan.
                                Pastikan Anda memasukkan nomor yang benar.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Info */}
            <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                <h4 className="font-semibold text-emerald-900 mb-2">Informasi</h4>
                <ul className="text-sm text-emerald-800 space-y-1">
                    <li>• Nomor pendaftaran diberikan setelah Anda berhasil mengirim formulir pendaftaran.</li>
                    <li>• Proses verifikasi berkas membutuhkan waktu 1-3 hari kerja.</li>
                    <li>• Jika ada pertanyaan, silakan hubungi panitia PSB melalui kontak yang tersedia.</li>
                </ul>
            </div>
        </div>
    );
}
