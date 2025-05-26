const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const membershipSchema = new mongoose.Schema({
  status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
  type: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'MembershipPlan' },
  autoRenew: { type: Boolean, default: true }
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, '邮箱是必需的'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '请提供有效的邮箱地址']
  },
  password: {
    type: String,
    required: [true, '密码是必需的'],
    minlength: [6, '密码至少需要6个字符']
  },
  role: {
    type: String,
    enum: ['admin', 'instructor', 'customer'],
    default: 'customer'
  },
  membership: membershipSchema
}, {
  timestamps: true
});

// 密码加密中间件
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 密码验证方法
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User; 