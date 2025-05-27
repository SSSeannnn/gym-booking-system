const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const {
  getAllClassesHandler,
  getClassByIdHandler,
  createClassHandler,
  updateClassHandler,
  deleteClassHandler
} = require('../controllers/classController');

// Public routes
router.get('/', getAllClassesHandler);
router.get('/:id', getClassByIdHandler);

// Protected routes
router.use(authenticate);
router.post('/', createClassHandler);
router.put('/:id', updateClassHandler);
router.delete('/:id', deleteClassHandler);

module.exports = router; 