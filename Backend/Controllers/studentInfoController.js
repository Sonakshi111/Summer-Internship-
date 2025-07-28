import { getStudentInfoRows } from '../Models/sheetsModel.js';

export async function getStudentInfo(req, res) {
  try {
    const { uid } = req.params;
    
    // Get all rows from Sheet2
    const allRows = await getStudentInfoRows();
    
    // Find the row matching the student's UID
    const studentInfo = allRows.find(row => row.uniqueId === uid);
    
    if (!studentInfo) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    // Return only the relevant fields needed for StudentDashboard
    const { uniqueId, name, email, dob, phone, college, course, branch, address } = studentInfo;
    
    res.json({
      success: true,
      studentInfo: {
        uniqueId,
        name,
        email,
        dob,
        phone,
        college,
        course,
        branch,
        address
      }
    });
  } catch (error) {
    console.error('Error fetching student info:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch student information',
      error: error.message 
    });
  }
}
