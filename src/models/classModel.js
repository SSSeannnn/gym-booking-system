const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true
  },
  durationMinutes: {
    type: String,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'Class duration is required'],
    min: [15, 'Class duration must be at least 15 minutes'],
    max: [180, 'Class duration cannot exceed 180 minutes']
  },
  maxCapacity: {
    type: Number,
    required: [true, 'Maximum capacity is required'],
    min: [1, 'Maximum capacity must be at least 1'],
    default: 20
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Instructor is required']
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: [true, 'Class level is required']
  },
  category: {
    type: String,
    required: [true, 'Class category is required'],
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      ret.maxCapacity = ret.capacity;
      delete ret._id;
      delete ret.__v;
      delete ret.capacity;
      return ret;
    }
  }
});

// Add index for better query performance
classSchema.index({ name: 1 });
classSchema.index({ instructor: 1 });
classSchema.index({ level: 1 });
classSchema.index({ category: 1 });

const Class = mongoose.model('Class', classSchema);

module.exports = Class; 