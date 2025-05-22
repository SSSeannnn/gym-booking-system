const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  durationMinutes: {
    type: Number,
    required: [true, 'Class duration is required'],
    min: [15, 'Class duration must be at least 15 minutes'],
    max: [180, 'Class duration cannot exceed 180 minutes']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Instructor is required']
  },
  maxCapacity: {
    type: Number,
    required: [true, 'Maximum capacity is required'],
    min: [1, 'Maximum capacity must be at least 1'],
    default: 20
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add index for better query performance
classSchema.index({ name: 1 });
classSchema.index({ instructor: 1 });
classSchema.index({ isActive: 1 });

const Class = mongoose.model('Class', classSchema);

module.exports = Class; 