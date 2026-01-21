import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender configuration
const EMAIL_FROM = process.env.EMAIL_FROM || 'PSB Al-Bahjah Buyut <psb@albahjahbuyut.com>';

// Check if email is configured
export function isEmailConfigured(): boolean {
    return !!process.env.RESEND_API_KEY;
}

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

    const statusInfo = {
        VERIFIED: {
            title: 'Berkas Terverifikasi',
            emoji: '✓',
            bgColor: '#EFF6FF',
            borderColor: '#3B82F6',
            textColor: '#1E40AF',
            message: `Berkas pendaftaran atas nama <strong>${namaLengkap}</strong> di ${unitName} telah kami verifikasi dan dinyatakan <strong>lengkap</strong>.`,
            nextStep: 'Mohon menunggu pengumuman selanjutnya mengenai hasil seleksi penerimaan santri baru.',
        },
        ACCEPTED: {
            title: 'Diterima',
            emoji: '🎉',
            bgColor: '#ECFDF5',
            borderColor: '#10B981',
            textColor: '#065F46',
            message: `Alhamdulillah, dengan ini kami sampaikan bahwa <strong>${namaLengkap}</strong> telah <strong>diterima</strong> sebagai santri baru di ${unitName}.`,
            nextStep: 'Silakan melakukan daftar ulang sesuai jadwal yang akan kami informasikan. Jazakumullahu khairan atas kepercayaannya.',
        },
        REJECTED: {
            title: 'Belum Diterima',
            emoji: '',
            bgColor: '#FEF2F2',
            borderColor: '#EF4444',
            textColor: '#991B1B',
            message: `Dengan berat hati kami sampaikan bahwa pendaftaran atas nama <strong>${namaLengkap}</strong> di ${unitName} <strong>belum dapat kami terima</strong> pada periode ini.`,
            nextStep: 'Semoga Allah SWT senantiasa memberikan jalan terbaik. Terima kasih atas kepercayaan Anda kepada Al-Bahjah Buyut.',
        },
    };

    const info = statusInfo[status];

    const html = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pemberitahuan PSB Al-Bahjah Buyut</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 32px 16px;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0;">
                    
                    <!-- Logo Header -->
                    <tr>
                        <td style="padding: 32px 32px 24px 32px; text-align: center; border-bottom: 1px solid #e2e8f0;">
                            <h1 style="margin: 0; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;">
                                Al-Bahjah Buyut
                            </h1>
                            <p style="margin: 4px 0 0 0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; color: #64748b;">
                                Penerimaan Santri Baru 2026/2027
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 32px;">
                            <!-- Status Box -->
                            <div style="background-color: ${info.bgColor}; border-left: 3px solid ${info.borderColor}; padding: 16px 20px; margin-bottom: 24px;">
                                <p style="margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 600; color: ${info.textColor};">
                                    ${info.emoji ? info.emoji + ' ' : ''}Status: ${info.title}
                                </p>
                            </div>
                            
                            <!-- Greeting -->
                            <p style="margin: 0 0 16px 0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; color: #334155; line-height: 1.6;">
                                Assalamu'alaikum Warahmatullahi Wabarakatuh,
                            </p>
                            
                            <!-- Message -->
                            <p style="margin: 0 0 20px 0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; color: #334155; line-height: 1.7;">
                                ${info.message}
                            </p>
                            
                            <!-- Registration Number -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 6px; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 16px;">
                                        <p style="margin: 0 0 4px 0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 500; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                                            No. Pendaftaran
                                        </p>
                                        <p style="margin: 0; font-family: 'SF Mono', 'Roboto Mono', monospace; font-size: 16px; font-weight: 600; color: #0f172a; letter-spacing: 0.5px;">
                                            ${registrationNumber}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            ${notes ? `
                            <!-- Notes -->
                            <div style="background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 6px; padding: 14px 16px; margin-bottom: 20px;">
                                <p style="margin: 0 0 4px 0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 600; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px;">
                                    Catatan
                                </p>
                                <p style="margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; color: #78350f; line-height: 1.5;">
                                    ${notes}
                                </p>
                            </div>
                            ` : ''}
                            
                            <!-- Next Step -->
                            <p style="margin: 0 0 24px 0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; color: #334155; line-height: 1.7;">
                                ${info.nextStep}
                            </p>
                            
                            <!-- Closing -->
                            <p style="margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; color: #334155; line-height: 1.6;">
                                Wassalamu'alaikum Warahmatullahi Wabarakatuh,
                            </p>
                            <p style="margin: 8px 0 0 0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 600; color: #0f172a;">
                                Panitia PSB Al-Bahjah Buyut
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
                            <p style="margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; color: #94a3b8;">
                                Email ini dikirim otomatis. Untuk pertanyaan, hubungi panitia PSB.
                            </p>
                        </td>
                    </tr>
                </table>
                
                <!-- Bottom Text -->
                <p style="margin: 24px 0 0 0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; color: #94a3b8; text-align: center;">
                    © 2026 Al-Bahjah Buyut · Cirebon, Jawa Barat
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    const subjectMap = {
        VERIFIED: `Berkas Terverifikasi - ${registrationNumber}`,
        ACCEPTED: `Selamat! Anda Diterima - ${registrationNumber}`,
        REJECTED: `Pemberitahuan Pendaftaran - ${registrationNumber}`,
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
): Promise<{ success: boolean; error?: string }> {
    // Skip if no email provided
    if (!toEmail) {
        console.log(`[Email] Skipped: No email address for ${data.registrationNumber}`);
        return { success: true }; // Not an error, just skipped
    }

    // Skip if Resend not configured
    if (!isEmailConfigured()) {
        console.log(`[Email] Skipped: Resend API key not configured`);
        return { success: true }; // Not an error, just skipped
    }

    try {
        const { subject, html } = getStatusEmailContent(data);

        const { data: result, error } = await resend.emails.send({
            from: EMAIL_FROM,
            to: toEmail,
            subject,
            html,
        });

        if (error) {
            console.error('[Email] Resend error:', error);
            return { success: false, error: error.message };
        }

        console.log(`[Email] Sent to ${toEmail} for ${data.registrationNumber}, ID: ${result?.id}`);
        return { success: true };
    } catch (error) {
        console.error('[Email] Failed to send:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
