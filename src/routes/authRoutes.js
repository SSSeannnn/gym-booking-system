const express = require('express');
const router = express.Router();
const { registerHandler, loginHandler, getProfileHandler } = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { validateRequest } = require('../middlewares/validateMiddleware');
const schemas = require('../validations/authValidation');

// Public routes
router.post('/register', validateRequest(schemas.register), registerHandler);
router.post('/login', validateRequest(schemas.login), loginHandler);

// Protected routes
router.get('/profile', authenticate, getProfileHandler);

// Protected test route
router.get('/protected', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Access granted to protected route',
    user: req.user
  });
});

// Admin only test route
router.get('/admin', authenticate, authorize('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Access granted to admin route',
    user: req.user
  });
});

// Customer only test route
router.get('/customer', authenticate, authorize('customer'), (req, res) => {
  res.json({
    success: true,
    message: 'Access granted to customer route',
    user: req.user
  });
});

module.exports = router; 