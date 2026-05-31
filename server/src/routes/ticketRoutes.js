import express from 'express';
import { 
  createTicket, 
  getMyTickets, 
  getTicketById,
  getAllTicketsAdmin,   
  assignTicketAdmin,
  getAssignedTickets    // <-- 1. Import the new function
} from '../controllers/ticketController.js';
import { verifyToken, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verifyToken); 

// --- Customer Routes ---
router.post('/', createTicket);
router.get('/my-tickets', getMyTickets);
router.get('/:id', getTicketById); 

// --- Employee Routes ---
// 2. Add this specific route for technicians
router.get('/employee/assigned', requireRole(['EMPLOYEE']), getAssignedTickets);

// --- Admin Only Routes ---
router.get('/admin/all', requireRole(['ADMIN' , 'EMPLOYEE']), getAllTicketsAdmin);
router.put('/admin/assign/:id', requireRole(['ADMIN' , 'EMPLOYEE']), assignTicketAdmin);

export default router;