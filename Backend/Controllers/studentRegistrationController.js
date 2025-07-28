import { sheets } from '../Models/sheetsModel.js';

import bcrypt from 'bcrypt';

export const registerStudent = async (req, res) => {
    try {
        const { name, uid, phone, email, password, confirmPassword } = req.body;
        
        // Validate required fields
        if (!name || !uid || !phone || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                error: 'All fields (name, uid, phone, email, password, confirmPassword) are required'
            });
        }

        // Validate password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                error: 'Passwords do not match'
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Get the current timestamp
        const timestamp = new Date().toISOString();

        // Prepare the data to be written to the sheet
        const rowData = [name, uid, phone, email, hashedPassword, timestamp];

        // Write the data to the Registration sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Registration!A1:F',
            valueInputOption: 'RAW',
            resource: {
                values: [rowData]
            }
        });

        res.json({
            success: true,
            message: 'Student registered successfully',
            data: {
                name,
                uid,
                phone,
                email,
                registeredAt: timestamp
            }
        });
    } catch (error) {
        console.error('Error registering student:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
