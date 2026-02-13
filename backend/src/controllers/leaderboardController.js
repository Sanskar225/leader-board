const Leaderboard = require('../models/Leaderboard');
const User = require('../models/User');
const GitHubStats = require('../models/GitHubStats');
const LeetCodeStats = require('../models/LeetCodeStats');
const ScoringService = require('../services/ScoringService');

class LeaderboardController {

    // ==============================
    // GET FULL LEADERBOARD
    // ==============================
    async getLeaderboard(req, res) {
        try {
            const {
                page = 1,
                limit = 20,
                sortBy = 'totalScore',
                order = 'desc',
                search = '',
                platform = 'all',
                minScore = 0,
                maxScore = 1000000
            } = req.query;

            const pageNumber = Math.max(1, parseInt(page));
            const limitNumber = Math.min(100, Math.max(1, parseInt(limit)));
            const skip = (pageNumber - 1) * limitNumber;

            let filter = {
                totalScore: {
                    $gte: parseInt(minScore),
                    $lte: parseInt(maxScore)
                }
            };

            if (platform === 'leetcode') {
                filter.leetCodeScore = { $gt: 0 };
            } else if (platform === 'github') {
                filter.githubScore = { $gt: 0 };
            }

            if (search) {
                const users = await User.find({
                    username: { $regex: search, $options: 'i' }
                }).select('_id');

                filter.user = { $in: users.map(u => u._id) };
            }

            const total = await Leaderboard.countDocuments(filter);

            const sortOrder = order === 'desc' ? -1 : 1;
            const sort = { [sortBy]: sortOrder };

            const leaderboard = await Leaderboard.find(filter)
                .populate('user', 'username avatar email')
                .sort(sort)
                .skip(skip)
                .limit(limitNumber)
                .lean();

            const enrichedLeaderboard = leaderboard.map((entry, index) => {
                const rank = skip + index + 1;
                return {
                    ...entry,
                    rank,
                    rankChange: entry.previousRank
                        ? entry.previousRank - rank
                        : 0,
                    percentile: total > 0
                        ? Math.round(((total - rank) / total) * 10000) / 100
                        : 0
                };
            });

            let currentUser = null;

            if (req.user) {
                const userEntry = await Leaderboard.findOne({ user: req.user._id });

                if (userEntry) {
                    const usersAbove = await Leaderboard.countDocuments({
                        totalScore: { $gt: userEntry.totalScore }
                    });

                    const rank = usersAbove + 1;

                    currentUser = {
                        userId: req.user._id,
                        username: req.user.username,
                        totalScore: userEntry.totalScore,
                        rank,
                        percentile: total > 0
                            ? Math.round(((total - rank) / total) * 10000) / 100
                            : 0,
                        rankChange: userEntry.previousRank
                            ? userEntry.previousRank - rank
                            : 0
                    };
                }
            }

            res.json({
                success: true,
                data: {
                    leaderboard: enrichedLeaderboard,
                    pagination: {
                        page: pageNumber,
                        limit: limitNumber,
                        total,
                        pages: Math.ceil(total / limitNumber),
                        hasNext: pageNumber < Math.ceil(total / limitNumber),
                        hasPrev: pageNumber > 1
                    },
                    currentUser
                }
            });

        } catch (error) {
            console.error('Get leaderboard error:', error);
            res.status(500).json({ success: false, error: 'Failed to fetch leaderboard' });
        }
    }

    // ==============================
    // GET TOP PERFORMERS
    // ==============================
    async getTopPerformers(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 3;

            const topPerformers = await Leaderboard.find({
                totalScore: { $gt: 0 }
            })
                .populate('user', 'username avatar')
                .sort({ totalScore: -1 })
                .limit(limit)
                .lean();

            const enriched = topPerformers.map((entry, index) => ({
                ...entry,
                rank: index + 1,
                rankChange: entry.previousRank
                    ? entry.previousRank - (index + 1)
                    : 0
            }));

            res.json({ success: true, data: enriched });

        } catch (error) {
            console.error('Get top performers error:', error);
            res.status(500).json({ success: false, error: 'Failed to fetch top performers' });
        }
    }

    // ==============================
    // GET SINGLE USER RANK
    // ==============================
    async getUserRank(req, res) {
        try {
            const { userId } = req.params;

            const totalUsers = await Leaderboard.countDocuments();

            const userEntry = await Leaderboard.findOne({ user: userId })
                .populate('user', 'username avatar email');

            if (!userEntry) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found in leaderboard'
                });
            }

            const usersAbove = await Leaderboard.countDocuments({
                totalScore: { $gt: userEntry.totalScore }
            });

            const rank = usersAbove + 1;

            res.json({
                success: true,
                data: {
                    user: userEntry.user,
                    totalScore: userEntry.totalScore,
                    rank,
                    percentile: totalUsers > 0
                        ? Math.round(((totalUsers - rank) / totalUsers) * 10000) / 100
                        : 0,
                    rankChange: userEntry.previousRank
                        ? userEntry.previousRank - rank
                        : 0
                }
            });

        } catch (error) {
            console.error('Get user rank error:', error);
            res.status(500).json({ success: false, error: 'Failed to fetch user rank' });
        }
    }

    // ==============================
    // COMPARE USERS
    // ==============================
    async compareUsers(req, res) {
        try {
            const { userId1, userId2 } = req.params;

            const [user1, user2] = await Promise.all([
                Leaderboard.findOne({ user: userId1 }).populate('user', 'username avatar'),
                Leaderboard.findOne({ user: userId2 }).populate('user', 'username avatar')
            ]);

            const [github1, github2] = await Promise.all([
                GitHubStats.findOne({ user: userId1 }),
                GitHubStats.findOne({ user: userId2 })
            ]);

            const [leetcode1, leetcode2] = await Promise.all([
                LeetCodeStats.findOne({ user: userId1 }),
                LeetCodeStats.findOne({ user: userId2 })
            ]);

            res.json({
                success: true,
                data: {
                    user1: { profile: user1, github: github1, leetcode: leetcode1 },
                    user2: { profile: user2, github: github2, leetcode: leetcode2 },
                    comparison: {
                        scoreDiff: (user1?.totalScore || 0) - (user2?.totalScore || 0),
                        leetcodeDiff: (leetcode1?.totalSolved || 0) - (leetcode2?.totalSolved || 0),
                        githubDiff: (github1?.totalStars || 0) - (github2?.totalStars || 0)
                    }
                }
            });

        } catch (error) {
            console.error('Compare users error:', error);
            res.status(500).json({ success: false, error: 'Failed to compare users' });
        }
    }

    // ==============================
    // GET LEADERBOARD STATS
    // ==============================
    async getLeaderboardStats(req, res) {
        try {
            const totalUsers = await Leaderboard.countDocuments();

            const topUser = await Leaderboard.findOne()
                .populate('user', 'username avatar')
                .sort({ totalScore: -1 });

            const aggregate = await Leaderboard.aggregate([
                { $group: { _id: null, total: { $sum: '$totalScore' }, avg: { $avg: '$totalScore' } } }
            ]);

            res.json({
                success: true,
                data: {
                    totalUsers,
                    totalScore: aggregate[0]?.total || 0,
                    averageScore: Math.round(aggregate[0]?.avg || 0),
                    topUser: topUser
                        ? { username: topUser.user?.username, score: topUser.totalScore }
                        : null
                }
            });

        } catch (error) {
            console.error('Get leaderboard stats error:', error);
            res.status(500).json({ success: false, error: 'Failed to fetch leaderboard stats' });
        }
    }

    // ==============================
    // ADMIN: REFRESH RANKS
    // ==============================
    async refreshRanks(req, res) {
        try {
            const leaderboard = await Leaderboard.find()
                .sort({ totalScore: -1 });

            for (let i = 0; i < leaderboard.length; i++) {
                const entry = leaderboard[i];
                entry.previousRank = entry.rank || i + 1;
                entry.rank = i + 1;
                await entry.save();
            }

            res.json({
                success: true,
                message: 'Leaderboard ranks refreshed successfully',
                totalUpdated: leaderboard.length
            });

        } catch (error) {
            console.error('Refresh ranks error:', error);
            res.status(500).json({ success: false, error: 'Failed to refresh ranks' });
        }
    }
}

module.exports = new LeaderboardController();
