import Ticket from '../models/Ticket.js';

// Helper function to generate unique Ticket IDs (e.g., NT-8431)
const generateTicketId = async () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000); 
  const ticketId = `NT-${randomNum}`;
  
  const exists = await Ticket.findOne({ ticketId });
  if (exists) return generateTicketId(); 
  
  return ticketId;
};

// 1. Create a new ticket (Customer Portal)
export const createTicket = async (req, res) => {
  try {
    const { category, subject, description, plantReference } = req.body;

    if (!category || !subject || !description) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const ticketId = await generateTicketId();

    // --- Map uploaded files to local URLs ---
    const attachmentUrls = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        // Build an accessible web URL pointing to your local Node server
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        attachmentUrls.push(fileUrl);
      });
    }

    const ticket = await Ticket.create({
      ticketId,
      customer: req.user._id,
      category,
      subject,
      description,
      plantReference,
      attachments: attachmentUrls // Save local server paths to MongoDB!
    });

    res.status(201).json({
      message: 'Ticket created successfully with local attachments',
      ticket
    });
  } catch (error) {
    console.error('Create Ticket Error:', error);
    res.status(500).json({ message: 'Server error creating ticket' });
  }
};

// 2. Get all tickets for the logged-in customer (Customer Portal)
export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Fetch Tickets Error:', error);
    res.status(500).json({ message: 'Server error fetching tickets' });
  }
};

// 3. Get a single ticket by its ID (Shared view)
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.id });
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    res.status(200).json(ticket);
  } catch (error) {
    console.error('Fetch Single Ticket Error:', error);
    res.status(500).json({ message: 'Server error fetching ticket details' });
  }
};

// 4. Get EVERY ticket in the system (Admin Only)
export const getAllTicketsAdmin = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('customer', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(tickets);
  } catch (error) {
    console.error('Admin Fetch Tickets Error:', error);
    res.status(500).json({ message: 'Server error fetching master ticket pool' });
  }
};

// 5. Assign a ticket to an employee / Update ticket details (Admin Only)
export const assignTicketAdmin = async (req, res) => {
  try {
    const { employeeId, priority, status } = req.body;
    const { id } = req.params;

    const ticket = await Ticket.findOne({ ticketId: id });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (employeeId) ticket.assignedTo = employeeId === "" ? null : employeeId;
    if (priority) ticket.priority = priority;
    if (status) ticket.status = status;

    await ticket.save();

    const updatedTicket = await Ticket.findOne({ ticketId: id })
      .populate('customer', 'name email')
      .populate('assignedTo', 'name email');

    res.status(200).json({
      message: 'Ticket updated successfully by administrator',
      ticket: updatedTicket
    });
  } catch (error) {
    console.error('Admin Assign Ticket Error:', error);
    res.status(500).json({ message: 'Server error updating ticket assignment' });
  }
};

// 6. Get tickets assigned to the logged-in Employee (Technician Portal)
export const getAssignedTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ assignedTo: req.user._id })
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(tickets);
  } catch (error) {
    console.error('Fetch Assigned Tickets Error:', error);
    res.status(500).json({ message: 'Server error fetching assigned tickets' });
  }
};