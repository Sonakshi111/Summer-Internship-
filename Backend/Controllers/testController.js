import { sheets } from '../Models/sheetsModel.js';

export const testSheetData = async (req, res) => {
  try {
    // Get all data from StudentList sheet
    const studentList = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'StudentList!A1:C',
    });

    // Get all data from RegistrationDetails sheet
    const registrationData = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'RegistrationDetails!A1:F',
    });

    res.json({
      success: true,
      studentList: studentList.data.values,
      registrationData: registrationData.data.values
    });
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
