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
    tempatLahir: string;
    tanggalLahir: string;
    jenisKelamin: string;
    alamatLengkap: string;
    nisn?: string;
    asalSekolah: string;
    namaOrangTua: string;
    noHpOrangTua: string;
    emailOrangTua?: string;
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

// Store the sheet name to use
let targetSheetName: string | null = null;

/**
 * Ensure the spreadsheet has the correct headers
 */
async function ensureSheetHeaders(): Promise<string> {
    if (!sheets) return 'Sheet1';

    const headerRow = [
        'Nomor Pendaftaran',
        'Nama Lengkap',
        'Tempat Lahir',
        'Tanggal Lahir',
        'Jenis Kelamin',
        'Alamat Lengkap',
        'NISN',
        'Asal Sekolah',
        'Nama Orang Tua',
        'No HP Orang Tua',
        'Email Orang Tua',
        'Unit Pendidikan',
        'Link Drive',
        'Status',
        'Tanggal Daftar'
    ];

    // If we already know the sheet name, use it
    if (targetSheetName) {
        return targetSheetName;
    }

    try {
        // First, try to use "PSB" sheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: GOOGLE_SPREADSHEET_ID,
            range: 'PSB!A1:O1',
        });

        const headers = response.data.values?.[0];
        targetSheetName = 'PSB';

        // If no headers, create them
        if (!headers || headers.length === 0) {
            await sheets.spreadsheets.values.update({
                spreadsheetId: GOOGLE_SPREADSHEET_ID,
                range: 'PSB!A1:O1',
                valueInputOption: 'RAW',
                requestBody: {
                    values: [headerRow]
                }
            });
            console.log('Spreadsheet headers created in PSB sheet');
        }

        return targetSheetName;
    } catch (error: any) {
        console.log('PSB sheet not found, trying first sheet or creating PSB sheet...');

        // Try to create "PSB" sheet
        try {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: GOOGLE_SPREADSHEET_ID,
                requestBody: {
                    requests: [{
                        addSheet: {
                            properties: {
                                title: 'PSB',
                                gridProperties: {
                                    rowCount: 1000,
                                    columnCount: 15
                                }
                            }
                        }
                    }]
                }
            });

            // Add headers to new sheet
            await sheets.spreadsheets.values.update({
                spreadsheetId: GOOGLE_SPREADSHEET_ID,
                range: 'PSB!A1:O1',
                valueInputOption: 'RAW',
                requestBody: {
                    values: [headerRow]
                }
            });

            console.log('PSB sheet created with headers');
            targetSheetName = 'PSB';
            return targetSheetName;
        } catch (createError: any) {
            console.log('Could not create PSB sheet, using first sheet instead');

            // Fallback: Use the first existing sheet
            const firstSheet = await getFirstSheetName();
            targetSheetName = firstSheet;

            // Try to add headers to first sheet
            try {
                const checkResponse = await sheets.spreadsheets.values.get({
                    spreadsheetId: GOOGLE_SPREADSHEET_ID,
                    range: `${firstSheet}!A1:O1`,
                });

                const existingHeaders = checkResponse.data.values?.[0];
                if (!existingHeaders || existingHeaders.length === 0) {
                    await sheets.spreadsheets.values.update({
                        spreadsheetId: GOOGLE_SPREADSHEET_ID,
                        range: `${firstSheet}!A1:O1`,
                        valueInputOption: 'RAW',
                        requestBody: {
                            values: [headerRow]
                        }
                    });
                    console.log(`Headers created in ${firstSheet}`);
                }
            } catch (headerError) {
                console.error('Error adding headers to first sheet:', headerError);
            }

            return targetSheetName;
        }
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
        // Ensure headers exist and get sheet name
        const sheetName = await ensureSheetHeaders();

        // Format date for display
        const formattedDate = new Date(data.createdAt).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Prepare row data
        const rowData = [
            data.registrationNumber,
            data.namaLengkap,
            data.tempatLahir,
            data.tanggalLahir,
            data.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan',
            data.alamatLengkap,
            data.nisn || '-',
            data.asalSekolah,
            data.namaOrangTua,
            data.noHpOrangTua,
            data.emailOrangTua || '-',
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
