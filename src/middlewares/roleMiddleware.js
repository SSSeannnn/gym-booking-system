/**
 * Role authorization middleware
 * @param {string[]} roles - Array of allowed roles
 * @returns {Function} Express middleware function
 */
const authorize = (roles) => {
  // Convert single role to array
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    console.log('roleMiddleware - req.user:', {
      id: req.user?._id,
      email: req.user?.email,
      role: req.user?.role
    });
    console.log('roleMiddleware - allowed roles:', roles);

    // Check if user exists (should be attached by auth middleware)
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthenticated' });
    }

    // Check if user's role is authorized
    if (!roles.includes(req.user.role)) {
      console.log('roleMiddleware - role check failed:', {
        userRole: req.user.role,
        allowedRoles: roles
      });
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    next();
  };
};

module.exports = {
  authorize
}; 