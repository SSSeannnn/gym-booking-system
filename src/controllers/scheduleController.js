const {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule
} = require('../services/scheduleService');

/**
 * 创建课程排班
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const createScheduleHandler = async (req, res, next) => {
  try {
    const scheduleData = {
      ...req.body,
      createdBy: req.user._id // 设置创建者为当前登录用户
    };
    const newSchedule = await createSchedule(scheduleData);
    res.status(201).json({
      success: true,
      message: '课程排班创建成功',
      data: newSchedule
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取所有课程排班
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const getAllSchedulesHandler = async (req, res, next) => {
  try {
    const schedules = await getAllSchedules(req.query);
    res.status(200).json({
      success: true,
      data: schedules
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取单个课程排班
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const getScheduleByIdHandler = async (req, res, next) => {
  try {
    const schedule = await getScheduleById(req.params.id);
    res.status(200).json({
      success: true,
      data: schedule
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新课程排班
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const updateScheduleHandler = async (req, res, next) => {
  try {
    const updatedSchedule = await updateSchedule(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: '课程排班更新成功',
      data: updatedSchedule
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 删除课程排班
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const deleteScheduleHandler = async (req, res, next) => {
  try {
    await deleteSchedule(req.params.id);
    res.status(200).json({
      success: true,
      message: '课程排班删除成功'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createScheduleHandler,
  getAllSchedulesHandler,
  getScheduleByIdHandler,
  updateScheduleHandler,
  deleteScheduleHandler
}; 