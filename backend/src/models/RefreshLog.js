const mongoose = require('mongoose');

const RefreshLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['github', 'leetcode', 'both'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },
    error: {
        type: String
    },
    duration: {
        type: Number, // in milliseconds
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 604800 // Auto delete after 7 days
    }
});

module.exports = mongoose.model('RefreshLog', RefreshLogSchema);