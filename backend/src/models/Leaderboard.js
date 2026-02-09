// src/models/Leaderboard.js - UPDATED
const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    totalScore: {
        type: Number,
        default: 0,
        min: 0
    },
    leetCodeScore: {
        type: Number,
        default: 0,
        min: 0
    },
    githubScore: {
        type: Number,
        default: 0,
        min: 0
    },
    rank: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    previousRank: {
        type: Number,
        default: 0
    },
    rankChange: {
        type: Number,
        default: 0
    }
});

// Compound indexes
LeaderboardSchema.index({ totalScore: -1 });
LeaderboardSchema.index({ rank: 1 });
LeaderboardSchema.index({ user: 1 });
LeaderboardSchema.index({ lastUpdated: -1 });

LeaderboardSchema.pre('save', function(next) {
    if (this.previousRank && this.rank) {
        this.rankChange = this.previousRank - this.rank;
    }
    next();
});

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);