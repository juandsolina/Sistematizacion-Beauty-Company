// src/routes/auth.routes.ts
import { Router } from 'express';
import { register, login } from '../controllers/admin/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);

export default router;