// This middleware checks if the user is authenticated by verifying a JWT token.
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
exports.protect = (req, res, next) => {
    // Check for token in the Authorization header
  const token = req.headers.authorization?.split(' ')[1];
    // If token is not provided, return an error
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    // Verify the token
  try {
    // Decode the token using your secret key
    const decoded = jwt.verify(token, secretKey);
    // If token is valid, add the user to the request object
    req.user = decoded;
    // Call the next middleware or route handler
    next();
  } 
  // If token verification fails, return an error
  catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
