const jwt = require('jsonwebtoken');

const generateToken = (userId, role, groupid = null) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    { id: userId, role, groupid },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } 
  );
};

module.exports = generateToken;
