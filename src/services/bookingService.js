const Booking = require('../models/bookingModel');
const Schedule = require('../models/scheduleModel');
const User = require('../models/userModel');

/**
 * 创建预约
 * @param {Object} bookingData - 预约数据
 * @returns {Promise<Object>} 创建的预约
 */
async function createBooking(bookingData) {
  // 检查课程排班是否存在
  const schedule = await Schedule.findById(bookingData.scheduleId);
  if (!schedule) {
    throw new Error('无效的排班ID');
  }

  // 检查是否已满
  if (schedule.currentBookings >= schedule.maxCapacity) {
    throw new Error('课程已满');
  }

  // 检查用户是否已经预约过这个课程
  const existingBooking = await Booking.findOne({
    userId: bookingData.userId,
    scheduleId: bookingData.scheduleId
  });
  if (existingBooking) {
    throw new Error('您已经预约过这个课程');
  }

  // 检查用户是否符合预订条件（例如，会员级别不够）
  const user = await User.findById(bookingData.userId);
  if (!user) {
    throw new Error('用户不存在');
  }
  // 假设用户需要是会员才能预订
  if (user.role !== 'customer') {
    throw new Error('只有会员才能预订课程');
  }

  // 创建预约
  const booking = new Booking(bookingData);
  await booking.save();

  // 更新课程排班的当前预约数
  schedule.currentBookings += 1;
  await schedule.save();

  return booking;
}

/**
 * 获取用户的所有预约
 * @param {string} userId - 用户ID
 * @returns {Promise<Array>} 预约列表
 */
async function getUserBookings(userId) {
  return await Booking.find({ userId })
    .populate({
      path: 'scheduleId',
      populate: {
        path: 'classId',
        select: 'name description durationMinutes instructor'
      }
    })
    .sort({ createdAt: -1 });
}

/**
 * 获取课程排班的所有预约
 * @param {string} scheduleId - 课程排班ID
 * @returns {Promise<Array>} 预约列表
 */
async function getScheduleBookings(scheduleId) {
  return await Booking.find({ scheduleId })
    .populate('userId', 'email')
    .sort({ createdAt: -1 });
}

/**
 * 取消预约
 * @param {string} bookingId - 预约ID
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 取消的预约
 */
async function cancelBooking(bookingId, userId) {
  const booking = await Booking.findOne({ _id: bookingId, userId });
  if (!booking) {
    throw new Error('预约不存在或无权取消');
  }

  if (booking.status === 'cancelled') {
    throw new Error('预约已经取消');
  }

  // 更新预约状态
  booking.status = 'cancelled';
  await booking.save();

  // 更新课程排班的当前预约数
  const schedule = await Schedule.findById(booking.scheduleId);
  if (schedule) {
    schedule.currentBookings = Math.max(0, schedule.currentBookings - 1);
    await schedule.save();
  }

  return booking;
}

/**
 * 获取预约详情
 * @param {string} bookingId - 预约ID
 * @returns {Promise<Object>} 预约详情
 */
async function getBookingById(bookingId) {
  const booking = await Booking.findById(bookingId)
    .populate({
      path: 'scheduleId',
      populate: {
        path: 'classId',
        select: 'name description durationMinutes instructor'
      }
    })
    .populate('userId', 'email');
  
  if (!booking) {
    throw new Error('预约不存在');
  }
  
  return booking;
}

module.exports = {
  createBooking,
  getUserBookings,
  getScheduleBookings,
  cancelBooking,
  getBookingById
}; 