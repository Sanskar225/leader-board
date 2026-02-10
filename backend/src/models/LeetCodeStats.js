// src/models/LeetCodeStats.js - UPDATED
const mongoose = require('mongoose');

const LeetCodeStatsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    totalSolved: {
        type: Number,
        default: 0
    },
    easySolved: {
        type: Number,
        default: 0
    },
    mediumSolved: {
        type: Number,
        default: 0
    },
    hardSolved: {
        type: Number,
        default: 0
    },
    acceptanceRate: {
        type: Number,
        default: 0
    },
    ranking: {
        type: Number,
        default: 0
    },
    reputation: {
        type: Number,
        default: 0
    },
    contributionPoints: {
        type: Number,
        default: 0
    },
    lastSynced: {
        type: Date,
        default: Date.now
    },
    syncedAt: {
        type: Date,
        default: Date.now
    },
    rawData: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
});

// Keep only schema.index() calls, remove index: true from schema definition
LeetCodeStatsSchema.index({ user: 1 });
LeetCodeStatsSchema.index({ totalSolved: -1 });
LeetCodeStatsSchema.index({ ranking: 1 });

module.exports =
  mongoose.models.LeetCodeStats ||
  mongoose.model('LeetCodeStats', LeetCodeStatsSchema);
