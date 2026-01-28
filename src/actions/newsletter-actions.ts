'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import { GoogleGenAI } from '@google/genai';

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const EMAIL_FROM = 'Al-Bahjah Buyut <info@albahjahbuyut.com>';

// Initialize Gemini
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

/**
 * Subscribe to newsletter
 */
export async function subscribeNewsletter(
    email: string,
    name?: string,
    source?: string
): Promise<{ success: boolean; message: string }> {
    try {
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { success: false, message: 'Format email tidak valid' };
        }

        // Check if already subscribed
        const existing = await db.newsletterSubscriber.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (existing) {
            if (existing.isActive) {
                return { success: false, message: 'Email ini sudah terdaftar' };
            } else {
                // Reactivate subscription
                await db.newsletterSubscriber.update({
                    where: { email: email.toLowerCase() },
                    data: {
                        isActive: true,
                        name: name || existing.name,
                        unsubscribedAt: null,
                        subscribedAt: new Date(),
                    }
                });
                return { success: true, message: 'Berhasil berlangganan kembali!' };
            }
        }

        // Create new subscriber
        await db.newsletterSubscriber.create({
            data: {
                email: email.toLowerCase(),
                name: name || null,
                source: source || 'unknown',
                isActive: true,
            }
        });

        revalidatePath('/admin/newsletter');

        return { success: true, message: 'Terima kasih! Email Anda sudah terdaftar.' };
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return { success: false, message: 'Terjadi kesalahan, silakan coba lagi' };
    }
}

/**
 * Unsubscribe from newsletter
 */
export async function unsubscribeNewsletter(
    email: string
): Promise<{ success: boolean; message: string }> {
    try {
        const subscriber = await db.newsletterSubscriber.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!subscriber) {
            return { success: false, message: 'Email tidak ditemukan' };
        }

        if (!subscriber.isActive) {
            return { success: false, message: 'Email sudah tidak berlangganan' };
        }

        await db.newsletterSubscriber.update({
            where: { email: email.toLowerCase() },
            data: {
                isActive: false,
                unsubscribedAt: new Date(),
            }
        });

        revalidatePath('/admin/newsletter');

        return { success: true, message: 'Anda telah berhenti berlangganan' };
    } catch (error) {
        console.error('Newsletter unsubscribe error:', error);
        return { success: false, message: 'Terjadi kesalahan, silakan coba lagi' };
    }
}

/**
 * Get all subscribers (admin only)
 */
export async function getNewsletterSubscribers() {
    try {
        const subscribers = await db.newsletterSubscriber.findMany({
            orderBy: { subscribedAt: 'desc' }
        });
        return subscribers;
    } catch (error) {
        console.error('Get subscribers error:', error);
        return [];
    }
}

/**
 * Get subscriber stats (admin only)
 */
export async function getNewsletterStats() {
    try {
        const total = await db.newsletterSubscriber.count();
        const active = await db.newsletterSubscriber.count({ where: { isActive: true } });
        const thisMonth = await db.newsletterSubscriber.count({
            where: {
                subscribedAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            }
        });

        return { total, active, inactive: total - active, thisMonth };
    } catch (error) {
        console.error('Get stats error:', error);
        return { total: 0, active: 0, inactive: 0, thisMonth: 0 };
    }
}

/**
 * Delete subscriber (admin only)
 */
export async function deleteSubscriber(id: string): Promise<{ success: boolean; message: string }> {
    try {
        await db.newsletterSubscriber.delete({
            where: { id }
        });

        revalidatePath('/admin/newsletter');

        return { success: true, message: 'Subscriber berhasil dihapus' };
    } catch (error) {
        console.error('Delete subscriber error:', error);
        return { success: false, message: 'Gagal menghapus subscriber' };
    }
}

/**
 * Get newsletter send history (admin only)
 */
export async function getNewsletterHistory() {
    try {
        const history = await db.newsletterHistory.findMany({
            orderBy: { sentAt: 'desc' },
            take: 20 // Limit to last 20 entries
        });
        return history;
    } catch (error) {
        console.error('Get newsletter history error:', error);
        return [];
    }
}

/**
 * Send newsletter to all active subscribers (admin only)
 */
export async function sendNewsletter(
    subject: string,
    content: string
): Promise<{ success: boolean; message: string; sent: number }> {
    if (!resend) {
        return { success: false, message: 'Email tidak dikonfigurasi', sent: 0 };
    }

    try {
        const subscribers = await db.newsletterSubscriber.findMany({
            where: { isActive: true },
            select: { email: true, name: true }
        });

        if (subscribers.length === 0) {
            return { success: false, message: 'Tidak ada subscriber aktif', sent: 0 };
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://albahjahbuyut.com';

        // Send in batches (Resend has rate limits)
        const BATCH_SIZE = 50;
        let sentCount = 0;

        for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
            const batch = subscribers.slice(i, i + BATCH_SIZE);

            for (const subscriber of batch) {
                try {
                    // Process content to add inline styles for better email client support
                    let styledContent = content
                        // Images: Responsive and rounded
                        .replace(/<img/g, '<img style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; display: block;"')
                        // Headings: Professional styling
                        .replace(/<h1/g, '<h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin: 24px 0 16px; line-height: 1.3;"')
                        .replace(/<h2/g, '<h2 style="font-size: 20px; font-weight: 600; color: #0f172a; margin: 20px 0 12px; line-height: 1.3;"')
                        .replace(/<h3/g, '<h3 style="font-size: 18px; font-weight: 600; color: #0f172a; margin: 16px 0 8px; line-height: 1.3;"')
                        // Paragraphs: Spacing
                        .replace(/<p/g, '<p style="margin: 0 0 16px;"')
                        // Links: Brand color
                        .replace(/<a /g, '<a style="color: #059669; text-decoration: underline; font-weight: 500;" ')
                        // Lists: Spacing and indentation
                        .replace(/<ul>/g, '<ul style="margin: 0 0 16px; padding-left: 24px;">')
                        .replace(/<ol>/g, '<ol style="margin: 0 0 16px; padding-left: 24px;">')
                        .replace(/<li>/g, '<li style="margin-bottom: 8px;">')
                        // Blockquotes
                        .replace(/<blockquote>/g, '<blockquote style="border-left: 4px solid #e2e8f0; padding-left: 16px; margin: 16px 0; color: #64748b; font-style: italic;">');

                    const emailHtml = `
                        <!DOCTYPE html>
                        <html lang="id">
                        <head>
                            <meta charset="utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <link rel="preconnect" href="https://fonts.googleapis.com">
                            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                            <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
                            <style>
                                body { margin: 0; padding: 0; background-color: #f6f9fc; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
                                .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); }
                                .header { padding: 40px 0; text-align: center; background-color: #ffffff; border-bottom: 1px solid #f1f5f9; }
                                .logo { height: 48px; width: auto; }
                                .content { padding: 48px 40px; color: #1e293b; line-height: 1.6; }
                                .content img { max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; display: block; }
                                .content h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin: 24px 0 16px; line-height: 1.3; }
                                .content h2 { font-size: 20px; font-weight: 600; color: #0f172a; margin: 20px 0 12px; line-height: 1.3; }
                                .content h3 { font-size: 18px; font-weight: 600; color: #0f172a; margin: 16px 0 8px; line-height: 1.3; }
                                .content p { margin: 0 0 16px; }
                                .content ul, .content ol { margin: 0 0 16px; padding-left: 24px; }
                                .content li { margin-bottom: 8px; }
                                .content a { color: #059669; text-decoration: underline; font-weight: 500; }
                                .content blockquote { border-left: 4px solid #e2e8f0; padding-left: 16px; margin: 16px 0; color: #64748b; font-style: italic; }
                                .title { margin: 0 0 24px; font-size: 24px; font-weight: 700; color: #0f172a; letter-spacing: -0.02em; }
                                .body-text { font-size: 16px; color: #334155; }
                                .footer { padding: 40px; background-color: #f8fafc; text-align: center; border-top: 1px solid #f1f5f9; }
                                .footer-text { margin-bottom: 24px; font-size: 14px; color: #64748b; line-height: 1.5; }
                                .unsubscribe-btn { display: inline-block; padding: 10px 24px; background-color: #ffffff; color: #059669; font-size: 13px; font-weight: 600; text-decoration: none; border-radius: 8px; border: 1px solid #d1fae5; transition: background-color 0.2s; }
                                .copyright { margin-top: 24px; font-size: 12px; color: #94a3b8; }
                                @media (max-width: 600px) {
                                    .container { margin: 0; border-radius: 0; }
                                    .content { padding: 32px 24px; }
                                    .footer { padding: 32px 24px; }
                                }
                            </style>
                        </head>
                        <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f3f4f6;">
                                <tr>
                                    <td align="center" style="padding: 40px 10px;">
                                        <div style="max-width: 600px; width: 100%; text-align: left;">
                                            <!-- Logo -->
                                            <div style="text-align: center; margin-bottom: 32px;">
                                                <img src="${baseUrl}/logo-buyut.png" alt="Al-Bahjah Buyut" style="height: 52px; width: auto; display: block; margin: 0 auto;" />
                                            </div>

                                            <!-- Main Card -->
                                            <div style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);">
                                                <div style="padding: 48px 40px;">
                                                    <h1 style="margin: 0 0 24px; font-size: 28px; font-weight: 800; color: #0f172a; letter-spacing: -0.03em; line-height: 1.2;">${subject}</h1>
                                                    <div style="font-size: 16px; color: #334155; line-height: 1.8;">
                                                        ${styledContent}
                                                    </div>
                                                </div>

                                                <!-- Call to Action placeholder if needed -->
                                                <div style="padding: 0 40px 48px;">
                                                    <div style="height: 1px; background-color: #f1f5f9; margin-bottom: 32px;"></div>
                                                    <p style="margin: 0; font-size: 14px; color: #64748b; font-style: italic;">
                                                        Semoga pesan ini bermanfaat untuk mempererat ukhuwah kita semua.
                                                    </p>
                                                </div>
                                            </div>

                                            <!-- Footer -->
                                            <div style="padding: 40px 20px; text-align: center;">
                                                <p style="margin: 0 0 12px; font-size: 14px; font-weight: 700; color: #1e293b;">LPD Al-Bahjah Buyut</p>
                                                <p style="margin: 0 0 24px; font-size: 13px; color: #94a3b8; line-height: 1.5;">
                                                    Jl. Revolusi No.45, Desa Buyut, Kecamatan Gunung Jati, Kabupaten Cirebon<br>
                                                    Indonesia
                                                </p>
                                                
                                                <div style="margin-bottom: 24px;">
                                                    <a href="${baseUrl}/unsubscribe?email=${encodeURIComponent(subscriber.email)}" style="display: inline-block; padding: 10px 20px; background-color: #ffffff; color: #059669; font-size: 12px; font-weight: 600; text-decoration: none; border-radius: 99px; border: 1px solid #d1fae5;">
                                                        Berhenti Berlangganan
                                                    </a>
                                                </div>

                                                <p style="margin: 0; font-size: 11px; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em;">
                                                    &copy; ${new Date().getFullYear()} AL-BAHJAH BUYUT. ALL RIGHTS RESERVED.
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </body>
                        </html>
                    `;

                    await resend.emails.send({
                        from: EMAIL_FROM,
                        to: subscriber.email,
                        subject: subject,
                        html: emailHtml,
                        text: content.replace(/<[^>]*>?/gm, ''), // Plain text fallback for better deliverability
                    });
                    sentCount++;
                } catch (emailError) {
                    console.error(`Failed to send to ${subscriber.email}:`, emailError);
                }
            }

            // Rate limiting delay between batches
            if (i + BATCH_SIZE < subscribers.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        // Save to history if any emails were sent
        if (sentCount > 0) {
            const plainTextPreview = content.replace(/<[^>]*>?/gm, '').substring(0, 255);
            await db.newsletterHistory.create({
                data: {
                    subject: subject,
                    contentPreview: plainTextPreview,
                    recipientCount: sentCount,
                }
            });
        }

        return {
            success: true,
            message: `Newsletter terkirim ke ${sentCount} subscriber`,
            sent: sentCount
        };
    } catch (error) {
        console.error('Send newsletter error:', error);
        return { success: false, message: 'Gagal mengirim newsletter', sent: 0 };
    }
}

/**
 * Generate newsletter content using AI
 */
// Available models to try (in order of preference)
const GEMINI_MODELS = [
    "gemini-2.5-flash-lite", // Verified working for this user
    "gemini-2.5-flash-lite-001",
    "gemini-2.0-flash-lite",
    "gemini-2.5-flash",
    "gemini-1.5-flash",
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateNewsletterAI(prompt: string): Promise<{ success: boolean; subject: string; content: string; message: string }> {
    if (!genAI) {
        return { success: false, subject: '', content: '', message: 'AI tidak dikonfigurasi (API Key kosong)' };
    }

    const systemPrompt = `Anda adalah editor newsletter profesional untuk LPD Al-Bahjah Buyut. 
    Tugas Anda adalah membuat konten newsletter berdasarkan topik yang diberikan oleh user. 
    
    Instruksi Penting:
    1. **Domain & Link**: Gunakan HANYA domain internal **https://albahjahbuyut.com**. JANGAN gunakan link eksternal (seperti al-bahjah.org, yayasanlain.com, dll).
    2. **Mapping Route**:
       - Informasi Donasi/Infaq -> arahkan ke **https://albahjahbuyut.com/infaq**
       - Pendaftaran Santri Baru (PSB) -> arahkan ke **https://albahjahbuyut.com/psb**
       - Berita/Artikel Terbaru -> arahkan ke **https://albahjahbuyut.com/berita**
       - Profil/Tentang Kami -> arahkan ke **https://albahjahbuyut.com/profil**
       - Galeri/Dokumentasi -> arahkan ke **https://albahjahbuyut.com/galeri**
    3. **Subject**: Buat Subject/Judul yang menarik, singkat (maks 60 karakter), dan clickbait islami yang sopan.
    4. **Konten**: Buat isi konten yang inspiratif, profesional, dengan nuansa islami modern.
    5. **Format HTML**: Gunakan tag HTML sederhana (<p>, <strong>, <ul>, <li>, <a>).
    
    Berikan jawaban dalam format JSON murni tanpa markdown formatting:
    {
        "subject": "Judul Email di sini",
        "content": "Isi konten HTML di sini"
    }
    
    Topik/Prompt: `;

    let lastError: Error | null = null;
    let successfulModel = '';

    for (const modelName of GEMINI_MODELS) {
        try {
            // console.log(`Attempting generation with model: ${modelName}`);

            const response = await genAI.models.generateContent({
                model: modelName,
                contents: systemPrompt + prompt
            });
            const text = response.text || '';

            // Clean up markdown code blocks if present
            const jsonStr = text.replace(/```json\s*|\s*```/g, '').trim();
            const data = JSON.parse(jsonStr);

            // console.log(`Success with model: ${modelName}`);
            successfulModel = modelName;

            return {
                success: true,
                subject: data.subject || '',
                content: data.content || '',
                message: `Konten & Judul berhasil di-generate! (via ${modelName})`
            };
        } catch (error: any) {
            lastError = error;
            console.error(`Failed with model ${modelName}:`, error.message);

            // If quota exceeded or overloaded, wait briefly before next model
            if (error.message?.includes('429') || error.message?.includes('503')) {
                await sleep(1000);
            }
        }
    }

    return {
        success: false,
        subject: '',
        content: '',
        message: `Gagal men-generate konten: ${lastError?.message || 'Semua model sedang sibuk/limit'}`
    };
}

