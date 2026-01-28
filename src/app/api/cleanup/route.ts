import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        console.log("Start cleaning up dummy data via API...");

        // 1. Delete Dummy Posts
        const deletedPosts = await db.post.deleteMany({
            where: {
                slug: {
                    in: [
                        'penerimaan-santri-baru-2026',
                        'kajian-bulanan-buya-yahya-januari-2026',
                        'prestasi-santri-tahfidz-2026'
                    ]
                }
            }
        });

        // 2. Delete Dummy Galleries
        const deletedGalleries = await db.gallery.deleteMany({
            where: {
                title: {
                    in: [
                        'Kegiatan Belajar Mengajar',
                        'Sholat Berjamaah',
                        'Ekstrakurikuler Memanah',
                        'Wisuda Tahfidz',
                        'Gotong Royong',
                        'Makan Bersama'
                    ]
                }
            }
        });

        // 3. Delete Dummy Majelis
        const deletedMajelis = await db.majelis.deleteMany({
            where: {
                OR: [
                    { title: { in: ['Kajian Akhlak', 'Kajian Kitab Al-Hikam', 'Majelis Keliling'] } }
                ]
            }
        });

        // 4. Delete Dummy Donation Program
        const deletedDonation = await db.donationProgram.deleteMany({
            where: {
                slug: 'infaq-pembangunan-masjid'
            }
        });

        // 5. Delete Dummy Settings
        const deletedSettings = await db.setting.deleteMany({
            where: {
                key: {
                    in: ['site_name', 'site_description', 'contact_email', 'contact_phone', 'address']
                }
            }
        });

        const result = {
            posts: deletedPosts.count,
            galleries: deletedGalleries.count,
            majelis: deletedMajelis.count,
            donations: deletedDonation.count,
            settings: deletedSettings.count
        };

        console.log("Cleanup complete!", result);

        return NextResponse.json({ success: true, result });
    } catch (error) {
        console.error("Cleanup error:", error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
