import bcrypt from 'bcrypt';
import { getRegistrationRows } from '../models/sheetsModel.js';

export async function login(req, res) {
  try {
    const { uniqueId, password } = req.body;
    if (!uniqueId || !password) {
      return res.status(400).json({ success: false, message: 'Missing credentials' });
    }

    const rows = await getRegistrationRows();
    const found = rows.find(r => r[0] === uniqueId);
    if (!found) return res.status(401).json({ success: false, message: 'Invalid ID or password' });

    const hashed = found[rows[0].length - 1];
    if (! (await bcrypt.compare(password, hashed))) {
      return res.status(401).json({ success: false, message: 'Invalid ID or password' });
    }

    const name = found[rows[0].length - 3]; // adjust indexes based on your columns
    res.json({ success: true, uniqueId, name });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
