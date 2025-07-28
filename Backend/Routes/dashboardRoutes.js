import express from 'express';
import { getDashboard } from '../Controllers/dashboardController.js';
const router = express.Router();
router.get('/student/:uid', getDashboard);
export default router;
