const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    game: { type: String, required: true, index: true },
    category: {
      type: String,
      enum: ['account', 'item', 'rental', 'service'],
      default: 'item'
    },
    characterTag: { type: String },
    price: { type: Number, required: true },
    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
