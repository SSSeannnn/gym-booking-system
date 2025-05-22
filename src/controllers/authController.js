const { registerUser, loginUser } = require('../services/authService');

/**
 * 用户注册控制器
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const register = async (req, res, next) => {
  try {
    const userData = {
      email: req.body.email,
      password: req.body.password,
      role: req.body.role || 'customer' // 默认为customer角色
    };

    const user = await registerUser(userData);
    // 注册成功后，调用 loginUser 生成 token
    const result = await loginUser(userData.email, userData.password);
    
    res.status(201).json({
      success: true,
      message: '注册成功',
      data: { user, token: result.token }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || '注册失败'
    });
  }
};

/**
 * 用户登录控制器
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '请提供邮箱和密码'
      });
    }

    const result = await loginUser(email, password);
    
    res.status(200).json({
      success: true,
      message: '登录成功',
      data: result
    });
  } catch (error) {
    // 密码错误或用户不存在时返回 401
    if (error.message === '密码错误' || error.message === '用户不存在') {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
    res.status(400).json({
      success: false,
      message: error.message || '登录失败'
    });
  }
};

module.exports = {
  register,
  login
}; 