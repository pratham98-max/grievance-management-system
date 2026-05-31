import express from 'express';
import { getEmployees } from '../controllers/userController.js';
import { verifyToken, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Only Admins should be able to pull the employee directory
router.get('/employees', verifyToken, requireRole(['ADMIN']), getEmployees);

export default router;