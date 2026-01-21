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
    console.log('📬 To: mohfahrezi93@gmail.com\n');

    const resend = new Resend(RESEND_API_KEY);

    // Test Data
    const namaLengkap = "Fulan bin Fulan";
    const registrationNumber = "PSB-2026-TEST-001";
    const unitName = "SMPIQu Al-Bahjah Buyut";

    // Style constants
    const BRAND_COLOR = '#059669'; // Emerald 600
    const ACCENT_COLOR = '#10B981'; // Emerald 500

    // Content specifically for TEST
    const info = {
        title: 'Email Test Berhasil',
        params: {
            icon: 'https://img.icons8.com/cloud/100/40C057/checked-2.png',
            bgColor: '#F0FDF4',
            borderColor: '#BBF7D0',
            textColor: '#166534',
        },
        message: `
            <p style="margin: 0 0 16px 0;">Alhamdulillah, ini adalah <strong>EMAIL TEST</strong> untuk memverifikasi desain baru template email PSB.</p>
            <p style="margin: 0;">Jika Anda melihat logo Al-Bahjah Buyut di atas dan tampilan kartu yang rapi, berarti template baru sudah berjalan dengan baik.</p>
        `,
        nextStep: {
            title: 'Sistem Siap Digunakan',
            text: 'Anda sekarang dapat menggunakan fitur kirim email notifikasi (Verified/Accepted/Rejected) melalui Panel Admin.'
        }
    };

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
                            <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">
                                Al-Bahjah Buyut
                            </h1>
                            <p style="margin: 0; font-size: 14px; color: #64748b; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
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
                                        <p style="margin: 0; font-size: 18px; font-weight: 700; color: ${info.params.textColor};">
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
                            <p style="margin: 0 0 24px 0; font-size: 16px; color: #334155; line-height: 1.6;">
                                Assalamu'alaikum Warahmatullahi Wabarakatuh,
                            </p>

                            <!-- Custom Message -->
                            <div style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 32px;">
                                ${info.message}
                            </div>

                            <!-- Detail Card -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 32px;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding-bottom: 8px;">
                                                    <p style="margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">No. Pendaftaran</p>
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
                                                    <p style="margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Unit Pendidikan</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600; color: #0f172a;">
                                                        ${unitName}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Next Step Section -->
                            <div style="border-left: 4px solid ${BRAND_COLOR}; padding-left: 20px; margin-bottom: 40px;">
                                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #0f172a;">
                                    ${info.nextStep.title}
                                </h3>
                                <p style="margin: 0; font-size: 15px; color: #475569; line-height: 1.6;">
                                    ${info.nextStep.text}
                                </p>
                            </div>

                            <!-- Sign off -->
                            <p style="margin: 0; font-size: 16px; color: #334155; line-height: 1.6;">
                                Wassalamu'alaikum Warahmatullahi Wabarakatuh,
                            </p>
                            <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: 700; color: #0f172a;">
                                Panitia PSB Al-Bahjah Buyut
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                            <p style="margin: 0 0 12px 0; font-size: 13px; color: #64748b; font-family: 'Plus Jakarta Sans', sans-serif;">
                                Butuh bantuan? Hubungi kami melalui <a href="https://wa.me/628123456789" style="color: ${BRAND_COLOR}; text-decoration: underline; font-weight: 600;">WhatsApp</a> atau <a href="mailto:psb@albahjahbuyut.com" style="color: ${BRAND_COLOR}; text-decoration: underline; font-weight: 600;">Email</a>
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                                © 2026 Al-Bahjah Buyut. All rights reserved.<br>
                                Jl. Buyut No. 1, Cirebon, Jawa Barat
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

    try {
        const { data, error } = await resend.emails.send({
            from: EMAIL_FROM,
            to: 'mohfahrezi93@gmail.com',
            subject: 'Test Email (New Template) - PSB Al-Bahjah Buyut',
            html: html,
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
