const Joi = require('joi');

/**
 * 请求验证中间件
 * @param {Object} schema - Joi验证模式
 * @returns {Function} Express中间件函数
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: `输入验证失败: ${errorMessage}`
      });
    }
    next();
  };
};

// 定义验证模式
const schemas = {
  // 用户注册验证
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('customer', 'admin', 'instructor').default('customer')
  }),

  // 用户登录验证
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // 创建课程验证
  createClass: Joi.object({
    name: Joi.string().required().messages({
      'string.empty': 'Class name cannot be empty',
      'any.required': 'Class name is required'
    }),
    description: Joi.string().allow('').optional(),
    durationMinutes: Joi.number().required().min(15).max(180).messages({
      'number.base': 'Class duration must be a number',
      'number.min': 'Class duration must be at least 15 minutes',
      'number.max': 'Class duration cannot exceed 180 minutes',
      'any.required': 'Class duration is required'
    }),
    instructor: Joi.string().required().messages({
      'string.empty': 'Instructor is required',
      'any.required': 'Instructor is required'
    }),
    maxCapacity: Joi.number().min(1).default(20).messages({
      'number.base': 'Maximum capacity must be a number',
      'number.min': 'Maximum capacity must be at least 1'
    }),
    isActive: Joi.boolean().default(true)
  }),

  // 创建排班验证
  createSchedule: Joi.object({
    classId: Joi.string().required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    maxCapacity: Joi.number().required().min(1),
    room: Joi.string().optional()
  }),

  // 创建预约验证
  createBooking: Joi.object({
    scheduleId: Joi.string().required()
  })
};

module.exports = {
  validateRequest,
  schemas
}; 