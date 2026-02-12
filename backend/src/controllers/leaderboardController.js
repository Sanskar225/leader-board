const Leaderboard = require('../models/Leaderboard');
const User = require('../models/User');
const GitHubStats = require('../models/GitHubStats');
const LeetCodeStats = require('../models/LeetCodeStats');
const ScoringService = require('../services/ScoringService');

class LeaderboardController {
    // ✅ FIX: Enhanced getLeaderboard with better filtering and pagination
    async getLeaderboard(req, res) {
        try {
            const {
                page = 1,
                limit = 20,
                sortBy = 'rank',
                order = 'asc',
                search = '',
                platform = 'all',
                minScore = 0,
                maxScore = 1000000
            } = req.query;

            const pageNumber = Math.max(1, parseInt(page));
            const limitNumber = Math.min(100, Math.max(1, parseInt(limit)));
            const skip = (pageNumber - 1) * limitNumber;

            // Build filter
            let filter = {
                totalScore: { 
                    $gte: parseInt(minScore), 
                    $lte: parseInt(maxScore) 
                }
            };

            // ✅ FIX: Add platform filtering
            if (platform === 'leetcode') {
                filter.leetCodeScore = { $gt: 0 };
            } else if (platform === 'github') {
                filter.githubScore = { $gt: 0 };
            }

            // Search by username
            let userIds = [];
            if (search) {
                const users = await User.find({
                    username: { $regex: search, $options: 'i' }
                }).select('_id');
                userIds = users.map(u => u._id);
                filter.user = { $in: userIds };
            }

            // Get total count
            const total = await Leaderboard.countDocuments(filter);

            // Get leaderboard entries
            const sortOrder = order === 'desc' ? -1 : 1;
            const sort = { [sortBy]: sortOrder };
            
            const leaderboard = await Leaderboard.find(filter)
                .populate('user', 'username avatar email createdAt')
                .sort(sort)
                .skip(skip)
                .limit(limitNumber)
                .lean();

            // ✅ FIX: Add rank change calculation
            const enrichedLeaderboard = leaderboard.map((entry, index) => ({
                ...entry,
                rank: skip + index + 1,
                rankChange: entry.previousRank ? entry.previousRank - (skip + index + 1) : 0,
                percentile: total > 0 
                    ? Math.round(((total - (skip + index + 1)) / total) * 100 * 100) / 100 
                    : 0
            }));

            // Get current user's position
            let currentUser = null;
            if (req.user) {
                const userEntry = await Leaderboard.findOne({ user: req.user._id });
                if (userEntry) {
                    const rankAbove = await Leaderboard.countDocuments({
                        totalScore: { $gt: userEntry.totalScore }
                    });
                    currentUser = {
                        userId: req.user._id,
                        username: req.user.username,
                        rank: rankAbove + 1,
                        totalScore: userEntry.totalScore,
                        percentile: total > 0 
                            ? Math.round(((total - (rankAbove + 1)) / total) * 100 * 100) / 100 
                            : 0,
                        rankChange: userEntry.rankChange
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
                    currentUser,
                    filters: {
                        search,
                        sortBy,
                        order,
                        platform,
                        minScore,
                        maxScore
                    }
                }
            });

        } catch (error) {
            console.error('Get leaderboard error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch leaderboard'
            });
        }
    }

    // ✅ NEW: Get top 3 performers for podium
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

            // Calculate rank changes for top performers
            const enriched = topPerformers.map((performer, index) => ({
                ...performer,
                rank: index + 1,
                rankChange: performer.previousRank ? performer.previousRank - (index + 1) : 0
            }));

            res.json({
                success: true,
                data: enriched
            });

        } catch (error) {
            console.error('Get top performers error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch top performers'
            });
        }
    }

    // ✅ NEW: Get user comparison data
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
                    user1: {
                        profile: user1,
                        github: github1,
                        leetcode: leetcode1
                    },
                    user2: {
                        profile: user2,
                        github: github2,
                        leetcode: leetcode2
                    },
                    comparison: {
                        scoreDiff: (user1?.totalScore || 0) - (user2?.totalScore || 0),
                        rankDiff: (user2?.rank || 0) - (user1?.rank || 0),
                        leetcodeDiff: (leetcode1?.totalSolved || 0) - (leetcode2?.totalSolved || 0),
                        githubDiff: (github1?.totalStars || 0) - (github2?.totalStars || 0)
                    }
                }
            });

        } catch (error) {
            console.error('Compare users error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to compare users'
            });
        }
    }

    // ✅ NEW: Get leaderboard statistics for dashboard
    async getLeaderboardStats(req, res) {
        try {
            const [
                totalUsers,
                totalScore,
                averageScore,
                topUser,
                distribution
            ] = await Promise.all([
                Leaderboard.countDocuments(),
                Leaderboard.aggregate([
                    { $group: { _id: null, total: { $sum: '$totalScore' } } }
                ]),
                Leaderboard.aggregate([
                    { $group: { _id: null, avg: { $avg: '$totalScore' } } }
                ]),
                Leaderboard.findOne()
                    .populate('user', 'username avatar')
                    .sort({ totalScore: -1 }),
                Leaderboard.aggregate([
                    {
                        $bucket: {
                            groupBy: '$totalScore',
                            boundaries: [0, 100, 500, 1000, 2000, 5000, 10000],
                            default: '10000+',
                            output: {
                                count: { $sum: 1 }
                            }
                        }
                    }
                ])
            ]);

            res.json({
                success: true,
                data: {
                    totalUsers,
                    totalScore: totalScore[0]?.total || 0,
                    averageScore: Math.round(averageScore[0]?.avg || 0),
                    topUser: topUser ? {
                        username: topUser.user?.username,
                        score: topUser.totalScore
                    } : null,
                    distribution
                }
            });

        } catch (error) {
            console.error('Get leaderboard stats error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch leaderboard stats'
            });
        }
    }
}

module.exports = new LeaderboardController();