/**
 * Newsletter Automation Logic
 * Handles: YouTube fetch → AI generation → Email dispatch
 */

import { db } from '@/lib/db';
import { Resend } from 'resend';
import { GoogleGenAI } from '@google/genai';
import { getLatestIslamicVideos, getIslamicFallbackTopic, type YouTubeVideo } from '@/lib/youtube';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;
const EMAIL_FROM = 'Al-Bahjah Buyut <info@albahjahbuyut.com>';
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://albahjahbuyut.com';

// Gemini models ordered by preference
const GEMINI_MODELS = [
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash-lite',
    'gemini-2.5-flash',
    'gemini-1.5-flash',
];

export interface AutoNewsletterResult {
    success: boolean;
    message: string;
    subject?: string;
    sentCount?: number;
    youtubeVideoId?: string;
    youtubeTitle?: string;
    errorLog?: string;
}

/**
 * Generate newsletter content using AI based on YouTube videos or fallback topic
 */
async function generateNewsletterContent(
    videos: YouTubeVideo[]
): Promise<{ subject: string; content: string; model: string }> {
    if (!genAI) throw new Error('Gemini AI tidak dikonfigurasi');

    // Build context from videos
    let videoContext = '';
    let primaryVideo: YouTubeVideo | null = null;

    if (videos.length > 0) {
        primaryVideo = videos[0];
        videoContext = videos.slice(0, 3).map((v, i) => `
Video ${i + 1}: "${v.title}" oleh ${v.channelTitle}
Deskripsi: ${v.description}
Link: ${v.videoUrl}
Thumbnail: ${v.thumbnailUrl}
        `.trim()).join('\n\n');
    }

    const isMonday = new Date().getDay() === 1; // 1 = Monday
    const newsletterType = isMonday
        ? 'Ringkasan Video & Kajian Islami Minggu Ini'
        : 'Mutiara Hikmah & Nasihat Islami';

    const systemPrompt = videos.length > 0
        ? `Anda adalah editor newsletter profesional untuk LPD Al-Bahjah Buyut (pondok pesantren Islami).
Tugas: Buat newsletter ${newsletterType} berdasarkan video terbaru dari Buya Yahya / Al-Bahjah TV.

Data Video Terbaru (HANYA gunakan informasi dari sini, JANGAN mengarang isi video):
${videoContext}

⚠️ ATURAN KRITIS - WAJIB DIIKUTI:
1. HANYA tulis hal yang memang tersirat dari JUDUL dan DESKRIPSI video di atas
2. JANGAN mengarang detail isi ceramah, dalil, atau poin yang tidak ada di deskripsi
3. Jika deskripsi singkat/tidak informatif, fokus pada TEMA dari judulnya saja
4. SELALU cantumkan kalimat: "Tonton video lengkapnya untuk mendapatkan ilmu yang utuh"
5. SELALU sertakan link video asli agar subscriber bisa verifikasi sendiri

Instruksi Konten:
1. **Subject**: Menarik, singkat (maks 65 karakter), bisa pakai emoji
2. **Konten Newsletter** harus berisi:
   - Salam pembuka: "Assalamu'alaikum warahmatullahi wabarakatuh"
   - Muqaddimah singkat (1-2 kalimat)
   - Thumbnail video: <img src="${primaryVideo?.thumbnailUrl}" alt="${primaryVideo?.title}">
   - Judul video yang disorot: <strong>"${primaryVideo?.title}"</strong>
   - Poin-poin tema berdasarkan judul (3-4 poin, jujur bahwa ini TEMA bukan transkripsi)
   - Ajakan menonton: <a href="${primaryVideo?.videoUrl}">▶ Tonton Video Lengkapnya di YouTube</a>
   - 1 mutiara hikmah Islami yang relevan dengan TEMA judul dalam <blockquote>
   - Info video lainnya jika ada (sebut judulnya saja + linknya)
   - Pengingat majelis rutin Al-Bahjah Buyut
   - Link donasi: <a href="${BASE_URL}/infaq">Dukung Dakwah Kami</a>
   - Penutup dengan doa & salam
3. **Domain**: HANYA gunakan ${BASE_URL} untuk link internal
4. **Format**: HTML sederhana (<p>, <strong>, <ul>, <li>, <a>, <blockquote>, <img>)
5. **Bahasa**: Indonesia yang hangat, Islami modern
6. **Panjang**: 350-500 kata

Berikan jawaban dalam format JSON murni:
{"subject": "...", "content": "... HTML content ..."}`
        : `Anda adalah editor newsletter profesional untuk LPD Al-Bahjah Buyut (pondok pesantren Islami).
Tugas: Buat newsletter ${newsletterType} dengan tema: "${getIslamicFallbackTopic()}"

Instruksi Penting:
1. **Subject**: Menarik, singkat (maks 65 karakter), clickbait Islami sopan, bisa pakai emoji
2. **Konten Newsletter** harus berisi:
   - Salam pembuka yang hangat "Assalamu'alaikum warahmatullahi wabarakatuh"
   - Muqaddimah singkat
   - 3-4 poin utama tentang tema yang diberikan dengan <ul><li>
   - 2 mutiara hikmah dalam <blockquote>
   - Ayat Al-Quran atau Hadits yang relevan dalam <blockquote>
   - Pengingat kegiatan majelis rutin Al-Bahjah Buyut
   - Link ke website: <a href="${BASE_URL}/berita">Baca Artikel Terbaru</a>
   - Link donasi: <a href="${BASE_URL}/infaq">Dukung Dakwah Kami</a>
   - Penutup dengan doa & salam
3. **Domain**: HANYA gunakan ${BASE_URL} untuk link internal
4. **Format**: HTML sederhana (<p>, <strong>, <ul>, <li>, <a>, <blockquote>)
5. **Bahasa**: Indonesia yang hangat, akrab, dan Islami modern
6. **Panjang**: 400-600 kata

Berikan jawaban dalam format JSON murni:
{"subject": "...", "content": "... HTML content ..."}`;

    let lastError: Error | null = null;

    for (const modelName of GEMINI_MODELS) {
        try {
            const response = await genAI.models.generateContent({
                model: modelName,
                contents: systemPrompt,
            });

            const text = response.text || '';
            // Strip markdown code fences if present
            let jsonStr = text.replace(/```json\s*|\s*```/g, '').trim();
            // If model added conversational text before/after JSON, extract the {...} block
            const jsonMatch = jsonStr.match(/\{[\s\S]*"subject"[\s\S]*"content"[\s\S]*\}/);
            if (jsonMatch) jsonStr = jsonMatch[0];
            const data = JSON.parse(jsonStr);

            return {
                subject: data.subject || 'Newsletter Al-Bahjah Buyut',
                content: data.content || '',
                model: modelName,
            };
        } catch (error: any) {
            lastError = error;
            console.error(`Gemini model ${modelName} failed:`, error.message);
            if (error.message?.includes('429') || error.message?.includes('503')) {
                await new Promise(r => setTimeout(r, 1500));
            }
        }
    }

    throw new Error(`Semua model Gemini gagal: ${lastError?.message}`);
}

/**
 * Build HTML email from subject + content
 */
function buildEmailHtml(subject: string, content: string, subscriberEmail: string): string {
    const styledContent = content
        .replace(/<img/g, '<img style="max-width: 100%; height: auto; border-radius: 10px; margin: 16px 0; display: block;"')
        .replace(/<h1/g, '<h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin: 24px 0 16px; line-height: 1.3;"')
        .replace(/<h2/g, '<h2 style="font-size: 20px; font-weight: 600; color: #0f172a; margin: 20px 0 12px; line-height: 1.3;"')
        .replace(/<h3/g, '<h3 style="font-size: 17px; font-weight: 600; color: #0f172a; margin: 16px 0 8px; line-height: 1.3;"')
        .replace(/<p/g, '<p style="margin: 0 0 16px; font-size: 16px; color: #334155; line-height: 1.8;"')
        .replace(/<a /g, '<a style="color: #059669; text-decoration: underline; font-weight: 600;" ')
        .replace(/<ul>/g, '<ul style="margin: 0 0 16px; padding-left: 24px;">')
        .replace(/<ol>/g, '<ol style="margin: 0 0 16px; padding-left: 24px;">')
        .replace(/<li>/g, '<li style="margin-bottom: 10px; font-size: 16px; color: #334155; line-height: 1.7;">')
        .replace(/<blockquote>/g, '<blockquote style="border-left: 4px solid #059669; padding: 12px 20px; margin: 20px 0; background: #f0fdf4; border-radius: 0 8px 8px 0; font-style: italic; color: #166534; line-height: 1.8;">');

    const unsubscribeUrl = `${BASE_URL}/unsubscribe?email=${encodeURIComponent(subscriberEmail)}`;

    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 10px;">
        <div style="max-width: 600px; width: 100%; text-align: left;">
          
          <!-- Logo -->
          <div style="text-align: center; margin-bottom: 28px;">
            <img src="${BASE_URL}/logo-buyut.png" alt="Al-Bahjah Buyut" style="height: 52px; width: auto; display: block; margin: 0 auto;" />
          </div>

          <!-- Newsletter Badge -->
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="display: inline-block; background: #dcfce7; color: #166534; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; padding: 6px 16px; border-radius: 99px; text-transform: uppercase;">
              📧 Newsletter Mingguan
            </span>
          </div>

          <!-- Main Card -->
          <div style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
            <div style="padding: 48px 40px 32px;">
              <h1 style="margin: 0 0 24px; font-size: 26px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; line-height: 1.3;">${subject}</h1>
              <div style="font-size: 16px; color: #334155; line-height: 1.8;">
                ${styledContent}
              </div>
            </div>

            <!-- Footer divider -->
            <div style="padding: 0 40px 40px;">
              <div style="height: 1px; background: linear-gradient(to right, transparent, #e2e8f0, transparent); margin-bottom: 28px;"></div>
              <p style="margin: 0; font-size: 14px; color: #94a3b8; font-style: italic; text-align: center;">
                Semoga pesan ini bermanfaat untuk mempererat ukhuwah kita semua. 🤲
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="padding: 36px 20px; text-align: center;">
            <p style="margin: 0 0 4px; font-size: 15px; font-weight: 700; color: #1e293b;">LPD Al-Bahjah Buyut</p>
            <p style="margin: 0 0 20px; font-size: 13px; color: #94a3b8; line-height: 1.5;">
              Jl. Revolusi No.45, Desa Buyut, Kecamatan Gunung Jati<br>Kabupaten Cirebon, Jawa Barat
            </p>
            <div style="margin-bottom: 20px;">
              <a href="${unsubscribeUrl}" style="display: inline-block; padding: 10px 22px; background: #fff; color: #059669; font-size: 12px; font-weight: 600; text-decoration: none; border-radius: 99px; border: 1.5px solid #d1fae5;">
                Berhenti Berlangganan
              </a>
            </div>
            <p style="margin: 0; font-size: 11px; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.06em;">
              © ${new Date().getFullYear()} AL-BAHJAH BUYUT · All Rights Reserved
            </p>
          </div>

        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Main automation function: YouTube → AI → Email
 * Called by the cron job endpoint
 */
export async function runNewsletterAutomation(): Promise<AutoNewsletterResult> {
    console.log('🕌 Starting newsletter automation...');

    if (!resend) {
        return { success: false, message: 'RESEND_API_KEY tidak dikonfigurasi' };
    }
    if (!genAI) {
        return { success: false, message: 'GEMINI_API_KEY tidak dikonfigurasi' };
    }

    let videos: YouTubeVideo[] = [];
    let generationSource = 'fallback_topic';
    let primaryVideoId: string | undefined;
    let primaryVideoTitle: string | undefined;

    // Step 1: Fetch YouTube videos
    try {
        console.log('🔍 Fetching latest YouTube videos...');
        videos = await getLatestIslamicVideos(14); // Last 14 days
        if (videos.length > 0) {
            generationSource = 'youtube_videos';
            primaryVideoId = videos[0].videoId;
            primaryVideoTitle = videos[0].title;
            console.log(`✅ Found ${videos.length} videos. Primary: "${videos[0].title}"`);
        } else {
            console.log('ℹ️ No recent videos found. Using fallback topic.');
        }
    } catch (err) {
        console.error('⚠️ YouTube fetch failed, using fallback:', err);
    }

    // Step 2: Generate content with Gemini AI
    let subject = '';
    let htmlContent = '';
    let usedModel = '';

    try {
        console.log('🤖 Generating content with Gemini AI...');
        const generated = await generateNewsletterContent(videos);
        subject = generated.subject;
        htmlContent = generated.content;
        usedModel = generated.model;
        console.log(`✅ Content generated via ${usedModel}. Subject: "${subject}"`);
    } catch (err: any) {
        const errMsg = err.message || 'Unknown AI error';
        console.error('❌ AI generation failed:', errMsg);

        // Log to DB as failed
        await db.newsletterHistory.create({
            data: {
                subject: 'AUTO: Gagal Generate Konten',
                contentPreview: `Error: ${errMsg}`,
                recipientCount: 0,
                source: 'auto',
                status: 'failed',
                errorLog: errMsg,
            } as any,
        }).catch(() => {}); // Don't throw if DB also fails

        return {
            success: false,
            message: `Gagal generate konten AI: ${errMsg}`,
            errorLog: errMsg,
        };
    }

    // Step 3: Get active subscribers
    const subscribers = await db.newsletterSubscriber.findMany({
        where: { isActive: true },
        select: { email: true, name: true },
    });

    if (subscribers.length === 0) {
        await db.newsletterHistory.create({
            data: {
                subject,
                contentPreview: htmlContent.replace(/<[^>]*>?/gm, '').substring(0, 255),
                recipientCount: 0,
                source: 'auto',
                status: 'skipped',
                youtubeVideoId: primaryVideoId,
                youtubeTitle: primaryVideoTitle,
                errorLog: 'Tidak ada subscriber aktif',
            } as any,
        }).catch(() => {});

        return { success: false, message: 'Tidak ada subscriber aktif', sentCount: 0 };
    }

    // Step 4: Send emails in batches
    const BATCH_SIZE = 50;
    let sentCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
        const batch = subscribers.slice(i, i + BATCH_SIZE);

        for (const subscriber of batch) {
            try {
                const emailHtml = buildEmailHtml(subject, htmlContent, subscriber.email);
                const plainText = htmlContent.replace(/<[^>]*>?/gm, '');

                await resend.emails.send({
                    from: EMAIL_FROM,
                    to: subscriber.email,
                    subject,
                    html: emailHtml,
                    text: plainText,
                });
                sentCount++;
            } catch (emailErr: any) {
                errors.push(`${subscriber.email}: ${emailErr.message}`);
                console.error(`Failed to send to ${subscriber.email}:`, emailErr.message);
            }
        }

        // Rate limit delay between batches
        if (i + BATCH_SIZE < subscribers.length) {
            await new Promise(r => setTimeout(r, 1200));
        }
    }

    // Step 5: Save history to DB
    const contentPreview = htmlContent.replace(/<[^>]*>?/gm, '').substring(0, 255);
    const finalStatus = sentCount > 0 ? 'sent' : 'failed';
    const errorLog = errors.length > 0 ? errors.slice(0, 10).join('\n') : null;

    try {
        await db.newsletterHistory.create({
            data: {
                subject,
                contentPreview,
                recipientCount: sentCount,
                source: 'auto',
                status: finalStatus,
                youtubeVideoId: primaryVideoId || null,
                youtubeTitle: primaryVideoTitle || null,
                errorLog,
            } as any,
        });
    } catch (dbErr) {
        console.error('Failed to save newsletter history:', dbErr);
    }

    const message = sentCount > 0
        ? `✅ Newsletter otomatis terkirim ke ${sentCount}/${subscribers.length} subscriber${errors.length > 0 ? ` (${errors.length} gagal)` : ''}`
        : '❌ Tidak ada email yang berhasil terkirim';

    console.log(message);

    return {
        success: sentCount > 0,
        message,
        subject,
        sentCount,
        youtubeVideoId: primaryVideoId,
        youtubeTitle: primaryVideoTitle,
        errorLog: errorLog || undefined,
    };
}
