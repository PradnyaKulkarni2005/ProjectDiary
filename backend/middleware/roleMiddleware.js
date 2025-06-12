// Middleware to check user roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if the user is authenticated
    if (!roles.includes(req.user.role)) {
        // If the user's role is not in the allowed roles, return an error
      return res.status(403).json({ message: 'Access denied' });
    }
    // If the user's role is allowed, proceed to the next middleware or route handler
    next();
  };
};
