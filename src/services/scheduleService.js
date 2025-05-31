const Schedule = require('../models/scheduleModel');
const Class = require('../models/classModel'); // 确保 Class 模型被正确导入

// 创建排班
async function createSchedule(scheduleData) {
  // 检查 classId 是否存在
  const classExists = await Class.findById(scheduleData.classId);
  if (!classExists) {
    // 最好抛出一个特定类型的错误，或者带有状态码的错误对象
    const error = new Error('Class not found');
    error.statusCode = 404; // 例如
    throw error;
  }

  // 确保字段名匹配 Schedule 模型
  const schedule = new Schedule({
    classId: scheduleData.classId,
    startTime: scheduleData.startTime,
    endTime: scheduleData.endTime,
    maxCapacity: scheduleData.maxCapacity,
    room: scheduleData.room,
    status: 'scheduled'
  });

  try {
    return await schedule.save();
  } catch (error) {
    // 处理 Mongoose 验证错误等
    if (error.name === 'ValidationError') {
      const err = new Error('Schedule validation failed');
      err.statusCode = 400;
      err.errors = error.errors; // 可以附加详细的验证错误
      throw err;
    }
    throw error; // 重新抛出其他类型的错误
  }
}

// 获取所有排班
async function getAllSchedules(filter = {}) {
  return await Schedule.find(filter)
    .populate({
      path: 'classId',
      select: 'name description instructor level category duration maxCapacity',
      populate: {
        path: 'instructor',
        model: 'User',
        select: 'username name'
      }
    })
    .sort({ startTime: 1 });
}

// 获取单个排班 (深度填充课程和教练信息)
async function getScheduleById(id) {
  try {
    const schedule = await Schedule.findById(id)
      .populate({
        path: 'classId',
        select: 'name description instructor level category durationMinutes maxCapacity',
        populate: {
          path: 'instructor',
          model: 'User',
          select: 'username name' // <--- 同上
        }
      });
    if (!schedule) {
      const error = new Error('Schedule not found');
      error.statusCode = 404;
      throw error;
    }
    return schedule;
  } catch (error) {
    console.error(`Error in getScheduleById for id ${id}:`, error);
    if (!error.statusCode) error.message = 'Error fetching schedule by ID'; // 避免覆盖特定错误
    throw error;
  }
}

// 更新排班 (深度填充课程和教练信息)
async function updateSchedule(id, updateData) {
  try {
    if (updateData.classId) {
      const classExists = await Class.findById(updateData.classId);
      if (!classExists) {
        const error = new Error('Class not found for update');
        error.statusCode = 404;
        throw error;
      }
    }

    const schedule = await Schedule.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate({
        path: 'classId',
        select: 'name description instructor level category durationMinutes maxCapacity',
        populate: {
          path: 'instructor',
          model: 'User',
          select: 'username name' // <--- 同上
        }
      });
    if (!schedule) {
      const error = new Error('Schedule not found for update');
      error.statusCode = 404;
      throw error;
    }
    return schedule;
  } catch (error) {
    console.error(`Error in updateSchedule for id ${id}:`, error);
    if (error.name === 'ValidationError') {
        const err = new Error('Schedule update validation failed');
        err.statusCode = 400;
        err.errors = error.errors;
        throw err;
    }
    if (!error.statusCode) error.message = 'Error updating schedule';
    throw error;
  }
}

// 删除排班
async function deleteSchedule(id) {
  try {
    const schedule = await Schedule.findByIdAndDelete(id);
    if (!schedule) {
      const error = new Error('Schedule not found for deletion');
      error.statusCode = 404;
      throw error;
    }
    return { success: true, message: '排班已成功删除', data: schedule };
  } catch (error) {
    console.error(`Error in deleteSchedule for id ${id}:`, error);
    if (!error.statusCode) error.message = 'Error deleting schedule';
    throw error;
  }
}

module.exports = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule
};