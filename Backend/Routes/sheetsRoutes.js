import express from 'express';
import { getStudents } from '../Controllers/sheetsController.js';

const router = express.Router();

// Basic route for now
router.get('/students', getStudents);

export default router;
