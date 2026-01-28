// Script to fix missing driveFolderId from driveFolderUrl
import { db } from '../src/lib/db';

async function fixDriveFolderIds() {
    console.log('Looking for registrations with driveFolderUrl but missing driveFolderId...\n');

    const registrations = await db.pSBRegistration.findMany({
        where: {
            driveFolderUrl: { not: null },
            driveFolderId: null,
        },
        select: {
            id: true,
            registrationNumber: true,
            namaLengkap: true,
            driveFolderUrl: true,
            driveFolderId: true,
        },
    });

    if (registrations.length === 0) {
        console.log('No registrations found that need fixing.');

        // Let's check all registrations with Drive info
        const allWithDrive = await db.pSBRegistration.findMany({
            where: {
                OR: [
                    { driveFolderId: { not: null } },
                    { driveFolderUrl: { not: null } },
                ],
            },
            select: {
                id: true,
                registrationNumber: true,
                namaLengkap: true,
                driveFolderUrl: true,
                driveFolderId: true,
            },
        });

        console.log(`\nAll registrations with Drive info (${allWithDrive.length}):`);
        allWithDrive.forEach(r => {
            console.log(`- ${r.registrationNumber} (${r.namaLengkap})`);
            console.log(`  driveFolderId: ${r.driveFolderId || 'NULL'}`);
            console.log(`  driveFolderUrl: ${r.driveFolderUrl || 'NULL'}`);
        });

        // Check specific registration from URL
        const specific = await db.pSBRegistration.findUnique({
            where: { id: 'cmkcosp6h00004f27jef5nh1' },
            select: {
                id: true,
                registrationNumber: true,
                namaLengkap: true,
                driveFolderUrl: true,
                driveFolderId: true,
            },
        });

        if (specific) {
            console.log(`\nSpecific registration (cmkcosp6h00004f27jef5nh1):`);
            console.log(`- ${specific.registrationNumber} (${specific.namaLengkap})`);
            console.log(`  driveFolderId: ${specific.driveFolderId || 'NULL'}`);
            console.log(`  driveFolderUrl: ${specific.driveFolderUrl || 'NULL'}`);
        }

        return;
    }

    console.log(`Found ${registrations.length} registrations to fix:\n`);

    for (const reg of registrations) {
        const urlMatch = reg.driveFolderUrl?.match(/folders\/([a-zA-Z0-9_-]+)/);
        if (urlMatch) {
            const folderId = urlMatch[1];
            console.log(`${reg.registrationNumber} (${reg.namaLengkap})`);
            console.log(`  URL: ${reg.driveFolderUrl}`);
            console.log(`  Extracted ID: ${folderId}`);

            await db.pSBRegistration.update({
                where: { id: reg.id },
                data: { driveFolderId: folderId },
            });

            console.log(`  ✅ Updated driveFolderId\n`);
        }
    }

    console.log('Done!');
}

fixDriveFolderIds()
    .catch(console.error)
    .finally(() => db.$disconnect());
