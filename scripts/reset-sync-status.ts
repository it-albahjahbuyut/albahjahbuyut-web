// Script to reset spreadsheetSynced status
import { db } from '../src/lib/db';

async function resetSyncStatus() {
    const result = await db.pSBRegistration.updateMany({
        where: { spreadsheetSynced: true },
        data: { spreadsheetSynced: false }
    });

    console.log(`Reset ${result.count} registrations to spreadsheetSynced=false`);
}

resetSyncStatus()
    .catch(console.error)
    .finally(() => db.$disconnect());
