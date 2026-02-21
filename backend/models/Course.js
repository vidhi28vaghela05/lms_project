const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skillsCovered: { type: [String], default: [] },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  thumbnail: { type: String },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  
  // New Fields
  price: { type: Number, required: true, default: 0 },
  isApproved: { type: Boolean, default: false },
  updateRequest: {
    description: String,
    pendingData: mongoose.Schema.Types.Mixed,
    status: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' }
  },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isPopular: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
