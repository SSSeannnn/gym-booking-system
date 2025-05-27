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
    const { email, password, role = 'customer', planId, username } = req.body;

    // 验证邮箱格式
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // 验证会员计划
    if (!planId) {
      return res.status(400).json({
        success: false,
        message: 'Please select a membership plan'
      });
    }

    const plan = await membershipService.getPlanById(planId);
    if (!plan) {
      return res.status(400).json({
        success: false,
        message: 'Invalid membership plan ID'
      });
    }

    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // 创建新用户
    const user = new User({
      email,
      password,
      role,
      username
    });

    // 设置会员信息
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.durationDays);

    user.membership = {
      status: 'active',
      type: plan.name.toLowerCase().includes('monthly') ? 'monthly' : 'yearly',
      startDate,
      endDate,
      planId: plan._id
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
      message: 'Registration successful',
      data: {
        user: {
          email: user.email,
          role: user.role,
          username: user.username,
          membership: user.membership
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
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
        message: 'Invalid email or password'
      });
    }

    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
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
      message: 'Login successful',
      data: {
        user: {
          email: user.email,
          role: user.role,
          username: user.username,
          membership: user.membership
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

const getProfileHandler = async (req, res, next) => {
  try {
    const user = req.user;
    res.json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
        username: user.username,
        membership: user.membership
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerHandler,
  loginHandler,
  getProfileHandler
}; 