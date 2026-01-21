import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Webhook } from 'svix';
import { headers } from 'next/headers';

export async function POST(req: Request) {
    try {
        const payload = await req.text();
        const headersList = await headers();

        // --- WEBHOOK VERIFICATION (Optional but Recommended) ---
        // Get this from your Resend Dashboard > Webhooks
        const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET;

        if (WEBHOOK_SECRET) {
            const svix_id = headersList.get("svix-id");
            const svix_timestamp = headersList.get("svix-timestamp");
            const svix_signature = headersList.get("svix-signature");

            if (!svix_id || !svix_timestamp || !svix_signature) {
                return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
            }

            const wh = new Webhook(WEBHOOK_SECRET);

            try {
                wh.verify(payload, {
                    "svix-id": svix_id,
                    "svix-timestamp": svix_timestamp,
                    "svix-signature": svix_signature,
                });
            } catch (err) {
                console.error('[Webhook] Verification failed:', err);
                return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
            }
        } else {
            console.warn('[Webhook] RESEND_WEBHOOK_SECRET is not set. Skipping signature verification.');
        }
        // --------------------------------------------------------

        const json = JSON.parse(payload);
        const { type, data } = json;

        // Basic validation
        if (!type || !data) {
            return NextResponse.json({ error: 'Invalid payload structure' }, { status: 400 });
        }

        const emailId = data.email_id;

        console.log(`[Webhook] Received Resend event: ${type} for ${emailId}`);

        if (!emailId) {
            return NextResponse.json({ error: 'No email_id found' }, { status: 400 });
        }

        // Map Resend events to our status
        // Events: email.sent, email.delivered, email.opened, email.clicked
        let status = '';
        if (type === 'email.sent') status = 'sent';
        if (type === 'email.delivered') status = 'delivered';
        if (type === 'email.opened') status = 'opened';
        if (type === 'email.clicked') status = 'clicked';
        if (type === 'email.bounced') status = 'bounced';

        if (status) {
            // Find registration with this email ID
            // Since emailId is not unique in DB (multiple emails per reg possible), we update ANY that matches 'lastEmailId'
            // OR we just assume it updates the one where 'lastEmailId' matches.

            await db.pSBRegistration.updateMany({
                where: {
                    lastEmailId: emailId
                },
                data: {
                    emailStatus: status
                }
            });

            console.log(`[Webhook] Updated status to ${status} for email ${emailId}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Webhook] Error processing Resend webhook:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
