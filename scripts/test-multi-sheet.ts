// Script untuk test pendaftaran PSB via kode
// Langsung memanggil server action submitPSBRegistration

import { db } from '../src/lib/db';
import { appendToSpreadsheet } from '../src/lib/google-sheets';

async function testPSBRegistration() {
    console.log('=== TEST PENDAFTARAN PSB MULTI-SHEET ===\n');

    // Test Case 1: SMPIQu (Sheet: SMP)
    await runTest('smpiqu', 'SMP');

    // Test Case 2: SMAIQu (Sheet: SMA)
    await runTest('smaiqu', 'SMA');

    console.log('\n=== SEMUA TEST SELESAI ===');
}

async function runTest(unitSlug: string, expectedSheet: string) {
    console.log(`\n--- Testing Unit: ${unitSlug} (Exp Sheet: ${expectedSheet}) ---`);

    // 1. Dapatkan unit
    const unit = await db.unit.findFirst({
        where: { slug: unitSlug }
    });

    if (!unit) {
        console.log(`❌ Unit ${unitSlug} tidak ditemukan! Skipping...`);
        return;
    }

    console.log(`✅ Unit ditemukan: ${unit.name}`);

    // 2. Generate registration number
    const now = new Date();
    const dateStr = now.toISOString().slice(2, 10).replace(/-/g, '').slice(0, 4); // YYMM
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const registrationNumber = `TEST${dateStr}${expectedSheet}${randomStr}`;

    console.log(`📝 Reg Number: ${registrationNumber}`);

    // 3. Test Google Sheets
    console.log(`🔄 Menambahkan ke Google Spreadsheet...`);
    try {
        const sheetResult = await appendToSpreadsheet({
            registrationNumber,
            namaLengkap: `Test Siswa ${expectedSheet}`,
            nisn: '1234567890',
            nik: '1234567890123456',
            noKK: '1234567890123456',
            jenisKelamin: 'L',
            tempatLahir: 'Cirebon',
            tanggalLahir: '2012-01-01',
            asalSekolah: `SD Asal ${expectedSheet}`,
            alamatSekolahAsal: '-',
            namaAyah: 'Wali Ayah',
            namaIbu: 'Wali Ibu',
            pekerjaanAyah: 'Wiraswasta',
            pekerjaanIbu: '-',
            penghasilanAyah: '-',
            penghasilanIbu: '-',
            pendidikanAyah: '-',
            pendidikanIbu: '-',
            anakKe: '1',
            dariSaudara: '2',
            jumlahTanggungan: '3',
            alamatLengkap: 'Jalan Test',
            noWaIbu: '0812345',
            noWaAyah: '0812345',
            sumberInfo: 'Test Script',
            unitName: unit.name,
            driveFolderUrl: 'https://drive.google.com/test',
            status: 'PENDING',
            createdAt: new Date().toISOString(),
        });

        if (sheetResult.success) {
            console.log(`✅ Berhasil! Cek sheet '${expectedSheet}' di spreadsheet.`);
        } else {
            console.log(`⚠️ Gagal: ${sheetResult.message}`);
        }
    } catch (sheetError) {
        console.log(`❌ Error Google Sheets: ${sheetError}`);
    }
}

testPSBRegistration().catch(console.error);
