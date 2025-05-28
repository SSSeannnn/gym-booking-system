const express = require('express');
const router = express.Router();
const {
  getAllUsersHandler,
  getUserByIdHandler,
  updateUserHandler,
  deleteUserHandler,
  updateUserRoleHandler,
  getUserStatsHandler,
  createUserHandler
} = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { validateRequest, schemas } = require('../middlewares/validateRequest');

// All routes require authentication
router.use(authenticate);

// Create new user
router.post('/', authorize(['admin']), validateRequest(schemas.createUser), createUserHandler);

// Get all users
router.get('/', authorize(['admin']), getAllUsersHandler);

// Get user statistics
router.get('/stats', authorize(['admin']), getUserStatsHandler);

// Get specific user
router.get('/:id', authorize(['admin']), getUserByIdHandler);

// Update user
router.put('/:id', authorize(['admin']), updateUserHandler);

// Delete user
router.delete('/:id', authorize(['admin']), deleteUserHandler);

router.put('/:id/role', authorize(['admin']), updateUserRoleHandler);

module.exports = router; 