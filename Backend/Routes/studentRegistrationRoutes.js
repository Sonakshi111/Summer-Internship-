import express from 'express';
import { registerStudent } from '../Controllers/studentRegistrationController.js';

const router = express.Router();

// Student registration endpoint
router.post('/register', registerStudent);

export default router;
