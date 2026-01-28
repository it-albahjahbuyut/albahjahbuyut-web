'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { unsubscribeNewsletter } from '@/actions/newsletter-actions';
import Link from 'next/link';

function UnsubscribeContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (email && status === 'idle') {
            handleUnsubscribe();
        }
    }, [email]);

    const handleUnsubscribe = async () => {
        if (!email) {
            setStatus('error');
            setMessage('Email tidak ditemukan');
            return;
        }

        setStatus('loading');

        const result = await unsubscribeNewsletter(email);

        setStatus(result.success ? 'success' : 'error');
        setMessage(result.message);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                {status === 'loading' && (
                    <>
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Memproses...
                        </h1>
                        <p className="text-gray-500">
                            Mohon tunggu sebentar
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Berhasil Berhenti Berlangganan
                        </h1>
                        <p className="text-gray-500 mb-6">
                            Anda tidak akan menerima email newsletter lagi dari Al-Bahjah Buyut.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                        >
                            Kembali ke Beranda
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Gagal
                        </h1>
                        <p className="text-gray-500 mb-6">
                            {message}
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Kembali ke Beranda
                        </Link>
                    </>
                )}

                {status === 'idle' && !email && (
                    <>
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Mail className="w-8 h-8 text-gray-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Email Tidak Ditemukan
                        </h1>
                        <p className="text-gray-500 mb-6">
                            Link berhenti berlangganan tidak valid.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                        >
                            Kembali ke Beranda
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default function UnsubscribePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
        }>
            <UnsubscribeContent />
        </Suspense>
    );
}
