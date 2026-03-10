import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.js';
import { validateRegister } from '../middlewares/validators.js';

const router = Router();

// POST /api/auth/register - Register
router.post('/register', validateRegister, authController.register);

// GET /api/auth/me - Get current user (requiere autenticación)
router.get('/me', verifyToken, authController.getCurrentUser);

export default router;
