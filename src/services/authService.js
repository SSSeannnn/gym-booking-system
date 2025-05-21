const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/passwordHasher');
const jwtConfig = require('../config/jwt.config');

/**
 * 注册新用户
 * @param {Object} userData - 用户数据
 * @param {string} userData.email - 用户邮箱
 * @param {string} userData.password - 用户密码
 * @param {string} [userData.role] - 用户角色（可选）
 * @returns {Promise<Object>} - 返回创建的用户对象（不包含密码）
 */
const registerUser = async (userData) => {
  try {
    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('该邮箱已被注册');
    }

    // 对密码进行哈希处理
    const hashedPassword = await hashPassword(userData.password);

    // 创建新用户
    const user = await User.create({
      ...userData,
      password: hashedPassword
    });

    // 返回用户信息（不包含密码）
    const userResponse = user.toObject();
    delete userResponse.password;
    return userResponse;
  } catch (error) {
    throw error;
  }
};

/**
 * 用户登录
 * @param {string} email - 用户邮箱
 * @param {string} password - 用户密码
 * @returns {Promise<Object>} - 返回用户信息和JWT令牌
 */
const loginUser = async (email, password) => {
  try {
    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('用户不存在');
    }

    // 验证密码
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('密码错误');
    }

    // 生成JWT令牌
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    // 返回用户信息和令牌
    const userResponse = user.toObject();
    delete userResponse.password;
    return {
      user: userResponse,
      token
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  registerUser,
  loginUser
}; 