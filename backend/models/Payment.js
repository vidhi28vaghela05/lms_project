const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['stripe', 'upi'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  transactionId: { type: String },
  instructorEarnings: { type: Number, required: true },
  platformEarnings: { type: Number, required: true },
  proofImage: { type: String }, // For UPI manual verification
  isConfirmed: { type: Boolean, default: false } // Admin confirmation flag
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
