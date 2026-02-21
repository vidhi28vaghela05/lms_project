const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  progressPercentage: { type: Number, default: 0 },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  completedSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  performanceScore: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
