const {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass
} = require('../services/classService');

/**
 * Create a new class
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createClassHandler = async (req, res, next) => {
  try {
    const classData = {
      ...req.body,
      instructor: req.body.instructor || req.user._id // 优先用传入的 instructor
    };
    const newClass = await createClass(classData);
    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      data: newClass
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all classes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getAllClassesHandler = async (req, res, next) => {
  try {
    const classes = await getAllClasses(req.query);
    res.status(200).json({
      success: true,
      data: classes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get class by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getClassByIdHandler = async (req, res, next) => {
  try {
    const classData = await getClassById(req.params.id);
    res.status(200).json({
      success: true,
      data: classData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update class
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateClassHandler = async (req, res, next) => {
  try {
    const updatedClass = await updateClass(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Class updated successfully',
      data: updatedClass
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete class
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const deleteClassHandler = async (req, res, next) => {
  try {
    await deleteClass(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClassHandler,
  getAllClassesHandler,
  getClassByIdHandler,
  updateClassHandler,
  deleteClassHandler
}; 