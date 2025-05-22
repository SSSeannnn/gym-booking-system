const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
  getUserStats
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
      message: '用户信息更新成功',
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
      message: '用户删除成功',
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
      message: '用户角色更新成功',
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

module.exports = {
  getAllUsersHandler,
  getUserByIdHandler,
  updateUserHandler,
  deleteUserHandler,
  updateUserRoleHandler,
  getUserStatsHandler
}; 