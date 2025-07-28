import { google } from 'googleapis';
import 'dotenv/config';
import { GoogleAuth } from 'google-auth-library';

const auth = new GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export const sheets = google.sheets({ version: 'v4', auth });
const sheetId = process.env.GOOGLE_SHEET_ID;
export { sheetId };
/* helpers */
export async function getStudentList() {
  const r = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'StudentList!A2:C',
  });
  return r.data.values ?? [];
}

export async function appendUserRow(row) {
  return sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'RegistrationDetails!A2:E',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  });
}

// const SHEET_ID = '1w376GT7oxLbgvs9UI2pxqG3ke6OMCuAYcvMp2wcQaWE'; // 🔁 Replace with your actual Sheet ID
// const RANGE = 'Sheet1!A1:Z1000'; 

export async function getRegistrationRows() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1!A2:L', // includes headers: uniqueId to profileImageUrl
  });

  const [headers, ...rows] = res.data.values;
  return mapRowsToObjects(rows, headers);
}

// ✅ Get all Sheet2 data (Internship Details)
export async function getStudentInfoRows() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet2!A2:I', // includes headers
  });

  const [headers, ...rows] = res.data.values;
  return mapRowsToObjects(rows, headers);
}