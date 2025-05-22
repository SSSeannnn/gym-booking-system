const Class = require('../models/classModel');

/**
 * Create a new class
 * @param {Object} classData - Class data
 * @returns {Promise<Object>} - Created class
 */
const createClass = async (classData) => {
  try {
    const newClass = await Class.create(classData);
    return newClass;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all classes
 * @param {Object} filter - Filter criteria
 * @returns {Promise<Array>} - List of classes
 */
const getAllClasses = async (filter = {}) => {
  try {
    const classes = await Class.find(filter)
      .populate('instructor', 'email')
      .sort({ createdAt: -1 });
    return classes;
  } catch (error) {
    throw error;
  }
};

/**
 * Get class by ID
 * @param {string} id - Class ID
 * @returns {Promise<Object>} - Class details
 */
const getClassById = async (id) => {
  try {
    const classData = await Class.findById(id)
      .populate('instructor', 'email');
    if (!classData) {
      throw new Error('Class not found');
    }
    return classData;
  } catch (error) {
    throw error;
  }
};

/**
 * Update class
 * @param {string} id - Class ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} - Updated class
 */
const updateClass = async (id, updateData) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('instructor', 'email');

    if (!updatedClass) {
      throw new Error('Class not found');
    }
    return updatedClass;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete class
 * @param {string} id - Class ID
 * @returns {Promise<Object>} - Deleted class
 */
const deleteClass = async (id) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(id);
    if (!deletedClass) {
      throw new Error('Class not found');
    }
    return deletedClass;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass
}; 