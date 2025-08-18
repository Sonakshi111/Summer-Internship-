import { google } from 'googleapis';
import 'dotenv/config';
import { GoogleAuth } from 'google-auth-library';

const auth = new GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export const sheets = google.sheets({ version: 'v4', auth });
const sheetId = process.env.GOOGLE_SHEET_ID;
export { sheetId, mapRowsToObjects };

// ✅ Project Data operations
export async function addBatchAllotmentToSheet(projectData) {
  try {
    console.log('Adding project data:', projectData);
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'ProjectData!A1:Z',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            projectData.projectName || '',
            projectData.projectCode || '',
            projectData.duration || '',
            projectData.branch || '',
            projectData.batch || '',
            projectData.timeSlot1 || '',
            projectData.timeSlot2 || '',
            projectData.timeSlot3 || '',
            projectData.timeSlot4 || ''
          ]
        ]
      }
    });
    
    console.log('Batch allotment added successfully:', response.data);
    return { success: true, data: response.data };
    
  } catch (error) {
    console.error('Error in addBatchAllotmentToSheet:', error);
    throw error;
  }
}

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


export async function getRegistrationRows() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1!A2:L', // includes headers: uniqueId to profileImageUrl
  });

  const [headers, ...rows] = res.data.values;
  return mapRowsToObjects(rows, headers);
}

// ✅ Get registration data from RegistrationDetails sheet
export async function getStudentInfoRows() {
  try {
    // First get the headers from row 1
    const headersRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'RegistrationDetails!A1:E1', // Get only the header row
    });

    // Then get the data rows starting from row 2
    const dataRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'RegistrationDetails!A2:E', // Get data rows starting from row 2
    });

    // Get verified dates from Fee Challan sheet
    const challanData = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Fee Challan!A2:G' // UID in column B, verified date in column G
    });

    // Log raw data for debugging
    console.log('Headers from RegistrationDetails:', headersRes.data.values);
    console.log('Data rows from RegistrationDetails:', dataRes.data.values);
    
    // Get actual headers from the sheet
    const headers = headersRes.data.values?.[0];
    const rows = dataRes.data.values || [];
    const challanRows = challanData.data.values ?? [];
    
    // If headers are not found, throw an error instead of using defaults
    if (!headers) {
      throw new Error('No headers found in RegistrationDetails sheet');
    }
    
    // Log headers and data for debugging
    console.log('Sheet headers:', headers);
    console.log('Data rows:', rows);
    console.log('Challan rows:', challanRows);
    
    // Map rows to objects using actual headers
    const processedData = rows.map(row => {
      const student = {
        name: row[0],
        UID: row[1],
        email: row[2],
        course: row[3],
        status: row[4],
        verifiedDate: row[6]
      };

      // Set current date as verified date in DD-MM-YYYY format
      const currentDate = new Date();
      student.verifiedDate = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()}`;

      return student;
    });

    console.log('Processed data with verified dates:', processedData);
    
    return processedData;
  } catch (error) {
    console.error('Error fetching RegistrationDetails data:', error);
    throw error;
  }
}

// ✅ Get student data by UID
export async function getStudentData(uid) {
  try {
    console.log('Looking for student with UID:', uid);
    
    // Get registration data from RegistrationDetails sheet
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'RegistrationDetails!A1:E', // Adjust range as needed
    });

    const rows = res.data.values ?? [];
    console.log('Raw sheet data:', rows);
    
    // Debug: Log all UIDs in the sheet
    const allUids = rows.map(row => row[2]).filter(Boolean);
    console.log('All UIDs in sheet:', allUids);
    
    const student = rows.find(row => row[1] === uid); // UID is in second column (index 1)
    console.log('Found student:', student);

    if (!student) {
      console.log('Student not found in sheet');
      return null;
    }

    // Get verified date from Fee challan sheet (column G)
    const challanData = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Fee Challan!A2:G' // Adjust range to include column G
    });

    const challanRows = challanData.data.values ?? [];
    console.log('Fee challan sheet data:', challanRows);

    const challanRow = challanRows.find(row => row[1] === uid); // UID is in second column
    console.log('Found challan row:', challanRow);

    if (!challanRow) {
      console.log('Challan row not found');
      return null;
    }

    // Column G contains the verified date
    const verifiedDate = challanRow[6]; // Column G is index 6

    return {
      name: student[0], // Name is in first column (index 0)
      UID: uid,
      email: student[3], // Email is in fourth column (index 3)
      course: '', // Course is not in RegistrationDetails sheet
      verified: verifiedDate ? true : false,
      verifiedDate: verifiedDate || new Date().toLocaleDateString() // Use current date if not set
    };
  } catch (error) {
    console.error('Error getting student data:', error);
    throw error;
  }
}

// ✅ Fee challan sheet operations
export async function appendChallanRequest({ UID, name, email, course, requestDate }) {
  try {
    console.log('Appending new challan request for UID:', UID);
    
    // Column order for Fee Challan sheet:
    // 0: Name, 1: UID, 2: Email, 3: Course, 4: Request Date, 5: Status, 6: Verified Date, 7: Signature URL
    const rowData = [
      name,        // Name
      UID,         // UID
      email,       // Email
      course,      // Course
      requestDate, // Request Date
      'pending',   // Status (initially pending)
      '',          // Verified Date (empty initially)
      ''           // Signature URL (empty initially)
    ];

    // Check for existing request
    const challanRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Fee Challan!A2:H' // Skip header row
    });
    
    const challanRows = challanRes.data.values || [];
    const existingRowIndex = challanRows.findIndex(row => row[1] && row[1].trim() === UID.trim());
    
    if (existingRowIndex !== -1) {
      // Update existing request if it was rejected
      const existingStatus = (challanRows[existingRowIndex][5] || '').toLowerCase();
      if (existingStatus === 'rejected') {
        await sheets.spreadsheets.values.update({
          spreadsheetId: sheetId,
          range: `Fee Challan!A${existingRowIndex + 2}:H${existingRowIndex + 2}`, // +2 because 1 for header, 1 for 0-based index
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [rowData]
          }
        });
        return { success: true, message: 'Challan request resubmitted successfully' };
      }
      return { success: false, message: 'A challan request already exists for this student' };
    }

    // If no existing request, append a new row
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Fee Challan!A1:H1',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [rowData]
      }
    });

    return { success: true, message: 'Challan request submitted successfully' };
    
  } catch (error) {
    console.error('Error in appendChallanRequest:', error);
    throw error;
  }
}

export async function getChallanRequests() {
  try {
    console.log('Fetching challan requests from sheet...');
    console.log('Sheet ID:', sheetId);
    
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Fee Challan!A2:H', // Skip header row
    });

    if (!res.data || !res.data.values) {
      console.error('No data returned from spreadsheet. Response:', JSON.stringify(res.data, null, 2));
      return [];
    }

    const rows = res.data.values;
    console.log(`Retrieved ${rows.length} rows from Fee Challan sheet`);
    
    if (rows.length > 0) {
      console.log('First row sample:', rows[0]);
    }
    
    // Map rows to objects using direct indices
    // 0: Name, 1: UID, 2: Email, 3: Course, 4: Request Date, 5: Status, 6: Verified Date, 7: Signature URL
    const mappedRows = rows.map((row, index) => ({
      name: row[0] || '',
      UID: row[1]?.toString() || '', // Ensure UID is a string for comparison
      email: row[2] || '',
      course: row[3] || '',
      requestDate: row[4] || '',
      status: (row[5] || '').toLowerCase(),
      verifiedDate: row[6] || '',
      signatureUrl: row[7] || '',
      _rowIndex: index + 2 // +2 because we're skipping header and JS is 0-based
    }));
    
    console.log(`Mapped ${mappedRows.length} challan requests`);
    return mappedRows;
  } catch (error) {
    console.error('Error in getChallanRequests:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    throw new Error(`Failed to fetch challan requests: ${error.message}`);
  }
}

// Define aliases for each field that we can match against
const fieldAliases = {
  name: ['name', 'full name', 'student name', 'student_name'],
  UID: ['uid', 'student_id', 'id', 'student id', 'studentid', 'registration number', 'regno'],
  email: ['email', 'email address', 'email_address'],
  course: ['course', 'program', 'degree', 'branch'],
  phone: ['phone', 'phone number', 'phone_number', 'mobile', 'mobile number', 'contact'],
  password: ['password', 'hash'],
  status: ['status', 'state'],
  requestDate: ['request_date', 'date_requested']
};

// Function to find best matching header for a field
function findMatchingHeader(header) {
  // Try to match against all field aliases
  for (const [field, aliases] of Object.entries(fieldAliases)) {
    // Check if header matches any alias exactly
    if (aliases.includes(header.toLowerCase())) {
      return field;
    }
    // Check if header contains any alias as substring
    if (aliases.some(alias => header.toLowerCase().includes(alias))) {
      return field;
    }
  }
  return null;
}

function mapRowsToObjects(rows, headers) {
  // Log headers for debugging
  console.log('=== Sheet Headers ===');
  headers.forEach((h, i) => console.log(`[${i}] ${h}`));
  
  // Create a mapping of header names to their indices
  const headerMap = headers.reduce((acc, header, index) => {
    acc[header] = index;
    return acc;
  }, {});

  console.log('=== Header Field Mapping ===');
  // Create a mapping of actual headers to our field names
  const headerFieldMap = headers.reduce((acc, header) => {
    const originalHeader = header;
    header = header.trim();
    const field = findMatchingHeader(header);
    console.log(`'${originalHeader}' -> '${field}'`);
    if (field) {
      acc[originalHeader] = field;
    }
    return acc;
  }, {});
  
  console.log('=== Mapped Fields ===');
  console.log(JSON.stringify(headerFieldMap, null, 2));

  return rows.map(row => {
    const obj = {};
    console.log('Processing row:', row);
    headers.forEach(header => {
      const field = headerFieldMap[header];
      if (field) {
        const value = row[headerMap[header]];
        obj[field] = value ? value.trim() : ''; // Changed undefined to ''
      }
    });
    return obj;
  });
}