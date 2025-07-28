import { sheets, sheetId } from '../Models/sheetsModel.js';

export const getStudents = async (req, res) => {
  console.log('Received request to /api/students');
  console.log('Request query:', req.query);
  
  try {
    console.log('Attempting to fetch student list from Google Sheets...');
    const r = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'StudentList!A2:F', // Adjusted range to include all columns
    });
    const data = r.data.values ?? [];
    console.log('Successfully fetched data from Google Sheets:', data);
    
    // Filter data based on query parameters if provided
    let filteredData = data;
    if (req.query.id) {
      console.log('Filtering by ID:', req.query.id);
      filteredData = data.filter(row => row[0] === req.query.id);
    } else if (req.query.email) {
      console.log('Filtering by Email:', req.query.email);
      filteredData = data.filter(row => row[2] === req.query.email);
    }
    
    console.log('Final filtered data:', filteredData);
    res.json({ success: true, data: filteredData });
  } catch (error) {
    console.error('Error fetching students:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch student data',
      details: error.message 
    });
  }
};
