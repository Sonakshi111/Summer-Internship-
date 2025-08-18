import bcrypt from 'bcrypt';
import { sheets } from '../Models/sheetsModel.js';

export const login = async (req, res) => {
  try {
    const { uid, password, loginType = 'student' } = req.body;
    console.log('Login request received:', { uid, loginType });
    console.log('Request body:', req.body);

    if (!['student', 'admin'].includes(loginType)) {
      return res.status(400).json({ message: 'Invalid login type', success: false });
    }

    const sheetId = process.env.GOOGLE_SHEET_ID;
    console.log('Using sheet ID:', sheetId);
    
    // Determine which sheet to check based on login type
    const range = loginType === 'admin' ? 'AdminDetails!A2:E' : 'RegistrationDetails!A2:E';
    console.log('Fetching from:', range);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });
    console.log('Sheet response received');

    const rows = response.data.values ?? [];
    console.log('Found', rows.length, 'rows in sheet');

    // Try to find user in the appropriate sheet
    const userRow = rows.find((row) => row[1] === uid);
    console.log('User found:', userRow);

    if (!userRow) {
      return res.status(401).json({ 
        message: `Invalid ${loginType === 'admin' ? 'admin' : 'student'} UID`, 
        success: false 
      });
    }

    const storedHashedPassword = userRow[4];
    const isPasswordValid = await bcrypt.compare(password, storedHashedPassword);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password', success: false });
    }

    return res.status(200).json({
      message: 'Login successful',
      success: true,
      uid: uid,
      name: userRow[0],
      loginType: loginType
    });
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
      error: error.message,
    });
  }
};
