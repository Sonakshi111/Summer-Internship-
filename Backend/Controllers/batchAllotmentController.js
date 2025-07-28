import { sheets } from '../Models/sheetsModel.js';
import { sheetId } from '../Models/sheetsModel.js';

export async function submitBatchAllotment(req, res) {
  try {
    const { 
      uid, receiptNo, name, fatherName, college, 
      mobile, address, course, year, branch, 
      duration, trade, slot, project 
    } = req.body;

    // Prepare the data for Sheet1 in correct column order
    const rowData = [
      uid,         // uniqueId
      name,        // name
      '',          // email (not provided in form)
      mobile,      // phone
      '',          // dob (not provided in form)
      fatherName,  // fatherName
      address,     // address
      college,     // college
      course,      // course
      trade,       // trade
      duration,    // duration
      slot,        // slot
      project,     // project
      receiptNo,   // receiptNo
      ''           // profileImageUrl (not provided in form)
    ];

    // Write to Sheet1
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A2:L',
      valueInputOption: 'RAW',
      resource: {
        values: [rowData]
      }
    });

    res.json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error submitting batch allotment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit form',
      error: error.message 
    });
  }
}
