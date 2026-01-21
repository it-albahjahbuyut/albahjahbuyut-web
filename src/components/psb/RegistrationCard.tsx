'use client';

import { useRef, useState } from 'react';
import { Download, Loader2, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas-pro';

interface RegistrationCardProps {
    registrationNumber: string;
    namaLengkap: string;
    unitName: string;
    grade?: string;
    jenisSantri?: string;
    jenisKelamin?: string;
    pasFotoUrl?: string; // URL or base64
    tahunAjaran?: string;
}

export default function RegistrationCard({
    registrationNumber,
    namaLengkap,
    unitName,
    grade,
    jenisSantri,
    pasFotoUrl,
    tahunAjaran = '2026/2027',
}: RegistrationCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadSuccess, setDownloadSuccess] = useState(false);

    // Generate status check URL for QR code
    const statusCheckUrl = `https://albahjahbuyut.or.id/psb/status?no=${registrationNumber}`;

    const handleDownload = async () => {
        if (!cardRef.current) return;

        setIsDownloading(true);
        setDownloadSuccess(false);

        try {
            // Wait for images to load
            await new Promise(resolve => setTimeout(resolve, 500));

            // html2canvas-pro supports modern CSS color functions (lab, lch, oklch)
            const canvas = await html2canvas(cardRef.current, {
                scale: 3, // High resolution
                backgroundColor: '#ffffff',
                useCORS: true,
                allowTaint: true,
                logging: false,
            });

            // Convert to PNG and download
            const link = document.createElement('a');
            link.download = `kartu-peserta-${registrationNumber}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            setDownloadSuccess(true);
            setTimeout(() => setDownloadSuccess(false), 3000);
        } catch (error) {
            console.error('Error downloading card:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    // Determine unit badge color - using hex values to avoid color function issues
    const getUnitColor = (unit: string) => {
        const unitLower = unit.toLowerCase();
        if (unitLower.includes('smp')) return '#2563eb'; // blue-600
        if (unitLower.includes('sma')) return '#059669'; // emerald-600
        if (unitLower.includes('sd')) return '#f97316'; // orange-500
        if (unitLower.includes('tahfidz')) return '#9333ea'; // purple-600
        if (unitLower.includes('tafaqquh')) return '#0d9488'; // teal-600
        return '#4b5563'; // gray-600
    };

    return (
        <div className="w-full">
            {/* Scrollable container for mobile */}
            <div className="overflow-x-auto pb-4">
                <div className="flex justify-center min-w-fit">
                    {/* Card Container - Fixed width for consistent download */}
                    <div
                        ref={cardRef}
                        style={{
                            width: '340px',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            backgroundColor: '#ffffff',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #e5e7eb'
                        }}
                    >
                        {/* Header */}
                        <div
                            style={{
                                background: 'linear-gradient(135deg, #065f46 0%, #0d9488 50%, #14b8a6 100%)',
                                padding: '12px 16px',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                {/* Logo & Title */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        backgroundColor: '#ffffff',
                                        borderRadius: '6px',
                                        padding: '4px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}>
                                        <img
                                            src="/logo-buyut.png"
                                            alt="Logo Al-Bahjah Buyut"
                                            width={32}
                                            height={32}
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </div>
                                    <div>
                                        <h2 style={{
                                            color: '#ffffff',
                                            fontWeight: 'bold',
                                            fontSize: '12px',
                                            lineHeight: '1.2',
                                            margin: 0
                                        }}>
                                            KARTU PESERTA SELEKSI
                                        </h2>
                                        <p style={{
                                            color: '#a7f3d0',
                                            fontSize: '10px',
                                            margin: 0,
                                            marginTop: '2px'
                                        }}>
                                            PSB Al-Bahjah Buyut
                                        </p>
                                    </div>
                                </div>

                                {/* Unit Badge */}
                                <div style={{
                                    backgroundColor: getUnitColor(unitName),
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}>
                                    <span style={{
                                        color: '#ffffff',
                                        fontWeight: 'bold',
                                        fontSize: '11px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        {unitName.replace(/iqu/i, ' IQu').replace(/al-bahjah/i, '').trim().split(' ')[0]}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', gap: '14px' }}>
                                {/* Photo Section */}
                                <div style={{ flexShrink: 0 }}>
                                    <div
                                        style={{
                                            width: '80px',
                                            height: '106px',
                                            borderRadius: '6px',
                                            overflow: 'hidden',
                                            border: '2px solid #e5e7eb',
                                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                                            backgroundColor: '#f3f4f6',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {pasFotoUrl ? (
                                            <img
                                                src={pasFotoUrl}
                                                alt={namaLengkap}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                crossOrigin="anonymous"
                                            />
                                        ) : (
                                            <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                                                <div style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '50%',
                                                    backgroundColor: '#e5e7eb',
                                                    margin: '0 auto 4px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <svg style={{ width: '24px', height: '24px', color: '#9ca3af' }} fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                    </svg>
                                                </div>
                                                <span style={{ fontSize: '10px' }}>Foto 3x4</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Info Section */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {/* Name */}
                                        <div>
                                            <p style={{
                                                fontSize: '10px',
                                                color: '#6b7280',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                margin: 0
                                            }}>Nama Peserta</p>
                                            <p style={{
                                                fontWeight: 'bold',
                                                color: '#111827',
                                                fontSize: '14px',
                                                margin: 0,
                                                marginTop: '1px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>{namaLengkap}</p>
                                        </div>

                                        {/* Registration Number */}
                                        <div>
                                            <p style={{
                                                fontSize: '10px',
                                                color: '#6b7280',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                margin: 0
                                            }}>No. Pendaftaran</p>
                                            <p style={{
                                                fontFamily: 'monospace',
                                                fontWeight: 'bold',
                                                color: '#047857',
                                                fontSize: '12px',
                                                margin: 0,
                                                marginTop: '1px'
                                            }}>{registrationNumber}</p>
                                        </div>

                                        {/* Grade & Jenis Santri in row */}
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            {grade && (
                                                <div>
                                                    <p style={{
                                                        fontSize: '10px',
                                                        color: '#6b7280',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.05em',
                                                        margin: 0
                                                    }}>Grade</p>
                                                    <p style={{
                                                        fontWeight: '600',
                                                        color: '#1f2937',
                                                        fontSize: '12px',
                                                        margin: 0,
                                                        marginTop: '1px'
                                                    }}>{grade}</p>
                                                </div>
                                            )}
                                            {jenisSantri && (
                                                <div>
                                                    <p style={{
                                                        fontSize: '10px',
                                                        color: '#6b7280',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.05em',
                                                        margin: 0
                                                    }}>Jenis</p>
                                                    <p style={{
                                                        fontWeight: '600',
                                                        color: '#1f2937',
                                                        fontSize: '12px',
                                                        margin: 0,
                                                        marginTop: '1px'
                                                    }}>{jenisSantri}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer with QR Code */}
                        <div
                            style={{
                                padding: '10px 16px',
                                borderTop: '1px solid #e5e7eb',
                                background: 'linear-gradient(to right, #f8fafc, #f1f5f9)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <div>
                                <p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>Tahun Pelajaran</p>
                                <p style={{ fontWeight: 'bold', color: '#374151', fontSize: '12px', margin: 0, marginTop: '2px' }}>{tahunAjaran}</p>
                            </div>

                            {/* QR Code in Footer */}
                            <div style={{
                                backgroundColor: '#ffffff',
                                padding: '3px',
                                borderRadius: '4px',
                                border: '1px solid #e5e7eb'
                            }}>
                                <QRCodeSVG
                                    value={statusCheckUrl}
                                    size={40}
                                    level="M"
                                    includeMargin={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Download Button - Full width on mobile */}
            <div className="flex justify-center px-4">
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className={`w-full max-w-[340px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${downloadSuccess
                        ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl'
                        }`}
                >
                    {isDownloading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Menyiapkan Kartu...
                        </>
                    ) : downloadSuccess ? (
                        <>
                            <CheckCircle2 className="w-5 h-5" />
                            Kartu Berhasil Diunduh!
                        </>
                    ) : (
                        <>
                            <Download className="w-5 h-5" />
                            Download Kartu Peserta
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
