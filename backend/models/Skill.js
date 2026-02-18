const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  skillName: { type: String, required: true, unique: true },
  description: { type: String },
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  difficultyLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
