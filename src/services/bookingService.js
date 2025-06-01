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
    throw new Error('Invalid schedule ID');
  }

  // 检查是否已满
  if (schedule.currentBookings >= schedule.maxCapacity) {
    throw new Error('Class is full');
  }

  // 检查用户是否已经预约过这个课程
  const existingBooking = await Booking.findOne({
    userId: bookingData.userId,
    scheduleId: bookingData.scheduleId
  });
  if (existingBooking) {
    throw new Error('You have already booked this class');
  }

  // 检查用户是否符合预订条件（例如，会员级别不够）
  const user = await User.findById(bookingData.userId);
  if (!user) {
    throw new Error('User does not exist');
  }
  // 假设用户需要是会员才能预订
  if (user.role !== 'customer') {
    throw new Error('Only members can book classes');
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
  const bookings = await Booking.find({ userId })
    .populate({
      path: 'scheduleId',
      populate: {
        path: 'classId',
        populate: {
          path: 'instructor',
          select: 'username name'
        },
        select: 'name description durationMinutes instructor'
      }
    })
    .sort({ createdAt: -1 });
  // 转换格式，兼容前端MyBookings.tsx的booking.schedule
  return bookings.map(b => {
    const schedule = b.scheduleId ? {
      ...b.scheduleId.toObject(),
      className: b.scheduleId.classId?.name || '',
      instructor: b.scheduleId.classId?.instructor || '',
    } : undefined;
    return {
      ...b.toObject(),
      schedule
    };
  });
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
 * @returns {Promise<Object>} 取消后的预约对象
 */
const cancelBooking = async (bookingId, userId) => {
  // 查找预约并验证所有权
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error('Booking does not exist');
  }

  // 验证预约是否属于该用户
  if (booking.userId.toString() !== userId) {
    throw new Error('You are not authorized to cancel this booking');
  }

  // 检查预约状态
  if (booking.status !== 'confirmed') {
    throw new Error('Only confirmed bookings can be cancelled');
  }

  // 更新预约状态
  booking.status = 'cancelled';
  await booking.save();

  // 更新排班可用名额
  const schedule = await Schedule.findById(booking.scheduleId);
  if (schedule) {
    schedule.currentBookings = Math.max(0, schedule.currentBookings - 1);
    await schedule.save();
  }

  return booking;
};

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
        populate: {
          path: 'instructor',
          select: 'username name'
        },
        select: 'name description durationMinutes instructor'
      }
    })
    .populate('userId', 'email');
  
  if (!booking) {
    throw new Error('Booking does not exist');
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