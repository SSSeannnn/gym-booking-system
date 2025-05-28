const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const MembershipPlan = require('../models/membershipPlanModel');

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
    throw new Error('User not found');
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
    throw new Error('User not found');
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
    throw new Error('User not found');
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
    throw new Error('User not found');
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

// 创建用户
async function createUser(userData) {
  try {
    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // 处理会员信息
    let membership = null;
    if (userData.planId && userData.planId !== 'none') {
      const startDate = new Date();
      let endDate = new Date();

      // 根据会员类型计算结束日期
      switch (userData.planId) {
        case 'weekly':
          endDate.setDate(startDate.getDate() + 7);
          break;
        case 'monthly':
          endDate.setMonth(startDate.getMonth() + 1);
          break;
        case 'yearly':
          endDate.setFullYear(startDate.getFullYear() + 1);
          break;
      }

      membership = {
        type: userData.planId,
        status: 'active',
        startDate: startDate,
        endDate: endDate,
        autoRenew: false
      };
    }

    // 生成密码盐和哈希
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // 创建用户对象
    const user = new User({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
      membership: membership
    });

    // 保存用户
    const savedUser = await user.save();
    return savedUser;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
  getUserStats
}; 