const mongoose = require('mongoose');

const GitHubStatsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    publicRepos: { type: Number, default: 0 },
    totalStars: { type: Number, default: 0 },
    totalForks: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    contributions: { type: Number, default: 0 },
    avatar: { type: String },
    profileUrl: { type: String },
    lastSynced: { type: Date, default: Date.now },
    syncedAt: { type: Date, default: Date.now },
    rawData: { type: mongoose.Schema.Types.Mixed, default: {} }
});

// ✅ FIX: Remove duplicate index - use ONLY schema.index()
GitHubStatsSchema.index({ user: 1 });
GitHubStatsSchema.index({ totalStars: -1 });
GitHubStatsSchema.index({ contributions: -1 });

module.exports = mongoose.model('GitHubStats', GitHubStatsSchema);