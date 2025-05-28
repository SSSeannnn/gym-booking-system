const Joi = require('joi');

const createUser = Joi.object({
  username: Joi.string().required().min(3).max(30).messages({
    'string.empty': 'Username cannot be empty',
    'string.min': 'Username must be at least 3 characters',
    'string.max': 'Username cannot exceed 30 characters'
  }),
  email: Joi.string().required().email().messages({
    'string.empty': 'Email cannot be empty',
    'string.email': 'Please enter a valid email address'
  }),
  password: Joi.string().required().min(6).messages({
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password must be at least 6 characters'
  }),
  role: Joi.string().valid('customer', 'instructor', 'admin').required().messages({
    'any.only': 'Role must be customer, instructor, or admin'
  }),
  membership: Joi.object({
    type: Joi.string().valid('none', 'monthly', 'yearly').default('none'),
    startDate: Joi.date().default(() => new Date()),
    endDate: Joi.date().min(Joi.ref('startDate')),
    status: Joi.string().valid('active', 'expired', 'cancelled').default('active')
  }).default({
    type: 'none',
    startDate: new Date(),
    status: 'active'
  })
});

const updateUser = Joi.object({
  username: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  role: Joi.string().valid('customer', 'instructor', 'admin'),
  membership: Joi.object({
    type: Joi.string().valid('none', 'monthly', 'yearly'),
    startDate: Joi.date(),
    endDate: Joi.date().min(Joi.ref('startDate')),
    status: Joi.string().valid('active', 'expired', 'cancelled')
  })
}).min(1);

const updateUserRole = Joi.object({
  role: Joi.string().valid('customer', 'instructor', 'admin').required()
});

module.exports = {
  createUser,
  updateUser,
  updateUserRole
}; 