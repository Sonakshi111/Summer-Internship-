import { appendChallanRequest, getChallanRequests } from '../Models/sheetsModel';

export const submitChallanRequest = async (req, res) => {
  try {
    const { name, UID, email, course } = req.body;

    if (!name || !UID || !email || !course) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const requestDate = new Date().toLocaleDateString();

    await appendChallanRequest({
      name,
      UID,
      email,
      course,
      requestDate,
    });

    res.status(200).json({ message: 'Challan request submitted successfully.' });
  } catch (error) {
    console.error('Error submitting challan request:', error);
    res.status(500).json({ error: 'Failed to submit challan request.' });
  }
};

export const fetchChallanRequests = async (req, res) => {
  try {
    const data = await getChallanRequests();
    res.status(200).json({ requests: data });
  } catch (error) {
    console.error('Error fetching challan requests:', error);
    res.status(500).json({ error: 'Failed to fetch challan requests.' });
  }
};
