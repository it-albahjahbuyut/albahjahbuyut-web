import { Resend } from 'resend';
import { getAppUrl } from '@/lib/env';

// Initialize Resend with API key
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Email sender configuration
const EMAIL_FROM = process.env.EMAIL_FROM || 'PSB Al-Bahjah Buyut <psb@albahjahbuyut.com>';

// Check if email is configured
export function isEmailConfigured(): boolean {
    return !!process.env.RESEND_API_KEY;
}

// ... (keep interface and getStatusEmailContent as is, we are replacing the top block and the function below)

// Email templates for different statuses
interface StatusEmailData {
    namaLengkap: string;
    registrationNumber: string;
    unitName: string;
    status: 'VERIFIED' | 'ACCEPTED' | 'REJECTED';
    notes?: string;
}

function getStatusEmailContent(data: StatusEmailData): { subject: string; html: string } {
    const { namaLengkap, registrationNumber, unitName, status, notes } = data;

    // Brand Colors
    const BRAND_COLOR = '#059669'; // Emerald 600
    const ACCENT_COLOR = '#10B981'; // Emerald 500
    const BASE_URL = getAppUrl();

    const statusInfo = {
        VERIFIED: {
            title: 'Berkas Terverifikasi',
            params: {
                icon: 'https://img.icons8.com/cloud/100/40C057/checked-2.png', // Placeholder or use emoji if images blocked
                bgColor: '#F0FDF4', // Emerald 50
                borderColor: '#BBF7D0', // Emerald 200
                textColor: '#166534', // Emerald 800
            },
            message: `
                <p style="margin: 0 0 16px 0;">Alhamdulillah, kami informasikan bahwa berkas pendaftaran calon santri atas nama <strong>${namaLengkap}</strong> telah diperiksa oleh panitia dan dinyatakan <strong>LENGKAP (TERVERIFIKASI)</strong>.</p>
                <p style="margin: 0;">Data pendaftaran Anda kini telah masuk dalam database seleksi kami.</p>
            `,
            nextStep: {
                title: 'Langkah Selanjutnya',
                text: 'Mohon menunggu informasi jadwal tes seleksi atau pengumuman selanjutnya yang akan kami kirimkan melalui email atau WhatsApp. Pastikan nomor kontak Anda selalu aktif.'
            }
        },
        ACCEPTED: {
            title: 'Selamat! Anda Diterima',
            params: {
                icon: 'https://img.icons8.com/cloud/100/40C057/trophy.png',
                bgColor: '#ECFDF5',
                borderColor: '#34D399',
                textColor: '#065F46',
            },
            message: `
                <p style="margin: 0 0 16px 0;"><strong>Bismillah, Masya Allah Tabarakallah.</strong></p>
                <p style="margin: 0;">Berdasarkan hasil seleksi yang telah dilakukan, dengan rasa syukur dan bangga kami tetapkan bahwa calon santri atas nama <strong>${namaLengkap}</strong> dinyatakan <strong>DITERIMA</strong> di ${unitName}.</p>
            `,
            nextStep: {
                title: 'Konfirmasi Kelulusan',
                text: 'Silakan segera melakukan <strong>Daftar Ulang</strong> sesuai dengan instruksi teknis yang terlampir (atau akan diinformasikan terpisah). Keterlambatan daftar ulang dapat mempengaruhi status penerimaan.'
            }
        },
        REJECTED: {
            title: 'Hasil Seleksi',
            params: {
                icon: 'https://img.icons8.com/cloud/100/FA5252/cancel.png',
                bgColor: '#FEF2F2', // Red 50
                borderColor: '#FECACA', // Red 200
                textColor: '#991B1B', // Red 800
            },
            message: `
                <p style="margin: 0 0 16px 0;">Terima kasih atas kepercayaan Ayah/Bunda mendaftarkan ananda di ${unitName}.</p>
                <p style="margin: 0;">Berdasarkan hasil seleksi yang ketat dan kuota yang terbatas, mohon maaf kami sampaikan bahwa ananda <strong>${namaLengkap}</strong> <strong>BELUM DAPAT DITERIMA</strong> pada periode tahun ajaran ini.</p>
            `,
            nextStep: {
                title: 'Jangan Berkecil Hati',
                text: 'Keputusan ini tidak mengurangi potensi ananda. Semoga Allah SWT senantiasa memberikan jalan terbaik dan kesuksesan di tempat pendidikan yang lain. Aamiin.'
            }
        },
    };

    const info = statusInfo[status];

    const html = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${info.title}</title>
    <!-- Import Font: Plus Jakarta Sans for a modern, distinct look -->
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* CSS Reset & Basics */
        body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        table { border-collapse: separate; border-spacing: 0; }
        img { border: 0; outline: none; text-decoration: none; }
        a { text-decoration: none; color: ${BRAND_COLOR}; font-weight: 600; }
        
        /* Utility */
        .text-center { text-align: center; }
        .font-bold { font-weight: 700; }
        .text-sm { font-size: 14px; }
        .text-xs { font-size: 12px; }
        .text-muted { color: #64748b; }
        .text-dark { color: #1e293b; }
        
        /* Mobile adjustment */
        @media only screen and (max-width: 600px) {
            .container { width: 100% !important; padding: 0 !important; }
            .content-padding { padding: 24px 20px !important; }
            .mobile-stack { display: block !important; width: 100% !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9;">
    
    <!-- Main Wrapper -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; padding: 40px 0;">
        <tr>
            <td align="center">
                
                <!-- Email Container -->
                <table class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden; max-width: 600px; width: 100%;">
                    
                    <!-- Decorative Top Bar -->
                    <tr>
                        <td height="6" style="background: linear-gradient(90deg, ${BRAND_COLOR} 0%, ${ACCENT_COLOR} 100%);"></td>
                    </tr>

                    <!-- Header Section -->
                    <tr>
                        <td class="content-padding" style="padding: 40px 48px 20px 48px; text-align: center;">
                            <!-- Logo -->
                            <img src="https://albahjahbuyut.com/favicon.png" alt="Logo Al-Bahjah" width="64" height="64" style="margin-bottom: 16px; width: 64px; height: 64px; object-fit: contain;">
                            
                            <!-- Hospital Name -->
                            <h1 style="margin: 0 0 8px 0; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">
                                Al-Bahjah Buyut
                            </h1>
                            <p style="margin: 0; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; font-size: 14px; color: #64748b; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
                                Penerimaan Santri Baru
                            </p>
                        </td>
                    </tr>

                    <!-- Status Hero Section -->
                    <tr>
                        <td style="padding: 0 48px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${info.params.bgColor}; border: 1px solid ${info.params.borderColor}; border-radius: 12px;">
                                <tr>
                                    <td style="padding: 24px; text-align: center;">
                                        <p style="margin: 0; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 700; color: ${info.params.textColor};">
                                            ${info.title}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td class="content-padding" style="padding: 32px 48px;">
                            
                            <!-- Greeting -->
                            <p style="margin: 0 0 24px 0; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; font-size: 16px; color: #334155; line-height: 1.6;">
                                Assalamu'alaikum Warahmatullahi Wabarakatuh,
                            </p>

                            <!-- Custom Message -->
                            <div style="font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 32px;">
                                ${info.message}
                            </div>

                            <!-- Detail Card -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 32px;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding-bottom: 8px;">
                                                    <p style="margin: 0; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">No. Pendaftaran</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding-bottom: 20px; border-bottom: 1px dashed #cbd5e1;">
                                                    <p style="margin: 0; font-family: 'SF Mono', Consolas, monospace; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: 1px;">
                                                        ${registrationNumber}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding-top: 20px;">
                                                    <p style="margin: 0; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Unit Pendidikan</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <p style="margin: 4px 0 0 0; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; color: #0f172a;">
                                                        ${unitName}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            ${notes ? `
                            <!-- Admin Notes -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 12px; margin-bottom: 32px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0 0 8px 0; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 700; color: #92400e; text-transform: uppercase; display: flex; align-items: center;">
                                            ⚠ Catatan Tambahan
                                        </p>
                                        <p style="margin: 0; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; font-size: 15px; color: #78350f; line-height: 1.5;">
                                            ${notes}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            ` : ''}

                            <!-- Next Step Section -->
                            <div style="border-left: 4px solid ${BRAND_COLOR}; padding-left: 20px; margin-bottom: 40px;">
                                <h3 style="margin: 0 0 8px 0; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 700; color: #0f172a;">
                                    ${info.nextStep.title}
                                </h3>
                                <p style="margin: 0; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; font-size: 15px; color: #475569; line-height: 1.6;">
                                    ${info.nextStep.text}
                                </p>
                            </div>

                            <!-- Sign off -->
                            <p style="margin: 0; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; font-size: 16px; color: #334155; line-height: 1.6;">
                                Wassalamu'alaikum Warahmatullahi Wabarakatuh,
                            </p>
                            <p style="margin: 8px 0 0 0; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 700; color: #0f172a;">
                                Panitia PSB Al-Bahjah Buyut
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                            <p style="margin: 0 0 12px 0; font-size: 13px; color: #64748b; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif;">
                                Butuh bantuan? Hubungi kami melalui <a href="https://wa.me/628123456789" style="color: ${BRAND_COLOR}; text-decoration: underline; font-weight: 600;">WhatsApp</a> atau <a href="mailto:psb@albahjahbuyut.com" style="color: ${BRAND_COLOR}; text-decoration: underline; font-weight: 600;">Email</a>
                            </p>
                            <p style="margin: 0; font-family: 'Plus Jakarta Sans', Helvetica, Arial, sans-serif; font-size: 12px; color: #94a3b8;">
                                © 2026 Al-Bahjah Buyut. All rights reserved.<br>
                                Jl. Revolusi No.45 Desa Buyut Kec. Gunungjati Kab. Cirebon
                            </p>
                        </td>
                    </tr>
                </table>
                <!-- End Email Container -->

            </td>
        </tr>
    </table>
</body>
</html>
    `;

    const subjectMap = {
        VERIFIED: `[Lengkap] Berkas Pendaftaran Terverifikasi - ${registrationNumber}`,
        ACCEPTED: `[PENTING] Hasil Seleksi PSB: DITERIMA - ${registrationNumber}`,
        REJECTED: `Informasi Hasil Seleksi PSB - ${registrationNumber}`,
    };

    return {
        subject: subjectMap[status],
        html,
    };
}

/**
 * Send status notification email using Resend
 * Only sends if email is provided and Resend is configured
 */
export async function sendStatusEmail(
    toEmail: string | null | undefined,
    data: StatusEmailData
): Promise<{ success: boolean; error?: string; id?: string }> {
    // Check if email is provided
    if (!toEmail) {
        console.warn(`[Email] Skipped: No email address for registration ${data.registrationNumber}`);
        return { success: false, error: 'Email orang tua tidak tersedia in database' };
    }

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
        console.error(`[Email] Failed: RESEND_API_KEY is missing in environment variables`);
        return { success: false, error: 'Server configuration error: RESEND_API_KEY missing' };
    }

    // Re-initialize Resend here to ensure we pick up the latest env var (sometimes issues with file-level consts in serverless)
    const resendClient = new Resend(process.env.RESEND_API_KEY);

    try {
        const { subject, html } = getStatusEmailContent(data);

        console.log(`[Email] Attempting to send to ${toEmail} for ${data.registrationNumber}...`);

        const { data: result, error } = await resendClient.emails.send({
            from: process.env.EMAIL_FROM || 'PSB Al-Bahjah Buyut <psb@albahjahbuyut.com>',
            to: toEmail,
            subject,
            html,
        });

        if (error) {
            console.error('[Email] Resend API error:', error);
            return { success: false, error: `Resend Error: ${error.message}` };
        }

        if (!result?.id) {
            console.error('[Email] Resend succeeded but no ID returned');
            return { success: false, error: 'No Email ID returned from Resend' };
        }

        console.log(`[Email] Successfully sent to ${toEmail}. ID: ${result.id}`);
        return { success: true, id: result.id };
    } catch (error) {
        console.error('[Email] Unexpected error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error during email sending',
        };
    }
}
