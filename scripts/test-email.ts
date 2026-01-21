/**
 * Test script untuk mengirim email PSB
 * Run: npx tsx scripts/test-email.ts
 */

import 'dotenv/config';
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'Acme <onboarding@resend.dev>';

async function testEmail() {
    console.log('🚀 Testing Email with Resend...\n');

    if (!RESEND_API_KEY) {
        console.error('❌ RESEND_API_KEY not found in environment variables!');
        console.log('\nPlease add to your .env:');
        console.log('RESEND_API_KEY="re_xxxxxxxxxxxxx"');
        process.exit(1);
    }

    console.log('✅ RESEND_API_KEY found');
    console.log(`📧 From: ${EMAIL_FROM}`);
    console.log('📬 To: ahmadofficial@gmail.com\n');

    const resend = new Resend(RESEND_API_KEY);

    try {
        const { data, error } = await resend.emails.send({
            from: EMAIL_FROM,
            to: 'ahmadofficial@gmail.com',
            subject: 'Test Email - PSB Al-Bahjah Buyut',
            html: `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Email PSB</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 32px 16px;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 32px 32px 24px 32px; text-align: center; border-bottom: 1px solid #e2e8f0;">
                            <h1 style="margin: 0; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;">
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
                            <div style="background-color: #ECFDF5; border-left: 3px solid #10B981; padding: 16px 20px; margin-bottom: 24px;">
                                <p style="margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 600; color: #065F46;">
                                    ✓ Test Berhasil
                                </p>
                            </div>
                            
                            <p style="margin: 0 0 16px 0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; color: #334155; line-height: 1.6;">
                                Assalamu'alaikum Warahmatullahi Wabarakatuh,
                            </p>
                            
                            <p style="margin: 0 0 20px 0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; color: #334155; line-height: 1.7;">
                                Ini adalah email test dari sistem PSB Al-Bahjah Buyut. Jika Anda menerima email ini, berarti konfigurasi <strong>Resend</strong> sudah benar dan siap digunakan untuk notifikasi kepada pendaftar.
                            </p>
                            
                            <!-- Timestamp -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 6px; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 16px;">
                                        <p style="margin: 0 0 4px 0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 500; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                                            Waktu Pengiriman
                                        </p>
                                        <p style="margin: 0; font-family: 'SF Mono', 'Roboto Mono', monospace; font-size: 14px; font-weight: 600; color: #0f172a;">
                                            ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'full', timeStyle: 'medium' })} WIB
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
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
                                Email ini dikirim otomatis dari sistem PSB.
                            </p>
                        </td>
                    </tr>
                </table>
                
                <p style="margin: 24px 0 0 0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; color: #94a3b8; text-align: center;">
                    © 2026 Al-Bahjah Buyut · Cirebon, Jawa Barat
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
            `,
        });

        if (error) {
            console.error('❌ Error:', error);
            return;
        }

        console.log('✅ Email sent successfully!');
        console.log('📋 Email ID:', data?.id);
        console.log('\n🎉 Check inbox mohfahrezi93@gmail.com (or spam folder)');
    } catch (err) {
        console.error('❌ Failed to send:', err);
    }
}

testEmail();
