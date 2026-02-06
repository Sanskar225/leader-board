const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { refreshLimiter } = require('../utils/rateLimiter');

router.use(protect);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.post('/refresh', refreshLimiter, userController.refreshStats);
router.get('/leaderboard', userController.getLeaderboard);
router.get('/compare/:userId', userController.compareUser);

module.exports = router;