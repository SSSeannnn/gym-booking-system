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
      message: '会员订阅已取消',
      data: {
        membership: user.membership && user.membership.toObject ? user.membership.toObject() : user.membership,
        message: `您的会员资格将持续到 ${user.membership.endDate.toLocaleDateString()}`
      }
    });
  } catch (error) {
    if (error.message === '当前没有激活的会员订阅') {
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
        message: '请选择会员计划'
      });
    }

    const user = await membershipService.renewMembership(req.user.id, planId);
    res.status(200).json({
      success: true,
      message: '会员续订成功',
      data: {
        membership: user.membership && user.membership.toObject ? user.membership.toObject() : user.membership,
        message: `您的会员资格已延长至 ${user.membership.endDate.toLocaleDateString()}`
      }
    });
  } catch (error) {
    if (error.message === '无效的会员计划') {
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