const express = require("express");
const router = express.Router();
const leaderboardController = require("../controllers/leaderboardController");
const { protect, admin } = require("../middleware/auth");

router.get("/", leaderboardController.getLeaderboard);
router.get("/top", leaderboardController.getTopPerformers);
router.get("/stats", leaderboardController.getLeaderboardStats);

/**
 * No optional params in Express 5
 */
router.get("/user", leaderboardController.getLeaderboard);
router.get("/user/:userId", leaderboardController.getUserRank);

router.post(
  "/refresh",
  protect,
  admin,
  leaderboardController.refreshRanks
);

module.exports = router;
