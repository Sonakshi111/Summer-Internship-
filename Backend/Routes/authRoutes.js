import express from 'express';
import { register } from '../Controllers/registerController.js';
import { registerValidation } from '../Middlewares/auth.js';
import { login } from '../Controllers/loginController.js';
import { loginValidation } from '../Middlewares/auth.js';

const router = express.Router();

router.post('/register', registerValidation, register);

router.post('/login', loginValidation, login);

export default router;
