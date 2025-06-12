// This file generates a JWT token for user authentication
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
exports.generateToken = (id, role) => {
  return jwt.sign({ id, role }, secretKey, { expiresIn: '1d' });
};
