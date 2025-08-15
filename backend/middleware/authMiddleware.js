// This middleware checks if the user is authenticated by verifying a JWT token.
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;
exports.protect = (req, res, next) => {
  // Check if the Authorization header is present
  const authHeader = req.headers.authorization;
  // If the Authorization header is not present or does not start with 'Bearer ', return an error
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
    // Check for token in the Authorization header
  const token = authHeader.split(' ')[1];
  
    // Verify the token
  try {
    // Decode the token using your secret key
    const decoded = jwt.verify(token, secretKey);
    // If token is valid, add the user to the request object
    if (!decoded.id) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }
    // Check if the user is a student and has a group ID
     if (decoded.role === 'student' && !decoded.groupid) {
      return res.status(401).json({ message: 'Student token missing group ID' });
    }
    req.user = decoded; //contains id,role,groupid
    // Call the next middleware or route handler
    next();
  } 
  // If token verification fails, return an error
  catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};
