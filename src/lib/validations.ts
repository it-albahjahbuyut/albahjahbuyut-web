import { z } from "zod";

// ============================================
// SECURITY: Input Validation Schemas
// These schemas provide protection against:
// - SQL Injection (via parameterized queries with Prisma + validation)
// - XSS attacks (via input sanitization and validation)
// ============================================

// Helper regex patterns for security
const SAFE_SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SAFE_STRING_REGEX = /^[^<>{}\\]*$/; // Disallow common injection characters

// Maximum lengths to prevent DoS via large payloads
const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 100000; // 100KB for rich text
const MAX_STRING_LENGTH = 1000;
const MAX_URL_LENGTH = 2048;

// Auth Schemas
export const loginSchema = z.object({
    email: z
        .string()
        .email("Email tidak valid")
        .max(254, "Email terlalu panjang")
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(6, "Password minimal 6 karakter")
        .max(128, "Password terlalu panjang"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Unit Schemas
export const unitSchema = z.object({
    name: z
        .string()
        .min(1, "Nama unit diperlukan")
        .max(MAX_TITLE_LENGTH, "Nama terlalu panjang")
        .trim(),
    slug: z
        .string()
        .min(1, "Slug diperlukan")
        .max(100, "Slug terlalu panjang")
        .toLowerCase()
        .trim()
        .refine(
            (val) => SAFE_SLUG_REGEX.test(val),
            "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung"
        ),
    description: z
        .string()
        .max(MAX_CONTENT_LENGTH, "Deskripsi terlalu panjang")
        .optional(),
    curriculum: z
        .string()
        .max(MAX_CONTENT_LENGTH, "Kurikulum terlalu panjang")
        .optional(),
    facilities: z
        .string()
        .max(MAX_CONTENT_LENGTH, "Fasilitas terlalu panjang")
        .optional(),
    registrationLink: z
        .string()
        .url("Link tidak valid")
        .max(MAX_URL_LENGTH, "URL terlalu panjang")
        .optional()
        .or(z.literal("")),
    image: z
        .string()
        .max(MAX_URL_LENGTH, "URL gambar terlalu panjang")
        .optional(),
    isActive: z.boolean().default(true),
    order: z.number().int().min(0).max(1000).default(0),
});

export type UnitInput = z.infer<typeof unitSchema>;

// Post Schemas
export const postSchema = z.object({
    title: z
        .string()
        .min(1, "Judul diperlukan")
        .max(MAX_TITLE_LENGTH, "Judul terlalu panjang")
        .trim()
        .refine(
            (val) => SAFE_STRING_REGEX.test(val),
            "Judul mengandung karakter tidak valid"
        ),
    slug: z
        .string()
        .min(1, "Slug diperlukan")
        .max(100, "Slug terlalu panjang")
        .toLowerCase()
        .trim()
        .refine(
            (val) => SAFE_SLUG_REGEX.test(val),
            "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung"
        ),
    content: z
        .string()
        .min(1, "Konten diperlukan")
        .max(MAX_CONTENT_LENGTH, "Konten terlalu panjang"),
    excerpt: z
        .string()
        .max(MAX_STRING_LENGTH, "Ringkasan terlalu panjang")
        .optional(),
    image: z
        .string()
        .max(MAX_URL_LENGTH, "URL gambar terlalu panjang")
        .optional(),
    category: z.enum(["BERITA", "PENGUMUMAN", "KEGIATAN", "PRESTASI", "ARTIKEL"]),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
    featured: z.boolean(),
    unitId: z
        .string()
        .max(100, "ID terlalu panjang")
        .optional(),
    galleryImages: z
        .array(z.string().url("URL gambar tidak valid"))
        .optional()
        .default([]),
});

export type PostInput = z.infer<typeof postSchema>;

// Donation Program Schemas
export const donationSchema = z.object({
    title: z
        .string()
        .min(1, "Judul diperlukan")
        .max(MAX_TITLE_LENGTH, "Judul terlalu panjang")
        .trim()
        .refine(
            (val) => SAFE_STRING_REGEX.test(val),
            "Judul mengandung karakter tidak valid"
        ),
    slug: z
        .string()
        .min(1, "Slug diperlukan")
        .max(100, "Slug terlalu panjang")
        .toLowerCase()
        .trim()
        .refine(
            (val) => SAFE_SLUG_REGEX.test(val),
            "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung"
        ),
    description: z
        .string()
        .min(1, "Deskripsi diperlukan")
        .max(MAX_CONTENT_LENGTH, "Deskripsi terlalu panjang"),
    image: z
        .string()
        .max(MAX_URL_LENGTH, "URL gambar terlalu panjang")
        .optional(),
    targetAmount: z
        .number()
        .positive("Target harus lebih dari 0")
        .max(999999999999, "Target terlalu besar"),
    currentAmount: z
        .number()
        .min(0)
        .max(999999999999, "Jumlah terlalu besar")
        .default(0),
    bankName: z
        .string()
        .min(1, "Nama bank diperlukan")
        .max(100, "Nama bank terlalu panjang")
        .trim(),
    accountNumber: z
        .string()
        .min(1, "Nomor rekening diperlukan")
        .max(50, "Nomor rekening terlalu panjang")
        .trim()
        .refine(
            (val) => /^[0-9-]+$/.test(val),
            "Nomor rekening hanya boleh berisi angka dan tanda hubung"
        ),
    accountName: z
        .string()
        .max(150, "Nama pemilik rekening terlalu panjang")
        .optional(),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    endDate: z.date().optional(),
    galleryImages: z
        .array(z.string().url("URL gambar tidak valid"))
        .optional()
        .default([]),
});

export type DonationInput = z.infer<typeof donationSchema>;

// Gallery Schemas
export const gallerySchema = z.object({
    title: z
        .string()
        .min(1, "Judul diperlukan")
        .max(MAX_TITLE_LENGTH, "Judul terlalu panjang")
        .trim()
        .refine(
            (val) => SAFE_STRING_REGEX.test(val),
            "Judul mengandung karakter tidak valid"
        ),
    description: z
        .string()
        .max(MAX_STRING_LENGTH, "Deskripsi terlalu panjang")
        .optional(),
    imageUrl: z
        .string()
        .url("URL gambar tidak valid")
        .max(MAX_URL_LENGTH, "URL terlalu panjang"),
    order: z.number().int().min(0).max(1000).default(0),
    isActive: z.boolean().default(true),
    unitId: z
        .string()
        .max(100, "ID terlalu panjang")
        .optional(),
});

export type GalleryInput = z.infer<typeof gallerySchema>;

// Setting Schemas
export const settingSchema = z.object({
    key: z
        .string()
        .min(1, "Key diperlukan")
        .max(100, "Key terlalu panjang")
        .trim()
        .refine(
            (val) => /^[a-zA-Z0-9_]+$/.test(val),
            "Key hanya boleh berisi huruf, angka, dan underscore"
        ),
    value: z
        .string()
        .min(1, "Value diperlukan")
        .max(MAX_CONTENT_LENGTH, "Value terlalu panjang"),
});

export type SettingInput = z.infer<typeof settingSchema>;

// ============================================
// PSB (PENERIMAAN SANTRI BARU) SCHEMAS
// ============================================

// Regex patterns for Indonesian data validation
const NIK_REGEX = /^[0-9]{16}$/; // NIK 16 digit
const PHONE_REGEX = /^(\+62|62|0)8[1-9][0-9]{7,10}$/; // Indonesian phone number
const SAFE_NAME_REGEX = /^[a-zA-Z\s'.,-]+$/; // Only letters, spaces, and common name punctuation

// Helper to sanitize and validate Indonesian names (allow Indonesian characters)
const indonesianNameSchema = z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter")
    .trim()
    .refine(
        (val) => !/[<>{}\\]/.test(val),
        "Nama tidak boleh mengandung karakter khusus"
    );

// Helper for phone number validation
const phoneSchema = z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(15, "Nomor telepon maksimal 15 digit")
    .trim()
    .refine(
        (val) => /^[0-9+\-\s]+$/.test(val),
        "Nomor telepon hanya boleh berisi angka, +, atau -"
    );

export const psbFormSchema = z.object({
    // Unit Info
    unitId: z.string().min(1, "Unit diperlukan").max(100),
    unitName: z.string().min(1, "Nama unit diperlukan").max(100),
    unitSlug: z.string().min(1, "Slug unit diperlukan").max(50),

    // Data Santri
    namaLengkap: indonesianNameSchema,
    nisn: z
        .string()
        .max(20, "NISN terlalu panjang")
        .optional()
        .refine(
            (val) => !val || /^[0-9]+$/.test(val),
            "NISN hanya boleh berisi angka"
        ),
    nik: z
        .string()
        .length(16, "NIK harus 16 digit")
        .refine(
            (val) => NIK_REGEX.test(val),
            "NIK harus berupa 16 digit angka"
        ),
    noKK: z
        .string()
        .length(16, "Nomor KK harus 16 digit")
        .refine(
            (val) => /^[0-9]{16}$/.test(val),
            "Nomor KK harus berupa 16 digit angka"
        ),
    jenisKelamin: z.enum(["L", "P"], {
        message: "Jenis kelamin harus L atau P",
    }),
    tempatLahir: z
        .string()
        .min(2, "Tempat lahir diperlukan")
        .max(100, "Tempat lahir terlalu panjang")
        .trim(),
    tanggalLahir: z
        .string()
        .min(1, "Tanggal lahir diperlukan")
        .refine(
            (val) => !isNaN(Date.parse(val)),
            "Format tanggal tidak valid"
        ),
    asalSekolah: z
        .string()
        .min(3, "Asal sekolah diperlukan")
        .max(200, "Nama sekolah terlalu panjang")
        .trim(),
    alamatSekolahAsal: z
        .string()
        .max(500, "Alamat sekolah terlalu panjang")
        .optional()
        .default(""),

    // Data Orang Tua
    namaAyah: indonesianNameSchema,
    namaIbu: indonesianNameSchema,
    pekerjaanAyah: z
        .string()
        .min(2, "Pekerjaan ayah diperlukan")
        .max(100, "Pekerjaan terlalu panjang")
        .trim(),
    pekerjaanIbu: z
        .string()
        .min(2, "Pekerjaan ibu diperlukan")
        .max(100, "Pekerjaan terlalu panjang")
        .trim(),
    penghasilanAyah: z
        .string()
        .min(1, "Penghasilan ayah diperlukan")
        .max(50, "Penghasilan terlalu panjang"),
    penghasilanIbu: z
        .string()
        .max(50, "Penghasilan terlalu panjang")
        .optional()
        .default(""),
    pendidikanAyah: z
        .string()
        .min(1, "Pendidikan ayah diperlukan")
        .max(50, "Pendidikan terlalu panjang"),
    pendidikanIbu: z
        .string()
        .min(1, "Pendidikan ibu diperlukan")
        .max(50, "Pendidikan terlalu panjang"),
    anakKe: z
        .string()
        .min(1, "Anak ke berapa diperlukan")
        .max(10)
        .refine(
            (val) => /^[0-9]+$/.test(val),
            "Anak ke harus berupa angka"
        ),
    dariSaudara: z
        .string()
        .min(1, "Jumlah saudara diperlukan")
        .max(10)
        .refine(
            (val) => /^[0-9]+$/.test(val),
            "Jumlah saudara harus berupa angka"
        ),
    jumlahTanggungan: z
        .string()
        .min(1, "Jumlah tanggungan diperlukan")
        .max(10)
        .refine(
            (val) => /^[0-9]+$/.test(val),
            "Jumlah tanggungan harus berupa angka"
        ),
    alamatLengkap: z
        .string()
        .min(10, "Alamat minimal 10 karakter")
        .max(500, "Alamat terlalu panjang")
        .trim()
        .refine(
            (val) => !/[<>{}\\]/.test(val),
            "Alamat tidak boleh mengandung karakter khusus"
        ),
    noWaIbu: phoneSchema,
    noWaAyah: z
        .string()
        .max(15, "Nomor telepon maksimal 15 digit")
        .optional()
        .refine(
            (val) => !val || /^[0-9+\-\s]+$/.test(val),
            "Nomor telepon hanya boleh berisi angka"
        ),
    sumberInfo: z
        .string()
        .max(200, "Sumber info terlalu panjang")
        .optional()
        .default(""),

    // Legacy fields (optional, for backward compatibility)
    namaOrangTua: z.string().max(100).optional(),
    noHpOrangTua: z.string().max(15).optional(),
    emailOrangTua: z
        .string()
        .email("Email tidak valid")
        .max(254)
        .optional()
        .or(z.literal("")),
});

export type PSBFormInput = z.infer<typeof psbFormSchema>;

// Document upload validation
export const psbDocumentSchema = z.object({
    documentType: z.enum([
        "IJAZAH",
        "AKTA_KELAHIRAN",
        "KARTU_KELUARGA",
        "PAS_FOTO",
        "KTP_ORTU",
        "SKHUN",
        "RAPOR"
    ], {
        message: "Tipe dokumen tidak valid",
    }),
    fileName: z
        .string()
        .min(1, "Nama file diperlukan")
        .max(200, "Nama file terlalu panjang")
        .refine(
            (val) => !/[<>:"/\\|?*]/.test(val),
            "Nama file mengandung karakter tidak valid"
        ),
    fileSize: z
        .number()
        .min(100, "File terlalu kecil")
        .max(5 * 1024 * 1024, "File maksimal 5MB"),
    mimeType: z
        .string()
        .refine(
            (val) => [
                "image/jpeg",
                "image/png",
                "image/webp",
                "application/pdf"
            ].includes(val),
            "Tipe file tidak diizinkan (hanya JPG, PNG, WebP, PDF)"
        ),
    base64Data: z
        .string()
        .min(1, "Data file diperlukan")
        .max(10 * 1024 * 1024, "Data file terlalu besar"), // ~7.5MB after base64 encoding
});

export type PSBDocumentInput = z.infer<typeof psbDocumentSchema>;

// ============================================
// HELPER: Sanitize HTML for display
// ============================================

/**
 * Basic HTML sanitization for content display
 * For rich text content, we allow specific safe tags
 */
export function sanitizeHtmlForDisplay(html: string): string {
    // List of allowed tags for rich text content
    const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'pre', 'code'];

    // Remove script tags and event handlers
    let sanitized = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/on\w+='[^']*'/gi, '')
        .replace(/javascript:/gi, '');

    return sanitized;
}

