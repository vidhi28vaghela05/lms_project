const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
  skills: { type: [String], default: [] },
  progressScore: { type: Number, default: 0 },
  
  // Auth & Verification
  isVerified: { type: Boolean, default: false },
  otp: {
    code: String,
    expiresAt: Date
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  // Instructor Specifics
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: function() {
      return this.role === 'instructor' ? 'pending' : 'approved';
    }
  },
  registrationDescription: String,
  upiId: String,
  payableAmount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },

  // Student Specifics
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
}, { timestamps: true });

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
