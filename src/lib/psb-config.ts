// Konfigurasi formulir PSB per unit/divisi
// Bisa dikembangkan lebih lanjut untuk field yang berbeda-beda per unit

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'date' | 'select' | 'textarea' | 'email' | 'tel';
    placeholder?: string;
    required: boolean;
    options?: { value: string; label: string }[];
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

// Field formulir standar (sama untuk semua unit)
export const STANDARD_FORM_FIELDS: FormField[] = [
    {
        name: 'namaLengkap',
        label: 'Nama Lengkap',
        type: 'text',
        placeholder: 'Masukkan nama lengkap sesuai akta kelahiran',
        required: true,
    },
    {
        name: 'tempatLahir',
        label: 'Tempat Lahir',
        type: 'text',
        placeholder: 'Contoh: Jakarta',
        required: true,
    },
    {
        name: 'tanggalLahir',
        label: 'Tanggal Lahir',
        type: 'date',
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
        name: 'alamatLengkap',
        label: 'Alamat Lengkap',
        type: 'textarea',
        placeholder: 'Masukkan alamat lengkap termasuk RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten',
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
        name: 'asalSekolah',
        label: 'Asal Sekolah',
        type: 'text',
        placeholder: 'Nama sekolah asal',
        required: true,
    },
    {
        name: 'namaOrangTua',
        label: 'Nama Orang Tua / Wali',
        type: 'text',
        placeholder: 'Nama lengkap orang tua atau wali',
        required: true,
    },
    {
        name: 'noHpOrangTua',
        label: 'No. HP Orang Tua / Wali',
        type: 'tel',
        placeholder: 'Contoh: 08123456789',
        required: true,
    },
    {
        name: 'emailOrangTua',
        label: 'Email Orang Tua / Wali',
        type: 'email',
        placeholder: 'email@example.com',
        required: false,
    },
];

// Dokumen standar untuk SMP
export const SMP_DOCUMENTS: DocumentRequirement[] = [
    {
        type: 'IJAZAH_SD',
        label: 'Ijazah SD / Sederajat',
        description: 'Upload scan ijazah SD atau Surat Keterangan Lulus',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: true,
    },
    {
        type: 'AKTA_KELAHIRAN',
        label: 'Akta Kelahiran',
        description: 'Upload scan akta kelahiran',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: true,
    },
    {
        type: 'KARTU_KELUARGA',
        label: 'Kartu Keluarga',
        description: 'Upload scan Kartu Keluarga',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: true,
    },
    {
        type: 'PAS_FOTO',
        label: 'Pas Foto 3x4',
        description: 'Upload pas foto ukuran 3x4 dengan latar belakang merah',
        acceptedFormats: ['.jpg', '.jpeg', '.png'],
        maxSizeMB: 2,
        required: true,
    },
    {
        type: 'KTP_ORTU',
        label: 'KTP Orang Tua / Wali',
        description: 'Upload scan KTP orang tua atau wali',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: true,
    },
];

// Dokumen standar untuk SMA
export const SMA_DOCUMENTS: DocumentRequirement[] = [
    {
        type: 'IJAZAH_SMP',
        label: 'Ijazah SMP / Sederajat',
        description: 'Upload scan ijazah SMP atau Surat Keterangan Lulus',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: true,
    },
    {
        type: 'AKTA_KELAHIRAN',
        label: 'Akta Kelahiran',
        description: 'Upload scan akta kelahiran',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: true,
    },
    {
        type: 'KARTU_KELUARGA',
        label: 'Kartu Keluarga',
        description: 'Upload scan Kartu Keluarga',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: true,
    },
    {
        type: 'PAS_FOTO',
        label: 'Pas Foto 3x4',
        description: 'Upload pas foto ukuran 3x4 dengan latar belakang merah',
        acceptedFormats: ['.jpg', '.jpeg', '.png'],
        maxSizeMB: 2,
        required: true,
    },
    {
        type: 'KTP_ORTU',
        label: 'KTP Orang Tua / Wali',
        description: 'Upload scan KTP orang tua atau wali',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: true,
    },
];

// Dokumen untuk program Tahfidz/Tafaqquh (sama dengan SMP/SMA tergantung jenjang)
export const PESANTREN_DOCUMENTS: DocumentRequirement[] = [
    {
        type: 'IJAZAH',
        label: 'Ijazah Terakhir',
        description: 'Upload scan ijazah terakhir (SD/SMP/SMA) atau Surat Keterangan Lulus',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: true,
    },
    {
        type: 'AKTA_KELAHIRAN',
        label: 'Akta Kelahiran',
        description: 'Upload scan akta kelahiran',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: true,
    },
    {
        type: 'KARTU_KELUARGA',
        label: 'Kartu Keluarga',
        description: 'Upload scan Kartu Keluarga',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: true,
    },
    {
        type: 'PAS_FOTO',
        label: 'Pas Foto 3x4',
        description: 'Upload pas foto ukuran 3x4 dengan latar belakang merah',
        acceptedFormats: ['.jpg', '.jpeg', '.png'],
        maxSizeMB: 2,
        required: true,
    },
    {
        type: 'KTP_ORTU',
        label: 'KTP Orang Tua / Wali',
        description: 'Upload scan KTP orang tua atau wali',
        acceptedFormats: ['.pdf', '.jpg', '.jpeg', '.png'],
        maxSizeMB: 5,
        required: true,
    },
];

// Fungsi untuk mendapatkan konfigurasi berdasarkan slug unit
export function getFormConfig(unitSlug: string): { fields: FormField[]; documents: DocumentRequirement[] } {
    const slug = unitSlug.toLowerCase();

    // Field sama untuk semua unit
    const fields = STANDARD_FORM_FIELDS;

    // Dokumen berbeda berdasarkan unit
    let documents: DocumentRequirement[];

    if (slug.includes('smp')) {
        documents = SMP_DOCUMENTS;
    } else if (slug.includes('sma')) {
        documents = SMA_DOCUMENTS;
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
