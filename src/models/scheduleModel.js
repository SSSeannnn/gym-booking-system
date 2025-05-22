const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class reference is required']
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  maxCapacity: {
    type: Number,
    required: [true, 'Maximum capacity is required'],
    min: [1, 'Maximum capacity must be at least 1']
  },
  currentBookings: {
    type: Number,
    default: 0,
    min: [0, 'Current bookings cannot be negative']
  },
  status: {
    type: String,
    enum: ['scheduled', 'cancelled', 'completed'],
    default: 'scheduled'
  },
  room: {
    type: String,
    required: [true, 'Room number is required'],
    trim: true
  }
}, {
  timestamps: true
});

// Add index for better query performance
scheduleSchema.index({ classId: 1 });
scheduleSchema.index({ startTime: 1 });
scheduleSchema.index({ status: 1 });

// Virtual for checking if class is full
scheduleSchema.virtual('isFull').get(function() {
  return this.currentBookings >= this.maxCapacity;
});

// Virtual for checking if class is available
scheduleSchema.virtual('isAvailable').get(function() {
  return this.status === 'scheduled' && !this.isFull;
});

// Pre-save middleware to validate endTime is after startTime
scheduleSchema.pre('save', function(next) {
  if (this.endTime <= this.startTime) {
    next(new Error('End time must be after start time'));
  }
  next();
});

// Pre-save middleware to validate currentBookings doesn't exceed maxCapacity
scheduleSchema.pre('save', function(next) {
  if (this.currentBookings > this.maxCapacity) {
    next(new Error('Current bookings cannot exceed maximum capacity'));
  }
  next();
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule; 