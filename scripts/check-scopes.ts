
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

async function main() {
    console.log('Starting Scopes Diagnostic...');

    // 1. Load .env manually
    const envPath = path.join(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) { return; }
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const envVars: Record<string, string> = {};
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) envVars[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
    });

    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = envVars;

    // 2. Initialize Auth
    const oauth2Client = new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

    // 3. Check Drive Access (Should work)
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    try {
        console.log('Checking Drive Access...');
        await drive.files.list({ pageSize: 1 });
        console.log('SUCCESS: Drive access works. Token is valid.');
    } catch (error: any) {
        console.error('FAILURE: Drive access failed.', error.message);
        return; // If drive fails, the token is just bad.
    }

    // 4. Check Sheets Access
    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
    try {
        console.log('Checking Sheets Access...');
        // Try a generic call that doesn't need a specific ID, but there isn't really one for sheets.
        // We tried getting a specific sheet and it 404'd.
        // A 404 on a valid ID usually implies lack of permission if the ID exists.
        // But if the SCOPE is missing, we usually get a 403 "Insufficient Permission".

        // Let's try to create a dummy spreadsheet. If this fails with 403, we know it's scope.
        console.log('Attempting to create a temporary spreadsheet to test Create Scope...');
        const createRes = await sheets.spreadsheets.create({
            requestBody: {
                properties: { title: 'Test Scope Check' }
            }
        });
        console.log('SUCCESS: Crated spreadsheet ' + createRes.data.spreadsheetId);
        // Clean up
        // Drive delete
        await drive.files.delete({ fileId: createRes.data.spreadsheetId! });
    } catch (error: any) {
        console.log('FAILURE: Sheets operation failed.');
        console.log(`Status: ${error.status}`);
        console.log(`Message: ${error.message}`);
        console.log(`Scopes suspected missing.`);
    }

    // 5. Inspect Token Info (if possible)
    // We can use the token info endpoint to see scopes
    try {
        const token = await oauth2Client.getAccessToken(); // refresh if needed
        if (token.token) {
            const tokenInfoUrl = `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token.token}`;
            // fetch is available in node 18+ or we can use axios/https
            // using https simple get
            const https = require('https');
            https.get(tokenInfoUrl, (res: any) => {
                let data = '';
                res.on('data', (chunk: any) => data += chunk);
                res.on('end', () => {
                    console.log('\n--- TOKEN SCOPES ---');
                    const info = JSON.parse(data);
                    console.log(`Scopes: ${info.scope}`);
                });
            });
        }
    } catch (e) {
        console.log('Could not retrieve token info.');
    }
}

main();
