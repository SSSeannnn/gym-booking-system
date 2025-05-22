const Class = require('../models/classModel');
const Schedule = require('../models/scheduleModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');

/**
 * 获取课程统计信息
 * @returns {Promise<Object>} 课程统计信息
 */
async function getClassStats() {
  const totalClasses = await Class.countDocuments();
  const activeClasses = await Class.countDocuments({ isActive: true });
  const totalSchedules = await Schedule.countDocuments();
  const completedSchedules = await Schedule.countDocuments({ status: 'completed' });
  const cancelledSchedules = await Schedule.countDocuments({ status: 'cancelled' });

  return {
    totalClasses,
    activeClasses,
    totalSchedules,
    completedSchedules,
    cancelledSchedules
  };
}

/**
 * 获取预约统计信息
 * @returns {Promise<Object>} 预约统计信息
 */
async function getBookingStats() {
  const totalBookings = await Booking.countDocuments();
  const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
  const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

  // 计算平均每节课的预约人数
  const schedules = await Schedule.find();
  const totalCapacity = schedules.reduce((sum, schedule) => sum + schedule.maxCapacity, 0);
  const averageBookingsPerClass = totalCapacity > 0 ? totalBookings / schedules.length : 0;

  return {
    totalBookings,
    confirmedBookings,
    cancelledBookings,
    averageBookingsPerClass: Math.round(averageBookingsPerClass * 100) / 100
  };
}

/**
 * 获取收入统计信息
 * @param {Date} startDate - 开始日期
 * @param {Date} endDate - 结束日期
 * @returns {Promise<Object>} 收入统计信息
 */
async function getRevenueStats(startDate, endDate) {
  // 获取指定日期范围内的已完成的课程排班
  const schedules = await Schedule.find({
    status: 'completed',
    startTime: { $gte: startDate, $lte: endDate }
  });

  // 计算每个课程的收入
  const revenueByClass = {};
  for (const schedule of schedules) {
    const bookings = await Booking.countDocuments({
      scheduleId: schedule._id,
      status: 'confirmed'
    });
    const classInfo = await Class.findById(schedule.classId);
    const revenue = bookings * (classInfo.price || 0);
    
    if (!revenueByClass[classInfo.name]) {
      revenueByClass[classInfo.name] = 0;
    }
    revenueByClass[classInfo.name] += revenue;
  }

  // 计算总收入
  const totalRevenue = Object.values(revenueByClass).reduce((sum, revenue) => sum + revenue, 0);

  return {
    totalRevenue,
    revenueByClass
  };
}

/**
 * 获取教练统计信息
 * @returns {Promise<Object>} 教练统计信息
 */
async function getInstructorStats() {
  const instructors = await User.find({ role: 'instructor' });
  const stats = [];

  for (const instructor of instructors) {
    const classes = await Class.find({ instructor: instructor._id });
    const schedules = await Schedule.find({
      classId: { $in: classes.map(c => c._id) }
    });
    const bookings = await Booking.countDocuments({
      scheduleId: { $in: schedules.map(s => s._id) },
      status: 'confirmed'
    });

    stats.push({
      instructorId: instructor._id,
      email: instructor.email,
      totalClasses: classes.length,
      totalSchedules: schedules.length,
      totalBookings: bookings
    });
  }

  return stats;
}

/**
 * 获取热门课程统计
 * @returns {Promise<Array>} 热门课程统计
 */
async function getPopularClasses() {
  const schedules = await Schedule.find();
  const classStats = {};

  for (const schedule of schedules) {
    const bookings = await Booking.countDocuments({
      scheduleId: schedule._id,
      status: 'confirmed'
    });
    const classInfo = await Class.findById(schedule.classId);
    
    if (!classStats[classInfo.name]) {
      classStats[classInfo.name] = {
        name: classInfo.name,
        totalBookings: 0,
        totalSchedules: 0
      };
    }
    
    classStats[classInfo.name].totalBookings += bookings;
    classStats[classInfo.name].totalSchedules += 1;
  }

  // 转换为数组并排序
  return Object.values(classStats)
    .sort((a, b) => b.totalBookings - a.totalBookings)
    .map(stat => ({
      ...stat,
      averageBookings: Math.round((stat.totalBookings / stat.totalSchedules) * 100) / 100
    }));
}

module.exports = {
  getClassStats,
  getBookingStats,
  getRevenueStats,
  getInstructorStats,
  getPopularClasses
}; 