'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createRegistrationFolder, uploadToDrive, deleteDriveFolder, deleteFromDrive, listFilesInFolder } from '@/lib/google-drive';
import { appendToSpreadsheet, updateSpreadsheetStatus } from '@/lib/google-sheets';
import { uploadQueue } from '@/lib/upload-queue';
import { generateRegistrationNumber } from '@/lib/psb-config';
import { psbFormSchema, psbDocumentSchema } from '@/lib/validations';
import { ZodError } from 'zod';

// Define PSBStatus type locally to avoid Prisma client import issues
export type PSBStatus = 'PENDING' | 'VERIFIED' | 'ACCEPTED' | 'REJECTED';

export interface PSBFormData {
    unitId: string;
    unitName: string;
    unitSlug: string;
    // Data Santri
    namaLengkap: string;
    nisn?: string;
    nik: string;
    noKK: string;
    jenisKelamin: string;
    tempatLahir: string;
    tanggalLahir: string;
    asalSekolah: string;
    alamatSekolahAsal: string;
    // Data Orang Tua
    namaAyah: string;
    namaIbu: string;
    pekerjaanAyah: string;
    pekerjaanIbu: string;
    penghasilanAyah: string;
    penghasilanIbu?: string;
    pendidikanAyah: string;
    pendidikanIbu: string;
    anakKe: string;
    dariSaudara: string;
    jumlahTanggungan: string;
    alamatLengkap: string;
    noWaIbu: string;
    noWaAyah?: string;
    sumberInfo: string;
    // Program Spesial fields
    grade?: string;
    jenisSantri?: string;
    // Legacy fields for backward compatibility
    namaOrangTua?: string;
    noHpOrangTua?: string;
    emailOrangTua?: string;
}

export interface DocumentUpload {
    documentType: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    base64Data: string;
}

export interface SubmitPSBResult {
    success: boolean;
    message: string;
    registrationNumber?: string;
    error?: string;
    validationErrors?: Record<string, string>;
}

/**
 * Submit pendaftaran PSB baru
 * Strategy: Validate input → Save to DB immediately → Upload files in background
 */
export async function submitPSBRegistration(
    formData: PSBFormData,
    documents: DocumentUpload[]
): Promise<SubmitPSBResult> {
    try {
        // ============================================
        // SECURITY: Validate all input data with Zod
        // ============================================

        // Validate form data
        const validatedFormData = psbFormSchema.parse(formData);

        // Validate each document
        const validatedDocuments = documents.map((doc, index) => {
            try {
                return psbDocumentSchema.parse(doc);
            } catch (docError) {
                if (docError instanceof ZodError) {
                    // Zod v4+ uses 'issues' property
                    const issues = docError.issues || [];
                    const firstError = issues[0];
                    throw new Error(`Dokumen ${index + 1}: ${firstError?.message || 'Validasi gagal'}`);
                }
                throw docError;
            }
        });

        // Generate nomor pendaftaran
        const registrationNumber = generateRegistrationNumber(validatedFormData.unitSlug);

        // STEP 1: Simpan ke database DULU (cepat, ~1-2 detik)
        // Dokumen akan diupload di background
        const registration = await db.pSBRegistration.create({
            data: {
                registrationNumber,
                // Data Santri
                namaLengkap: formData.namaLengkap,
                nisn: formData.nisn || null,
                nik: formData.nik || null,
                noKK: formData.noKK || null,
                jenisKelamin: formData.jenisKelamin,
                tempatLahir: formData.tempatLahir,
                tanggalLahir: new Date(formData.tanggalLahir),
                asalSekolah: formData.asalSekolah,
                alamatSekolahAsal: formData.alamatSekolahAsal || null,
                // Data Orang Tua
                namaAyah: formData.namaAyah || null,
                namaIbu: formData.namaIbu || null,
                pekerjaanAyah: formData.pekerjaanAyah || null,
                pekerjaanIbu: formData.pekerjaanIbu || null,
                penghasilanAyah: formData.penghasilanAyah || null,
                penghasilanIbu: formData.penghasilanIbu || null,
                pendidikanAyah: formData.pendidikanAyah || null,
                pendidikanIbu: formData.pendidikanIbu || null,
                anakKe: formData.anakKe || null,
                dariSaudara: formData.dariSaudara || null,
                jumlahTanggungan: formData.jumlahTanggungan || null,
                alamatLengkap: formData.alamatLengkap,
                noWaIbu: formData.noWaIbu || null,
                noWaAyah: formData.noWaAyah || null,
                sumberInfo: formData.sumberInfo || null,
                // Program Spesial
                grade: formData.grade || null,
                jenisSantri: formData.jenisSantri || null,
                // Legacy fields for backward compatibility
                namaOrangTua: formData.namaAyah || formData.namaOrangTua || null,
                noHpOrangTua: formData.noWaIbu || formData.noHpOrangTua || null,
                emailOrangTua: formData.emailOrangTua || null,
                // Status & Metadata
                status: 'PENDING',
                driveFolderId: null,
                driveFolderUrl: null,
                unitId: formData.unitId,
            },
        });



        console.log(`Registration ${registrationNumber} saved to database`);

        // STEP 2: Add to queue for background processing
        // Queue limits concurrent uploads to prevent overload
        uploadQueue.add(registrationNumber, () =>
            processUploadsInBackground(
                registration.id,
                registrationNumber,
                formData,
                documents
            )
        );

        revalidatePath('/admin/psb');

        // Return segera - user tidak perlu menunggu upload selesai
        return {
            success: true,
            message: `Pendaftaran berhasil! Nomor pendaftaran Anda: ${registrationNumber}. Dokumen sedang diproses.`,
            registrationNumber: registration.registrationNumber,
        };
    } catch (error) {
        console.error('Error submitting PSB registration:', error);

        // Handle Zod validation errors
        if (error instanceof ZodError) {
            const issues = error.issues || [];
            const validationErrors: Record<string, string> = {};

            // Log detailed validation errors for debugging
            console.error('=== ZOD VALIDATION ERRORS ===');
            issues.forEach((issue, index) => {
                const path = issue.path?.join('.') || 'unknown';
                const message = issue.message;
                validationErrors[path] = message;
                console.error(`  ${index + 1}. Field: "${path}" - Error: "${message}"`);
            });
            console.error('=============================');

            return {
                success: false,
                message: `Data pendaftaran tidak valid: ${issues[0]?.message || 'Validasi gagal'}. Field: ${issues[0]?.path?.join('.') || 'unknown'}`,
                error: issues[0]?.message || 'Validasi gagal',
                validationErrors,
            };
        }

        return {
            success: false,
            message: 'Terjadi kesalahan saat memproses pendaftaran',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Process uploads in background (non-blocking)
 * This runs AFTER the response is sent to user
 */
async function processUploadsInBackground(
    registrationId: string,
    registrationNumber: string,
    formData: PSBFormData,
    documents: DocumentUpload[]
): Promise<void> {
    try {
        console.log(`[Background] Starting upload for ${registrationNumber}...`);

        // Create folder di Google Drive
        let folderResult: { folderId: string; folderUrl: string } | null = null;
        try {
            folderResult = await createRegistrationFolder(
                formData.unitName,
                formData.namaLengkap,
                registrationNumber,
                formData.unitSlug
            );
        } catch (folderError) {
            console.error(`[Background] Failed to create folder for ${registrationNumber}:`, folderError);
            // We cannot proceed with uploads if folder creation fails completely
            await db.pSBRegistration.update({
                where: { id: registrationId },
                data: {
                    notes: `System Error: Gagal membuat folder penyimpanan. Dokumen tidak dapat diupload.`,
                },
            });
            return;
        }

        // Upload semua dokumen PARALLEL dengan Promise.allSettled agar satu gagal tidak membatalkan yang lain
        const uploadPromises = documents.map(async (doc) => {
            const buffer = Buffer.from(doc.base64Data, 'base64');

            const uploadResult = await uploadToDrive(
                buffer,
                doc.fileName,
                doc.mimeType,
                folderResult!.folderId
            );

            return {
                documentType: doc.documentType,
                fileName: doc.fileName,
                fileSize: doc.fileSize,
                mimeType: doc.mimeType,
                driveFileId: uploadResult.fileId,
                driveFileUrl: uploadResult.fileUrl,
            };
        });

        const uploadResults = await Promise.allSettled(uploadPromises);

        // Filter successful uploads
        const uploadedDocuments: any[] = [];
        const failedUploads: string[] = [];

        uploadResults.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                uploadedDocuments.push(result.value);
            } else {
                const docName = documents[index].fileName;
                console.error(`[Background] Failed to upload ${docName}:`, result.reason);
                failedUploads.push(docName);
            }
        });

        // Extract pas foto URL for registration card
        const pasFotoDoc = uploadedDocuments.find(doc => doc.documentType === 'PAS_FOTO');
        const pasFotoUrl = pasFotoDoc?.driveFileUrl || null;

        // Prepare notes if there are failures
        let statusNotes: string | null = null;
        if (failedUploads.length > 0) {
            statusNotes = `Upload sebagian gagal (${failedUploads.length} file): ${failedUploads.join(', ')}. Harap upload ulang manual.`;
        }

        // Update registration dengan folder info dan documents
        await db.pSBRegistration.update({
            where: { id: registrationId },
            data: {
                driveFolderId: folderResult.folderId,
                driveFolderUrl: folderResult.folderUrl,
                pasFotoUrl: pasFotoUrl,
                notes: statusNotes, // Will be null if no errors, or contain error message
                documents: {
                    create: uploadedDocuments,
                },
            },
        });

        console.log(`[Background] Upload complete for ${registrationNumber}. Success: ${uploadedDocuments.length}, Failed: ${failedUploads.length}`);

        // Backup ke Spreadsheet (juga background)
        try {
            const sheetResult = await appendToSpreadsheet({
                registrationNumber,
                namaLengkap: formData.namaLengkap,
                nisn: formData.nisn || '',
                nik: formData.nik || '',
                noKK: formData.noKK || '',
                jenisKelamin: formData.jenisKelamin,
                tempatLahir: formData.tempatLahir,
                tanggalLahir: formData.tanggalLahir,
                asalSekolah: formData.asalSekolah,
                alamatSekolahAsal: formData.alamatSekolahAsal || '',
                namaAyah: formData.namaAyah || '',
                namaIbu: formData.namaIbu || '',
                pekerjaanAyah: formData.pekerjaanAyah || '',
                pekerjaanIbu: formData.pekerjaanIbu || '',
                penghasilanAyah: formData.penghasilanAyah || '',
                penghasilanIbu: formData.penghasilanIbu || '',
                pendidikanAyah: formData.pendidikanAyah || '',
                pendidikanIbu: formData.pendidikanIbu || '',
                anakKe: formData.anakKe || '',
                dariSaudara: formData.dariSaudara || '',
                jumlahTanggungan: formData.jumlahTanggungan || '',
                alamatLengkap: formData.alamatLengkap,
                noWaIbu: formData.noWaIbu || '',
                noWaAyah: formData.noWaAyah || '',
                sumberInfo: formData.sumberInfo || '',
                grade: formData.grade || '',
                jenisSantri: formData.jenisSantri || '',
                unitName: formData.unitName,
                driveFolderUrl: folderResult.folderUrl,
                status: 'PENDING',
                createdAt: new Date().toISOString(),
            });

            if (sheetResult.success) {
                // Mark as synced in database
                await db.pSBRegistration.update({
                    where: { id: registrationId },
                    data: { spreadsheetSynced: true },
                });
                console.log(`[Background] Spreadsheet backup complete for ${registrationNumber}`);
            } else {
                console.error(`[Background] Spreadsheet sync failed for ${registrationNumber}:`, sheetResult.message);
            }
        } catch (sheetError) {
            console.error('[Background] Spreadsheet error:', sheetError);
            // spreadsheetSynced remains false, can be retried later
        }

    } catch (error) {
        console.error(`[Background] Upload failed for ${registrationNumber}:`, error);

        // Update status to indicate upload problem
        try {
            await db.pSBRegistration.update({
                where: { id: registrationId },
                data: {
                    notes: `Upload gagal: ${error instanceof Error ? error.message : 'Unknown error'}. Harap upload ulang dokumen.`,
                },
            });
        } catch (updateError) {
            console.error('[Background] Failed to update notes:', updateError);
        }
    }
}

/**
 * Update status pendaftaran (admin only)
 */
export async function updatePSBStatus(
    registrationId: string,
    status: PSBStatus,
    notes?: string
): Promise<{ success: boolean; message: string }> {
    try {
        // Get registration data first for email
        const registration = await db.pSBRegistration.findUnique({
            where: { id: registrationId },
            include: { unit: true },
        });

        if (!registration) {
            return { success: false, message: 'Pendaftaran tidak ditemukan' };
        }

        // Update status in database
        await db.pSBRegistration.update({
            where: { id: registrationId },
            data: {
                status,
                notes: notes || null,
            },
        });

        revalidatePath('/admin/psb');

        // Only send email for VERIFIED, ACCEPTED, REJECTED (not PENDING)
        if (['VERIFIED', 'ACCEPTED', 'REJECTED'].includes(status)) {
            // Import dynamically to avoid circular dependency
            const { sendStatusEmail } = await import('@/lib/email');

            // Send email notification (non-blocking)
            // Send email notification (await to ensure execution in serverless environment)
            try {
                const result = await sendStatusEmail(registration.emailOrangTua, {
                    namaLengkap: registration.namaLengkap,
                    registrationNumber: registration.registrationNumber,
                    unitName: registration.unit.name,
                    status: status as 'VERIFIED' | 'ACCEPTED' | 'REJECTED',
                    notes: notes,
                });

                if (result.success && result.id) {
                    console.log(`[PSB] Email sent for ${registration.registrationNumber}, ID: ${result.id}`);

                    // Update email tracking info
                    await db.pSBRegistration.update({
                        where: { id: registrationId },
                        data: {
                            lastEmailId: result.id,
                            emailStatus: 'sent'
                        }
                    });
                } else if (result.error) {
                    console.error(`[PSB] Email failed for ${registration.registrationNumber}:`, result.error);
                }
            } catch (err) {
                console.error('[PSB] Email send error:', err);
            }
        }

        // Update status di spreadsheet juga (non-blocking)
        try {
            await updateSpreadsheetStatus(registration.registrationNumber, registration.unit.name, status);
        } catch (sheetError) {
            console.error('Failed to update spreadsheet status (non-blocking):', sheetError);
        }

        const statusLabels: Record<PSBStatus, string> = {
            PENDING: 'Menunggu',
            VERIFIED: 'Terverifikasi',
            ACCEPTED: 'Diterima',
            REJECTED: 'Ditolak',
        };

        return {
            success: true,
            message: `Status pendaftaran berhasil diubah menjadi ${statusLabels[status]}`,
        };
    } catch (error) {
        console.error('Error updating PSB status:', error);
        return {
            success: false,
            message: 'Terjadi kesalahan saat mengubah status',
        };
    }
}

/**
 * Admin upload dokumen manual ke pendaftaran yang sudah ada
 */
export async function adminUploadDocument(
    registrationId: string,
    documentType: string,
    fileName: string,
    mimeType: string,
    base64Data: string
): Promise<{ success: boolean; message: string; document?: { id: string; fileName: string; driveFileUrl: string } }> {
    try {
        // Get registration data
        const registration = await db.pSBRegistration.findUnique({
            where: { id: registrationId },
            include: { unit: true },
        });

        if (!registration) {
            return { success: false, message: 'Pendaftaran tidak ditemukan' };
        }

        let folderId = registration.driveFolderId;
        let folderUrl = registration.driveFolderUrl;

        // If no folder exists yet, create one
        if (!folderId) {
            console.log(`[Admin Upload] Creating folder for ${registration.registrationNumber}...`);
            const folderResult = await createRegistrationFolder(
                registration.unit.name,
                registration.namaLengkap,
                registration.registrationNumber,
                registration.unit.slug
            );
            folderId = folderResult.folderId;
            folderUrl = folderResult.folderUrl;

            // Update registration with folder info
            await db.pSBRegistration.update({
                where: { id: registrationId },
                data: {
                    driveFolderId: folderId,
                    driveFolderUrl: folderUrl,
                },
            });
        }

        // Check for existing document of the same type and remove it
        // This prevents duplicate files in Drive and DB
        const existingDoc = await db.pSBDocument.findFirst({
            where: {
                registrationId: registrationId,
                documentType: documentType
            }
        });

        if (existingDoc) {
            console.log(`[Admin Upload] Replacing existing ${documentType} document...`);

            // Delete from Drive
            if (existingDoc.driveFileId) {
                await deleteFromDrive(existingDoc.driveFileId);
            }

            // Delete from DB
            await db.pSBDocument.delete({
                where: { id: existingDoc.id }
            });
        }

        // Convert base64 to buffer and upload
        const buffer = Buffer.from(base64Data, 'base64');
        console.log(`[Admin Upload] Uploading ${fileName} to folder ${folderId}...`);

        const uploadResult = await uploadToDrive(buffer, fileName, mimeType, folderId);

        // Save document record to database
        const document = await db.pSBDocument.create({
            data: {
                registrationId,
                documentType,
                fileName: uploadResult.fileName,
                fileSize: buffer.length,
                mimeType,
                driveFileId: uploadResult.fileId,
                driveFileUrl: uploadResult.fileUrl,
            },
        });

        // If this is a PAS_FOTO, update the pasFotoUrl
        if (documentType === 'PAS_FOTO') {
            await db.pSBRegistration.update({
                where: { id: registrationId },
                data: { pasFotoUrl: uploadResult.fileUrl },
            });
        }

        revalidatePath(`/admin/psb/${registrationId}`);
        revalidatePath('/admin/psb');

        console.log(`[Admin Upload] Successfully uploaded ${fileName}`);

        return {
            success: true,
            message: `Dokumen ${documentType.replace(/_/g, ' ')} berhasil diupload`,
            document: {
                id: document.id,
                fileName: document.fileName,
                driveFileUrl: document.driveFileUrl,
            },
        };
    } catch (error) {
        console.error('[Admin Upload] Error:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Terjadi kesalahan saat upload dokumen',
        };
    }
}

/**
 * Hapus pendaftaran (admin only)
 */
export async function deletePSBRegistration(
    registrationId: string
): Promise<{ success: boolean; message: string }> {
    try {
        // Get registration data first
        const registration = await db.pSBRegistration.findUnique({
            where: { id: registrationId },
        });

        if (!registration) {
            return {
                success: false,
                message: 'Data pendaftaran tidak ditemukan',
            };
        }

        // Delete folder from Google Drive
        if (registration.driveFolderId) {
            try {
                await deleteDriveFolder(registration.driveFolderId);
            } catch (error) {
                console.error('Error deleting Drive folder:', error);
                // Continue with database deletion even if Drive deletion fails
            }
        }

        // Delete from database (cascade will delete documents)
        await db.pSBRegistration.delete({
            where: { id: registrationId },
        });

        revalidatePath('/admin/psb');

        return {
            success: true,
            message: 'Data pendaftaran berhasil dihapus',
        };
    } catch (error) {
        console.error('Error deleting PSB registration:', error);
        return {
            success: false,
            message: 'Terjadi kesalahan saat menghapus data',
        };
    }
}

/**
 * Bulk update status pendaftaran (admin only)
 * Updates multiple registrations at once and sends email notifications
 */
export async function bulkUpdatePSBStatus(
    status: PSBStatus,
    filter?: { unitId?: string; currentStatus?: PSBStatus }
): Promise<{ success: boolean; message: string; count: number }> {
    try {
        // Build where clause based on filter
        const whereClause: Record<string, unknown> = {};
        if (filter?.unitId) {
            whereClause.unitId = filter.unitId;
        }
        if (filter?.currentStatus) {
            whereClause.status = filter.currentStatus;
        }

        // Get all registrations that will be updated
        const registrations = await db.pSBRegistration.findMany({
            where: whereClause,
            include: { unit: true },
        });

        if (registrations.length === 0) {
            return {
                success: false,
                message: 'Tidak ada pendaftaran yang sesuai kriteria',
                count: 0,
            };
        }

        // Update all matching registrations
        await db.pSBRegistration.updateMany({
            where: whereClause,
            data: { status },
        });

        // Send emails in background (non-blocking)
        if (['VERIFIED', 'ACCEPTED', 'REJECTED'].includes(status)) {
            const { sendStatusEmail } = await import('@/lib/email');

            for (const reg of registrations) {
                if (reg.emailOrangTua) {
                    try {
                        const result = await sendStatusEmail(reg.emailOrangTua, {
                            namaLengkap: reg.namaLengkap,
                            registrationNumber: reg.registrationNumber,
                            unitName: reg.unit.name,
                            status: status as 'VERIFIED' | 'ACCEPTED' | 'REJECTED',
                        });

                        if (result.success && result.id) {
                            // Update email tracking info
                            await db.pSBRegistration.update({
                                where: { id: reg.id },
                                data: {
                                    lastEmailId: result.id,
                                    emailStatus: 'sent'
                                }
                            });
                        }
                    } catch (err) {
                        console.error(`[Bulk] Email failed for ${reg.registrationNumber}:`, err);
                    }
                }
            }
        }

        // Update spreadsheet in background
        for (const reg of registrations) {
            updateSpreadsheetStatus(reg.registrationNumber, reg.unit.name, status).catch((err) => {
                console.error(`[Bulk] Spreadsheet update failed for ${reg.registrationNumber}:`, err);
            });
        }

        revalidatePath('/admin/psb');

        const statusLabels: Record<PSBStatus, string> = {
            PENDING: 'Menunggu',
            VERIFIED: 'Terverifikasi',
            ACCEPTED: 'Diterima',
            REJECTED: 'Ditolak',
        };

        return {
            success: true,
            message: `${registrations.length} pendaftaran berhasil diubah menjadi ${statusLabels[status]}`,
            count: registrations.length,
        };
    } catch (error) {
        console.error('Error bulk updating PSB status:', error);
        return {
            success: false,
            message: 'Terjadi kesalahan saat mengubah status',
            count: 0,
        };
    }
}

/**
 * Get all registrations for admin
 */
export async function getAllPSBRegistrations(
    status?: PSBStatus,
    unitId?: string
) {
    try {
        const registrations = await db.pSBRegistration.findMany({
            where: {
                ...(status && { status }),
                ...(unitId && { unitId }),
            },
            include: {
                unit: true,
                documents: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return registrations;
    } catch (error) {
        console.error('Error fetching PSB registrations:', error);
        return [];
    }
}

/**
 * Get single registration by ID
 */
export async function getPSBRegistrationById(id: string) {
    try {
        const registration = await db.pSBRegistration.findUnique({
            where: { id },
            include: {
                unit: true,
                documents: true,
            },
        });

        return registration;
    } catch (error) {
        console.error('Error fetching PSB registration:', error);
        return null;
    }
}

/**
 * Get registration by registration number (for public tracking)
 */
export async function getPSBRegistrationByNumber(registrationNumber: string) {
    try {
        const registration = await db.pSBRegistration.findUnique({
            where: { registrationNumber },
            include: {
                unit: {
                    select: {
                        name: true,
                        slug: true,
                    },
                },
            },
        });

        if (!registration) {
            return null;
        }

        // Return limited info for public
        return {
            registrationNumber: registration.registrationNumber as string,
            namaLengkap: registration.namaLengkap as string,
            unitName: registration.unit.name as string,
            status: registration.status as PSBStatus,
            notes: registration.notes as string | null,
            createdAt: registration.createdAt as Date,
        };
    } catch (error) {
        console.error('Error fetching PSB registration by number:', error);
        return null;
    }
}

/**
 * Get count of registrations not synced to spreadsheet
 */
export async function getUnsyncedCount(): Promise<number> {
    try {
        const count = await db.pSBRegistration.count({
            where: { spreadsheetSynced: false },
        });
        return count;
    } catch (error) {
        console.error('Error getting unsynced count:', error);
        return 0;
    }
}

/**
 * Update Drive folder URL for a registration
 * This also extracts and saves the folder ID from the URL
 */
export async function updateDriveFolderUrl(
    registrationId: string,
    driveUrl: string
): Promise<{ success: boolean; message: string }> {
    try {
        // Validate URL format
        const urlMatch = driveUrl.match(/folders\/([a-zA-Z0-9_-]+)/);
        if (!urlMatch) {
            return {
                success: false,
                message: 'URL tidak valid. Gunakan format: https://drive.google.com/drive/folders/FOLDER_ID'
            };
        }

        const folderId = urlMatch[1];

        await db.pSBRegistration.update({
            where: { id: registrationId },
            data: {
                driveFolderUrl: driveUrl,
                driveFolderId: folderId
            },
        });

        revalidatePath(`/admin/psb/${registrationId}`);
        revalidatePath('/admin/psb');

        return {
            success: true,
            message: `Berhasil menyimpan folder Drive (ID: ${folderId.substring(0, 10)}...)`
        };
    } catch (error) {
        console.error('Error updating Drive folder URL:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Sync a single registration to spreadsheet
 * @param registrationId - The ID of the registration to sync
 * @param force - If true, sync even if already marked as synced
 */
export async function syncRegistrationToSpreadsheet(
    registrationId: string,
    force: boolean = false
): Promise<{ success: boolean; message: string }> {
    try {
        const registration = await db.pSBRegistration.findUnique({
            where: { id: registrationId },
            include: { unit: true },
        });

        if (!registration) {
            return { success: false, message: 'Pendaftaran tidak ditemukan' };
        }

        // Skip if already synced and not forcing
        if (registration.spreadsheetSynced && !force) {
            return { success: true, message: 'Sudah tersinkronisasi' };
        }

        console.log(`[Sync] Syncing ${registration.registrationNumber} to spreadsheet (force: ${force})`);

        const result = await appendToSpreadsheet({
            registrationNumber: registration.registrationNumber,
            namaLengkap: registration.namaLengkap,
            nisn: registration.nisn || '',
            nik: registration.nik || '',
            noKK: registration.noKK || '',
            jenisKelamin: registration.jenisKelamin,
            tempatLahir: registration.tempatLahir,
            tanggalLahir: registration.tanggalLahir.toISOString().split('T')[0],
            asalSekolah: registration.asalSekolah,
            alamatSekolahAsal: registration.alamatSekolahAsal || '',
            namaAyah: registration.namaAyah || '',
            namaIbu: registration.namaIbu || '',
            pekerjaanAyah: registration.pekerjaanAyah || '',
            pekerjaanIbu: registration.pekerjaanIbu || '',
            penghasilanAyah: registration.penghasilanAyah || '',
            penghasilanIbu: registration.penghasilanIbu || '',
            pendidikanAyah: registration.pendidikanAyah || '',
            pendidikanIbu: registration.pendidikanIbu || '',
            anakKe: registration.anakKe || '',
            dariSaudara: registration.dariSaudara || '',
            jumlahTanggungan: registration.jumlahTanggungan || '',
            alamatLengkap: registration.alamatLengkap,
            noWaIbu: registration.noWaIbu || '',
            noWaAyah: registration.noWaAyah || '',
            sumberInfo: registration.sumberInfo || '',
            grade: registration.grade || '',
            jenisSantri: registration.jenisSantri || '',
            unitName: registration.unit.name,
            driveFolderUrl: registration.driveFolderUrl || '',
            status: registration.status,
            createdAt: registration.createdAt.toISOString(),
        });

        if (result.success) {
            await db.pSBRegistration.update({
                where: { id: registrationId },
                data: { spreadsheetSynced: true },
            });
            return { success: true, message: `Berhasil sync: ${registration.registrationNumber}` };
        }

        // If failed, mark as not synced so it can be retried
        await db.pSBRegistration.update({
            where: { id: registrationId },
            data: { spreadsheetSynced: false },
        });

        return { success: false, message: result.message };
    } catch (error) {
        console.error('Error syncing registration to spreadsheet:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Sync all unsynced registrations to spreadsheet
 * Process in batches to avoid Vercel timeout (default max 10s on hobby)
 */
export async function syncAllUnsyncedToSpreadsheet(batchSize = 10): Promise<{
    success: boolean;
    message: string;
    synced: number;
    failed: number;
    remaining: number;
}> {
    try {
        const unsynced = await db.pSBRegistration.findMany({
            where: { spreadsheetSynced: false },
            select: { id: true, registrationNumber: true },
            take: batchSize, // LIMIT batch size
        });

        const totalUnsynced = await db.pSBRegistration.count({
            where: { spreadsheetSynced: false },
        });

        if (unsynced.length === 0) {
            return {
                success: true,
                message: 'Semua data sudah tersinkronisasi',
                synced: 0,
                failed: 0,
                remaining: 0,
            };
        }

        let synced = 0;
        let failed = 0;

        for (const registration of unsynced) {
            const result = await syncRegistrationToSpreadsheet(registration.id);
            if (result.success) {
                synced++;
            } else {
                failed++;
                console.error(`Failed to sync ${registration.registrationNumber}: ${result.message}`);
            }

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        revalidatePath('/admin/psb');

        const remaining = totalUnsynced - synced; // Estimation

        return {
            success: true,
            message: `Batch selesai: ${synced} berhasil, ${failed} gagal. ${remaining > 0 ? `Masih ada ${remaining} data.` : 'Semua selesai.'}`,
            synced,
            failed,
            remaining,
        };
    } catch (error) {
        console.error('Error syncing all unsynced to spreadsheet:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
            synced: 0,
            failed: 0,
            remaining: 0,
        };
    }
}

/**
 * Sync documents from Google Drive folder to database
 * This is useful when files are in Drive but not recorded in database
 */
export async function syncDocumentsFromDrive(
    registrationId: string
): Promise<{ success: boolean; message: string; synced: number }> {
    try {
        const registration = await db.pSBRegistration.findUnique({
            where: { id: registrationId },
            include: { documents: true },
        });

        if (!registration) {
            return { success: false, message: 'Pendaftaran tidak ditemukan', synced: 0 };
        }

        // Try to get folder ID from driveFolderId or extract from driveFolderUrl
        let folderId = registration.driveFolderId;

        if (!folderId && registration.driveFolderUrl) {
            // Extract folder ID from URL like: 
            // https://drive.google.com/drive/folders/14RynWwDJOHbYbnhpGADDbLYBgozsARI
            const urlMatch = registration.driveFolderUrl.match(/folders\/([a-zA-Z0-9_-]+)/);
            if (urlMatch) {
                folderId = urlMatch[1];
                console.log(`[Sync] Extracted folder ID from URL: ${folderId}`);

                // Update the database with the extracted folder ID
                await db.pSBRegistration.update({
                    where: { id: registrationId },
                    data: { driveFolderId: folderId },
                });
            }
        }

        if (!folderId) {
            return { success: false, message: 'Tidak ada folder Drive terhubung', synced: 0 };
        }

        // Get files from Drive
        const driveFiles = await listFilesInFolder(folderId);

        if (driveFiles.length === 0) {
            return { success: true, message: 'Tidak ada file di Drive', synced: 0 };
        }

        // Get existing document file IDs
        const existingFileIds = new Set(registration.documents.map(doc => doc.driveFileId));

        let synced = 0;
        let pasFotoUrl: string | null = null;

        for (const file of driveFiles) {
            // Skip if already in database
            if (existingFileIds.has(file.id)) {
                continue;
            }

            // Detect document type from filename
            const fileName = file.name.toUpperCase();
            let documentType = 'LAINNYA';

            if (fileName.includes('IJAZAH') || fileName.includes('RAPORT') || fileName.includes('RAPOR')) {
                documentType = 'IJAZAH';
            } else if (fileName.includes('AKTA') || fileName.includes('AKTE')) {
                documentType = 'AKTA_KELAHIRAN';
            } else if (fileName.includes('KK') || fileName.includes('KARTU_KELUARGA') || fileName.includes('KARTU KELUARGA')) {
                documentType = 'KARTU_KELUARGA';
            } else if (fileName.includes('FOTO') || fileName.includes('PHOTO') || fileName.includes('PAS_FOTO') || fileName.includes('PASFOTO')) {
                documentType = 'PAS_FOTO';
                pasFotoUrl = file.webViewLink;
            } else if (fileName.includes('KTP')) {
                documentType = 'KTP_ORTU';
            } else if (fileName.includes('BUKTI') || fileName.includes('TRANSFER') || fileName.includes('TRANSAKSI') || fileName.includes('DAFTAR')) {
                documentType = 'BUKTI_PEMBAYARAN';
            }

            // Create document record
            await db.pSBDocument.create({
                data: {
                    registrationId: registration.id,
                    documentType,
                    fileName: file.name,
                    fileSize: file.size,
                    mimeType: file.mimeType,
                    driveFileId: file.id,
                    driveFileUrl: file.webViewLink,
                },
            });

            synced++;
            console.log(`[Sync] Added document: ${file.name} as ${documentType}`);
        }

        // Update pasFotoUrl if found
        if (pasFotoUrl && !registration.pasFotoUrl) {
            await db.pSBRegistration.update({
                where: { id: registrationId },
                data: { pasFotoUrl },
            });
        }

        revalidatePath(`/admin/psb/${registrationId}`);
        revalidatePath('/admin/psb');

        return {
            success: true,
            message: `Berhasil sync ${synced} dokumen dari Drive`,
            synced,
        };
    } catch (error) {
        console.error('Error syncing documents from Drive:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
            synced: 0,
        };
    }
}

/**
 * Sync all registrations that have Drive folder but no documents
 */
export async function syncAllMissingDocuments(): Promise<{
    success: boolean;
    message: string;
    totalSynced: number;
    registrationsProcessed: number;
}> {
    try {
        // Find registrations with Drive folder but no documents
        const registrations = await db.pSBRegistration.findMany({
            where: {
                driveFolderId: { not: null },
            },
            include: {
                documents: true,
            },
        });

        // Filter only those with zero documents
        const missingDocs = registrations.filter(r => r.documents.length === 0);

        if (missingDocs.length === 0) {
            return {
                success: true,
                message: 'Semua pendaftaran sudah memiliki dokumen',
                totalSynced: 0,
                registrationsProcessed: 0,
            };
        }

        let totalSynced = 0;
        let registrationsProcessed = 0;

        for (const reg of missingDocs) {
            const result = await syncDocumentsFromDrive(reg.id);
            if (result.synced > 0) {
                totalSynced += result.synced;
                registrationsProcessed++;
            }

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        return {
            success: true,
            message: `Sync selesai: ${totalSynced} dokumen dari ${registrationsProcessed} pendaftaran`,
            totalSynced,
            registrationsProcessed,
        };
    } catch (error) {
        console.error('Error syncing all missing documents:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
            totalSynced: 0,
            registrationsProcessed: 0,
        };
    }
}
