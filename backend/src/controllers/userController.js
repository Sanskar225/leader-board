const User = require('../models/User');
const Profile = require('../models/Profile');
const Leaderboard = require('../models/Leaderboard');
const GitHubStats = require('../models/GitHubStats');
const LeetCodeStats = require('../models/LeetCodeStats');
const { generateToken } = require('../utils/jwt');
const {
    validateUsername,
    validateEmail,
    validatePassword,
    validateGitHubUsername,
    validateLeetCodeUsername
} = require('../utils/validators');
const RefreshService = require('../services/RefreshService');

class UserController {
    async register(req, res) {
        try {
            const { username, email, password } = req.body;

            const usernameError = validateUsername(username);
            const emailError = validateEmail(email);
            const passwordError = validatePassword(password);

            if (usernameError || emailError || passwordError) {
                return res.status(400).json({
                    success: false,
                    errors: {
                        username: usernameError,
                        email: emailError,
                        password: passwordError
                    }
                });
            }

            const existingUser = await User.findOne({
                $or: [{ email }, { username }]
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    error: existingUser.email === email 
                        ? 'Email already registered' 
                        : 'Username already taken'
                });
            }

            const user = await User.create({
                username,
                email,
                password
            });

            await Profile.create({
                user: user._id
            });

            const token = generateToken(user._id);

            user.lastLogin = new Date();
            await user.save();

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user: user.toJSON(),
                    token
                }
            });

        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to register user'
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    error: 'Please provide email and password'
                });
            }

            const user = await User.findOne({ email }).select('+password');

            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid credentials'
                });
            }

            const isPasswordValid = await user.comparePassword(password);

            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid credentials'
                });
            }

            const token = generateToken(user._id);

            user.lastLogin = new Date();
            await user.save();

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: user.toJSON(),
                    token
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to login'
            });
        }
    }

    async getProfile(req, res) {
        try {
            const userId = req.user._id;

            const user = await User.findById(userId);
            const profile = await Profile.findOne({ user: userId });

            const [githubStats, leetcodeStats, leaderboard] = await Promise.all([
                GitHubStats.findOne({ user: userId }),
                LeetCodeStats.findOne({ user: userId }),
                Leaderboard.findOne({ user: userId }).populate('user', 'username avatar')
            ]);

            const refreshHistory = await RefreshService.getRefreshHistory(userId, 5);

            let percentile = 0;
            if (leaderboard && leaderboard.rank > 0) {
                const totalUsers = await Leaderboard.countDocuments();
                percentile = ((totalUsers - leaderboard.rank) / totalUsers) * 100;
            }

            res.json({
                success: true,
                data: {
                    user: user.toJSON(),
                    profile: profile || {},
                    stats: {
                        github: githubStats || {},
                        leetcode: leetcodeStats || {}
                    },
                    leaderboard: leaderboard || {},
                    metrics: {
                        percentile: Math.round(percentile * 100) / 100,
                        lastUpdated: leaderboard?.lastUpdated || null
                    },
                    refreshHistory
                }
            });

        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch profile'
            });
        }
    }

    async updateProfile(req, res) {
        try {
            const userId = req.user._id;
            const { githubUsername, leetcodeUsername, bio, location, website } = req.body;

            if (githubUsername) {
                const githubError = validateGitHubUsername(githubUsername);
                if (githubError) {
                    return res.status(400).json({
                        success: false,
                        error: githubError
                    });
                }
            }

            if (leetcodeUsername) {
                const leetcodeError = validateLeetCodeUsername(leetcodeUsername);
                if (leetcodeError) {
                    return res.status(400).json({
                        success: false,
                        error: leetcodeError
                    });
                }
            }

            const profile = await Profile.findOneAndUpdate(
                { user: userId },
                {
                    githubUsername,
                    leetcodeUsername,
                    bio,
                    location,
                    website,
                    updatedAt: new Date()
                },
                { new: true, upsert: true }
            );

            if (githubUsername || leetcodeUsername) {
                setTimeout(async () => {
                    try {
                        await RefreshService.refreshUserStats(
                            userId,
                            githubUsername || profile.githubUsername,
                            leetcodeUsername || profile.leetcodeUsername
                        );
                    } catch (error) {
                        console.error('Background refresh failed:', error);
                    }
                }, 0);
            }

            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: { profile }
            });

        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update profile'
            });
        }
    }
// Add this method to userController.js

async refreshStats(req, res) {
    try {
        const userId = req.user._id;
        const { type = 'both' } = req.body;

        const profile = await Profile.findOne({ user: userId });
        
        if (!profile) {
            return res.status(400).json({
                success: false,
                error: 'Profile not found. Please update your profile first.'
            });
        }

        if ((type === 'both' || type === 'github') && !profile.githubUsername) {
            return res.status(400).json({
                success: false,
                error: 'GitHub username not set in profile'
            });
        }

        if ((type === 'both' || type === 'leetcode') && !profile.leetcodeUsername) {
            return res.status(400).json({
                success: false,
                error: 'LeetCode username not set in profile'
            });
        }

        const result = await RefreshService.refreshUserStats(
            userId,
            profile.githubUsername,
            profile.leetcodeUsername,
            type
        );

        if (!result.success) {
            return res.status(400).json({
                success: false,
                error: result.error
            });
        }

        // Notify via WebSocket about the refresh
        if (global.wsService) {
            global.wsService.broadcastToRoom(`user_${userId}`, {
                type: 'stats_refreshed',
                data: result,
                timestamp: new Date().toISOString()
            });

            // If rank changed, notify leaderboard room
            const oldEntry = await Leaderboard.findOne({ user: userId });
            const newEntry = await ScoringService.updateUserScores(userId);
            
            if (oldEntry && newEntry && oldEntry.rank !== newEntry.rank) {
                global.wsService.notifyLeaderboardChange({
                    userId,
                    oldRank: oldEntry.rank,
                    newRank: newEntry.rank,
                    scoreChange: newEntry.totalScore - oldEntry.totalScore
                });
            }
        }

        res.json({
            success: true,
            message: 'Stats refreshed successfully',
            data: {
                duration: result.duration,
                refreshedAt: new Date()
            }
        });

    } catch (error) {
        console.error('Refresh stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to refresh stats'
        });
    }
}
    async getLeaderboard(req, res) {
        try {
            const { page = 1, limit = 20, sort = 'rank', search = '' } = req.query;
            const pageNumber = parseInt(page);
            const limitNumber = parseInt(limit);
            const skip = (pageNumber - 1) * limitNumber;

            let query = {};
            
            if (search) {
                const users = await User.find({
                    username: { $regex: search, $options: 'i' }
                }).select('_id');
                
                query.user = { $in: users.map(u => u._id) };
            }

            const total = await Leaderboard.countDocuments(query);

            const leaderboard = await Leaderboard.find(query)
                .populate('user', 'username avatar email')
                .sort({ [sort]: sort === 'rank' ? 1 : -1 })
                .skip(skip)
                .limit(limitNumber);

            let userRank = null;
            if (req.user) {
                const userEntry = await Leaderboard.findOne({ user: req.user._id });
                if (userEntry) {
                    userRank = {
                        rank: userEntry.rank,
                        totalScore: userEntry.totalScore,
                        percentile: Math.round(((total - userEntry.rank) / total) * 100 * 100) / 100
                    };
                }
            }

            res.json({
                success: true,
                data: {
                    leaderboard,
                    pagination: {
                        page: pageNumber,
                        limit: limitNumber,
                        total,
                        pages: Math.ceil(total / limitNumber)
                    },
                    userRank,
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

    async compareUser(req, res) {
        try {
            const currentUserId = req.user._id;
            const targetUserId = req.params.userId;

            const [currentUser, targetUser] = await Promise.all([
                User.findById(currentUserId),
                User.findById(targetUserId)
            ]);

            if (!targetUser) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            const [currentProfile, targetProfile] = await Promise.all([
                Profile.findOne({ user: currentUserId }),
                Profile.findOne({ user: targetUserId })
            ]);

            const [currentGitHub, targetGitHub] = await Promise.all([
                GitHubStats.findOne({ user: currentUserId }),
                GitHubStats.findOne({ user: targetUserId })
            ]);

            const [currentLeetCode, targetLeetCode] = await Promise.all([
                LeetCodeStats.findOne({ user: currentUserId }),
                LeetCodeStats.findOne({ user: targetUserId })
            ]);

            const [currentLeaderboard, targetLeaderboard] = await Promise.all([
                Leaderboard.findOne({ user: currentUserId }),
                Leaderboard.findOne({ user: targetUserId })
            ]);

            const comparisons = {
                github: this.compareStats(currentGitHub, targetGitHub, 'github'),
                leetcode: this.compareStats(currentLeetCode, targetLeetCode, 'leetcode'),
                overall: this.compareLeaderboard(currentLeaderboard, targetLeaderboard)
            };

            res.json({
                success: true,
                data: {
                    currentUser: {
                        user: currentUser.toJSON(),
                        profile: currentProfile,
                        stats: {
                            github: currentGitHub,
                            leetcode: currentLeetCode
                        },
                        leaderboard: currentLeaderboard
                    },
                    targetUser: {
                        user: targetUser.toJSON(),
                        profile: targetProfile,
                        stats: {
                            github: targetGitHub,
                            leetcode: targetLeetCode
                        },
                        leaderboard: targetLeaderboard
                    },
                    comparisons
                }
            });

        } catch (error) {
            console.error('Compare user error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to compare users'
            });
        }
    }

    compareStats(current, target, type) {
        if (!current || !target) return {};

        const stats = {};
        const fields = type === 'github' 
            ? ['publicRepos', 'totalStars', 'totalForks', 'followers', 'contributions']
            : ['totalSolved', 'easySolved', 'mediumSolved', 'hardSolved', 'acceptanceRate', 'ranking'];

        fields.forEach(field => {
            const currentVal = current[field] || 0;
            const targetVal = target[field] || 0;
            const difference = currentVal - targetVal;
            const percentage = targetVal > 0 ? (difference / targetVal) * 100 : 0;

            stats[field] = {
                current: currentVal,
                target: targetVal,
                difference,
                percentage: Math.round(percentage * 100) / 100,
                better: difference > 0 ? 'current' : difference < 0 ? 'target' : 'equal'
            };
        });

        return stats;
    }

    compareLeaderboard(current, target) {
        if (!current || !target) return {};

        return {
            rank: {
                current: current.rank || 0,
                target: target.rank || 0,
                difference: (target.rank || 0) - (current.rank || 0),
                better: (current.rank || 0) < (target.rank || 0) ? 'current' : 
                        (current.rank || 0) > (target.rank || 0) ? 'target' : 'equal'
            },
            score: {
                current: current.totalScore || 0,
                target: target.totalScore || 0,
                difference: (current.totalScore || 0) - (target.totalScore || 0),
                percentage: target.totalScore > 0 
                    ? ((current.totalScore - target.totalScore) / target.totalScore) * 100 
                    : 0,
                better: (current.totalScore || 0) > (target.totalScore || 0) ? 'current' : 
                        (current.totalScore || 0) < (target.totalScore || 0) ? 'target' : 'equal'
            }
        };
    }
}

module.exports = new UserController();