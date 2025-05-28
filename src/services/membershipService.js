const mongoose = require('mongoose');
const MembershipPlan = require('../models/membershipPlanModel');
const User = require('../models/userModel');

/**
 * 获取所有可用的会员计划
 * @returns {Promise<Array>} 会员计划数组
 */
const getAvailablePlans = async () => {
  return await MembershipPlan.find({ isActive: true });
};

/**
 * 根据ID获取特定会员计划
 * @param {string} planId - 会员计划ID
 * @returns {Promise<Object|null>} 会员计划对象，如果未找到则返回null
 */
const getPlanById = async (planId) => {
  if (!mongoose.Types.ObjectId.isValid(planId)) return null;
  return await MembershipPlan.findById(planId);
};

// 初始化用户会员状态
const initializeMembership = async (userId, planId) => {
  const plan = await getPlanById(planId);
  if (!plan) {
    throw new Error('Invalid membership plan');
  }

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + plan.durationDays);

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.membership = {
    status: 'active',
    type: plan.name.toLowerCase().includes('monthly') ? 'monthly' : 'yearly',
    startDate,
    endDate,
    autoRenew: true,
    planId: plan._id
  };

  await user.save();
  return user;
};

// 取消会员订阅
const cancelMembership = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.membership || user.membership.status !== 'active') {
    throw new Error('No active membership subscription');
  }

  user.membership.autoRenew = false;
  user.membership.status = 'cancelled';
  await user.save();
  return user;
};

// 续订会员
const renewMembership = async (userId, planId) => {
  const plan = await getPlanById(planId);
  if (!plan) {
    throw new Error('Invalid membership plan');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const now = new Date();
  let startDate = now;
  let endDate = new Date(now);

  // 计算新的会员期限
  if (user.membership && user.membership.status === 'active' && user.membership.endDate > now) {
    // 如果会员未过期，从当前到期日开始计算
    startDate = user.membership.endDate;
    endDate = new Date(startDate);
  }
  
  // 添加新计划的持续时间
  endDate.setDate(endDate.getDate() + plan.durationDays);

  user.membership = {
    status: 'active',
    type: plan.name.toLowerCase().includes('monthly') ? 'monthly' : 'yearly',
    startDate,
    endDate,
    planId: plan._id,
    autoRenew: true
  };

  await user.save();
  return user;
};

// 检查会员状态
const checkMembershipStatus = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.membership) {
    return {
      status: 'none',
      message: 'Non-member user'
    };
  }

  // 检查会员是否过期
  if (user.membership.status === 'active' && new Date() > user.membership.endDate) {
    user.membership.status = 'expired';
    await user.save();
  }

  return user.membership;
};

module.exports = {
  getAvailablePlans,
  getPlanById,
  initializeMembership,
  cancelMembership,
  renewMembership,
  checkMembershipStatus
}; 