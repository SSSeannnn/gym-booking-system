const {
  getClassStats,
  getBookingStats,
  getRevenueStats,
  getInstructorStats,
  getPopularClasses
} = require('../services/statsService');

/**
 * 获取课程统计信息
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const getClassStatsHandler = async (req, res, next) => {
  try {
    const stats = await getClassStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取预约统计信息
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const getBookingStatsHandler = async (req, res, next) => {
  try {
    const stats = await getBookingStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取收入统计信息
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const getRevenueStatsHandler = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide start date and end date'
      });
    }

    const stats = await getRevenueStats(new Date(startDate), new Date(endDate));
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取教练统计信息
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const getInstructorStatsHandler = async (req, res, next) => {
  try {
    const stats = await getInstructorStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取热门课程统计
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const getPopularClassesHandler = async (req, res, next) => {
  try {
    const stats = await getPopularClasses();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClassStatsHandler,
  getBookingStatsHandler,
  getRevenueStatsHandler,
  getInstructorStatsHandler,
  getPopularClassesHandler
}; 