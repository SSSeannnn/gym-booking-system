const express = require('express');
const router = express.Router();
const {
  createClassHandler,
  getAllClassesHandler,
  getClassByIdHandler,
  updateClassHandler,
  deleteClassHandler
} = require('../controllers/classController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { validateRequest, schemas } = require('../middlewares/validateRequest');

// Public routes
router.get('/', getAllClassesHandler);
router.get('/:id', getClassByIdHandler);

// Protected routes (require authentication)
router.use(authenticate);

// Admin and Instructor routes
router.post('/', authorize(['admin', 'instructor']), validateRequest(schemas.createClass), createClassHandler);
router.put('/:id', authorize(['admin', 'instructor']), updateClassHandler);
router.delete('/:id', authorize(['admin', 'instructor']), deleteClassHandler);

module.exports = router; 