const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  activityLogs: [{
    action: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  completionRate: { type: Number, default: 0 },
  predictedPerformance: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Analytics', analyticsSchema);
