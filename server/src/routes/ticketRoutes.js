import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
  createTicket, 
  getMyTickets, 
  getTicketById,
  getAllTicketsAdmin,   
  assignTicketAdmin,
  getAssignedTickets    
} from '../controllers/ticketController.js';
import { verifyToken, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// --- Configure Multer Local Disk Storage ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/'); // Files will be saved inside server/src/uploads/
  },
  filename: (req, file, cb) => {
    // Generate a completely unique file name to avoid overwriting files
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.use(verifyToken); 

// --- Customer Routes ---
// Notice upload.array('attachments') matches the key name sent from Angular!
router.post('/', upload.array('attachments', 5), createTicket);
router.get('/my-tickets', getMyTickets);
router.get('/:id', getTicketById); 

// --- Employee Routes ---
router.get('/employee/assigned', requireRole(['EMPLOYEE']), getAssignedTickets);

// --- Admin Only Routes ---
router.get('/admin/all', requireRole(['ADMIN']), getAllTicketsAdmin);
router.put('/admin/assign/:id', requireRole(['ADMIN', 'EMPLOYEE']), assignTicketAdmin);

export default router;