const cron = require('node-cron');
const ScoringService = require('./ScoringService');
const RefreshService = require('./RefreshService');
const User = require('../models/User');
const Profile = require('../models/Profile');

class CronService {
    constructor() {
        this.jobs = [];
    }

    start() {
        console.log('🕐 Starting cron jobs...');

        // Update ranks every hour
        this.jobs.push(cron.schedule('0 * * * *', async () => {
            console.log('⏰ Running scheduled leaderboard rank update...');
            try {
                const count = await ScoringService.updateAllRanks();
                console.log(`✅ Updated ranks for ${count} users`);
            } catch (error) {
                console.error('❌ Error updating leaderboard ranks:', error);
            }
        }));

        // Refresh stats for active users every 6 hours
        this.jobs.push(cron.schedule('0 */6 * * *', async () => {
            console.log('⏰ Running scheduled stats refresh for active users...');
            try {
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                const activeUsers = await User.find({
                    lastLogin: { $gte: sevenDaysAgo }
                }).select('_id');

                let successCount = 0;
                let failCount = 0;

                for (const user of activeUsers.slice(0, 50)) {
                    try {
                        const profile = await Profile.findOne({ user: user._id });
                        if (profile && profile.githubUsername && profile.leetcodeUsername) {
                            await RefreshService.refreshUserStats(
                                user._id,
                                profile.githubUsername,
                                profile.leetcodeUsername,
                                'both'
                            );
                            successCount++;
                        }
                    } catch (error) {
                        failCount++;
                        console.error(`Failed to refresh user ${user._id}:`, error.message);
                    }
                }

                console.log(`✅ Refreshed ${successCount} users, failed: ${failCount}`);
            } catch (error) {
                console.error('❌ Error refreshing user stats:', error);
            }
        }));

        // Cleanup old logs daily at midnight
        this.jobs.push(cron.schedule('0 0 * * *', async () => {
            console.log('⏰ Running scheduled cleanup...');
            try {
                const RefreshLog = require('../models/RefreshLog');
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                const result = await RefreshLog.deleteMany({
                    createdAt: { $lt: thirtyDaysAgo }
                });

                console.log(`✅ Cleaned up ${result.deletedCount} old refresh logs`);
            } catch (error) {
                console.error('❌ Error cleaning up old logs:', error);
            }
        }));

        console.log(`✅ ${this.jobs.length} cron jobs started`);
    }

    stop() {
        this.jobs.forEach(job => job.stop());
        console.log('🛑 All cron jobs stopped');
    }
}

module.exports = new CronService();