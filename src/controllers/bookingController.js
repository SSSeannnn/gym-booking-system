const {
  createBooking,
  getUserBookings,
  getScheduleBookings,
  cancelBooking,
  getBookingById
} = require('../services/bookingService');

/**
 * 创建预约
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const createBookingHandler = async (req, res, next) => {
  try {
    const bookingData = {
      ...req.body,
      userId: req.user._id // 设置用户为当前登录用户
    };
    const booking = await createBooking(bookingData);
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    if (error.message === 'Invalid schedule ID') {
      return res.status(404).json({ success: false, message: error.message });
    } else if (error.message === 'Class is full') {
      return res.status(400).json({ success: false, message: error.message });
    } else if (error.message === 'You have already booked this class') {
      return res.status(409).json({ success: false, message: error.message });
    } else if (error.message === 'User does not exist') {
      return res.status(404).json({ success: false, message: error.message });
    } else if (error.message === 'Only members can book classes') {
      return res.status(403).json({ success: false, message: error.message });
    } else {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
};

/**
 * 获取用户的所有预约
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const getUserBookingsHandler = async (req, res, next) => {
  try {
    const bookings = await getUserBookings(req.user._id);
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取课程排班的所有预约
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const getScheduleBookingsHandler = async (req, res, next) => {
  try {
    const bookings = await getScheduleBookings(req.params.scheduleId);
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 取消预约
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const cancelBookingHandler = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await cancelBooking(bookingId, userId);
    
    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    if (error.message === 'Booking does not exist') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    if (error.message === 'You are not authorized to cancel this booking') {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }
    if (error.message === 'Only confirmed bookings can be cancelled') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

/**
 * 获取预约详情
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express下一个中间件函数
 */
const getBookingByIdHandler = async (req, res, next) => {
  try {
    const booking = await getBookingById(req.params.id);
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBookingHandler,
  getUserBookingsHandler,
  getScheduleBookingsHandler,
  cancelBookingHandler,
  getBookingByIdHandler
}; 