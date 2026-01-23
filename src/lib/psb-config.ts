// Konfigurasi formulir PSB per unit/divisi
// FORMULIR PENERIMAAN SANTRI BARU TP. 2026/2027

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'date' | 'select' | 'textarea' | 'email' | 'tel' | 'number';
    placeholder?: string;
    required: boolean;
    options?: { value: string; label: string }[];
    fullWidth?: boolean; // For fields that should span full width
}

export interface DocumentRequirement {
    type: string;
    label: string;
    description: string;
    acceptedFormats: string[];
    maxSizeMB: number;
    required: boolean;
}

export interface UnitFormConfig {
    name: string;
    slug: string;
    description: string;
    fields: FormField[];
    documents: DocumentRequirement[];
}

export interface BankInfo {
    bankName: string;
    accountNumber: string;
    accountName: string;
}

// Informasi rekening untuk pembayaran
export const PAYMENT_INFO = {
    SMP: {
        bankName: 'MUAMALAT',
        accountNumber: '7459910020100186',
        accountName: 'SMPIQU AL BAHJAH BUYUT'
    } as BankInfo,
    SMA: {
        bankName: 'MUAMALAT',
        accountNumber: '7459910020100187',
        accountName: 'SMAIQU AL BAHJAH BUYUT'
    } as BankInfo,
    SD: {
        bankName: 'MUAMALAT',
        accountNumber: '7459910020100186',
        accountName: 'SDIQU AL BAHJAH BUYUT'
    } as BankInfo,
    DEFAULT: {
        bankName: 'MUAMALAT',
        accountNumber: '7459910020100186',
        accountName: 'AL BAHJAH BUYUT'
    } as BankInfo,
};

// Fungsi untuk mendapatkan info bank berdasarkan unit
export function getPaymentInfo(unitSlug: string): BankInfo {
    const slug = unitSlug.toLowerCase();
    if (slug.includes('sma')) {
        return PAYMENT_INFO.SMA;
    } else if (slug.includes('smp')) {
        return PAYMENT_INFO.SMP;
    } else if (slug.includes('sd')) {
        return PAYMENT_INFO.SD;
    }
    return PAYMENT_INFO.DEFAULT;
}

// Opsi Pekerjaan 
const PEKERJAAN_OPTIONS = [
    { value: 'PNS', label: 'PNS' },
    { value: 'TNI/POLRI', label: 'TNI/POLRI' },
    { value: 'Pegawai Swasta', label: 'Pegawai Swasta' },
    { value: 'Wiraswasta', label: 'Wiraswasta' },
    { value: 'Petani', label: 'Petani' },
    { value: 'Nelayan', label: 'Nelayan' },
    { value: 'Buruh', label: 'Buruh' },
    { value: 'Guru/Dosen', label: 'Guru/Dosen' },
    { value: 'Dokter/Tenaga Medis', label: 'Dokter/Tenaga Medis' },
    { value: 'Pedagang', label: 'Pedagang' },
    { value: 'Ibu Rumah Tangga', label: 'Ibu Rumah Tangga' },
    { value: 'Tidak Bekerja', label: 'Tidak Bekerja' },
    { value: 'Lainnya', label: 'Lainnya' },
];

// Opsi Penghasilan
const PENGHASILAN_OPTIONS = [
    { value: '< 1 Juta', label: '< Rp 1.000.000' },
    { value: '1-3 Juta', label: 'Rp 1.000.000 - Rp 3.000.000' },
    { value: '3-5 Juta', label: 'Rp 3.000.000 - Rp 5.000.000' },
    { value: '5-10 Juta', label: 'Rp 5.000.000 - Rp 10.000.000' },
    { value: '> 10 Juta', label: '> Rp 10.000.000' },
];

// Opsi Pendidikan
const PENDIDIKAN_OPTIONS = [
    { value: 'SD/Sederajat', label: 'SD/Sederajat' },
    { value: 'SMP/Sederajat', label: 'SMP/Sederajat' },
    { value: 'SMA/Sederajat', label: 'SMA/Sederajat' },
    { value: 'D1/D2/D3', label: 'D1/D2/D3' },
    { value: 'S1', label: 'S1' },
    { value: 'S2', label: 'S2' },
    { value: 'S3', label: 'S3' },
];

// Opsi Sumber Info
const SUMBER_INFO_OPTIONS = [
    { value: 'Instagram', label: 'Instagram' },
    { value: 'Facebook', label: 'Facebook' },
    { value: 'TikTok', label: 'TikTok' },
    { value: 'YouTube', label: 'YouTube' },
    { value: 'Website', label: 'Website' },
    { value: 'Teman/Keluarga', label: 'Teman/Keluarga' },
    { value: 'Alumni', label: 'Alumni' },
    { value: 'Brosur/Pamflet', label: 'Brosur/Pamflet' },
    { value: 'Lainnya', label: 'Lainnya' },
];

// Opsi Grade
const GRADE_OPTIONS = [
    { value: 'A', label: 'Grade A - Reguler' },
    { value: 'B', label: 'Grade B - Beasiswa' },
];

// Opsi Jenis Santri
const JENIS_SANTRI_OPTIONS = [
    { value: 'Umum', label: 'Santri Umum (Baru)' },
    { value: 'Lanjutan', label: 'Santri Lanjutan (Dari Al-Bahjah)' },
];

// Field formulir standar sesuai FORMULIR PENERIMAAN SANTRI BARU TP. 2026/2027
export const STANDARD_FORM_FIELDS: FormField[] = [
    // Program Spesial - Grade & Jenis Santri
    {
        name: 'grade',
        label: 'Pilih Grade',
        type: 'select',
        required: true,
        options: GRADE_OPTIONS,
    },
    {
        name: 'jenisSantri',
        label: 'Jenis Santri',
        type: 'select',
        required: true,
        options: JENIS_SANTRI_OPTIONS,
    },
    // Data Santri
    {
        name: 'namaLengkap',
        label: 'Nama Lengkap',
        type: 'text',
        placeholder: 'Masukkan nama lengkap sesuai akta kelahiran',
        required: true,
    },
    {
        name: 'nisn',
        label: 'NISN (Nomor Induk Siswa Nasional)',
        type: 'text',
        placeholder: '10 digit NISN',
        required: false,
    },
    {
        name: 'nik',
        label: 'NIK (Nomor Induk Kependudukan)',
        type: 'text',
        placeholder: '16 digit NIK',
        required: true,
    },
    {
        name: 'noKK',
        label: 'No. KK (Kartu Keluarga)',
        type: 'text',
        placeholder: '16 digit Nomor Kartu Keluarga',
        required: true,
    },
    {
        name: 'jenisKelamin',
        label: 'Jenis Kelamin',
        type: 'select',
        required: true,
        options: [
            { value: 'L', label: 'Laki-laki' },
            { value: 'P', label: 'Perempuan' },
        ],
    },
    {
        name: 'tempatLahir',
        label: 'Tempat Lahir',
        type: 'text',
        placeholder: 'Contoh: Cirebon',
        required: true,
    },
    {
        name: 'tanggalLahir',
        label: 'Tanggal Lahir',
        type: 'date',
        required: true,
    },
    {
        name: 'asalSekolah',
        label: 'Asal Sekolah',
        type: 'text',
        placeholder: 'Nama sekolah asal',
        required: true,
    },
    {
        name: 'alamatSekolahAsal',
        label: 'Alamat Sekolah Asal',
        type: 'textarea',
        placeholder: 'Masukkan alamat lengkap sekolah asal',
        required: true,
        fullWidth: true,
    },

    // Data Orang Tua - Ayah
    {
        name: 'namaAyah',
        label: 'Nama Ayah',
        type: 'text',
        placeholder: 'Nama lengkap ayah',
        required: true,
    },
    {
        name: 'namaIbu',
        label: 'Nama Ibu',
        type: 'text',
        placeholder: 'Nama lengkap ibu',
        required: true,
    },
    {
        name: 'pekerjaanAyah',
        label: 'Pekerjaan Ayah',
        type: 'select',
        required: true,
        options: PEKERJAAN_OPTIONS,
    },
    {
        name: 'pekerjaanIbu',
        label: 'Pekerjaan Ibu',
        type: 'select',
        required: true,
        options: PEKERJAAN_OPTIONS,
    },
    {
        name: 'penghasilanAyah',
        label: 'Penghasilan Ayah',
        type: 'select',
        required: true,
        options: PENGHASILAN_OPTIONS,
    },
    {
        name: 'penghasilanIbu',
        label: 'Penghasilan Ibu',
        type: 'select',
        required: false,
        options: PENGHASILAN_OPTIONS,
    },
    {
        name: 'pendidikanAyah',
        label: 'Pendidikan Ayah',
        type: 'select',
        required: true,
        options: PENDIDIKAN_OPTIONS,
    },
    {
        name: 'pendidikanIbu',
        label: 'Pendidikan Ibu',
        type: 'select',
        required: true,
        options: PENDIDIKAN_OPTIONS,
    },
    {
        name: 'anakKe',
        label: 'Anak ke',
        type: 'number',
        placeholder: 'Contoh: 1',
        required: true,
    },
    {
        name: 'dariSaudara',
        label: 'Dari berapa bersaudara',
        type: 'number',
        placeholder: 'Contoh: 3',
        required: true,
    },
    {
        name: 'jumlahTanggungan',
        label: 'Jumlah Tanggungan Orang Tua',
        type: 'number',
        placeholder: 'Jumlah orang yang menjadi tanggungan',
        required: true,
    },
    {
        name: 'alamatLengkap',
        label: 'Alamat Rumah Orang Tua',
        type: 'textarea',
        placeholder: 'Masukkan alamat lengkap termasuk RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten',
        required: true,
        fullWidth: true,
    },
    {
        name: 'noWaIbu',
        label: 'No. WA Ibu',
        type: 'tel',
        placeholder: 'Contoh: 08123456789',
        required: true,
    },
    {
        name: 'noWaAyah',
        label: 'No. WA Ayah',
        type: 'tel',
        placeholder: 'Contoh: 08123456789',
        required: false,
    },
    {
        name: 'emailOrangTua',
        label: 'Email Orang Tua (Opsional)',
        type: 'email',
        placeholder: 'contoh@email.com',
        required: false,
    },
    {
        name: 'sumberInfo',
        label: 'Tau Al Bahjah Buyut dari mana?',
        type: 'select',
        required: true,
        options: SUMBER_INFO_OPTIONS,
    },
];

// Fields khusus untuk SMP/SMA (pilihan jenjang)
export const JENJANG_FIELD: FormField = {
    name: 'daftarKe',
    label: 'Daftar ke',
    type: 'select',
    required: true,
    options: [
        { value: 'SMP', label: 'SMP' },
        { value: 'SMA', label: 'SMA' },
    ],
};

// Dokumen standar untuk SMP
export const SMP_DOCUMENTS: DocumentRequirement[] = [
    {
        type: 'PAS_FOTO',
        label: 'Pas Foto 3x4',
        description: 'Upload pas foto ukuran 3x4 (Wajib untuk Kartu Peserta)',
        acceptedFormats: ['.jpg', '.jpeg', '.png'],
        maxSizeMB: 2,
        required: true,
    },
    {
        type: 'KARTU_KELUARGA',
        label: 'Kartu Keluarga (KK)',
        description: 'Upload scan Kartu Keluarga',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: false,
    },
    {
        type: 'AKTA_KELAHIRAN',
        label: 'Akta Kelahiran',
        description: 'Upload scan Akta Kelahiran',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: false,
    },
    {
        type: 'KTP_ORTU',
        label: 'KTP Orang Tua',
        description: 'Upload scan KTP Orang Tua (Ayah & Ibu) - Opsional',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: false,
    },
    {
        type: 'IJAZAH_SD',
        label: 'Ijazah SD / Sederajat',
        description: 'Upload scan ijazah SD atau Surat Keterangan Lulus - Opsional (Bisa menyusul)',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: false,
    },
    {
        type: 'BUKTI_PEMBAYARAN',
        label: 'Bukti Pembayaran',
        description: 'Upload bukti transfer biaya pendaftaran',
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.pdf'],
        maxSizeMB: 2,
        required: false,
    },
];

// Dokumen standar untuk SMA
export const SMA_DOCUMENTS: DocumentRequirement[] = [
    {
        type: 'PAS_FOTO',
        label: 'Pas Foto 3x4',
        description: 'Upload pas foto ukuran 3x4 (Wajib untuk Kartu Peserta)',
        acceptedFormats: ['.jpg', '.jpeg', '.png'],
        maxSizeMB: 2,
        required: true,
    },
    {
        type: 'KARTU_KELUARGA',
        label: 'Kartu Keluarga (KK)',
        description: 'Upload scan Kartu Keluarga',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: false,
    },
    {
        type: 'AKTA_KELAHIRAN',
        label: 'Akta Kelahiran',
        description: 'Upload scan Akta Kelahiran',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: false,
    },
    {
        type: 'KTP_ORTU',
        label: 'KTP Orang Tua',
        description: 'Upload scan KTP Orang Tua (Ayah & Ibu) - Opsional',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: false,
    },
    {
        type: 'IJAZAH_SMP',
        label: 'Ijazah SMP / Sederajat',
        description: 'Upload scan ijazah SMP atau Surat Keterangan Lulus - Opsional (Bisa menyusul)',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: false,
    },
    {
        type: 'BUKTI_PEMBAYARAN',
        label: 'Bukti Pembayaran',
        description: 'Upload bukti transfer biaya pendaftaran',
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.pdf'],
        maxSizeMB: 2,
        required: false,
    },
];

// Dokumen untuk program Tahfidz/Tafaqquh (sama dengan SMP/SMA tergantung jenjang)
export const PESANTREN_DOCUMENTS: DocumentRequirement[] = [
    {
        type: 'PAS_FOTO',
        label: 'Pas Foto 3x4',
        description: 'Upload pas foto ukuran 3x4 (Wajib untuk Kartu Peserta)',
        acceptedFormats: ['.jpg', '.jpeg', '.png'],
        maxSizeMB: 2,
        required: true,
    },
    {
        type: 'KARTU_KELUARGA',
        label: 'Kartu Keluarga (KK)',
        description: 'Upload scan Kartu Keluarga',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: false,
    },
    {
        type: 'AKTA_KELAHIRAN',
        label: 'Akta Kelahiran',
        description: 'Upload scan Akta Kelahiran',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: false,
    },
    {
        type: 'KTP_ORTU',
        label: 'KTP Orang Tua',
        description: 'Upload scan KTP Orang Tua - Opsional',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: false,
    },
    {
        type: 'IJAZAH',
        label: 'Ijazah Terakhir',
        description: 'Upload scan ijazah terakhir - Opsional (Bisa menyusul)',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: false,
    },
    {
        type: 'BUKTI_PEMBAYARAN',
        label: 'Bukti Pembayaran',
        description: 'Upload bukti transfer biaya pendaftaran',
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.pdf'],
        maxSizeMB: 2,
        required: false,
    },
];

// Dokumen standar untuk SD
export const SD_DOCUMENTS: DocumentRequirement[] = [
    {
        type: 'PAS_FOTO',
        label: 'Pas Foto 3x4',
        description: 'Upload pas foto ukuran 3x4 (Wajib untuk Kartu Peserta)',
        acceptedFormats: ['.jpg', '.jpeg', '.png'],
        maxSizeMB: 2,
        required: true,
    },
    {
        type: 'KARTU_KELUARGA',
        label: 'Kartu Keluarga (KK)',
        description: 'Upload scan Kartu Keluarga',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: false,
    },
    {
        type: 'AKTA_KELAHIRAN',
        label: 'Akta Kelahiran',
        description: 'Upload scan Akta Kelahiran',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: false,
    },
    {
        type: 'KTP_ORTU',
        label: 'KTP Orang Tua',
        description: 'Upload scan KTP Orang Tua (Ayah & Ibu) - Opsional',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: false,
    },
    {
        type: 'IJAZAH_TK',
        label: 'Ijazah TK / PAUD (Jika Ada)',
        description: 'Upload scan ijazah TK atau Surat Keterangan Lulus - Opsional (Bisa menyusul)',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: false,
    },
    {
        type: 'BUKTI_PEMBAYARAN',
        label: 'Bukti Pembayaran',
        description: 'Upload bukti transfer biaya pendaftaran',
        acceptedFormats: ['.jpg', '.jpeg', '.png', '.pdf'],
        maxSizeMB: 2,
        required: false,
    },
];

// Fungsi untuk mendapatkan konfigurasi berdasarkan slug unit
export function getFormConfig(unitSlug: string): { fields: FormField[]; documents: DocumentRequirement[] } {
    const slug = unitSlug.toLowerCase();

    // Field sama untuk semua unit
    const fields = [...STANDARD_FORM_FIELDS];

    // Dokumen berbeda berdasarkan unit
    let documents: DocumentRequirement[];

    if (slug.includes('smp')) {
        documents = SMP_DOCUMENTS;
    } else if (slug.includes('sma')) {
        documents = SMA_DOCUMENTS;
    } else if (slug.includes('sd')) {
        documents = SD_DOCUMENTS;
    } else {
        // Tahfidz, Tafaqquh, atau unit lainnya
        documents = PESANTREN_DOCUMENTS;
    }

    return { fields, documents };
}

// Fungsi untuk generate nomor pendaftaran
export function generateRegistrationNumber(unitSlug: string): string {
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const unitCode = unitSlug.slice(0, 3).toUpperCase();

    return `PSB${year}${month}${unitCode}${random}`;
}
