import { google } from 'googleapis';
import 'dotenv/config';

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});
const sheets = google.sheets({ version: 'v4', auth });

(async () => {
  const res = await sheets.spreadsheets.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    fields: 'sheets.properties.title',
  });

  console.log('\n📄  Tabs Google sees in this spreadsheet:');
  res.data.sheets.forEach((s, i) =>
    console.log(`${i + 1}. "${s.properties.title}"`)
  );
})();
