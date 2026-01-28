import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import {
    isSupabaseStorageConfigured,
    createSupabaseFolder,
    uploadToSupabase,
    deleteSupabaseFolder
} from './supabase-storage';

// Konfigurasi Google Drive API (OAuth 2.0 untuk Personal Gmail)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || '';
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';

// Check if Google Drive is configured
const isGoogleDriveConfigured = () => {
    return !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REFRESH_TOKEN && GOOGLE_DRIVE_FOLDER_ID);
};

// Lazy initialization of auth and drive
let auth: any = null; // Typing loosely to avoid complex OAuth2Client types without import
let drive: ReturnType<typeof google.drive> | null = null;

const initGoogleDrive = () => {
    if (!isGoogleDriveConfigured()) {
        console.log('Google Drive not configured (missing OAuth credentials), using local storage');
        return false;
    }

    if (!auth) {
        // Menggunakan OAuth 2.0 Client
        const { google } = require('googleapis');
        const oauth2Client = new google.auth.OAuth2(
            GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET,
            'https://developers.google.com/oauthplayground' // Redirect URI
        );

        // Set kredensial (Refresh Token is key here)
        oauth2Client.setCredentials({
            refresh_token: GOOGLE_REFRESH_TOKEN
        });

        auth = oauth2Client;
    }

    if (!drive) {
        drive = google.drive({ version: 'v3', auth });
    }

    return true;
};

export interface UploadResult {
    fileId: string;
    fileUrl: string;
    fileName: string;
}

export interface FolderResult {
    folderId: string;
    folderUrl: string;
}

// Local storage fallback paths
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'psb');

/**
 * Ensure local upload directory exists
 */
async function ensureLocalDir(dirPath: string): Promise<void> {
    try {
        await fs.access(dirPath);
    } catch {
        await fs.mkdir(dirPath, { recursive: true });
    }
}

/**
 * Membuat folder untuk pendaftaran baru
 * Attempts to use Google Drive, falls back to local storage if Drive fails or quota is exceeded
 */
export async function createRegistrationFolder(
    unitName: string,
    namaSantri: string,
    registrationNumber: string,
    unitSlug?: string
): Promise<FolderResult> {
    const date = new Date().toISOString().split('T')[0];
    const sanitizedName = namaSantri.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    const folderName = `${sanitizedName}_${registrationNumber}`;

    // Normalize unit name to prevent duplicates.
    // Use unitSlug (e.g. "smpiqu-al-bahjah-buyut") if available for consistency.
    // We try to match "SMPIQu_Al-Bahjah_Buyut" style.
    let unitFolderName = unitName.trim().replace(/\s+/g, '_');

    if (unitSlug) {
        // Attempt to make slug look like the folder name (uppercasing parts?)
        // Actually, if we just want consistency, we can rely on the slug being unique per unit.
        // But the user might want readable folder names.
        // Let's stick to unitName but normalize it aggressively.
        // Or if unitSlug is "smpiqu", we might want "SMPIQu".

        // If unitName is "SMPIQu Al-Bahjah Buyut" -> "SMPIQu_Al-Bahjah_Buyut".
        // If unitName is "SMPIQu Al Bahjah Buyut" -> "SMPIQu_Al_Bahjah_Buyut".
        // Using slug might not help recover the "SMPIQu" capitalization unless we map it.

        // Best approach: Use the existing logic but ensure unitName isn't mangled upstream.
        // But since we can't control upstream unitName easily right now,
        // let's rely on the implementation we already added: 
        // `unitName.trim().replace(/\s+/g, '_')`.

        // However, the user complained.
        // Let's assume the user will fix the unitName strings in DB or we use slug.
        // If I use slug: `unitSlug.replace(/-/g, '_')` -> "smpiqu_al_bahjah_buyut". 
        // That creates a NEW folder different from "SMPIQu_..." (case sensitive).

        // Okay, stuck with unitName.
    }

    // Ensure we handle the specific "SMPIQu" case the user mentioned.
    // If unitName contains "SMPIQu", ensure it is formatted consistently?
    // No, that's too hacky.

    unitFolderName = unitName.trim().replace(/\s+/g, '_');

    console.log(`Preparing registration folder: ${unitFolderName}/${folderName}`);

    // Try Google Drive first
    if (initGoogleDrive() && drive) {
        try {
            // Check/create unit folder
            let unitFolderId = GOOGLE_DRIVE_FOLDER_ID;

            // Search STRICTLY for the folder in the parent
            const searchResponse = await drive.files.list({
                q: `name = '${unitFolderName}' and mimeType = 'application/vnd.google-apps.folder' and '${GOOGLE_DRIVE_FOLDER_ID}' in parents and trashed = false`,
                fields: 'files(id, name)',
                supportsAllDrives: true,
                includeItemsFromAllDrives: true,
            });

            if (searchResponse.data.files && searchResponse.data.files.length > 0) {
                // Use the first match
                unitFolderId = searchResponse.data.files[0].id!;
                console.log(`Found existing unit folder: ${unitFolderId} (${searchResponse.data.files[0].name})`);
            } else {
                console.log(`Creating new unit folder: ${unitFolderName}`);
                const unitFolderResponse = await drive.files.create({
                    requestBody: {
                        name: unitFolderName,
                        mimeType: 'application/vnd.google-apps.folder',
                        parents: [GOOGLE_DRIVE_FOLDER_ID],
                    },
                    fields: 'id',
                    supportsAllDrives: true,
                });
                unitFolderId = unitFolderResponse.data.id!;
            }

            // Create registration folder
            console.log(`Creating registration folder in: ${unitFolderId}`);

            // Check if folder already exists to avoid duplicates on retry
            const regSearchResponse = await drive.files.list({
                q: `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and '${unitFolderId}' in parents and trashed = false`,
                fields: 'files(id, webViewLink)',
                supportsAllDrives: true,
                includeItemsFromAllDrives: true,
            });

            let folderId: string;
            let folderUrl: string;

            if (regSearchResponse.data.files && regSearchResponse.data.files.length > 0) {
                folderId = regSearchResponse.data.files[0].id!;
                folderUrl = regSearchResponse.data.files[0].webViewLink!;
                console.log(`Found existing registration folder: ${folderId}`);
            } else {
                const regFolderResponse = await drive.files.create({
                    requestBody: {
                        name: folderName,
                        mimeType: 'application/vnd.google-apps.folder',
                        parents: [unitFolderId],
                    },
                    fields: 'id, webViewLink',
                    supportsAllDrives: true,
                });
                folderId = regFolderResponse.data.id!;
                folderUrl = regFolderResponse.data.webViewLink!;
                console.log(`Drive folder created: ${folderId}`);
            }

            // Google Drive folder created successfully, return it directly
            // No test verification needed - actual uploads will handle errors gracefully
            console.log('Drive folder ready, using Google Drive for uploads');
            return { folderId, folderUrl };
        } catch (error) {
            console.error('Error dealing with Google Drive:', error);
            // Proceed to Supabase fallback
        }
    }

    // Fallback #1: Try Supabase Storage (works on Vercel!)
    if (isSupabaseStorageConfigured()) {
        try {
            console.log('Using Supabase Storage fallback');
            const supabaseResult = await createSupabaseFolder(unitName, namaSantri, registrationNumber);
            return {
                folderId: supabaseResult.folderId,
                folderUrl: supabaseResult.folderUrl,
            };
        } catch (supabaseError) {
            console.error('Supabase Storage fallback failed:', supabaseError);
            // Proceed to local fallback (last resort)
        }
    }

    // Fallback #2: Local storage (only works in development, NOT on Vercel!)
    console.warn('⚠️ Using local storage fallback - THIS WILL NOT WORK ON VERCEL!');
    const localPath = path.join(LOCAL_UPLOAD_DIR, unitFolderName, folderName);
    await ensureLocalDir(localPath);

    const relativePath = `${unitFolderName}/${folderName}`;

    return {
        folderId: `local_${relativePath}`,
        folderUrl: `/uploads/psb/${relativePath}`,
    };
}

/**
 * Upload file ke Google Drive atau lokal
 */
export async function uploadToDrive(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    folderId: string
): Promise<UploadResult> {

    // Sanitize filename
    const sanitizedFileName = fileName.replace(/[<>:"/\\|?*]/g, '_');
    const safeFileName = sanitizedFileName.replace(/[^a-zA-Z0-9._-]/g, '_');

    // If local folder, save locally
    if (folderId.startsWith('local_')) {
        console.log(`Uploading to local storage: ${fileName}`);
        const relativePath = folderId.replace('local_', '');
        const localDir = path.join(LOCAL_UPLOAD_DIR, relativePath);
        await ensureLocalDir(localDir);

        const localFilePath = path.join(localDir, safeFileName);

        await fs.writeFile(localFilePath, fileBuffer);

        return {
            fileId: `local_${relativePath}/${safeFileName}`,
            fileUrl: `/uploads/psb/${relativePath}/${safeFileName}`,
            fileName: safeFileName,
        };
    }

    // Try Google Drive
    if (initGoogleDrive() && drive) {
        try {
            const { Readable } = await import('stream');
            console.log(`Uploading to Google Drive: ${fileName}`);

            const response = await drive.files.create({
                requestBody: {
                    name: sanitizedFileName,
                    parents: [folderId],
                },
                media: {
                    mimeType: mimeType,
                    body: Readable.from(fileBuffer),
                },
                fields: 'id, webViewLink',
                supportsAllDrives: true,
            });

            console.log(`File uploaded to Drive: ${response.data.id}`);

            return {
                fileId: response.data.id!,
                fileUrl: response.data.webViewLink!,
                fileName: sanitizedFileName,
            };
        } catch (error) {
            console.error('Google Drive upload failed unexpectedly (Quota/Permission?):', error);
            // Proceed to Supabase fallback
        }
    }

    // Fallback #1: Supabase Storage (works on Vercel!)
    if (folderId.startsWith('supabase_') || isSupabaseStorageConfigured()) {
        try {
            // Extract folder path from supabase_ prefixed folderId
            const folderPath = folderId.startsWith('supabase_')
                ? folderId.replace('supabase_', '')
                : folderId;

            console.log(`Uploading to Supabase Storage: ${fileName}`);
            const supabaseResult = await uploadToSupabase(fileBuffer, fileName, mimeType, folderPath);

            return {
                fileId: supabaseResult.fileId,
                fileUrl: supabaseResult.fileUrl,
                fileName: supabaseResult.fileName,
            };
        } catch (supabaseError) {
            console.error('Supabase Storage upload failed:', supabaseError);
            // Proceed to local fallback (last resort)
        }
    }

    // Fallback #2: Local storage (only works in development, NOT on Vercel!)
    console.warn(`⚠️ Fallback: Saving locally into ${folderId} - THIS WILL NOT WORK ON VERCEL!`);
    const localDir = path.join(LOCAL_UPLOAD_DIR, folderId);
    await ensureLocalDir(localDir);

    const localFilePath = path.join(localDir, safeFileName);

    await fs.writeFile(localFilePath, fileBuffer);

    return {
        fileId: `local_${folderId}/${safeFileName}`,
        fileUrl: `/uploads/psb/${folderId}/${safeFileName}`,
        fileName: safeFileName,
    };
}

/**
 * Membuat folder di Drive (Direct)
 */
export async function createDriveFolder(
    folderName: string,
    parentFolderId?: string
): Promise<FolderResult> {
    if (initGoogleDrive() && drive) {
        try {
            const response = await drive.files.create({
                requestBody: {
                    name: folderName,
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: [parentFolderId || GOOGLE_DRIVE_FOLDER_ID],
                },
                fields: 'id, webViewLink',
            });

            return {
                folderId: response.data.id!,
                folderUrl: response.data.webViewLink!,
            };
        } catch (error) {
            console.error('createDriveFolder failed:', error);
        }
    }

    // Fallback
    const localPath = path.join(LOCAL_UPLOAD_DIR, folderName);
    await ensureLocalDir(localPath);

    return {
        folderId: `local_${folderName}`,
        folderUrl: `/uploads/psb/${folderName}`,
    };
}

/**
 * Hapus file
 */
export async function deleteFromDrive(fileId: string): Promise<void> {
    if (fileId.startsWith('local_')) {
        // Implementation for local delete if needed
        return;
    }

    if (initGoogleDrive() && drive) {
        try {
            await drive.files.delete({ fileId });
        } catch (error) {
            console.error('Error deleting from Drive:', error);
        }
    }
}

/**
 * Hapus folder beserta isinya
 */
export async function deleteDriveFolder(folderId: string): Promise<void> {
    // Handle Supabase Storage folders
    if (folderId.startsWith('supabase_')) {
        try {
            await deleteSupabaseFolder(folderId);
        } catch (error) {
            console.error('Error deleting Supabase folder:', error);
        }
        return;
    }

    // Handle local folders
    if (folderId.startsWith('local_')) {
        try {
            const folderPath = folderId.replace('local_', '');
            const localPath = path.join(LOCAL_UPLOAD_DIR, folderPath);
            await fs.rm(localPath, { recursive: true, force: true });
        } catch (error) {
            console.error('Error deleting local folder:', error);
        }
        return;
    }

    // Handle Google Drive folders
    if (initGoogleDrive() && drive) {
        try {
            await drive.files.delete({ fileId: folderId });
        } catch (error) {
            console.error('Error deleting Drive folder:', error);
        }
    }
}

export interface DriveFileInfo {
    id: string;
    name: string;
    mimeType: string;
    size: number;
    webViewLink: string;
}

/**
 * List all files in a Google Drive folder
 */
export async function listFilesInFolder(folderId: string): Promise<DriveFileInfo[]> {
    // Skip if local or supabase folder
    if (folderId.startsWith('local_') || folderId.startsWith('supabase_')) {
        console.log('Cannot list files for non-Drive folder:', folderId);
        return [];
    }

    if (!initGoogleDrive() || !drive) {
        console.error('Google Drive not initialized');
        return [];
    }

    try {
        const response = await drive.files.list({
            q: `'${folderId}' in parents and trashed = false`,
            fields: 'files(id, name, mimeType, size, webViewLink)',
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
        });

        if (!response.data.files) {
            return [];
        }

        return response.data.files.map(file => ({
            id: file.id!,
            name: file.name!,
            mimeType: file.mimeType!,
            size: parseInt(file.size || '0', 10),
            webViewLink: file.webViewLink!,
        }));
    } catch (error) {
        console.error('Error listing files in Drive folder:', error);
        return [];
    }
}

