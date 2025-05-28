const membershipService = require('../services/membershipService');
const User = require('../models/userModel');

/**
 * 获取所有可用的会员计划
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const getMembershipPlansHandler = async (req, res, next) => {
  try {
    const plans = await membershipService.getAvailablePlans();
    res.status(200).json({
      success: true,
      data: plans
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取当前登录用户的会员信息
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const getCurrentUserMembershipHandler = async (req, res, next) => {
  try {
    const membership = await membershipService.checkMembershipStatus(req.user.id);
    res.status(200).json({
      success: true,
      data: membership && membership.toObject ? membership.toObject() : membership
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 取消会员订阅
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const cancelMembershipHandler = async (req, res, next) => {
  try {
    const user = await membershipService.cancelMembership(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Membership subscription canceled',
      data: {
        membership: user.membership && user.membership.toObject ? user.membership.toObject() : user.membership,
        message: `Your membership will last until ${user.membership.endDate.toLocaleDateString()}`
      }
    });
  } catch (error) {
    if (error.message === 'There are currently no active membership subscriptions') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

/**
 * 续订会员
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const renewMembershipHandler = async (req, res, next) => {
  try {
    const { planId } = req.body;
    if (!planId) {
      return res.status(400).json({
        success: false,
        message: 'Please select a membership plan'
      });
    }

    const user = await membershipService.renewMembership(req.user.id, planId);
    res.status(200).json({
      success: true,
      message: 'Membership subscription successful',
      data: {
        membership: user.membership && user.membership.toObject ? user.membership.toObject() : user.membership,
        message: `Your membership will last until ${user.membership.endDate.toLocaleDateString()}`
      }
    });
  } catch (error) {
    if (error.message === 'Invalid membership plan') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

module.exports = {
  getMembershipPlansHandler,
  getCurrentUserMembershipHandler,
  cancelMembershipHandler,
  renewMembershipHandler
}; 