const express = require('express');
const router = express.Router();
const {
  createBookingHandler,
  getUserBookingsHandler,
  getScheduleBookingsHandler,
  cancelBookingHandler,
  getBookingByIdHandler
} = require('../controllers/bookingController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { validateRequest, schemas } = require('../middlewares/validateRequest');

// All routes require authentication
router.use(authenticate);

// Create booking - requires customer permission and input validation
router.post('/', authorize(['customer']), validateRequest(schemas.createBooking), createBookingHandler);

// Get all bookings for the current user
router.get('/me', authorize(['customer']), getUserBookingsHandler);

// Get all bookings for a specific schedule
router.get('/schedule/:scheduleId', authorize(['admin']), getScheduleBookingsHandler);

// Cancel booking
router.put('/:id/cancel', authorize(['customer']), cancelBookingHandler);

// Get specific booking details
router.get('/:id', getBookingByIdHandler);

/**
 * @route DELETE /api/bookings/:bookingId
 * @desc 取消预约
 * @access Private
 */
router.delete('/:bookingId', cancelBookingHandler);

module.exports = router; 