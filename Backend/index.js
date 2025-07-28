import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './Routes/authRoutes.js';
import studentRegistrationRoutes from './Routes/studentRegistrationRoutes.js';
import sheetsRoutes from './Routes/sheetsRoutes.js';
import batchAllotmentRoutes from './Routes/batchAllotmentRoutes.js';
import studentInfoRoutes from './Routes/studentInfoRoutes.js';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('Start ho gya');
});

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/api/student', studentRegistrationRoutes);
app.use('/api', sheetsRoutes);
app.use('/api/batch', batchAllotmentRoutes);
app.use('/api/student', studentInfoRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});