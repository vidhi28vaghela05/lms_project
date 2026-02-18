const mongoose = require('mongoose');

const skillGraphSchema = new mongoose.Schema({
  skillName: { type: String, required: true, unique: true },
  prerequisiteSkills: { type: [String], default: [] },
  relatedSkills: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('SkillGraph', skillGraphSchema);
