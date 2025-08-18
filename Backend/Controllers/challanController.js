import { appendChallanRequest, getChallanRequests, getStudentData } from '../Models/sheetsModel.js';
import { sheets, sheetId, mapRowsToObjects } from '../Models/sheetsModel.js';

export const submitChallanRequest = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { UID } = req.body;

    if (!UID) {
      console.log('No UID provided in request');
      return res.status(400).json({ 
        success: false,
        error: 'Student UID is required.' 
      });
    }

    console.log('Fetching student data from sheet...');
    // Get all student data from RegistrationDetails
    const sheetRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'RegistrationDetails!A2:E' // Skip header row
    });
    
    console.log('Sheet data retrieved, processing rows...');
    const rows = sheetRes.data.values || [];
    
    if (rows.length === 0) {
      console.error('No data found in the sheet');
      return res.status(500).json({
        success: false,
        error: 'No data found in the registration sheet'
      });
    }
    
    // Column indices for RegistrationDetails (0-based)
    // 0: Name, 1: UID, 2: phoneNumber, 3: email, 4: hashedPassword
    const studentInfo = rows.find(row => row[1] && row[1].trim() === UID.trim());
    
    if (studentInfo) {
      studentInfo.name = studentInfo[0];
      studentInfo.UID = studentInfo[1];
      studentInfo.phone = studentInfo[2];
      studentInfo.email = studentInfo[3];
      // No need to include hashedPassword
    }

    if (!studentInfo) {
      console.log(`Student with UID '${UID}' not found in registration records`);
      return res.status(404).json({
        success: false,
        error: 'Student not found in registration records'
      });
    }

    // Check existing challan requests in Fee Challan sheet
    const challanRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Fee Challan!A2:H' // Skip header row
    });
    
    const challanRows = challanRes.data.values || [];
    
    // Column indices for Fee Challan (0-based)
    // 0: Name, 1: UID, 2: Email, 3: Course, 4: Request Date, 5: Status, 6: Verified Date, 7: Signature URL
    const existingRequest = challanRows.find(row => row[1] && row[1].trim() === UID.trim());
    
    if (existingRequest) {
      const status = (existingRequest[5] || '').toLowerCase();
      const requestDate = existingRequest[4] || '';
      const verifiedDate = existingRequest[6] || '';
      
      if (status === 'verified') {
        return res.json({
          success: true,
          action: 'download',
          message: 'Challan is ready for download',
          challanRequest: {
            UID,
            status: 'verified',
            requestDate,
            verifiedDate
          }
        });
      } else {
        return res.json({
          success: true,
          action: 'pending',
          message: 'Challan request is pending approval',
          challanRequest: {
            UID,
            status: status || 'pending',
            requestDate
          }
        });
      }
    }

    // Create new challan request if no existing request
    const requestDate = new Date().toLocaleDateString();
    await appendChallanRequest({
      UID,
      name: studentInfo.name,
      email: studentInfo.email,
      course: studentInfo.course || '',
      requestDate,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      action: 'created',
      message: 'New challan request created successfully',
      challanRequest: {
        UID,
        status: 'pending',
        requestDate
      }
    });
  } catch (error) {
    console.error('Error submitting challan request:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to submit challan request'
    });
  }
};

export const getChallanStatus = async (req, res) => {
  try {
    let { UID } = req.params;
    
    // Decode the UID to handle special characters
    UID = decodeURIComponent(UID);
    console.log('Decoded UID:', UID);
    
    if (!UID) {
      return res.status(400).json({ 
        success: false, 
        error: 'UID parameter is required' 
      });
    }

    const requests = await getChallanRequests();
    const challanRequest = requests.find(req => req.UID === UID);

    if (!challanRequest) {
      return res.status(200).json({
        success: true,
        exists: false,
        message: 'No challan request found for this UID'
      });
    }

    res.status(200).json({
      success: true,
      exists: true,
      challanRequest: {
        UID: challanRequest.UID,
        status: challanRequest.status,
        requestDate: challanRequest.requestDate,
        verifiedDate: challanRequest.verifiedDate || null
      }
    });
  } catch (error) {
    console.error('Error fetching challan status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch challan status'
    });
  }
};

export const fetchChallanRequests = async (req, res, options = {}) => {
  try {
    const data = await getChallanRequests();
    
    // If getResponse is true, return the data directly without sending a response
    if (options.getResponse) {
      return { requests: data };
    }
    
    // Otherwise, send the response as before
    if (res && typeof res.status === 'function') {
      return res.status(200).json({ 
        success: true,
        count: data.length,
        requests: data 
      });
    }
    
    // If no response object is provided, just return the data
    return data;
  } catch (error) {
    console.error('Error fetching challan requests:', error);
    
    // If we have a response object, use it
    if (res && typeof res.status === 'function') {
      return res.status(500).json({ 
        success: false,
        error: 'Failed to fetch challan requests' 
      });
    }
    
    // Otherwise, rethrow the error
    throw error;
  }
};
