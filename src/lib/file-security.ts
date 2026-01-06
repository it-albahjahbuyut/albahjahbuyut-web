/**
 * File Upload Security Validation
 * 
 * Validates uploaded files to prevent:
 * - Malicious file uploads
 * - File type spoofing
 * - Oversized files (DoS)
 */

// ============================================
// CONFIGURATION
// ============================================

// Maximum file size (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed image MIME types
export const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/avif',
] as const;

// Allowed image extensions
export const ALLOWED_IMAGE_EXTENSIONS = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.avif',
] as const;

// Dangerous file extensions that should NEVER be allowed
const DANGEROUS_EXTENSIONS = [
    '.exe', '.bat', '.cmd', '.sh', '.php', '.js', '.html',
    '.htm', '.asp', '.aspx', '.jsp', '.cgi', '.pl', '.py',
    '.rb', '.ps1', '.vbs', '.wsf', '.jar', '.war', '.msi',
    '.dll', '.scr', '.com', '.pif', '.application', '.gadget',
    '.msp', '.hta', '.cpl', '.msc', '.inf', '.reg', '.scf',
];

// ============================================
// VALIDATION FUNCTIONS
// ============================================

export interface FileValidationResult {
    valid: boolean;
    error?: string;
}

/**
 * Validate an uploaded image file
 */
export function validateImageFile(file: File): FileValidationResult {
    // Check if file exists
    if (!file) {
        return { valid: false, error: 'Tidak ada file yang diunggah' };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `Ukuran file terlalu besar. Maksimal ${MAX_FILE_SIZE / 1024 / 1024}MB`
        };
    }

    // Check file size minimum (potential empty/corrupted file)
    if (file.size < 100) {
        return { valid: false, error: 'File terlalu kecil atau kosong' };
    }

    // Check MIME type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
        return {
            valid: false,
            error: `Tipe file tidak diizinkan. Gunakan: ${ALLOWED_IMAGE_TYPES.join(', ')}`
        };
    }

    // Check file extension
    const fileName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_IMAGE_EXTENSIONS.some(ext =>
        fileName.endsWith(ext)
    );

    if (!hasValidExtension) {
        return {
            valid: false,
            error: `Ekstensi file tidak diizinkan. Gunakan: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}`
        };
    }

    // Check for dangerous extensions (double extension attack)
    for (const dangerousExt of DANGEROUS_EXTENSIONS) {
        if (fileName.includes(dangerousExt)) {
            return {
                valid: false,
                error: 'File mengandung ekstensi berbahaya'
            };
        }
    }

    // Check filename for suspicious characters
    if (/[<>:"/\\|?*\x00-\x1F]/.test(file.name)) {
        return {
            valid: false,
            error: 'Nama file mengandung karakter tidak valid'
        };
    }

    return { valid: true };
}

/**
 * Validate file URL (for already uploaded files)
 */
export function validateImageUrl(url: string): FileValidationResult {
    if (!url) {
        return { valid: false, error: 'URL tidak boleh kosong' };
    }

    // Check URL length
    if (url.length > 2048) {
        return { valid: false, error: 'URL terlalu panjang' };
    }

    // Check for valid URL format
    try {
        const parsedUrl = new URL(url);

        // Only allow https (except for localhost in development)
        if (parsedUrl.protocol !== 'https:' &&
            !parsedUrl.hostname.includes('localhost')) {
            return { valid: false, error: 'URL harus menggunakan HTTPS' };
        }

        // Check for allowed image hosting domains
        const allowedDomains = [
            'res.cloudinary.com',
            'images.unsplash.com',
            'upload.wikimedia.org',
            'via.placeholder.com',
            'encrypted-tbn0.gstatic.com',
            'localhost',
        ];

        const isAllowedDomain = allowedDomains.some(domain =>
            parsedUrl.hostname.includes(domain)
        );

        if (!isAllowedDomain) {
            return {
                valid: false,
                error: 'Domain gambar tidak diizinkan'
            };
        }

    } catch {
        return { valid: false, error: 'Format URL tidak valid' };
    }

    return { valid: true };
}

/**
 * Sanitize filename for safe storage
 */
export function sanitizeFilename(filename: string): string {
    return filename
        // Remove path components
        .replace(/^.*[\\/]/, '')
        // Replace spaces with underscores
        .replace(/\s+/g, '_')
        // Remove special characters
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
        // Limit length
        .substring(0, 200)
        // Ensure it has a valid extension
        .toLowerCase();
}

/**
 * Generate safe filename with timestamp
 */
export function generateSafeFilename(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';

    return `upload_${timestamp}_${random}.${extension}`;
}
