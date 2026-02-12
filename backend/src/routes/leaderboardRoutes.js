const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', leaderboardController.getLeaderboard);
router.get('/top', leaderboardController.getTopPerformers);
router.get('/stats', leaderboardController.getLeaderboardStats);
router.get('/user/:userId', leaderboardController.getUserRank);
router.get('/compare/:userId1/:userId2', protect, leaderboardController.compareUsers);

// Admin routes
router.post('/refresh', protect, admin, leaderboardController.refreshRanks);

module.exports = router;