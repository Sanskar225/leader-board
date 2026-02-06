const GitHubService = require('./GitHubService');
const LeetCodeService = require('./LeetCodeService');
const ScoringService = require('./ScoringService');
const RefreshLog = require('../models/RefreshLog');
const GitHubStats = require('../models/GitHubStats');
const LeetCodeStats = require('../models/LeetCodeStats');

class RefreshService {
    async refreshUserStats(userId, githubUsername, leetcodeUsername, type = 'both') {
        const startTime = Date.now();
        const refreshLog = new RefreshLog({
            user: userId,
            type
        });

        try {
            let githubStats = null;
            let leetcodeStats = null;

            if (type === 'both' || type === 'github') {
                if (!githubUsername) {
                    throw new Error('GitHub username not provided');
                }

                githubStats = await GitHubService.getUserStats(githubUsername);
                
                await GitHubStats.findOneAndUpdate(
                    { user: userId },
                    {
                        user: userId,
                        ...githubStats,
                        syncedAt: new Date()
                    },
                    { upsert: true }
                );
            }

            if (type === 'both' || type === 'leetcode') {
                if (!leetcodeUsername) {
                    throw new Error('LeetCode username not provided');
                }

                leetcodeStats = await LeetCodeService.getUserStats(leetcodeUsername);
                
                await LeetCodeStats.findOneAndUpdate(
                    { user: userId },
                    {
                        user: userId,
                        ...leetcodeStats,
                        syncedAt: new Date()
                    },
                    { upsert: true }
                );
            }

            await ScoringService.updateUserScores(userId);

            refreshLog.status = 'success';
            refreshLog.duration = Date.now() - startTime;
            await refreshLog.save();

            return {
                success: true,
                githubStats,
                leetcodeStats,
                duration: refreshLog.duration
            };

        } catch (error) {
            refreshLog.status = 'failed';
            refreshLog.error = error.message;
            refreshLog.duration = Date.now() - startTime;
            await refreshLog.save();

            console.error(`Refresh failed for user ${userId}:`, error.message);
            
            return {
                success: false,
                error: error.message,
                duration: refreshLog.duration
            };
        }
    }

    async getRefreshHistory(userId, limit = 10) {
        try {
            const history = await RefreshLog.find({ user: userId })
                .sort({ createdAt: -1 })
                .limit(limit)
                .select('type status duration error createdAt');

            return history;
        } catch (error) {
            console.error('Error fetching refresh history:', error);
            return [];
        }
    }

    async validateUsernames(githubUsername, leetcodeUsername) {
        const validations = {
            github: { isValid: false, message: '' },
            leetcode: { isValid: false, message: '' }
        };

        if (githubUsername) {
            try {
                const isValid = await GitHubService.validateUsername(githubUsername);
                validations.github.isValid = isValid;
                validations.github.message = isValid ? 'Valid GitHub username' : 'Invalid GitHub username';
            } catch (error) {
                validations.github.message = 'Error validating GitHub username';
            }
        }

        if (leetcodeUsername) {
            try {
                const isValid = await LeetCodeService.validateUsername(leetcodeUsername);
                validations.leetcode.isValid = isValid;
                validations.leetcode.message = isValid ? 'Valid LeetCode username' : 'Invalid LeetCode username';
            } catch (error) {
                validations.leetcode.message = 'Error validating LeetCode username';
            }
        }

        return validations;
    }
}

module.exports = new RefreshService();