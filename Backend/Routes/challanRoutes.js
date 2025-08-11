
import express from 'express';
import { appendChallanRequest, getStudentData, getChallanRequests } from '../Models/sheetsModel.js';
import { generateChallanPDF } from '../utils/generateChallanPDF.js';

const router = express.Router();

// POST - Generate challan with automatic data fetching and verification
router.post('/generate-challan', async (req, res) => {
  try {
    const { UID } = req.body;

    if (!UID) {
      return res.status(400).json({ error: 'UID is required' });
    }

    // Fetch student data from sheets
    const studentData = await getStudentData(UID);
    if (!studentData) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if challan request already exists
    const existingRequests = await getChallanRequests();
    const existingRequest = existingRequests.find(req => req.UID === UID);

    if (existingRequest) {
      if (existingRequest.status === 'verified') {
        // If already verified, just generate PDF without creating new request
        return res.status(200).json({
          message: 'Challan already exists and is verified',
          status: 'verified'
        });
      } else if (existingRequest.status === 'pending') {
        // If pending, return with pending status
        return res.status(200).json({
          message: 'Challan request is pending approval',
          status: 'pending'
        });
      }
    }

    // If no existing request or if request was rejected
    if (!studentData.verified) {
      await appendChallanRequest({
        name: studentData.name,
        UID,
        email: studentData.email,
        course: studentData.course,
        requestDate: new Date().toLocaleDateString()
      });
      return res.status(200).json({ 
        message: 'Challan request submitted successfully',
        status: 'pending'
      });
    }

    // Generate PDF with only required fields
    const pdfBuffer = await generateChallanPDF({
      name: studentData.name,
      verifiedDate: studentData.verifiedDate,
      // Also pass with capital D for template compatibility
      verifiedDateCapital: studentData.verifiedDate
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=challan.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating challan:', error);
    res.status(500).json({ error: 'Failed to generate challan' });
  }
});
// GET - Student checks challan status
router.get('/status', async (req, res) => {
  try {
    const { UID, email } = req.query;

    if (!UID && !email) {
      return res.status(400).json({ error: 'UID or Email required' });
    }

    const data = await getChallanRequests();
    const student = data.find(s => s.UID === UID || s.email === email);

    if (!student || !student.status) {
      return res.status(404).json({ error: 'Student not found or invalid status' });
    }

    res.json({ status: student.status.toLowerCase(), student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch status' });
  }
});

// GET - Download challan PDF for verified student
router.get('/download/:UID', async (req, res) => {
  const { UID } = req.params;

  try {
    const data = await getChallanRequests();
    const student = data.find(s => s.UID === UID);

    if (!student || student.status.toLowerCase() !== 'verified') {
      return res.status(404).json({ error: 'Challan not found or not verified' });
    }

    const pdfBuffer = await generateChallanPDF(student.name, student.signatureUrl);
    
    res
      .set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=challan-${UID}.pdf`
      })
      .send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
});

export default router;
