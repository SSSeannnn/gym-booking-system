const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
  getUserStats,
  createUser
} = require('../services/userService');

/**
 * 获取所有用户
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const getAllUsersHandler = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取用户详情
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const getUserByIdHandler = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新用户信息
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const updateUserHandler = async (req, res, next) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'User information updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 删除用户
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const deleteUserHandler = async (req, res, next) => {
  try {
    const user = await deleteUser(req.params.id);
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新用户角色
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const updateUserRoleHandler = async (req, res, next) => {
  try {
    const user = await updateUserRole(req.params.id, req.body.role);
    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取用户统计信息
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const getUserStatsHandler = async (req, res, next) => {
  try {
    const stats = await getUserStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 创建新用户
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const createUserHandler = async (req, res, next) => {
  try {
    console.log('POST /api/users - Received request body:', JSON.stringify(req.body, null, 2));
    console.log('Currently logged in user:', JSON.stringify(req.user, null, 2));

    const userData = {
      ...req.body,
      createdBy: req.user._id // 设置创建者为当前登录用户
    };
    console.log('Preparing to create user data:', JSON.stringify(userData, null, 2));

    const newUser = await createUser(userData);
    console.log('User created successfully:', JSON.stringify(newUser, null, 2));

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This email has already been registered'
      });
    }
    next(error);
  }
};

module.exports = {
  getAllUsersHandler,
  getUserByIdHandler,
  updateUserHandler,
  deleteUserHandler,
  updateUserRoleHandler,
  getUserStatsHandler,
  createUserHandler
}; 