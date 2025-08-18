import { getStudentInfoRows, sheets, sheetId, mapRowsToObjects } from '../Models/sheetsModel.js';

export async function getStudentInfo(req, res) {
  try {
    let { uid } = req.params;
    
    // Decode the UID to handle special characters
    uid = decodeURIComponent(uid);
    console.log(`Received request to /api/student/info/${uid}`);
    
    // Get all rows from RegistrationDetails including headers
    const sheetRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'RegistrationDetails!A1:E'
    });
                    
    const [headers, ...rows] = sheetRes.data.values;
    console.log('Headers in RegistrationDetails:', headers);
    console.log('Raw data rows:', rows);
    
    const allRows = mapRowsToObjects(rows, headers);
    console.log('Processed rows:', allRows);
    
    // Find the row matching the student's UID
    const studentInfo = allRows.find(row => row.UID === uid);
    console.log('Found student info:', studentInfo);
    
    if (!studentInfo) {
      console.log(`Student with UID ${uid} not found`);
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    // Return the student information
    res.json({
      success: true,
      studentInfo: {
        UID: studentInfo.UID,
        name: studentInfo.name,
        email: studentInfo.email,
        course: studentInfo.course
      }
    });
  } catch (error) {
    console.error('Error fetching student info:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch student information',
      error: error.message 
    });
  }
}
