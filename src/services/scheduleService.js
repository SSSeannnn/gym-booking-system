const Schedule = require('../models/scheduleModel');
const Class = require('../models/classModel');

// 创建排班
async function createSchedule(scheduleData) {
  // 检查 classId 是否存在
  const classExists = await Class.findById(scheduleData.classId);
  if (!classExists) {
    throw new Error('Class not found');
  }
  const schedule = new Schedule(scheduleData);
  return await schedule.save();
}

// 获取所有排班
async function getAllSchedules(filter = {}) {
  return await Schedule.find(filter)
    .populate('classId', 'name instructor')
    .sort({ startTime: 1 });
}

// 获取单个排班
async function getScheduleById(id) {
  const schedule = await Schedule.findById(id).populate('classId', 'name instructor');
  if (!schedule) throw new Error('Schedule not found');
  return schedule;
}

// 更新排班
async function updateSchedule(id, updateData) {
  const schedule = await Schedule.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
    .populate('classId', 'name instructor');
  if (!schedule) throw new Error('Schedule not found');
  return schedule;
}

// 删除排班
async function deleteSchedule(id) {
  const schedule = await Schedule.findByIdAndDelete(id);
  if (!schedule) throw new Error('Schedule not found');
  return schedule;
}

module.exports = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule
}; 