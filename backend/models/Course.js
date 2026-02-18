const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skillsCovered: { type: [String], default: [] },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  thumbnail: { type: String },
  status: { type: String, enum: ['draft', 'published'], default: 'published' }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
