/**
 * Script: Test Newsletter Automation Secara Manual
 *
 * Cara jalankan:
 *   npx tsx scripts/test-newsletter-auto.ts
 *
 * Pastikan:
 *   1. Dev server TIDAK perlu running (langsung hit database)
 *   2. File .env sudah ada GEMINI_API_KEY, RESEND_API_KEY, YOUTUBE_API_KEY
 */

import 'dotenv/config';

// ─────────────────────────────────────────────────────────────────────────────
// Konfigurasi Test
// ─────────────────────────────────────────────────────────────────────────────
const TEST_CONFIG = {
    // Set true kalau mau kirim email beneran ke subscriber
    // Set false untuk dry-run (hanya generate konten, tidak kirim)
    SEND_REAL_EMAIL: true,

    // Override email target untuk testing (hanya berlaku jika SEND_REAL_EMAIL: true)
    TEST_EMAIL: 'mohfahrezi93@gmail.com',
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

function log(emoji: string, msg: string, color = RESET) {
    console.log(`${color}${emoji} ${msg}${RESET}`);
}

function separator(title: string) {
    console.log(`\n${CYAN}${'─'.repeat(60)}${RESET}`);
    console.log(`${BOLD}${CYAN}  ${title}${RESET}`);
    console.log(`${CYAN}${'─'.repeat(60)}${RESET}\n`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Test 1: Cek Environment Variables
// ─────────────────────────────────────────────────────────────────────────────
function testEnvVars() {
    separator('Step 1: Cek Environment Variables');

    const required = {
        YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        DATABASE_URL: process.env.DATABASE_URL,
    };

    let allOk = true;
    for (const [key, val] of Object.entries(required)) {
        if (val) {
            log('✅', `${key}: ${val.substring(0, 8)}...`, GREEN);
        } else {
            log('❌', `${key}: TIDAK ADA!`, RED);
            allOk = false;
        }
    }

    // Optional vars
    log('ℹ️', `CRON_SECRET: ${process.env.CRON_SECRET ? 'ada' : 'tidak ada (ok untuk local)'}`, DIM);
    log('ℹ️', `NEXT_PUBLIC_APP_URL: ${process.env.NEXT_PUBLIC_APP_URL || 'https://albahjahbuyut.com (default)'}`, DIM);

    if (!allOk) {
        throw new Error('Ada environment variable yang belum dikonfigurasi!');
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Test 2: YouTube API
// ─────────────────────────────────────────────────────────────────────────────
async function testYouTubeAPI() {
    separator('Step 2: Test YouTube API - Fetch Video Terbaru');

    const { getLatestIslamicVideos } = await import('../src/lib/youtube');

    log('🔍', 'Mengambil video terbaru dari Buya Yahya & Al-Bahjah TV...', YELLOW);
    const videos = await getLatestIslamicVideos(14);

    if (videos.length === 0) {
        log('⚠️', 'Tidak ada video ditemukan dalam 14 hari terakhir.', YELLOW);
        log('ℹ️', 'Akan menggunakan fallback topic Islami.', DIM);

        const { getIslamicFallbackTopic } = await import('../src/lib/youtube');
        const fallback = getIslamicFallbackTopic();
        log('📝', `Fallback topic: "${fallback}"`, CYAN);
    } else {
        log('✅', `Ditemukan ${videos.length} video:`, GREEN);
        videos.forEach((v, i) => {
            console.log(`\n  ${BOLD}Video ${i + 1}:${RESET}`);
            console.log(`  ${DIM}Channel:${RESET}   ${v.channelTitle}`);
            console.log(`  ${DIM}Judul:${RESET}     ${v.title}`);
            console.log(`  ${DIM}Published:${RESET} ${new Date(v.publishedAt).toLocaleDateString('id-ID')}`);
            console.log(`  ${DIM}URL:${RESET}       ${v.videoUrl}`);
            console.log(`  ${DIM}Thumbnail:${RESET} ${v.thumbnailUrl}`);
        });
    }

    return videos;
}

// ─────────────────────────────────────────────────────────────────────────────
// Test 3: AI Content Generation
// ─────────────────────────────────────────────────────────────────────────────
async function testAIGeneration(videos: any[]) {
    separator('Step 3: Test Gemini AI - Generate Konten Newsletter');

    const { GoogleGenAI } = await import('@google/genai');
    const { getIslamicFallbackTopic } = await import('../src/lib/youtube');

    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const GEMINI_MODELS = [
        'gemini-2.5-flash-lite',
        'gemini-2.0-flash-lite',
        'gemini-2.5-flash',
        'gemini-1.5-flash',
    ];

    const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://albahjahbuyut.com';
    const primaryVideo = videos[0] || null;

    const videoContext = videos.length > 0
        ? videos.slice(0, 3).map((v: any, i: number) => `Video ${i + 1}: "${v.title}" - ${v.videoUrl}`).join('\n')
        : '';

    const prompt = videos.length > 0
        ? `Anda adalah editor newsletter untuk LPD Al-Bahjah Buyut.
Buat newsletter mingguan islami berdasarkan video terbaru berikut:
${videoContext}

Instruksi:
- Subject: menarik, maks 65 karakter, bisa pakai emoji
- Konten: salam, ringkasan video, mutiara hikmah, ajakan nonton, penutup doa
- Format JSON: {"subject": "...", "content": "... HTML ..."}`
        : `Anda adalah editor newsletter untuk LPD Al-Bahjah Buyut.
Buat newsletter mingguan islami tentang: "${getIslamicFallbackTopic()}"

Instruksi:
- Subject: menarik, maks 65 karakter, bisa pakai emoji
- Konten: salam, isi tema, mutiara hikmah, link ${BASE_URL}/berita, penutup doa
- Format JSON: {"subject": "...", "content": "... HTML ..."}`;

    log('🤖', 'Generating konten dengan Gemini AI...', YELLOW);

    let lastError: Error | null = null;
    for (const modelName of GEMINI_MODELS) {
        try {
            process.stdout.write(`  Mencoba model: ${modelName}... `);
            const response = await genAI.models.generateContent({
                model: modelName,
                contents: prompt,
            });

            const text = response.text || '';
            let jsonStr = text.replace(/```json\s*|\s*```/g, '').trim();
            const jsonMatch = jsonStr.match(/\{[\s\S]*"subject"[\s\S]*"content"[\s\S]*\}/);
            if (jsonMatch) jsonStr = jsonMatch[0];
            const data = JSON.parse(jsonStr);

            console.log(`${GREEN}✅ Berhasil!${RESET}`);
            console.log(`\n  ${BOLD}Subject:${RESET}`);
            console.log(`  ${CYAN}"${data.subject}"${RESET}`);
            console.log(`\n  ${BOLD}Preview Konten (150 chars):${RESET}`);
            const preview = (data.content || '').replace(/<[^>]*>/g, '').substring(0, 150);
            console.log(`  ${DIM}${preview}...${RESET}`);
            console.log(`\n  ${DIM}Panjang konten: ${data.content?.length || 0} karakter${RESET}`);

            return { subject: data.subject, content: data.content, model: modelName };
        } catch (err: any) {
            console.log(`${RED}❌ Gagal${RESET} - ${err.message?.substring(0, 60)}`);
            lastError = err;
        }
    }

    throw new Error(`Semua model Gemini gagal: ${lastError?.message}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Test 4: Dry-run atau Send Email
// ─────────────────────────────────────────────────────────────────────────────
async function testEmailSend(subject: string, content: string) {
    separator('Step 4: Test Pengiriman Email');

    if (!TEST_CONFIG.SEND_REAL_EMAIL) {
        log('ℹ️', 'Mode DRY-RUN (tidak kirim email)', YELLOW);
        log('ℹ️', 'Ubah SEND_REAL_EMAIL: true di script ini untuk kirim beneran', DIM);
        log('✅', 'Simulasi berhasil! Konten sudah siap untuk dikirim.', GREEN);
        return;
    }

    // Send ke 1 email test saja (bukan semua subscriber)
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://albahjahbuyut.com';

    log('📧', `Mengirim test email ke: ${TEST_CONFIG.TEST_EMAIL}`, YELLOW);

    try {
        const result = await resend.emails.send({
            from: 'Al-Bahjah Buyut <info@albahjahbuyut.com>',
            to: TEST_CONFIG.TEST_EMAIL,
            subject: `[TEST] ${subject}`,
            html: `<h3 style="color:red;">[TEST EMAIL - Bukan Newsletter Resmi]</h3>${content}`,
            text: content.replace(/<[^>]*>/g, ''),
        });

        log('✅', `Email terkirim! ID: ${result.data?.id}`, GREEN);
    } catch (err: any) {
        log('❌', `Gagal kirim email: ${err.message}`, RED);
        throw err;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Test 5: Database Check
// ─────────────────────────────────────────────────────────────────────────────
async function testDatabase() {
    separator('Step 5: Cek Database - Jumlah Subscriber Aktif');

    // Import the project's shared db client (uses PrismaPg adapter for Supabase)
    const { db } = await import('../src/lib/db');

    try {
        const activeCount = await db.newsletterSubscriber.count({
            where: { isActive: true },
        });
        const totalCount = await db.newsletterSubscriber.count();

        log('✅', `Total subscriber: ${totalCount}`, GREEN);
        log('✅', `Subscriber aktif: ${activeCount}`, GREEN);

        if (activeCount === 0) {
            log('⚠️', 'Tidak ada subscriber aktif! Newsletter tidak akan terkirim.', YELLOW);
        } else {
            log('✅', `Newsletter akan dikirim ke ${activeCount} orang ketika cron berjalan.`, GREEN);
        }

        const lastHistory = await (db.newsletterHistory as any).findFirst({
            orderBy: { sentAt: 'desc' },
        });

        if (lastHistory) {
            log('ℹ️', `Newsletter terakhir dikirim: ${new Date(lastHistory.sentAt).toLocaleString('id-ID')}`, DIM);
            log('ℹ️', `Subject: "${lastHistory.subject}"`, DIM);
            log('ℹ️', `Penerima: ${lastHistory.recipientCount}`, DIM);
        }
    } finally {
        await db.$disconnect();
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN - Run All Tests
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
    console.log(`\n${BOLD}${CYAN}╔════════════════════════════════════════════════════╗${RESET}`);
    console.log(`${BOLD}${CYAN}║   🕌 TEST NEWSLETTER AUTOMATION - Al-Bahjah Buyut  ║${RESET}`);
    console.log(`${BOLD}${CYAN}╚════════════════════════════════════════════════════╝${RESET}\n`);

    const startTime = Date.now();

    try {
        // Step 1
        testEnvVars();

        // Step 2: YouTube
        const videos = await testYouTubeAPI();

        // Step 3: AI Generation
        const { subject, content } = await testAIGeneration(videos);

        // Step 4: Email (dry-run by default)
        await testEmailSend(subject, content);

        // Step 5: Database
        await testDatabase();

        // ─── Final Summary ────────────────────────────────────────────────────
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        separator(`✅ SEMUA TEST BERHASIL (${duration}s)`);
        log('🎉', 'Sistem newsletter automation siap digunakan!', GREEN);
        log('📅', 'Akan otomatis berjalan setiap Senin & Kamis jam 06:00 WIB', CYAN);
        log('🔗', 'Monitor di: https://albahjahbuyut.com/admin/newsletter', CYAN);

    } catch (error: any) {
        separator('❌ TEST GAGAL');
        log('💥', `Error: ${error.message}`, RED);
        console.error(error);
        process.exit(1);
    }
}

main();
