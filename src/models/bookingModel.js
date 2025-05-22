const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule',
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 创建复合索引
bookingSchema.index({ userId: 1, scheduleId: 1 }, { unique: true });

// 添加虚拟字段
bookingSchema.virtual('isActive').get(function() {
  return this.status === 'confirmed';
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking; 