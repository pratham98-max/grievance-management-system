import User from '../models/User.js';

// @desc    Register / Sync user with MongoDB
// @route   POST /api/auth/sync
// @access  Public
export const syncUser = async (req, res) => {
  try {
    // Extract role from the request body, default to 'CUSTOMER' if missing
    const { firebaseUid, email, name, role } = req.body;

    let user = await User.findOne({ firebaseUid });

    if (!user) {
      // Save the requested role to the database
      user = await User.create({
        firebaseUid,
        email,
        name,
        role: role || 'CUSTOMER' 
      });
      console.log(`New user synced to DB: ${email} as ${user.role}`);
    }

    res.status(200).json({ message: 'User synced successfully', user });
  } catch (error) {
    console.error('Sync User Error:', error);
    res.status(500).json({ message: 'Server error syncing user' });
  }
};

// @desc    Get current logged-in user's profile and role
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    // req.user._id comes safely from our verifyToken middleware!
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Fetch Profile Error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};