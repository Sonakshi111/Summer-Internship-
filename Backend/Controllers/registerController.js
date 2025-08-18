import bcrypt from 'bcrypt';
import { google } from 'googleapis';
import 'dotenv/config';

/* 1️⃣  Google sheets client with service‑account key */
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,   // credentials.json
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });

/* 2️⃣  Main handler */
export const register = async (req, res) => {
  try {
    const { name, uid, phoneNumber, email, password } = req.body;
    console.log("Received req.body:", req.body);
    console.log('Name:', name);
    console.log('UID:', uid);
    console.log('Phone:', phoneNumber);
    console.log('Email:', email);
    console.log('Password:', password);

    if (!name || !uid || !phoneNumber || !email || !password) {
      throw new Error('❌ Missing required fields');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRow = [name, uid, phoneNumber, email, hashedPassword];

    const sheetName = 'RegistrationDetails';

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${sheetName}!A2:E`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [userRow] },
    });

    console.log('✅ Google Sheets append result:', result.status);

    const successMessage = 'Registration successful';
    console.log('✅ Sending response:', {
      message: successMessage,
      success: true,
      uid,
      name,
    });
    
    res.status(201).json({
      message: successMessage,
      success: true,
      uid,
      name,
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
      error: error.message,
    });
  }
};


