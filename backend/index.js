
// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import authRoutes from './routes/authRoutes.js';
// import dashboardRoutes from './routes/dashboardRoutes.js';

// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());

// app.get('/', (_req, res) => res.send('Backend is live!'));

// app.use('/auth', authRoutes);
// app.use('/dashboard', dashboardRoutes);

// app.listen(process.env.PORT || 8080, () => {
//   console.log(`Backend running at http://localhost:${process.env.PORT || 8080}`);
// });
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { google } from 'googleapis';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 📄 Google Sheets Setup
const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json', // ✅ ensure this file exists at the project root
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const SHEET_ID = '1w376GT7oxLbgvs9UI2pxqG3ke6OMCuAYcvMp2wcQaWE'; // 🔁 Replace with your actual Sheet ID
const RANGE = 'Sheet1!A1:Z1000';   // Adjust based on your sheet layout

// ✅ Root Route: Fetch data from Google Sheets and print it
app.get('/', async (_req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    console.log('✅ Google Sheets Data:\n', rows);

    res.send('✅ Backend is live & fetched Google Sheets data. Check terminal!');
  } catch (error) {
    console.error('❌ Error fetching Google Sheets data:', error.message);
    res.status(500).send('❌ Failed to fetch Google Sheets data');
  }
});

// ✨ Auth & Dashboard Routes
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

// 🔊 Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
