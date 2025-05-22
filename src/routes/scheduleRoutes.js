const express = require('express');
const router = express.Router();
const {
  createScheduleHandler,
  getAllSchedulesHandler,
  getScheduleByIdHandler,
  updateScheduleHandler,
  deleteScheduleHandler
} = require('../controllers/scheduleController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { validateRequest, schemas } = require('../middlewares/validateRequest');

// All routes require authentication
router.use(authenticate);

// Create schedule - requires admin permission and input validation
router.post('/', authorize(['admin']), validateRequest(schemas.createSchedule), createScheduleHandler);

// Get all schedules
router.get('/', getAllSchedulesHandler);

// Get specific schedule
router.get('/:id', getScheduleByIdHandler);

// Update schedule - requires admin permission
router.put('/:id', authorize(['admin']), updateScheduleHandler);

// Delete schedule - requires admin permission
router.delete('/:id', authorize(['admin']), deleteScheduleHandler);

module.exports = router; 