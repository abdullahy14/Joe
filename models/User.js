const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['player', 'coach', 'org', 'admin'],
      default: 'player'
    },
    skillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'pro'],
      default: 'beginner'
    },
    walletBalance: { type: Number, default: 0 },
    recentlyViewedGames: [{ type: String }],
    mostPlayedCharacter: { type: String },
    badges: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
