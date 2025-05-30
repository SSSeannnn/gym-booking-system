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
      message: 'Schedule created successfully',
      data: newSchedule
    });
  } catch (error) {
    if (error.message === 'Class not found') {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }
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
    if (!schedules || schedules.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No schedules found'
      });
    }
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
    if (error.message === 'Schedule not found') {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }
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
      message: 'Schedule updated successfully',
      data: updatedSchedule
    });
  } catch (error) {
    if (error.message === 'Schedule not found') {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }
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
      message: 'Schedule deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Schedule not found') {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }
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