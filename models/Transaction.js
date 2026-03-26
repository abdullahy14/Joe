const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['purchase', 'prize', 'affiliate_commission'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'flagged'], default: 'pending' },
    fraudFlags: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
