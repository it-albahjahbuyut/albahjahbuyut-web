'use server';

/**
 * Script untuk memformat ulang spreadsheet PSB
 * - Menghapus bold dan warna kuning dari header
 * - Menambahkan border ke semua sel
 */

import { google } from 'googleapis';

const GOOGLE_CLIENT_ID = (process.env.GOOGLE_CLIENT_ID || '').trim();
const GOOGLE_CLIENT_SECRET = (process.env.GOOGLE_CLIENT_SECRET || '').trim();
const GOOGLE_REFRESH_TOKEN = (process.env.GOOGLE_REFRESH_TOKEN || '').trim();
const GOOGLE_SPREADSHEET_ID = (process.env.GOOGLE_SPREADSHEET_ID || '').trim();

async function initSheets() {
    const oauth2Client = new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
        refresh_token: GOOGLE_REFRESH_TOKEN
    });

    return google.sheets({ version: 'v4', auth: oauth2Client });
}

/**
 * Format spreadsheet dengan styling yang benar
 */
export async function formatSpreadsheet(sheetName: string = 'SMP'): Promise<{ success: boolean; message: string }> {
    if (!GOOGLE_SPREADSHEET_ID) {
        return { success: false, message: 'GOOGLE_SPREADSHEET_ID not configured' };
    }

    try {
        const sheets = await initSheets();

        // Get sheet ID from sheet name
        const spreadsheet = await sheets.spreadsheets.get({
            spreadsheetId: GOOGLE_SPREADSHEET_ID,
        });

        const sheet = spreadsheet.data.sheets?.find(
            s => s.properties?.title === sheetName
        );

        if (!sheet?.properties?.sheetId) {
            return { success: false, message: `Sheet '${sheetName}' not found` };
        }

        const sheetId = sheet.properties.sheetId;

        // Get current data range to determine how many rows/cols
        const dataResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: GOOGLE_SPREADSHEET_ID,
            range: `'${sheetName}'!A:AE`,
        });

        const rows = dataResponse.data.values || [];
        const numRows = Math.max(rows.length, 2);
        const numCols = 31; // Kolom A sampai AE

        // Apply formatting
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: GOOGLE_SPREADSHEET_ID,
            requestBody: {
                requests: [
                    // 1. Reset header row - remove bold and background color
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
                                    backgroundColor: { red: 1, green: 1, blue: 1 }, // White
                                    textFormat: {
                                        bold: false,
                                        fontSize: 10,
                                    },
                                },
                            },
                            fields: 'userEnteredFormat(backgroundColor,textFormat)',
                        },
                    },
                    // 2. Reset all data rows - remove any formatting
                    {
                        repeatCell: {
                            range: {
                                sheetId: sheetId,
                                startRowIndex: 1,
                                endRowIndex: numRows,
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
                                },
                            },
                            fields: 'userEnteredFormat(backgroundColor,textFormat)',
                        },
                    },
                    // 3. Add borders to all cells with data
                    {
                        updateBorders: {
                            range: {
                                sheetId: sheetId,
                                startRowIndex: 0,
                                endRowIndex: numRows,
                                startColumnIndex: 0,
                                endColumnIndex: numCols,
                            },
                            top: {
                                style: 'SOLID',
                                width: 1,
                                color: { red: 0.8, green: 0.8, blue: 0.8 },
                            },
                            bottom: {
                                style: 'SOLID',
                                width: 1,
                                color: { red: 0.8, green: 0.8, blue: 0.8 },
                            },
                            left: {
                                style: 'SOLID',
                                width: 1,
                                color: { red: 0.8, green: 0.8, blue: 0.8 },
                            },
                            right: {
                                style: 'SOLID',
                                width: 1,
                                color: { red: 0.8, green: 0.8, blue: 0.8 },
                            },
                            innerHorizontal: {
                                style: 'SOLID',
                                width: 1,
                                color: { red: 0.8, green: 0.8, blue: 0.8 },
                            },
                            innerVertical: {
                                style: 'SOLID',
                                width: 1,
                                color: { red: 0.8, green: 0.8, blue: 0.8 },
                            },
                        },
                    },
                ],
            },
        });

        console.log(`[Spreadsheet] Formatted sheet '${sheetName}' with ${numRows} rows`);

        return {
            success: true,
            message: `Sheet '${sheetName}' berhasil diformat (${numRows} baris)`
        };
    } catch (error) {
        console.error('Error formatting spreadsheet:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

/**
 * Format all PSB sheets
 */
export async function formatAllSheets(): Promise<{ success: boolean; message: string }> {
    const sheetNames = ['SMP', 'SMA', 'SD', 'PAUD', 'TAHFIDZ', 'TAFAQQUH', 'LAINNYA'];
    const results: string[] = [];

    for (const sheetName of sheetNames) {
        try {
            const result = await formatSpreadsheet(sheetName);
            if (result.success) {
                results.push(`✓ ${sheetName}`);
            }
        } catch {
            // Skip sheets that don't exist
        }
    }

    return {
        success: true,
        message: `Formatted sheets: ${results.join(', ')}`
    };
}
