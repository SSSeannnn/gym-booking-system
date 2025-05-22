const express = require('express');
const router = express.Router();
const {
  getClassStatsHandler,
  getBookingStatsHandler,
  getRevenueStatsHandler,
  getInstructorStatsHandler,
  getPopularClassesHandler
} = require('../controllers/statsController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// All routes require authentication
router.use(authenticate);

// Get class statistics
router.get('/classes', authorize(['admin']), getClassStatsHandler);

// Get booking statistics
router.get('/bookings', authorize(['admin']), getBookingStatsHandler);

// Get revenue statistics
router.get('/revenue', authorize(['admin']), getRevenueStatsHandler);

// Get instructor statistics
router.get('/instructors', authorize(['admin']), getInstructorStatsHandler);

// Get popular classes
router.get('/popular-classes', authorize(['admin']), getPopularClassesHandler);

module.exports = router; 