'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createRegistrationFolder, uploadToDrive, deleteDriveFolder } from '@/lib/google-drive';
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
        const folderResult = await createRegistrationFolder(
            formData.unitName,
            formData.namaLengkap,
            registrationNumber,
            formData.unitSlug
        );

        // Upload semua dokumen PARALLEL
        const uploadPromises = documents.map(async (doc) => {
            const buffer = Buffer.from(doc.base64Data, 'base64');

            const uploadResult = await uploadToDrive(
                buffer,
                doc.fileName,
                doc.mimeType,
                folderResult.folderId
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

        const uploadedDocuments = await Promise.all(uploadPromises);

        // Update registration dengan folder info dan documents
        await db.pSBRegistration.update({
            where: { id: registrationId },
            data: {
                driveFolderId: folderResult.folderId,
                driveFolderUrl: folderResult.folderUrl,
                documents: {
                    create: uploadedDocuments,
                },
            },
        });

        console.log(`[Background] Upload complete for ${registrationNumber}`);

        // Backup ke Spreadsheet (juga background)
        try {
            await appendToSpreadsheet({
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

            console.log(`[Background] Spreadsheet backup complete for ${registrationNumber}`);
        } catch (sheetError) {
            console.error('[Background] Spreadsheet error:', sheetError);
        }

        // Note: revalidatePath cannot be called in background/render context
        // Cache is already revalidated in the main submitPSBRegistration function

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
 * Sends email notification if parent email is provided
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
            sendStatusEmail(registration.emailOrangTua, {
                namaLengkap: registration.namaLengkap,
                registrationNumber: registration.registrationNumber,
                unitName: registration.unit.name,
                status: status as 'VERIFIED' | 'ACCEPTED' | 'REJECTED',
                notes: notes,
            }).then((result) => {
                if (result.success) {
                    console.log(`[PSB] Email sent for ${registration.registrationNumber}`);
                } else if (result.error) {
                    console.error(`[PSB] Email failed for ${registration.registrationNumber}:`, result.error);
                }
            }).catch((err) => {
                console.error('[PSB] Email send error:', err);
            });
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
                    sendStatusEmail(reg.emailOrangTua, {
                        namaLengkap: reg.namaLengkap,
                        registrationNumber: reg.registrationNumber,
                        unitName: reg.unit.name,
                        status: status as 'VERIFIED' | 'ACCEPTED' | 'REJECTED',
                    }).catch((err) => {
                        console.error(`[Bulk] Email failed for ${reg.registrationNumber}:`, err);
                    });
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
