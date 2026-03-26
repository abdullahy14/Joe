const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    game: { type: String, required: true, index: true },
    format: {
      type: String,
      enum: ['single_elimination', 'double_elimination'],
      default: 'single_elimination'
    },
    stakes: { type: String, enum: ['free', 'low', 'premium'], default: 'free' },
    prizePool: { type: Number, default: 0 },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bracket: { type: Object, default: {} },
    status: { type: String, enum: ['upcoming', 'live', 'completed'], default: 'upcoming' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tournament', tournamentSchema);
