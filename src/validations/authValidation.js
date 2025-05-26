const Joi = require('joi');

const schemas = {
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': '请提供有效的邮箱地址',
      'any.required': '邮箱是必需的'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': '密码至少需要6个字符',
      'any.required': '密码是必需的'
    }),
    role: Joi.string().valid('admin', 'instructor', 'customer').default('customer'),
    planId: Joi.string().required().messages({
      'any.required': '请选择会员计划'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': '请提供有效的邮箱地址',
      'any.required': '邮箱是必需的'
    }),
    password: Joi.string().required().messages({
      'any.required': '密码是必需的'
    })
  })
};

module.exports = schemas; 