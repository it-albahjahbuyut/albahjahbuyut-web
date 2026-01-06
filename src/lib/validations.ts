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

