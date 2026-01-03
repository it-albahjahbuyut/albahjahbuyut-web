import { z } from "zod";

// Auth Schemas
export const loginSchema = z.object({
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Unit Schemas
export const unitSchema = z.object({
    name: z.string().min(1, "Nama unit diperlukan"),
    slug: z.string().min(1, "Slug diperlukan"),
    description: z.string().optional(),
    curriculum: z.string().optional(),
    facilities: z.string().optional(),
    registrationLink: z.string().url("Link tidak valid").optional().or(z.literal("")),
    image: z.string().optional(),
    isActive: z.boolean().default(true),
    order: z.number().default(0),
});

export type UnitInput = z.infer<typeof unitSchema>;

// Post Schemas
export const postSchema = z.object({
    title: z.string().min(1, "Judul diperlukan"),
    slug: z.string().min(1, "Slug diperlukan"),
    content: z.string().min(1, "Konten diperlukan"),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    category: z.enum(["BERITA", "PENGUMUMAN", "KEGIATAN", "PRESTASI", "ARTIKEL"]),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
    featured: z.boolean(),
    unitId: z.string().optional(),
});

export type PostInput = z.infer<typeof postSchema>;

// Donation Program Schemas
export const donationSchema = z.object({
    title: z.string().min(1, "Judul diperlukan"),
    slug: z.string().min(1, "Slug diperlukan"),
    description: z.string().min(1, "Deskripsi diperlukan"),
    image: z.string().optional(),
    targetAmount: z.number().positive("Target harus lebih dari 0"),
    currentAmount: z.number().min(0).default(0),
    bankName: z.string().min(1, "Nama bank diperlukan"),
    accountNumber: z.string().min(1, "Nomor rekening diperlukan"),
    accountName: z.string().optional(),
    isActive: z.boolean().default(true),
    endDate: z.date().optional(),
});

export type DonationInput = z.infer<typeof donationSchema>;

// Gallery Schemas
export const gallerySchema = z.object({
    title: z.string().min(1, "Judul diperlukan"),
    description: z.string().optional(),
    imageUrl: z.string().url("URL gambar tidak valid"),
    order: z.number().default(0),
    isActive: z.boolean().default(true),
    unitId: z.string().optional(),
});

export type GalleryInput = z.infer<typeof gallerySchema>;

// Setting Schemas
export const settingSchema = z.object({
    key: z.string().min(1, "Key diperlukan"),
    value: z.string().min(1, "Value diperlukan"),
});

export type SettingInput = z.infer<typeof settingSchema>;
