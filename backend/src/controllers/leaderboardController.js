const Leaderboard = require('../models/Leaderboard');
const User = require('../models/User');
const ScoringService = require('../services/ScoringService');

class LeaderboardController {
    async getLeaderboard(req, res) {
        try {
            const {
                page = 1,
                limit = 50,
                sortBy = 'rank',
                order = 'asc',
                search = '',
                minScore = 0,
                maxScore = 1000000,
                timeRange = 'all'
            } = req.query;

            const pageNumber = parseInt(page);
            const limitNumber = parseInt(limit);
            const skip = (pageNumber - 1) * limitNumber;

            let filter = {
                totalScore: { $gte: parseInt(minScore), $lte: parseInt(maxScore) }
            };

            if (timeRange !== 'all') {
                let days = 7;
                if (timeRange === 'monthly') days = 30;
                
                const dateThreshold = new Date();
                dateThreshold.setDate(dateThreshold.getDate() - days);
                
                filter.lastUpdated = { $gte: dateThreshold };
            }

            if (search) {
                const users = await User.find({
                    username: { $regex: search, $options: 'i' }
                }).select('_id');
                
                filter.user = { $in: users.map(u => u._id) };
            }

            const sortOrder = order === 'desc' ? -1 : 1;
            const sort = { [sortBy]: sortOrder };

            if (sortBy === 'rank' && order === 'desc') {
                sort.rank = -1;
            }

            const total = await Leaderboard.countDocuments(filter);

            const leaderboard = await Leaderboard.find(filter)
                .populate('user', 'username avatar email createdAt')
                .sort(sort)
                .skip(skip)
                .limit(limitNumber)
                .lean();

            const enrichedLeaderboard = leaderboard.map((entry, index) => ({
                ...entry,
                percentile: total > 0 ? Math.round(((total - (skip + index + 1)) / total) * 100 * 100) / 100 : 0
            }));

            let currentUserPosition = null;
            if (req.user) {
                const userEntry = await Leaderboard.findOne({ user: req.user._id });
                if (userEntry) {
                    const rankAbove = await Leaderboard.countDocuments({
                        totalScore: { $gt: userEntry.totalScore }
                    });
                    currentUserPosition = {
                        rank: userEntry.rank,
                        totalScore: userEntry.totalScore,
                        position: rankAbove + 1,
                        percentile: total > 0 
                            ? Math.round(((total - userEntry.rank) / total) * 100 * 100) / 100 
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
                        pages: Math.ceil(total / limitNumber)
                    },
                    currentUser: currentUserPosition,
                    filters: {
                        sortBy,
                        order,
                        search,
                        minScore,
                        maxScore,
                        timeRange
                    },
                    updatedAt: new Date()
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

    async getTopPerformers(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;

            const topPerformers = await Leaderboard.find({})
                .populate('user', 'username avatar')
                .sort({ totalScore: -1 })
                .limit(limit)
                .lean();

            res.json({
                success: true,
                data: topPerformers
            });

        } catch (error) {
            console.error('Get top performers error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch top performers'
            });
        }
    }

    async getUserRank(req, res) {
        try {
            const userId = req.params.userId || req.user._id;

            const userEntry = await Leaderboard.findOne({ user: userId })
                .populate('user', 'username avatar');

            if (!userEntry) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found on leaderboard'
                });
            }

            const rankAbove = await Leaderboard.countDocuments({
                totalScore: { $gt: userEntry.totalScore }
            });

            const rankBelow = await Leaderboard.countDocuments({
                totalScore: { $lt: userEntry.totalScore }
            });

            const totalUsers = await Leaderboard.countDocuments();

            res.json({
                success: true,
                data: {
                    ...userEntry.toObject(),
                    rankAbove,
                    rankBelow,
                    totalUsers,
                    percentile: totalUsers > 0 
                        ? Math.round(((totalUsers - userEntry.rank) / totalUsers) * 100 * 100) / 100 
                        : 0,
                    context: {
                        isTop10: userEntry.rank <= 10,
                        isTop100: userEntry.rank <= 100,
                        isTop10Percent: userEntry.rank <= totalUsers * 0.1
                    }
                }
            });

        } catch (error) {
            console.error('Get user rank error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch user rank'
            });
        }
    }

    async getLeaderboardStats(req, res) {
        try {
            const stats = await Leaderboard.aggregate([
                {
                    $group: {
                        _id: null,
                        totalUsers: { $sum: 1 },
                        averageScore: { $avg: '$totalScore' },
                        maxScore: { $max: '$totalScore' },
                        minScore: { $min: '$totalScore' },
                        totalLeetCodeScore: { $sum: '$leetCodeScore' },
                        totalGitHubScore: { $sum: '$githubScore' }
                    }
                }
            ]);

            const distribution = await Leaderboard.aggregate([
                {
                    $bucket: {
                        groupBy: '$totalScore',
                        boundaries: [0, 100, 500, 1000, 2000, 5000, 10000, Infinity],
                        default: 'Other',
                        output: {
                            count: { $sum: 1 }
                        }
                    }
                }
            ]);

            const topUsers = await Leaderboard.find({})
                .populate('user', 'username avatar')
                .sort({ totalScore: -1 })
                .limit(3)
                .lean();

            const result = {
                overall: stats[0] || {},
                distribution,
                topUsers,
                updatedAt: new Date()
            };

            res.json({
                success: true,
                data: result
            });

        } catch (error) {
            console.error('Get leaderboard stats error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch leaderboard stats'
            });
        }
    }

    async refreshRanks(req, res) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    error: 'Only admins can refresh ranks'
                });
            }

            const startTime = Date.now();
            const count = await ScoringService.updateAllRanks();
            const duration = Date.now() - startTime;

            res.json({
                success: true,
                message: `Refreshed ranks for ${count} users`,
                data: {
                    count,
                    duration: `${duration}ms`
                }
            });

        } catch (error) {
            console.error('Refresh ranks error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to refresh ranks'
            });
        }
    }
}

module.exports = new LeaderboardController();