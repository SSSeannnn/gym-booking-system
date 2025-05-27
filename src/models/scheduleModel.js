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
  totalSpots: {
    type: Number,
    required: [true, 'Maximum capacity is required'],
    min: [1, 'Maximum capacity must be at least 1']
  },
  availableSpots: {
    type: Number,
    default: function() {
      return this.totalSpots;
    },
    min: [0, 'Available spots cannot be negative']
  },
  status: {
    type: String,
    enum: ['scheduled', 'cancelled', 'completed'],
    default: 'scheduled'
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      ret.className = ret.classId?.name;
      ret.instructor = ret.classId?.instructor;
      ret.level = ret.classId?.level;
      ret.category = ret.classId?.category;
      ret.date = ret.startTime;
      delete ret._id;
      delete ret.__v;
      delete ret.classId;
      return ret;
    }
  }
});

// Add index for better query performance
scheduleSchema.index({ classId: 1 });
scheduleSchema.index({ startTime: 1 });
scheduleSchema.index({ status: 1 });

// Virtual for checking if class is full
scheduleSchema.virtual('isFull').get(function() {
  return this.availableSpots === 0;
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

// Pre-save middleware to validate availableSpots doesn't exceed totalSpots
scheduleSchema.pre('save', function(next) {
  if (this.availableSpots > this.totalSpots) {
    next(new Error('Available spots cannot exceed total capacity'));
  }
  next();
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule; 