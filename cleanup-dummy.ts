import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log("Start cleaning up dummy data...");

    // 1. Delete Dummy Posts
    const deletedPosts = await prisma.post.deleteMany({
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
    console.log(`Deleted ${deletedPosts.count} dummy posts.`);

    // 2. Delete Dummy Galleries
    const deletedGalleries = await prisma.gallery.deleteMany({
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
    console.log(`Deleted ${deletedGalleries.count} dummy galleries.`);

    // 3. Delete Dummy Majelis
    // Try to delete by ID usage in seed if possible, or title
    const deletedMajelis = await prisma.majelis.deleteMany({
        where: {
            OR: [
                { id: { in: ['seed-majelis-1', 'seed-majelis-2', 'seed-majelis-3'] } },
                { title: { in: ['Kajian Akhlak', 'Kajian Kitab Al-Hikam', 'Majelis Keliling'] } }
            ]
        }
    });
    console.log(`Deleted ${deletedMajelis.count} dummy majelis.`);

    // 4. Delete Dummy Donation Program
    const deletedDonation = await prisma.donationProgram.deleteMany({
        where: {
            slug: 'infaq-pembangunan-masjid'
        }
    });
    console.log(`Deleted ${deletedDonation.count} dummy donation program.`);

    // 5. Delete Dummy Settings
    // Only delete if they match the dummy values exactly, to avoid deleting user-updated settings
    const deletedSettings = await prisma.setting.deleteMany({
        where: {
            key: {
                in: ['site_name', 'site_description', 'contact_email', 'contact_phone', 'address']
            },
            // Optional: You might want to remove this value check if you want to force delete regardless of changes
            // But usually safer to just delete by key if we are sure they are dummy keys
        }
    });
    console.log(`Deleted ${deletedSettings.count} dummy settings.`);

    console.log("Cleanup complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
