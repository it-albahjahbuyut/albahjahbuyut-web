// Script untuk update header Google Sheets
import 'dotenv/config'; // Load .env file
import { google } from 'googleapis';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';

const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || '';
const GOOGLE_SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || '';

async function updateHeaders() {
    console.log('=== UPDATE HEADERS SPREADSHEET ===\n');

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN || !GOOGLE_SPREADSHEET_ID) {
        console.error('❌ Konfigurasi Google Sheets tidak lengkap di .env');
        return;
    }

    // Init Auth
    const { google } = require('googleapis');
    const oauth2Client = new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
        refresh_token: GOOGLE_REFRESH_TOKEN
    });

    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

    // New Headers
    const headerRow = [
        'Nomor Pendaftaran',
        'Nama Lengkap',
        'NISN',
        'NIK',
        'No KK',
        'Jenis Kelamin',
        'Tempat Lahir',
        'Tanggal Lahir',
        'Asal Sekolah',
        'Alamat Sekolah Asal',
        'Nama Ayah',
        'Nama Ibu',
        'Pekerjaan Ayah',
        'Pekerjaan Ibu',
        'Penghasilan Ayah',
        'Penghasilan Ibu',
        'Pendidikan Ayah',
        'Pendidikan Ibu',
        'Anak Ke',
        'Dari Saudara',
        'Jumlah Tanggungan',
        'Alamat Orang Tua',
        'No WA Ibu',
        'No WA Ayah',
        'Sumber Info',
        'Unit Pendidikan',
        'Link Drive',
        'Status',
        'Tanggal Daftar'
    ];

    try {
        console.log('🔄 Mengupdate header di baris 1...');

        // Update row 1
        const response = await sheets.spreadsheets.values.update({
            spreadsheetId: GOOGLE_SPREADSHEET_ID,
            range: 'PSB!A1', // Asumsi nama sheet 'PSB', sesuaikan jika beda
            valueInputOption: 'RAW',
            requestBody: {
                values: [headerRow]
            },
        });

        console.log(`✅ Header berhasil diupdate!`);
        console.log(`${response.data.updatedCells} cells updated.`);

    } catch (error) {
        console.error('❌ Gagal update header:', error);

        // Jika gagal karena nama sheet salah, coba cari nama sheet pertama
        try {
            console.log('⚠️ Mencoba mendapatkan nama sheet pertama...');
            const metadata = await sheets.spreadsheets.get({
                spreadsheetId: GOOGLE_SPREADSHEET_ID
            });

            const firstSheetName = metadata.data.sheets[0].properties.title;
            console.log(`📄 Nama sheet pertama: ${firstSheetName}`);

            const responseRetry = await sheets.spreadsheets.values.update({
                spreadsheetId: GOOGLE_SPREADSHEET_ID,
                range: `'${firstSheetName}'!A1`,
                valueInputOption: 'RAW',
                requestBody: {
                    values: [headerRow]
                },
            });

            console.log(`✅ Header berhasil diupdate di sheet '${firstSheetName}'!`);
        } catch (retryError) {
            console.error('❌ Tetap gagal:', retryError);
        }
    }
}

updateHeaders().catch(console.error);
