import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import {
    ArrowLeft,
    User,
    Phone,
    School,
    Calendar,
    FileText,
    ExternalLink,
    Clock,
    CheckCircle2,
    XCircle,
    FileCheck
} from 'lucide-react';
import PSBDetailActions from '@/components/admin/PSBDetailActions';
import type { PSBStatus } from '@/actions/psb-actions';

interface PageProps {
    params: Promise<{ id: string }>;
}

interface PSBDocument {
    id: string;
    documentType: string;
    fileName: string;
    driveFileUrl: string;
}

interface PSBRegistration {
    id: string;
    registrationNumber: string;
    // Data Santri
    namaLengkap: string;
    nisn: string | null;
    nik: string | null;
    noKK: string | null;
    jenisKelamin: string;
    tempatLahir: string;
    tanggalLahir: Date;
    asalSekolah: string;
    alamatSekolahAsal: string | null;
    // Data Orang Tua
    namaAyah: string | null;
    namaIbu: string | null;
    pekerjaanAyah: string | null;
    pekerjaanIbu: string | null;
    penghasilanAyah: string | null;
    penghasilanIbu: string | null;
    pendidikanAyah: string | null;
    pendidikanIbu: string | null;
    anakKe: string | null;
    dariSaudara: string | null;
    jumlahTanggungan: string | null;
    alamatLengkap: string;
    noWaIbu: string | null;
    noWaAyah: string | null;
    sumberInfo: string | null;
    // Program Spesial
    grade: string | null;
    jenisSantri: string | null;
    // Legacy
    namaOrangTua: string | null;
    noHpOrangTua: string | null;
    emailOrangTua: string | null;
    // Status & Metadata
    status: PSBStatus;
    notes: string | null;
    driveFolderId: string | null;
    driveFolderUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    unit: { id: string; name: string; slug: string };
    documents: PSBDocument[];
    // Custom Data for PAUD
    customData: {
        namaPanggilan?: string;
        kewarganegaraan?: string;
        jumlahSaudaraTiri?: string;
        bahasaSehariHari?: string;
        beratBadan?: string;
        tinggiBadan?: string;
        golonganDarah?: string;
        imunisasi?: string;
        riwayatPenyakit?: string;
        usia?: string;
        ttlAyah?: string;
        kewarganegaraanAyah?: string;
        alamatAyah?: string;
        jumlahTanggunganAyah?: string;
        ttlIbu?: string;
        kewarganegaraanIbu?: string;
        alamatIbu?: string;
        jumlahTanggunganIbu?: string;
        statusMasuk?: string;
        tanggalDiterima?: string;
    } | null;
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const registration = await db.pSBRegistration.findUnique({
        where: { id },
        select: { namaLengkap: true, registrationNumber: true },
    });

    if (!registration) {
        return { title: 'Tidak Ditemukan | Admin PSB' };
    }

    return {
        title: `${registration.namaLengkap} (${registration.registrationNumber}) | Admin PSB`,
    };
}

const statusConfig: Record<PSBStatus, { label: string; color: string; icon: typeof Clock }> = {
    PENDING: {
        label: 'Menunggu Verifikasi',
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: Clock
    },
    VERIFIED: {
        label: 'Berkas Terverifikasi',
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

export default async function AdminPSBDetailPage({ params }: PageProps) {
    const { id } = await params;

    const registration = await db.pSBRegistration.findUnique({
        where: { id },
        include: {
            unit: true,
            documents: true,
        },
    }) as unknown as PSBRegistration | null;

    if (!registration) {
        notFound();
    }

    const statusInfo = statusConfig[registration.status];
    const StatusIcon = statusInfo.icon;

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin/psb"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Daftar PSB
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {registration.namaLengkap}
                        </h1>
                        <p className="text-gray-500 font-mono">
                            {registration.registrationNumber}
                        </p>
                    </div>
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${statusInfo.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusInfo.label}
                    </span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Data Pribadi */}
                    <div className="bg-white rounded-xl border p-6">
                        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-emerald-600" />
                            Data Pribadi Calon Santri
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Nama Lengkap</p>
                                <p className="font-medium text-gray-900">{registration.namaLengkap}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Jenis Kelamin</p>
                                <p className="font-medium text-gray-900">
                                    {registration.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">NISN</p>
                                <p className="font-medium text-gray-900">{registration.nisn || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">NIK</p>
                                <p className="font-medium text-gray-900">{registration.nik || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">No. KK</p>
                                <p className="font-medium text-gray-900">{registration.noKK || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Tempat Lahir</p>
                                <p className="font-medium text-gray-900">{registration.tempatLahir}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Tanggal Lahir</p>
                                <p className="font-medium text-gray-900">
                                    {new Date(registration.tanggalLahir).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        timeZone: 'Asia/Jakarta'
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Asal Sekolah</p>
                                <p className="font-medium text-gray-900">{registration.asalSekolah}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Alamat Sekolah Asal</p>
                                <p className="font-medium text-gray-900">{registration.alamatSekolahAsal || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Sumber Informasi</p>
                                <p className="font-medium text-gray-900">{registration.sumberInfo || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Data Khusus PAUD (jika ada customData) */}
                    {registration.customData && Object.keys(registration.customData).some(k => registration.customData?.[k as keyof typeof registration.customData]) && (
                        <div className="bg-white rounded-xl border p-6">
                            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-pink-600" />
                                Data Khusus PAUD
                            </h2>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {registration.customData.namaPanggilan && (
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Nama Panggilan</p>
                                        <p className="font-medium text-gray-900">{registration.customData.namaPanggilan}</p>
                                    </div>
                                )}
                                {registration.customData.usia && (
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Usia</p>
                                        <p className="font-medium text-gray-900">{registration.customData.usia} tahun</p>
                                    </div>
                                )}
                                {registration.customData.kewarganegaraan && (
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Kewarganegaraan</p>
                                        <p className="font-medium text-gray-900">{registration.customData.kewarganegaraan}</p>
                                    </div>
                                )}
                                {registration.customData.bahasaSehariHari && (
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Bahasa Sehari-hari</p>
                                        <p className="font-medium text-gray-900">{registration.customData.bahasaSehariHari}</p>
                                    </div>
                                )}
                                {registration.customData.beratBadan && (
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Berat Badan</p>
                                        <p className="font-medium text-gray-900">{registration.customData.beratBadan} kg</p>
                                    </div>
                                )}
                                {registration.customData.tinggiBadan && (
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Tinggi Badan</p>
                                        <p className="font-medium text-gray-900">{registration.customData.tinggiBadan} cm</p>
                                    </div>
                                )}
                                {registration.customData.golonganDarah && (
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Golongan Darah</p>
                                        <p className="font-medium text-gray-900">{registration.customData.golonganDarah}</p>
                                    </div>
                                )}
                                {registration.customData.jumlahSaudaraTiri && (
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Jumlah Saudara Tiri</p>
                                        <p className="font-medium text-gray-900">{registration.customData.jumlahSaudaraTiri}</p>
                                    </div>
                                )}
                                {registration.customData.statusMasuk && (
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Status Masuk</p>
                                        <p className="font-medium text-gray-900">{registration.customData.statusMasuk}</p>
                                    </div>
                                )}
                                {registration.customData.tanggalDiterima && (
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Tanggal Diterima</p>
                                        <p className="font-medium text-gray-900">{registration.customData.tanggalDiterima}</p>
                                    </div>
                                )}
                                {registration.customData.imunisasi && (
                                    <div className="sm:col-span-2">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Imunisasi yang Pernah Diberikan</p>
                                        <p className="font-medium text-gray-900">{registration.customData.imunisasi}</p>
                                    </div>
                                )}
                                {registration.customData.riwayatPenyakit && (
                                    <div className="sm:col-span-2">
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Riwayat Penyakit / Alergi</p>
                                        <p className="font-medium text-gray-900">{registration.customData.riwayatPenyakit}</p>
                                    </div>
                                )}
                            </div>

                            {/* Data Orang Tua Khusus PAUD */}
                            {(registration.customData.ttlAyah || registration.customData.ttlIbu) && (
                                <div className="mt-4 pt-4 border-t">
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">Data Tambahan Orang Tua</h3>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {registration.customData.ttlAyah && (
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">TTL Ayah</p>
                                                <p className="font-medium text-gray-900">{registration.customData.ttlAyah}</p>
                                            </div>
                                        )}
                                        {registration.customData.kewarganegaraanAyah && (
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Kewarganegaraan Ayah</p>
                                                <p className="font-medium text-gray-900">{registration.customData.kewarganegaraanAyah}</p>
                                            </div>
                                        )}
                                        {registration.customData.alamatAyah && (
                                            <div className="sm:col-span-2">
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Alamat Ayah</p>
                                                <p className="font-medium text-gray-900">{registration.customData.alamatAyah}</p>
                                            </div>
                                        )}
                                        {registration.customData.jumlahTanggunganAyah && (
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Jumlah Tanggungan Ayah</p>
                                                <p className="font-medium text-gray-900">{registration.customData.jumlahTanggunganAyah}</p>
                                            </div>
                                        )}
                                        {registration.customData.ttlIbu && (
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">TTL Ibu</p>
                                                <p className="font-medium text-gray-900">{registration.customData.ttlIbu}</p>
                                            </div>
                                        )}
                                        {registration.customData.kewarganegaraanIbu && (
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Kewarganegaraan Ibu</p>
                                                <p className="font-medium text-gray-900">{registration.customData.kewarganegaraanIbu}</p>
                                            </div>
                                        )}
                                        {registration.customData.alamatIbu && (
                                            <div className="sm:col-span-2">
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Alamat Ibu</p>
                                                <p className="font-medium text-gray-900">{registration.customData.alamatIbu}</p>
                                            </div>
                                        )}
                                        {registration.customData.jumlahTanggunganIbu && (
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Jumlah Tanggungan Ibu</p>
                                                <p className="font-medium text-gray-900">{registration.customData.jumlahTanggunganIbu}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="bg-white rounded-xl border p-6">
                        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Phone className="w-5 h-5 text-emerald-600" />
                            Data Orang Tua / Wali
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {/* Data Ayah */}
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Nama Ayah</p>
                                <p className="font-medium text-gray-900">{registration.namaAyah || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Nama Ibu</p>
                                <p className="font-medium text-gray-900">{registration.namaIbu || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Pekerjaan Ayah</p>
                                <p className="font-medium text-gray-900">{registration.pekerjaanAyah || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Pekerjaan Ibu</p>
                                <p className="font-medium text-gray-900">{registration.pekerjaanIbu || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Penghasilan Ayah</p>
                                <p className="font-medium text-gray-900">{registration.penghasilanAyah || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Penghasilan Ibu</p>
                                <p className="font-medium text-gray-900">{registration.penghasilanIbu || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Pendidikan Ayah</p>
                                <p className="font-medium text-gray-900">{registration.pendidikanAyah || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Pendidikan Ibu</p>
                                <p className="font-medium text-gray-900">{registration.pendidikanIbu || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Anak Ke</p>
                                <p className="font-medium text-gray-900">{registration.anakKe || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Dari Bersaudara</p>
                                <p className="font-medium text-gray-900">{registration.dariSaudara || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Jumlah Tanggungan</p>
                                <p className="font-medium text-gray-900">{registration.jumlahTanggungan || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">No. WA Ibu</p>
                                <p className="font-medium text-gray-900">
                                    {registration.noWaIbu ? (
                                        <a href={`https://wa.me/${registration.noWaIbu.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                                            {registration.noWaIbu}
                                        </a>
                                    ) : '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">No. WA Ayah</p>
                                <p className="font-medium text-gray-900">
                                    {registration.noWaAyah ? (
                                        <a href={`https://wa.me/${registration.noWaAyah.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                                            {registration.noWaAyah}
                                        </a>
                                    ) : '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Email Orang Tua</p>
                                <p className="font-medium text-gray-900">
                                    {registration.emailOrangTua ? (
                                        <a href={`mailto:${registration.emailOrangTua}`} className="text-emerald-600 hover:underline">
                                            {registration.emailOrangTua}
                                        </a>
                                    ) : '-'}
                                </p>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Alamat Rumah Orang Tua</p>
                                <p className="font-medium text-gray-900">{registration.alamatLengkap}</p>
                            </div>
                        </div>
                    </div>

                    {/* Unit Pendidikan */}
                    <div className="bg-white rounded-xl border p-6">
                        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <School className="w-5 h-5 text-emerald-600" />
                            Unit Pendidikan
                        </h2>

                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <School className="w-8 h-8 text-emerald-600" />
                            </div>
                            <div>
                                <p className="font-bold text-lg text-gray-900">{registration.unit.name}</p>
                                <p className="text-gray-500">/{registration.unit.slug}</p>
                            </div>
                        </div>

                        {/* Info Tambahan Unit (Grade & Jenis Santri) */}
                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Grade</p>
                                <p className="font-medium text-gray-900">
                                    {registration.grade ? `Grade ${registration.grade}` : '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Jenis Santri</p>
                                <p className="font-medium text-gray-900">
                                    {registration.jenisSantri || '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dokumen */}
                    <div className="bg-white rounded-xl border p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-emerald-600" />
                                Berkas Pendaftaran
                            </h2>
                            {registration.driveFolderUrl && !registration.driveFolderUrl.startsWith('/') ? (
                                <a
                                    href={registration.driveFolderUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    {registration.driveFolderUrl.includes('supabase')
                                        ? 'Buka di Supabase Storage'
                                        : 'Buka di Google Drive'}
                                </a>
                            ) : registration.driveFolderUrl?.startsWith('/') ? (
                                <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                                    <FileText className="w-4 h-4" />
                                    Disimpan Lokal
                                </span>
                            ) : registration.documents.length > 0 ? (
                                <span className="inline-flex items-center gap-2 text-sm text-emerald-600">
                                    <CheckCircle2 className="w-4 h-4" />
                                    {registration.documents.length} dokumen
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-2 text-sm text-amber-600">
                                    <Clock className="w-4 h-4" />
                                    Menunggu Upload...
                                </span>
                            )}
                        </div>

                        {registration.documents.length > 0 ? (
                            <div className="space-y-3">
                                {registration.documents.map((doc: PSBDocument) => (
                                    <div
                                        key={doc.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-lg border flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{doc.documentType.replace(/_/g, ' ')}</p>
                                                <p className="text-sm text-gray-500">{doc.fileName}</p>
                                            </div>
                                        </div>
                                        {doc.driveFileUrl && !doc.driveFileUrl.startsWith('/') ? (
                                            <a
                                                href={doc.driveFileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                Lihat
                                            </a>
                                        ) : doc.driveFileUrl?.startsWith('/') ? (
                                            <a
                                                href={doc.driveFileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                Lihat (Lokal)
                                            </a>
                                        ) : (
                                            <span className="px-3 py-1.5 text-sm text-gray-400">
                                                Belum tersedia
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>Belum ada dokumen yang diupload</p>
                                <p className="text-sm">Gunakan form upload di sebelah kanan untuk menambah dokumen</p>
                            </div>
                        )}
                    </div>

                    {/* Metadata */}
                    <div className="bg-white rounded-xl border p-6">
                        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-emerald-600" />
                            Informasi Pendaftaran
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Tanggal Daftar</p>
                                <p className="font-medium text-gray-900">
                                    {new Date(registration.createdAt).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        timeZone: 'Asia/Jakarta'
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Terakhir Diupdate</p>
                                <p className="font-medium text-gray-900">
                                    {new Date(registration.updatedAt).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        timeZone: 'Asia/Jakarta'
                                    })}
                                </p>
                            </div>
                        </div>

                        {registration.notes && (
                            <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                                <p className="text-xs text-amber-700 uppercase tracking-wide mb-1">Catatan Admin</p>
                                <p className="text-amber-900">{registration.notes}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar - Actions */}
                <div className="lg:col-span-1">
                    <PSBDetailActions
                        registrationId={registration.id}
                        currentStatus={registration.status}
                        notes={registration.notes}
                        driveFolderId={registration.driveFolderId}
                        driveFolderUrl={registration.driveFolderUrl}
                    />
                </div>
            </div>
        </div>
    );
}
