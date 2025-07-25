// sheetsModel.js or googleSheets.js
import { google } from 'googleapis';
import 'dotenv/config';

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export const sheets = google.sheets({ version: 'v4', auth });
const sheetId = process.env.GOOGLE_SHEET_ID;

// ✅ Helper to map headers to object
function mapRowsToObjects(rows, headers) {
  return rows.map((row) =>
    headers.reduce((obj, header, idx) => {
      obj[header] = row[idx] || '';
      return obj;
    }, {})
  );
}

// ✅ Get all Sheet1 data (Registration + Personal info)
export async function getRegistrationRows() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1!A1:L', // includes headers: uniqueId to profileImageUrl
  });

  const [headers, ...rows] = res.data.values;
  return mapRowsToObjects(rows, headers);
}

// ✅ Get all Sheet2 data (Internship Details)
export async function getStudentInfoRows() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet2!A1:I', // includes headers
  });

  const [headers, ...rows] = res.data.values;
  return mapRowsToObjects(rows, headers);
}
