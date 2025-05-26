const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const membershipService = require('../services/membershipService');
const jwtConfig = require('../config/jwt.config');

/**
 * 用户注册控制器
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const registerHandler = async (req, res, next) => {
  try {
    const { email, password, role = 'customer', planId } = req.body;

    // 验证邮箱格式
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '请提供有效的邮箱地址'
      });
    }

    // 验证会员计划
    if (!planId) {
      return res.status(400).json({
        success: false,
        message: '请选择会员计划'
      });
    }

    const plan = membershipService.getPlanById(planId);
    if (!plan) {
      return res.status(400).json({
        success: false,
        message: '无效的会员计划ID'
      });
    }

    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '该邮箱已被注册'
      });
    }

    // 创建新用户
    const user = new User({
      email,
      password,
      role
    });

    // 设置会员信息
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.durationDays);

    user.membership = {
      status: 'active',
      type: plan.id.split('_')[0], // 从 planId 中提取类型（monthly 或 weekly）
      startDate,
      endDate,
      planId: plan.id
    };

    // 保存用户
    await user.save();

    // 生成 JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    // 返回响应
    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: {
          email: user.email,
          role: user.role,
          membership: user.membership
        },
        token
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    next(error);
  }
};

/**
 * 用户登录控制器
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const loginHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 生成 JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    // 返回响应
    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: {
          email: user.email,
          role: user.role,
          membership: user.membership
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerHandler,
  loginHandler
}; 