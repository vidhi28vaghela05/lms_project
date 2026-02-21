const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  method: { type: String, default: 'UPI' },
  transactionRef: { type: String },
  payoutDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Payout', payoutSchema);
