import User from '../models/User.js';

// @desc    Get all employees (Technicians)
// @route   GET /api/users/employees
// @access  Private (Admin Only)
export const getEmployees = async (req, res) => {
  try {
    // Find all users who have the role of 'EMPLOYEE'
    const employees = await User.find({ role: 'EMPLOYEE' }).select('-password');
    
    res.status(200).json(employees);
  } catch (error) {
    console.error('Fetch Employees Error:', error);
    res.status(500).json({ message: 'Server error fetching employees' });
  }
};