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
export async function appendChallanRequest({ UID, email, course, requestDate }) {
  try {
    // First get the student's name from RegistrationDetails sheet
    const studentData = await getStudentData(UID);
    if (!studentData) {
      throw new Error(`Student with UID ${UID} not found`);
    }
    const name = studentData.name;
    console.log('Using student name:', name);

    // Check if request already exists
    const existingRequests = await getChallanRequests();
    const existingRequest = existingRequests.find(req => req.UID === UID);
    
    if (existingRequest) {
      // Allow resubmission if previous request was rejected
      if (existingRequest.status === 'rejected') {
        // Delete the rejected request first
        const rows = await sheets.spreadsheets.values.get({
          spreadsheetId: sheetId,
          range: 'Fee challan!A1:H'
        });
        const rowToDelete = rows.data.values?.findIndex(row => row[1] === UID); // Assuming UID is in column B
        if (rowToDelete !== -1) {
          await sheets.spreadsheets.values.batchClear({
            spreadsheetId: sheetId,
            ranges: [`Fee challan!A${rowToDelete + 1}:H${rowToDelete + 1}`]
          });
        }
      } else {
        throw new Error(`Challan request already exists for UID ${UID}. Current status: ${existingRequest.status}.\nPlease wait for the current request to be processed or contact support if you need assistance.`);
      }
    }

    // Get the actual headers from the Fee challan sheet
    const headersRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Fee challan!A1:H1',
    });

    const headers = headersRes.data.values?.[0];
    console.log('Actual sheet headers:', headers);
    
    if (!headers) {
      throw new Error('No headers found in Fee challan sheet');
    }

    // Create the row in the correct order based on actual headers
    const row = headers.map(header => {
      switch (header) {
        case 'Name': return name;
        case 'UID': return UID;
        case 'Email': return email; // Use email from POST request
        case 'Course': return ''; // Course is empty since it's not in RegistrationDetails
        case 'Request Date': return requestDate;
        case 'Status': return 'pending';
        case 'Verified Date': return '';
        case 'Signature URL': return '';
        default: return '';
      }
    });

    console.log('Appending row:', row);
    return sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Fee challan!A1:H',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row]
      }
    });
  } catch (error) {
    console.error('Error appending challan request:', error);
    throw error;
  }
}

export async function getChallanRequests() {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Fee challan!A1:Z',
    });

    if (!res.data.values) {
      console.error('No data returned from spreadsheet');
      return [];
    }

    const [headers, ...rows] = res.data.values;
    
    if (!headers || headers.length === 0) {
      console.error('No headers found in spreadsheet');
      return [];
    }

    console.log('Detected headers:', headers);
    
    const mappedData = mapRowsToObjects(rows, headers);
    console.log('Transformed data:', mappedData);
    
    return mappedData;
  } catch (error) {
    console.error('Error fetching challan requests:', error);
    throw error;
  }
}

// Define aliases for each field that we can match against
const fieldAliases = {
  name: ['name'],
  UID: ['uid', 'student_id', 'id'],
  phone: ['phone', 'mobile', 'contact'],
  email: ['email'],
  password: ['password', 'hash'],
  course: ['course', 'program'],
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
  console.log('Headers in sheet:', headers);
  
  // Create a mapping of header names to their indices
  const headerMap = headers.reduce((acc, header, index) => {
    acc[header] = index;
    return acc;
  }, {});

  // Create a mapping of actual headers to our field names
  const headerFieldMap = headers.reduce((acc, header) => {
    const field = findMatchingHeader(header);
    console.log(`Mapping header '${header}' to field:`, field);
    if (field) {
      acc[header] = field;
    }
    return acc;
  }, {});

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