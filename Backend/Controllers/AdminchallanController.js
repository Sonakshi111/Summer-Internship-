const { addChallanToSheet } = require('../services/googleSheetsService');

const generateChallan = async (req, res) => {
  try {
    const challanData = req.body;

    // Ensure data is present
    if (!challanData || Object.keys(challanData).length === 0) {
      return res.status(400).json({ error: 'Challan data is required' });
    }

    // Call the service to add data to Google Sheet
    const result = await addChallanToSheet(challanData);

    res.status(200).json({ message: 'Challan generated and saved successfully', result });
  } catch (error) {
    console.error('Error generating challan:', error.message);
    res.status(500).json({ error: 'Failed to generate challan' });
  }
};

module.exports = {
  generateChallan,
};
