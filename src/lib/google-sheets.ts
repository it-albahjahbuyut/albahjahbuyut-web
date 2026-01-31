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
    // PAUD Fields (Optional)
    namaPanggilan?: string;
    usia?: string;
    beratBadan?: string;
    tinggiBadan?: string;
    golonganDarah?: string;
    kewarganegaraan?: string;
    imunisasi?: string;
    riwayatPenyakit?: string;
    bahasaSehariHari?: string;
    jumlahSaudaraTiri?: string;
    ttlAyah?: string;
    alamatAyah?: string;
    jumlahTanggunganAyah?: string;
    ttlIbu?: string;
    alamatIbu?: string;
    jumlahTanggunganIbu?: string;
    kewarganegaraanAyah?: string;
    kewarganegaraanIbu?: string;
    statusMasuk?: string;
    tanggalDiterima?: string;
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

    // Standard Headers (for SD, SMP, SMA, etc)
    const baseHeaders = [
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

    let headerRow = [...baseHeaders];

    // If PAUD, append specific headers
    if (sheetName === 'PAUD') {
        const paudHeaders = [
            'Nama Panggilan',
            'Usia',
            'Berat Badan',
            'Tinggi Badan',
            'Gol. Darah',
            'Kewarganegaraan Anak',
            'Imunisasi',
            'Riwayat Penyakit',
            'Bahasa Sehari-hari',
            'Jumlah Saudara Tiri',
            'TTL Ayah',
            'Alamat Ayah',
            'Jumlah Tanggungan Ayah',
            'TTL Ibu',
            'Alamat Ibu',
            'Jumlah Tanggungan Ibu',
            'Kewarganegaraan Ayah',
            'Kewarganegaraan Ibu',
            'Status Masuk',
            'Tanggal Diterima'
        ];
        headerRow = [...baseHeaders, ...paudHeaders];
    }

    try {
        // Cek apakah sheet sudah ada
        let sheetId: number | undefined;

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

            // Get sheet ID for formatting
            const spreadsheetInfo = await sheets.spreadsheets.get({
                spreadsheetId: GOOGLE_SPREADSHEET_ID,
                fields: 'sheets.properties'
            });
            const targetSheet = spreadsheetInfo.data.sheets?.find(
                s => s.properties?.title === sheetName
            );
            sheetId = targetSheet?.properties?.sheetId ?? undefined;

            // Jika A1 kosong, isi header
            if (!headerCheck.data.values || headerCheck.data.values.length === 0) {
                await sheets.spreadsheets.values.update({
                    spreadsheetId: GOOGLE_SPREADSHEET_ID,
                    range: `'${sheetName}'!A1`,
                    valueInputOption: 'RAW',
                    requestBody: { values: [headerRow] }
                });
                console.log(`Headers created in existing sheet: ${sheetName}`);

                // Format header row
                if (sheetId !== undefined) {
                    await formatHeaderRow(sheetId, headerRow.length);
                }
            }

        } catch (error) {
            // Jika error, asumsikan sheet belum ada, maka buat sheet baru
            console.log(`Sheet '${sheetName}' not found, creating new sheet...`);

            const createResult = await sheets.spreadsheets.batchUpdate({
                spreadsheetId: GOOGLE_SPREADSHEET_ID,
                requestBody: {
                    requests: [{
                        addSheet: {
                            properties: {
                                title: sheetName,
                                gridProperties: {
                                    rowCount: 1000,
                                    columnCount: headerRow.length + 5 // Add buffer columns
                                }
                            }
                        }
                    }]
                }
            });

            // Get the new sheet ID
            sheetId = createResult.data.replies?.[0]?.addSheet?.properties?.sheetId ?? undefined;

            // Isi header untuk sheet baru
            await sheets.spreadsheets.values.update({
                spreadsheetId: GOOGLE_SPREADSHEET_ID,
                range: `'${sheetName}'!A1`,
                valueInputOption: 'RAW',
                requestBody: { values: [headerRow] }
            });
            console.log(`Sheet '${sheetName}' created with headers`);

            // Format header row
            if (sheetId !== undefined) {
                await formatHeaderRow(sheetId, headerRow.length);
            }
        }

        return sheetName;
    } catch (error) {
        console.error(`Error ensuring headers for ${sheetName}:`, error);
        // Fallback ke sheet pertama jika gagal total (jarang terjadi)
        return 'Sheet1';
    }
}

/**
 * Format header row with borders, bold text, and background color
 */
async function formatHeaderRow(sheetId: number, numCols: number): Promise<void> {
    if (!sheets) return;

    try {
        const borderStyle = {
            style: 'SOLID',
            width: 1,
            color: { red: 0, green: 0, blue: 0 }
        };

        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: GOOGLE_SPREADSHEET_ID,
            requestBody: {
                requests: [
                    // Format header cells
                    {
                        repeatCell: {
                            range: {
                                sheetId: sheetId,
                                startRowIndex: 0,
                                endRowIndex: 1,
                                startColumnIndex: 0,
                                endColumnIndex: numCols,
                            },
                            cell: {
                                userEnteredFormat: {
                                    backgroundColor: { red: 1, green: 0.85, blue: 0 }, // Yellow background
                                    textFormat: {
                                        bold: true,
                                        fontSize: 10,
                                    },
                                    horizontalAlignment: 'CENTER',
                                    verticalAlignment: 'MIDDLE',
                                    borders: {
                                        top: borderStyle,
                                        bottom: borderStyle,
                                        left: borderStyle,
                                        right: borderStyle
                                    }
                                },
                            },
                            fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,borders)',
                        },
                    },
                    // Freeze header row
                    {
                        updateSheetProperties: {
                            properties: {
                                sheetId: sheetId,
                                gridProperties: {
                                    frozenRowCount: 1
                                }
                            },
                            fields: 'gridProperties.frozenRowCount'
                        }
                    }
                ],
            },
        });
        console.log(`Header row formatted for sheet ID: ${sheetId}`);
    } catch (error) {
        console.error('Error formatting header row:', error);
        // Non-blocking error, continue without formatting
    }
}

/**
 * Append a new registration to the spreadsheet
 * Automatically handles Insert (if new) or Update (if exists)
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

        // Prepare base row data
        let rowData = [
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
            data.driveFolderUrl ? `=HYPERLINK("${data.driveFolderUrl}","Buka Drive")` : '-',
            data.status,
            formattedDate
        ];

        // Append PAUD specific data if needed
        if (sheetName === 'PAUD') {
            const paudData = [
                data.namaPanggilan || '-',
                data.usia || '-',
                data.beratBadan || '-',
                data.tinggiBadan || '-',
                data.golonganDarah || '-',
                data.kewarganegaraan || '-',
                data.imunisasi || '-',
                data.riwayatPenyakit || '-',
                data.bahasaSehariHari || '-',
                data.jumlahSaudaraTiri || '-',
                data.ttlAyah || '-',
                data.alamatAyah || '-',
                data.jumlahTanggunganAyah || '-',
                data.ttlIbu || '-',
                data.alamatIbu || '-',
                data.jumlahTanggunganIbu || '-',
                data.kewarganegaraanAyah || '-',
                data.kewarganegaraanIbu || '-',
                data.statusMasuk || '-',
                data.tanggalDiterima || '-'
            ];
            rowData = [...rowData, ...paudData];
        }

        // Check if registration already exists
        const existingRowIndex = await findRowIndex(sheetName, data.registrationNumber);
        let targetRowIndex: number;
        let actionMessage: string;

        if (existingRowIndex !== -1) {
            // UPDATE existing row
            console.log(`[Spreadsheet] Updating existing registration ${data.registrationNumber} at row ${existingRowIndex}`);

            await sheets!.spreadsheets.values.update({
                spreadsheetId: GOOGLE_SPREADSHEET_ID,
                range: `'${sheetName}'!A${existingRowIndex}`,
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [rowData]
                }
            });

            targetRowIndex = existingRowIndex;
            actionMessage = 'Data berhasil diupdate di spreadsheet';
        } else {
            // APPEND new row
            const range = `'${sheetName}'!A1`;
            console.log(`[Spreadsheet] Appending to ${GOOGLE_SPREADSHEET_ID} range ${range}`);

            const appendResult = await sheets!.spreadsheets.values.append({
                spreadsheetId: GOOGLE_SPREADSHEET_ID,
                range: range,
                valueInputOption: 'USER_ENTERED',
                insertDataOption: 'OVERWRITE',
                requestBody: {
                    values: [rowData]
                }
            });

            // Parse row number from updatedRange (e.g., "'SMP'!A2:AE2" -> row 2)
            const updatedRange = appendResult.data.updates?.updatedRange;
            if (updatedRange) {
                const rowMatch = updatedRange.match(/!A(\d+):/);
                targetRowIndex = rowMatch ? parseInt(rowMatch[1], 10) : -1;
            } else {
                targetRowIndex = -1;
            }

            actionMessage = 'Data berhasil ditambahkan ke spreadsheet';
        }

        // Format the row (border & clean style)
        if (targetRowIndex !== -1) {
            try {
                // Get sheet ID for formatting
                const spreadsheetInfo = await sheets!.spreadsheets.get({
                    spreadsheetId: GOOGLE_SPREADSHEET_ID,
                    fields: 'sheets.properties'
                });

                const targetSheet = spreadsheetInfo.data.sheets?.find(
                    s => s.properties?.title === sheetName
                );

                if (targetSheet?.properties?.sheetId !== undefined) {
                    const sheetId = targetSheet.properties.sheetId;
                    const numCols = 31; // Columns A to AE

                    // Border style
                    const borderStyle = {
                        style: 'SOLID',
                        width: 1,
                        color: { red: 0, green: 0, blue: 0 }
                    };

                    await sheets!.spreadsheets.batchUpdate({
                        spreadsheetId: GOOGLE_SPREADSHEET_ID,
                        requestBody: {
                            requests: [
                                {
                                    repeatCell: {
                                        range: {
                                            sheetId: sheetId,
                                            startRowIndex: targetRowIndex - 1, // 0-indexed
                                            endRowIndex: targetRowIndex,
                                            startColumnIndex: 0,
                                            endColumnIndex: numCols,
                                        },
                                        cell: {
                                            userEnteredFormat: {
                                                backgroundColor: { red: 1, green: 1, blue: 1 }, // White
                                                textFormat: {
                                                    bold: false,
                                                    fontSize: 10,
                                                },
                                                borders: {
                                                    top: borderStyle,
                                                    bottom: borderStyle,
                                                    left: borderStyle,
                                                    right: borderStyle
                                                }
                                            },
                                        },
                                        fields: 'userEnteredFormat(backgroundColor,textFormat,borders)',
                                    },
                                },
                            ],
                        },
                    });
                }
            } catch (formatError) {
                console.error('[Spreadsheet] Error formatting row (non-blocking):', formatError);
            }
        }

        console.log(`Registration ${data.registrationNumber} sync completed`);

        return {
            success: true,
            message: actionMessage
        };
    } catch (error) {
        console.error('Error syncing to spreadsheet:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

/**
 * Find row index by registration number
 */
async function findRowIndex(sheetName: string, registrationNumber: string): Promise<number> {
    if (!sheets) return -1;

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: GOOGLE_SPREADSHEET_ID,
            range: `'${sheetName}'!A:A`,
        });

        const rows = response.data.values;
        if (!rows) return -1;

        for (let i = 0; i < rows.length; i++) {
            if (rows[i][0] === registrationNumber) {
                return i + 1; // 1-indexed
            }
        }
        return -1;
    } catch (error) {
        // console.error('Error finding row index:', error); // Silent error if not found
        return -1;
    }
}

/**
 * Update status in spreadsheet
 */
export async function updateSpreadsheetStatus(
    registrationNumber: string,
    unitName: string,
    newStatus: string
): Promise<{ success: boolean; message: string }> {
    if (!initGoogleSheets()) {
        return {
            success: false,
            message: 'Google Sheets not configured'
        };
    }

    try {
        const sheetName = getSheetNameFromUnit(unitName);
        const rowIndex = await findRowIndex(sheetName, registrationNumber);

        if (rowIndex === -1) {
            return {
                success: false,
                message: `Registration ${registrationNumber} not found in sheet ${sheetName}`
            };
        }

        // Update the status column (Column AD is index 29)
        await sheets!.spreadsheets.values.update({
            spreadsheetId: GOOGLE_SPREADSHEET_ID,
            range: `'${sheetName}'!AD${rowIndex}`,
            valueInputOption: 'RAW',
            requestBody: {
                values: [[newStatus]]
            }
        });

        console.log(`[Spreadsheet] Registration ${registrationNumber} status updated to ${newStatus} in sheet ${sheetName}`);

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
