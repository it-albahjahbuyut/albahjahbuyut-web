'use server';

import { google } from 'googleapis';

// Konfigurasi Google Sheets API (menggunakan OAuth2 yang sama dengan Drive)
const GOOGLE_CLIENT_ID = (process.env.GOOGLE_CLIENT_ID || '').trim();
const GOOGLE_CLIENT_SECRET = (process.env.GOOGLE_CLIENT_SECRET || '').trim();
const GOOGLE_REFRESH_TOKEN = (process.env.GOOGLE_REFRESH_TOKEN || '').trim();
const GOOGLE_SPREADSHEET_ID = (process.env.GOOGLE_SPREADSHEET_ID || '').trim();

// Check if Google Sheets is configured
const isGoogleSheetsConfigured = () => {
    return !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REFRESH_TOKEN && GOOGLE_SPREADSHEET_ID);
};

// Lazy initialization of auth and sheets
let auth: any = null;
let sheets: ReturnType<typeof google.sheets> | null = null;

const initGoogleSheets = () => {
    if (!isGoogleSheetsConfigured()) {
        console.log('Google Sheets not configured, skipping spreadsheet backup');
        return false;
    }

    if (!auth) {
        const oauth2Client = new google.auth.OAuth2(
            GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET,
            'https://developers.google.com/oauthplayground'
        );

        oauth2Client.setCredentials({
            refresh_token: GOOGLE_REFRESH_TOKEN
        });

        auth = oauth2Client;
    }

    if (!sheets) {
        sheets = google.sheets({ version: 'v4', auth });
    }

    return true;
};

export interface PSBSpreadsheetData {
    registrationNumber: string;
    namaLengkap: string;
    nisn?: string;
    nik?: string;
    noKK?: string;
    jenisKelamin: string;
    tempatLahir: string;
    tanggalLahir: string;
    asalSekolah: string;
    alamatSekolahAsal?: string;
    namaAyah?: string;
    namaIbu?: string;
    pekerjaanAyah?: string;
    pekerjaanIbu?: string;
    penghasilanAyah?: string;
    penghasilanIbu?: string;
    pendidikanAyah?: string;
    pendidikanIbu?: string;
    anakKe?: string;
    dariSaudara?: string;
    jumlahTanggungan?: string;
    alamatLengkap: string;
    noWaIbu?: string;
    noWaAyah?: string;
    sumberInfo?: string;
    grade?: string;
    jenisSantri?: string;
    unitName: string;
    driveFolderUrl: string;
    status: string;
    createdAt: string;
}


/**
 * Get the name of the first sheet in the spreadsheet
 */
async function getFirstSheetName(): Promise<string> {
    if (!sheets) return 'Sheet1';

    try {
        const response = await sheets.spreadsheets.get({
            spreadsheetId: GOOGLE_SPREADSHEET_ID,
            fields: 'sheets.properties.title'
        });

        const firstSheet = response.data.sheets?.[0]?.properties?.title;
        return firstSheet || 'Sheet1';
    } catch (error) {
        console.error('Error getting sheet name:', error);
        return 'Sheet1';
    }
}

// Helper untuk mendapatkan nama sheet berdasarkan nama unit
function getSheetNameFromUnit(unitName: string): string {
    const lowerName = unitName.toLowerCase();
    if (lowerName.includes('smpiqu') || lowerName.includes('smp')) return 'SMP';
    if (lowerName.includes('smaiqu') || lowerName.includes('sma')) return 'SMA';
    if (lowerName.includes('sdiqu') || lowerName.includes('sd')) return 'SD';
    if (lowerName.includes('paud')) return 'PAUD';
    if (lowerName.includes('tahfidz')) return 'TAHFIDZ';
    if (lowerName.includes('tafaqquh')) return 'TAFAQQUH';
    return 'LAINNYA'; // Fallback
}

/**
 * Ensure the spreadsheet has the correct headers for specific sheet
 */
async function ensureSheetHeaders(sheetName: string): Promise<string> {
    if (!sheets) return sheetName;

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
        'Grade',
        'Jenis Santri',
        'Unit Pendidikan',
        'Link Drive',
        'Status',
        'Tanggal Daftar'
    ];

    try {
        // Cek apakah sheet sudah ada
        try {
            await sheets.spreadsheets.values.get({
                spreadsheetId: GOOGLE_SPREADSHEET_ID,
                range: `'${sheetName}'!A1`,
            });
            // Jika sukses, berarti sheet ada. Cek header.
            const headerCheck = await sheets.spreadsheets.values.get({
                spreadsheetId: GOOGLE_SPREADSHEET_ID,
                range: `'${sheetName}'!A1:A1`,
            });

            // Jika A1 kosong, isi header
            if (!headerCheck.data.values || headerCheck.data.values.length === 0) {
                await sheets.spreadsheets.values.update({
                    spreadsheetId: GOOGLE_SPREADSHEET_ID,
                    range: `'${sheetName}'!A1`,
                    valueInputOption: 'RAW',
                    requestBody: { values: [headerRow] }
                });
                console.log(`Headers created in existing sheet: ${sheetName}`);
            }

        } catch (error) {
            // Jika error, asumsikan sheet belum ada, maka buat sheet baru
            console.log(`Sheet '${sheetName}' not found, creating new sheet...`);

            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: GOOGLE_SPREADSHEET_ID,
                requestBody: {
                    requests: [{
                        addSheet: {
                            properties: {
                                title: sheetName,
                                gridProperties: {
                                    rowCount: 1000,
                                    columnCount: 30
                                }
                            }
                        }
                    }]
                }
            });

            // Isi header untuk sheet baru
            await sheets.spreadsheets.values.update({
                spreadsheetId: GOOGLE_SPREADSHEET_ID,
                range: `'${sheetName}'!A1`,
                valueInputOption: 'RAW',
                requestBody: { values: [headerRow] }
            });
            console.log(`Sheet '${sheetName}' created with headers`);
        }

        return sheetName;
    } catch (error) {
        console.error(`Error ensuring headers for ${sheetName}:`, error);
        // Fallback ke sheet pertama jika gagal total (jarang terjadi)
        return 'Sheet1';
    }
}

/**
 * Append a new registration to the spreadsheet
 */
export async function appendToSpreadsheet(data: PSBSpreadsheetData): Promise<{ success: boolean; message: string }> {
    if (!initGoogleSheets()) {
        return {
            success: false,
            message: 'Google Sheets not configured'
        };
    }

    try {
        // Tentukan nama sheet berdasarkan Unit
        const sheetName = getSheetNameFromUnit(data.unitName);

        // Ensure headers exist for this sheet
        await ensureSheetHeaders(sheetName);

        // Format date for display
        const formattedDate = new Date(data.createdAt).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Prepare row data sesuai formulir PSB TP. 2026/2027
        const rowData = [
            data.registrationNumber,
            data.namaLengkap,
            data.nisn || '-',
            data.nik || '-',
            data.noKK || '-',
            data.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan',
            data.tempatLahir,
            data.tanggalLahir,
            data.asalSekolah,
            data.alamatSekolahAsal || '-',
            data.namaAyah || '-',
            data.namaIbu || '-',
            data.pekerjaanAyah || '-',
            data.pekerjaanIbu || '-',
            data.penghasilanAyah || '-',
            data.penghasilanIbu || '-',
            data.pendidikanAyah || '-',
            data.pendidikanIbu || '-',
            data.anakKe || '-',
            data.dariSaudara || '-',
            data.jumlahTanggungan || '-',
            data.alamatLengkap,
            data.noWaIbu || '-',
            data.noWaAyah || '-',
            data.sumberInfo || '-',
            data.grade ? `Grade ${data.grade}` : '-',
            data.jenisSantri ? `Santri ${data.jenisSantri}` : '-',
            data.unitName,
            data.driveFolderUrl,
            data.status,
            formattedDate
        ];

        // Append to spreadsheet using dynamic sheet name with quotes for safety
        const range = `'${sheetName}'!A:O`;
        console.log(`[Spreadsheet] Appending to ${GOOGLE_SPREADSHEET_ID} range ${range}`);

        await sheets!.spreadsheets.values.append({
            spreadsheetId: GOOGLE_SPREADSHEET_ID,
            range: range,
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values: [rowData]
            }
        });

        console.log(`Registration ${data.registrationNumber} added to spreadsheet`);

        return {
            success: true,
            message: 'Data berhasil disimpan ke spreadsheet'
        };
    } catch (error) {
        console.error('Error appending to spreadsheet:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

/**
 * Update status in spreadsheet
 */
export async function updateSpreadsheetStatus(
    registrationNumber: string,
    newStatus: string
): Promise<{ success: boolean; message: string }> {
    if (!initGoogleSheets()) {
        return {
            success: false,
            message: 'Google Sheets not configured'
        };
    }

    try {
        // Get all data to find the row
        const response = await sheets!.spreadsheets.values.get({
            spreadsheetId: GOOGLE_SPREADSHEET_ID,
            range: 'PSB!A:O',
        });

        const rows = response.data.values;
        if (!rows) {
            return {
                success: false,
                message: 'No data found in spreadsheet'
            };
        }

        // Find the row with matching registration number
        let rowIndex = -1;
        for (let i = 0; i < rows.length; i++) {
            if (rows[i][0] === registrationNumber) {
                rowIndex = i + 1; // Sheets is 1-indexed
                break;
            }
        }

        if (rowIndex === -1) {
            return {
                success: false,
                message: 'Registration not found in spreadsheet'
            };
        }

        // Update the status column (column N = index 14)
        await sheets!.spreadsheets.values.update({
            spreadsheetId: GOOGLE_SPREADSHEET_ID,
            range: `PSB!N${rowIndex}`,
            valueInputOption: 'RAW',
            requestBody: {
                values: [[newStatus]]
            }
        });

        console.log(`Registration ${registrationNumber} status updated to ${newStatus} in spreadsheet`);

        return {
            success: true,
            message: 'Status berhasil diupdate di spreadsheet'
        };
    } catch (error) {
        console.error('Error updating spreadsheet status:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
