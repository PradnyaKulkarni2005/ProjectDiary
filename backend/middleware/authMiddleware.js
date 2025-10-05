// This middleware checks if the user is authenticated by verifying a JWT token.
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

exports.protect = (req, res, next) => {
  // Check if the Authorization header is present
  const authHeader = req.headers.authorization;

  // If the Authorization header is not present or does not start with 'Bearer ', return an error
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(" ")[1];

  // 🚩 Extra safety check: handle "null", "undefined" or empty token values
  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({ message: "Invalid or missing token" });
  }

  try {
    // Decode the token using your secret key
    const decoded = jwt.verify(token, secretKey);

    // If token is valid, it should contain an 'id' (user id in payload)
    if (!decoded.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Check if the user is a student and has a group ID
    if (decoded.role === "student" && !decoded.groupid) {
      return res
        .status(401)
        .json({ message: "Student token missing group ID" });
    }

    // Attach the decoded token payload to req.user for downstream controllers
    // This will typically contain { id, role, groupid }
    req.user = decoded;

    // Call the next middleware or route handler
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);

    // Differentiate between expired token and malformed/invalid token
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please log in again" });
    }

    // All other token verification errors → Invalid token
    return res.status(401).json({ message: "Invalid token" });
  }
};
