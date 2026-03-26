const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    game: { type: String, required: true, index: true },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'pro'],
      required: true
    },
    coach: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    modules: [{ title: String, durationMinutes: Number }],
    rating: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
