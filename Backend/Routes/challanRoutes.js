
import express from 'express';
import { 
  submitChallanRequest, 
  getChallanStatus, 
  fetchChallanRequests 
} from '../Controllers/challanController.js';
import { generateChallanPDF } from '../utils/generateChallanPDF.js';

const router = express.Router();

// Submit a new challan request
router.post('/submit', submitChallanRequest);

// Get challan status for a student
router.get('/status/:UID', getChallanStatus);

// Get all challan requests (admin only)
router.get('/requests', fetchChallanRequests);

// Download challan PDF
router.get('/download/:UID', async (req, res) => {
  try {
    let { UID } = req.params;
    
    // Decode the UID to handle special characters
    UID = decodeURIComponent(UID);
    console.log('Decoded UID for download:', UID);
    
    try {
      // Get the requests data directly without sending a response
      const requests = await fetchChallanRequests();
      console.log('All challan requests:', requests);
      
      // Ensure UID comparison is done as strings and handle case sensitivity
      const challan = Array.isArray(requests) 
        ? requests.find(req => req.UID && req.UID.toString().trim() === UID.trim())
        : null;
        
      console.log('Found challan for download:', challan);

      if (!challan) {
        console.log('Challan not found for UID:', UID);
        console.log('Available UIDs:', requests.map(r => r.UID));
        return res.status(404).json({ 
          success: false,
          error: 'Challan not found' 
        });
      }
      
      if (challan.status !== 'verified') {
        console.log('Challan found but not verified. Status:', challan.status);
        return res.status(400).json({ 
          success: false,
          error: 'Challan not verified' 
        });
      }

      console.log('Generating PDF for challan:', challan);
      const pdfBuffer = await generateChallanPDF({
        name: challan.name,
        UID: challan.UID,
        verifiedDate: challan.verifiedDate || new Date().toISOString().split('T')[0]
      });
      
      // Create a safe filename by replacing special characters
      const safeUID = UID.replace(/[^a-z0-9]/gi, '_');
      
      res
        .set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename=challan-${safeUID}.pdf`
        })
        .send(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error; // This will be caught by the outer try-catch
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate PDF' 
    });
  }
});

export default router;
