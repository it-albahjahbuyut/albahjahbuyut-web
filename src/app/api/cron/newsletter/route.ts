/**
 * Vercel Cron Job Endpoint: Automated Islamic Newsletter
 * 
 * Schedule: 2x/week
 *   - Every Monday 06:00 WIB  = Sunday 23:00 UTC  → cron: 0 23 * * 0
 *   - Every Thursday 06:00 WIB = Wednesday 23:00 UTC → cron: 0 23 * * 3
 * 
 * Combined (Vercel Hobby = 1 cron): 0 23 * * 0,3
 * 
 * Security: Protected by CRON_SECRET env variable
 * Vercel automatically sends: Authorization: Bearer <CRON_SECRET>
 */

import { type NextRequest, NextResponse } from 'next/server';
import { runNewsletterAutomation } from '@/lib/newsletter-automation';

export const maxDuration = 300; // 5 minutes max (Vercel Pro limit, Hobby = 60s)
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    // ── Security: verify CRON_SECRET ──────────────────────────────────────────
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Allow Vercel internal cron calls (they send the Bearer token automatically)
    // Also allow manual trigger from admin if secret matches
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        console.warn('[Cron] Unauthorized cron attempt blocked');
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    // Log execution info
    const day = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        timeZone: 'Asia/Jakarta',
    });
    console.log(`[Cron] Newsletter automation triggered. Day: ${day}`);

    // ── Run automation ────────────────────────────────────────────────────────
    const startTime = Date.now();

    try {
        const result = await runNewsletterAutomation();
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log(`[Cron] Completed in ${duration}s:`, result.message);

        return NextResponse.json({
            ok: result.success,
            message: result.message,
            data: {
                subject: result.subject,
                sentCount: result.sentCount,
                youtubeVideoId: result.youtubeVideoId,
                youtubeTitle: result.youtubeTitle,
                durationSeconds: duration,
            },
        });
    } catch (error: any) {
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.error('[Cron] Fatal error:', error.message);

        return NextResponse.json(
            {
                ok: false,
                error: error.message || 'Unknown error',
                durationSeconds: duration,
            },
            { status: 500 }
        );
    }
}
