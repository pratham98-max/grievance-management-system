import admin from '../config/firebase.js';
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('Auth blocked: No Bearer token provided');
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the token with Firebase
    // If this fails (e.g., token expired), it jumps to the catch block
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Find the user in our MongoDB using their Firebase UID
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!user) {
      console.warn(`Auth blocked: User with UID ${decodedToken.uid} not found in MongoDB`);
      return res.status(404).json({ message: 'User not found in database' });
    }

    // Attach user and role to the request
    req.user = user;
    next();
  } catch (error) {
    // Log the specific Firebase error (e.g., 'Firebase ID token has expired')
    console.error('Auth Middleware Error:', error.message);
    
    // 403 is correct for invalid/expired tokens
    return res.status(403).json({ 
      message: 'Unauthorized: Invalid or expired token',
      error: error.message 
    });
  }
};

export const requireRole = (rolesArray) => {
  return (req, res, next) => {
    // Safety check: verify req.user exists
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not identified' });
    }
    
    if (!rolesArray.includes(req.user.role)) {
      console.warn(`Access Denied: User ${req.user.email} (Role: ${req.user.role}) attempted to access restricted route.`);
      return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }
    next();
  };
};