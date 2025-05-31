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
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
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

// Password encryption middleware
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

// Password verification method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User; 