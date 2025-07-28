import { getRegistrationRows, getStudentInfoRows } from '../Models/sheetsModel.js';

export async function getDashboard(req, res) {
  try {
    const { uniqueId } = req.params;
    const reg = await getRegistrationRows();
    const info = await getStudentInfoRows();

    const studentReg = reg.find(r => r[0] === uniqueId);
    const studentInfo = info.find(i => i[0] === uniqueId);

    if (!studentReg || !studentInfo) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Destructure arrays to objects as needed:
    const [uid, feeReceiptNumber, duration, startDate, endDate, projectName, batchCode, trainingSlot] = studentReg;
    const [uid2, name, college, course, branch, phone, dob, fatherName, address] = studentInfo;

    res.json({
      success: true,
      studentData: {
        uniqueId: uid,
        feeReceiptNumber, duration, startDate, endDate,
        projectName, batchCode, trainingSlot,
        name, college, course, branch, phone, dob, fatherName, address
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
