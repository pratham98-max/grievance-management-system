import express from 'express';
import { syncUser, getMe } from '../controllers/authController.js'; // <-- Import getMe
import { verifyToken } from '../middlewares/authMiddleware.js';     // <-- Import verifyToken

const router = express.Router();

// Public route (Syncing a newly registered user doesn't need our custom token yet)
router.post('/sync', syncUser);

// Private route (Requires the user to be logged in)
router.get('/me', verifyToken, getMe); // <-- ADD THIS ROUTE

export default router;