import express from 'express';
import { getStudentInfo } from '../Controllers/studentInfoController.js';

const router = express.Router();

router.get('/info/:uid', getStudentInfo);

export default router;
