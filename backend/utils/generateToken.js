// This file generates a JWT token for user authentication
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
exports.generateToken = (id, role, groupid = null) => {
  const payload = { id, role };
  if (groupid) payload.groupid = groupid;

  return jwt.sign(payload, secretKey, { expiresIn: '1d' });
};

