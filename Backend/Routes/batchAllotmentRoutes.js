import express from 'express';
import { submitBatchAllotment } from '../Controllers/batchAllotmentController.js';

const router = express.Router();

router.post('/submit', submitBatchAllotment);

export default router;
