/**
 * Test Script untuk PSB Form
 * Menguji apakah form pendaftaran bekerja dengan baik
 * 
 * Jalankan dengan: npx tsx scripts/test-psb-form.ts
 */

import { db } from '../src/lib/db';
import { generateRegistrationNumber } from '../src/lib/psb-config';
import { psbFormSchema } from '../src/lib/validations';

// Dummy data untuk testing
const dummyFormData = {
    // Unit Info
    unitId: '', // akan diisi dari database
    unitName: 'SMPIQu Al-Bahjah Buyut',
    unitSlug: 'smpiqu-al-bahjah-buyut',

    // Program Spesial
    grade: 'A' as const,
    jenisSantri: 'Umum' as const,

    // Data Santri
    namaLengkap: 'Ahmad Fauzi Test',
    nisn: '1234567890',
    nik: '3209123456789012',
    noKK: '3209876543210123',
    jenisKelamin: 'L' as const,
    tempatLahir: 'Cirebon',
    tanggalLahir: '2012-05-15',
    asalSekolah: 'SD Negeri 1 Cirebon Test',
    alamatSekolahAsal: 'Jl. Pendidikan No. 123, Cirebon',

    // Data Orang Tua
    namaAyah: 'Bapak Ahmad Test',
    namaIbu: 'Ibu Fatimah Test',
    pekerjaanAyah: 'Wiraswasta',
    pekerjaanIbu: 'Ibu Rumah Tangga',
    penghasilanAyah: '3-5 Juta',
    penghasilanIbu: '< 1 Juta',
    pendidikanAyah: 'S1',
    pendidikanIbu: 'SMA/Sederajat',
    anakKe: '2',
    dariSaudara: '3',
    jumlahTanggungan: '4',
    alamatLengkap: 'Jl. Test Alamat No. 456, Desa Buyut, Kecamatan Arjawinangun, Kabupaten Cirebon, Jawa Barat 45162',
    noWaIbu: '081234567890',
    noWaAyah: '089876543210',
    sumberInfo: 'Instagram',
};

async function testPSBForm() {
    console.log('🧪 Testing PSB Form...\n');

    try {
        // 1. Get unit SMP from database
        console.log('1️⃣ Mengambil data unit SMP dari database...');
        const unit = await db.unit.findFirst({
            where: {
                OR: [
                    { slug: { contains: 'smp' } },
                    { name: { contains: 'SMP' } }
                ]
            }
        });

        if (!unit) {
            console.log('❌ Unit SMP tidak ditemukan di database');
            console.log('   Pastikan sudah ada data unit dengan slug/nama yang mengandung "smp"');
            return;
        }

        console.log(`   ✅ Unit ditemukan: ${unit.name} (ID: ${unit.id})`);

        // Update dummy data dengan unit ID yang valid
        const formData = {
            ...dummyFormData,
            unitId: unit.id,
            unitName: unit.name,
            unitSlug: unit.slug,
        };

        // 2. Validate form data dengan Zod schema
        console.log('\n2️⃣ Validasi form data dengan Zod schema...');
        try {
            const validatedData = psbFormSchema.parse(formData);
            console.log('   ✅ Validasi berhasil!');
            console.log('   Data yang divalidasi:', JSON.stringify(validatedData, null, 2).substring(0, 500) + '...');
        } catch (validationError) {
            if (validationError instanceof Error && 'issues' in validationError) {
                const zodError = validationError as any;
                console.log('   ❌ Validasi gagal:');
                zodError.issues.forEach((issue: any) => {
                    console.log(`      - ${issue.path.join('.')}: ${issue.message}`);
                });
                return;
            }
            throw validationError;
        }

        // 3. Test generate registration number
        console.log('\n3️⃣ Test generate nomor pendaftaran...');
        const regNumber = generateRegistrationNumber(formData.unitSlug);
        console.log(`   ✅ Nomor pendaftaran: ${regNumber}`);

        // 4. Test simpan ke database (tanpa upload dokumen)
        console.log('\n4️⃣ Test simpan ke database...');
        const registration = await db.pSBRegistration.create({
            data: {
                registrationNumber: regNumber,
                namaLengkap: formData.namaLengkap,
                nisn: formData.nisn,
                nik: formData.nik,
                noKK: formData.noKK,
                jenisKelamin: formData.jenisKelamin,
                tempatLahir: formData.tempatLahir,
                tanggalLahir: new Date(formData.tanggalLahir),
                asalSekolah: formData.asalSekolah,
                alamatSekolahAsal: formData.alamatSekolahAsal,
                namaAyah: formData.namaAyah,
                namaIbu: formData.namaIbu,
                pekerjaanAyah: formData.pekerjaanAyah,
                pekerjaanIbu: formData.pekerjaanIbu,
                penghasilanAyah: formData.penghasilanAyah,
                penghasilanIbu: formData.penghasilanIbu,
                pendidikanAyah: formData.pendidikanAyah,
                pendidikanIbu: formData.pendidikanIbu,
                anakKe: formData.anakKe,
                dariSaudara: formData.dariSaudara,
                jumlahTanggungan: formData.jumlahTanggungan,
                alamatLengkap: formData.alamatLengkap,
                noWaIbu: formData.noWaIbu,
                noWaAyah: formData.noWaAyah,
                sumberInfo: formData.sumberInfo,
                grade: formData.grade,
                jenisSantri: formData.jenisSantri,
                status: 'PENDING',
                unitId: formData.unitId,
                notes: '[TEST] Data dummy untuk testing PSB form',
            },
        });

        console.log(`   ✅ Berhasil disimpan ke database!`);
        console.log(`   Registration ID: ${registration.id}`);
        console.log(`   Nomor Pendaftaran: ${registration.registrationNumber}`);
        console.log(`   Grade: ${registration.grade}`);
        console.log(`   Jenis Santri: ${registration.jenisSantri}`);

        // 5. Verify data di database
        console.log('\n5️⃣ Verifikasi data di database...');
        const savedReg = await db.pSBRegistration.findUnique({
            where: { id: registration.id },
            include: { unit: true }
        });

        if (savedReg) {
            console.log('   ✅ Data berhasil diverifikasi!');
            console.log(`   - Nama: ${savedReg.namaLengkap}`);
            console.log(`   - Unit: ${savedReg.unit.name}`);
            console.log(`   - Grade: ${savedReg.grade}`);
            console.log(`   - Jenis Santri: ${savedReg.jenisSantri}`);
            console.log(`   - Status: ${savedReg.status}`);
        }

        // 6. Cleanup - hapus data test
        console.log('\n6️⃣ Cleanup - menghapus data test...');
        await db.pSBRegistration.delete({
            where: { id: registration.id }
        });
        console.log('   ✅ Data test berhasil dihapus');

        console.log('\n✅ ============================================');
        console.log('   SEMUA TEST BERHASIL!');
        console.log('   PSB Form berfungsi dengan baik.');
        console.log('   Grade dan Jenis Santri tersimpan ke database.');
        console.log('============================================\n');

    } catch (error) {
        console.error('\n❌ Error saat testing:', error);
    } finally {
        await db.$disconnect();
    }
}

// Run test
testPSBForm();
