
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

async function main() {
    console.log('Starting Google Sheets diagnostic...');

    // 1. Load .env manually
    const envPath = path.join(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
        console.error('ERROR: .env file not found at ' + envPath);
        return;
    }

    const envContent = fs.readFileSync(envPath, 'utf-8');
    const envVars: Record<string, string> = {};
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            envVars[key] = value;
        }
    });

    const GOOGLE_CLIENT_ID = envVars['GOOGLE_CLIENT_ID'];
    const GOOGLE_CLIENT_SECRET = envVars['GOOGLE_CLIENT_SECRET'];
    const GOOGLE_REFRESH_TOKEN = envVars['GOOGLE_REFRESH_TOKEN'];
    const GOOGLE_SPREADSHEET_ID = envVars['GOOGLE_SPREADSHEET_ID'];

    console.log('Environment Check:');
    console.log(`- GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID ? 'Present' : 'MISSING'}`);
    console.log(`- GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET ? 'Present' : 'MISSING'}`);
    console.log(`- GOOGLE_REFRESH_TOKEN: ${GOOGLE_REFRESH_TOKEN ? 'Present' : 'MISSING'}`);
    console.log(`- GOOGLE_SPREADSHEET_ID: ${GOOGLE_SPREADSHEET_ID || 'MISSING'}`);

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN || !GOOGLE_SPREADSHEET_ID) {
        console.error('Missing required environment variables. Aborting.');
        return;
    }

    // 2. Initialize Auth
    const oauth2Client = new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
        refresh_token: GOOGLE_REFRESH_TOKEN
    });

    // 3. Check Identity
    try {
        // We need another API to check "who am I", usually oauth2 v2
        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const userInfo = await oauth2.userinfo.get();
        console.log('\nAuthenticated User Info:');
        console.log(`- Email: ${userInfo.data.email}`);
        console.log(`- Name: ${userInfo.data.name}`);
        console.log(`- ID: ${userInfo.data.id}`);

        console.log(`\nPLEASE VERIFY: Is the spreadsheet shared with ${userInfo.data.email}?`);
    } catch (error: any) {
        console.error('\nFailed to get user info:', error.message);
        console.log('This might mean the scope for userinfo is not granted, but we proceed to check Sheets access.');
    }

    // 4. Check Spreadsheet Access
    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

    try {
        console.log(`\nAttempting to access Spreadsheet ID: ${GOOGLE_SPREADSHEET_ID}`);
        const response = await sheets.spreadsheets.get({
            spreadsheetId: GOOGLE_SPREADSHEET_ID,
            fields: 'spreadsheetId,properties.title,sheets.properties.title'
        });

        console.log('SUCCESS! Spreadsheet found.');
        console.log(`- Title: ${response.data.properties?.title}`);
        console.log('- Sheets:');
        response.data.sheets?.forEach(sheet => {
            console.log(`  - ${sheet.properties?.title}`);
        });

    } catch (error: any) {
        console.error('\nFAILED to access spreadsheet.');
        console.error(`- Status: ${error.status || error.code}`);
        console.error(`- Message: ${error.message}`);

        if (error.code === 404) {
            console.error('\nDIAGNOSIS: 404 means the spreadsheet ID is invalid OR the user does not have permission to view it.');
            console.error('1. Check if the spreadsheet ID is correct.');
            console.error('2. Check if the spreadsheet is shared with the email printed above.');
        } else if (error.code === 403) {
            console.error('\nDIAGNOSIS: 403 means permission denied or API not enabled.');
        }
    }
}

main().catch(console.error);
