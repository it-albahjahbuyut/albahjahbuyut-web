import { createClient } from '@supabase/supabase-js';

// Supabase Storage configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const PSB_BUCKET_NAME = 'psb-documents';

// Check if Supabase Storage is configured
export function isSupabaseStorageConfigured(): boolean {
    return !!(SUPABASE_URL && SUPABASE_SERVICE_KEY);
}

// Create Supabase client with service role key for storage operations
function getSupabaseAdmin() {
    if (!isSupabaseStorageConfigured()) {
        throw new Error('Supabase Storage not configured');
    }
    return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}

export interface SupabaseUploadResult {
    fileId: string;
    fileUrl: string;
    fileName: string;
    bucket: string;
    path: string;
}

export interface SupabaseFolderResult {
    folderId: string;
    folderUrl: string;
    bucket: string;
    path: string;
}

/**
 * Ensure PSB bucket exists
 */
async function ensurePSBBucket(): Promise<boolean> {
    try {
        const supabase = getSupabaseAdmin();

        // Check if bucket exists
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some(b => b.name === PSB_BUCKET_NAME);

        if (!bucketExists) {
            // Create the bucket - PUBLIC so files can be accessed directly
            const { error } = await supabase.storage.createBucket(PSB_BUCKET_NAME, {
                public: true, // Public bucket - files accessible via direct URL
                fileSizeLimit: 10 * 1024 * 1024, // 10MB max
                allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
            });

            if (error) {
                console.error('Failed to create PSB bucket:', error);
                return false;
            }
            console.log('Created PSB documents bucket');
        }

        return true;
    } catch (error) {
        console.error('Error ensuring PSB bucket:', error);
        return false;
    }
}

/**
 * Create a "folder" path for registration documents
 * Note: Supabase Storage doesn't have real folders, just path prefixes
 */
export async function createSupabaseFolder(
    unitName: string,
    namaSantri: string,
    registrationNumber: string
): Promise<SupabaseFolderResult> {
    // Ensure bucket exists
    await ensurePSBBucket();

    // Sanitize names for path
    const sanitizedUnit = unitName.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
    const sanitizedName = namaSantri.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');

    // Create path: unit/registration_number_name/
    const folderPath = `${sanitizedUnit}/${registrationNumber}_${sanitizedName}`;

    // For public buckets, use the direct public URL
    // Format: {SUPABASE_URL}/storage/v1/object/public/{bucket}/{path}
    const folderUrl = `${SUPABASE_URL}/storage/v1/object/public/${PSB_BUCKET_NAME}/${folderPath}`;

    return {
        folderId: `supabase_${folderPath}`,
        folderUrl: folderUrl,
        bucket: PSB_BUCKET_NAME,
        path: folderPath
    };
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadToSupabase(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    folderPath: string
): Promise<SupabaseUploadResult> {
    // Ensure bucket exists
    await ensurePSBBucket();

    const supabase = getSupabaseAdmin();

    // Sanitize filename
    const sanitizedFileName = fileName
        .replace(/[<>:"/\\|?*]/g, '_')
        .replace(/[^a-zA-Z0-9._-]/g, '_');

    // Full path in bucket
    const fullPath = `${folderPath}/${sanitizedFileName}`;

    console.log(`Uploading to Supabase Storage: ${fullPath}`);

    // Upload file
    const { data, error } = await supabase.storage
        .from(PSB_BUCKET_NAME)
        .upload(fullPath, fileBuffer, {
            contentType: mimeType,
            upsert: true, // Overwrite if exists
            cacheControl: '3600'
        });

    if (error) {
        console.error('Supabase upload error:', error);
        throw new Error(`Failed to upload to Supabase: ${error.message}`);
    }

    // For public buckets, use direct public URL (no signed URL needed)
    const fileUrl = `${SUPABASE_URL}/storage/v1/object/public/${PSB_BUCKET_NAME}/${fullPath}`;

    console.log(`File uploaded to Supabase: ${data.path}`);

    return {
        fileId: `supabase_${data.path}`,
        fileUrl: fileUrl,
        fileName: sanitizedFileName,
        bucket: PSB_BUCKET_NAME,
        path: data.path
    };
}

/**
 * Get signed URL for a file (refreshes expiration)
 */
export async function getSignedUrl(filePath: string, expiresIn: number = 3600): Promise<string | null> {
    try {
        const supabase = getSupabaseAdmin();

        // Remove 'supabase_' prefix if present
        const cleanPath = filePath.startsWith('supabase_')
            ? filePath.replace('supabase_', '')
            : filePath;

        const { data, error } = await supabase.storage
            .from(PSB_BUCKET_NAME)
            .createSignedUrl(cleanPath, expiresIn);

        if (error) {
            console.error('Error getting signed URL:', error);
            return null;
        }

        return data.signedUrl;
    } catch (error) {
        console.error('Error getting signed URL:', error);
        return null;
    }
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFromSupabase(filePath: string): Promise<boolean> {
    try {
        const supabase = getSupabaseAdmin();

        // Remove 'supabase_' prefix if present
        const cleanPath = filePath.startsWith('supabase_')
            ? filePath.replace('supabase_', '')
            : filePath;

        const { error } = await supabase.storage
            .from(PSB_BUCKET_NAME)
            .remove([cleanPath]);

        if (error) {
            console.error('Error deleting from Supabase:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error deleting from Supabase:', error);
        return false;
    }
}

/**
 * Delete folder (all files with path prefix) from Supabase Storage
 */
export async function deleteSupabaseFolder(folderPath: string): Promise<boolean> {
    try {
        const supabase = getSupabaseAdmin();

        // Remove 'supabase_' prefix if present
        const cleanPath = folderPath.startsWith('supabase_')
            ? folderPath.replace('supabase_', '')
            : folderPath;

        // List all files in the folder
        const { data: files, error: listError } = await supabase.storage
            .from(PSB_BUCKET_NAME)
            .list(cleanPath);

        if (listError) {
            console.error('Error listing folder contents:', listError);
            return false;
        }

        if (files && files.length > 0) {
            // Delete all files in the folder
            const filePaths = files.map(f => `${cleanPath}/${f.name}`);
            const { error: deleteError } = await supabase.storage
                .from(PSB_BUCKET_NAME)
                .remove(filePaths);

            if (deleteError) {
                console.error('Error deleting folder contents:', deleteError);
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error('Error deleting folder from Supabase:', error);
        return false;
    }
}
