const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

/**
 * 获取所有用户
 * @returns {Promise<Array>} 用户列表
 */
async function getAllUsers() {
  return await User.find().select('-password');
}

/**
 * 获取用户详情
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 用户详情
 */
async function getUserById(userId) {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('用户不存在');
  }
  return user;
}

/**
 * 更新用户信息
 * @param {string} userId - 用户ID
 * @param {Object} updateData - 更新数据
 * @returns {Promise<Object>} 更新后的用户信息
 */
async function updateUser(userId, updateData) {
  // 如果更新包含密码，需要加密
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new Error('用户不存在');
  }

  return user;
}

/**
 * 删除用户
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 删除的用户信息
 */
async function deleteUser(userId) {
  const user = await User.findByIdAndDelete(userId).select('-password');
  if (!user) {
    throw new Error('用户不存在');
  }
  return user;
}

/**
 * 更新用户角色
 * @param {string} userId - 用户ID
 * @param {string} role - 新角色
 * @returns {Promise<Object>} 更新后的用户信息
 */
async function updateUserRole(userId, role) {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { role } },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new Error('用户不存在');
  }

  return user;
}

/**
 * 获取用户统计信息
 * @returns {Promise<Object>} 用户统计信息
 */
async function getUserStats() {
  const totalUsers = await User.countDocuments();
  const customers = await User.countDocuments({ role: 'customer' });
  const instructors = await User.countDocuments({ role: 'instructor' });
  const admins = await User.countDocuments({ role: 'admin' });

  return {
    totalUsers,
    customers,
    instructors,
    admins
  };
}

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
  getUserStats
}; 