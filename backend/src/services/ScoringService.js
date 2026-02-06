const Leaderboard = require('../models/Leaderboard');
const LeetCodeStats = require('../models/LeetCodeStats');
const GitHubStats = require('../models/GitHubStats');

class ScoringService {
    constructor() {
        this.weights = {
            leetCode: {
                totalSolved: 2,
                easySolved: 1,
                mediumSolved: 3,
                hardSolved: 5,
                acceptanceRate: 0.5,
                ranking: -0.01,
                reputation: 0.1
            },
            github: {
                publicRepos: 5,
                totalStars: 10,
                totalForks: 3,
                followers: 2,
                contributions: 0.1,
                following: 0.1
            },
            combined: {
                leetCodeWeight: 0.7,
                githubWeight: 0.3
            }
        };
    }

    calculateLeetCodeScore(leetcodeStats) {
        if (!leetcodeStats) return 0;

        const {
            totalSolved = 0,
            easySolved = 0,
            mediumSolved = 0,
            hardSolved = 0,
            acceptanceRate = 0,
            ranking = 0,
            reputation = 0
        } = leetcodeStats;

        const weights = this.weights.leetCode;

        let score = 0;
        score += totalSolved * weights.totalSolved;
        score += easySolved * weights.easySolved;
        score += mediumSolved * weights.mediumSolved;
        score += hardSolved * weights.hardSolved;
        score += acceptanceRate * weights.acceptanceRate;
        score += ranking * weights.ranking;
        score += reputation * weights.reputation;

        return Math.max(0, Math.round(score));
    }

    calculateGitHubScore(githubStats) {
        if (!githubStats) return 0;

        const {
            publicRepos = 0,
            totalStars = 0,
            totalForks = 0,
            followers = 0,
            contributions = 0,
            following = 0
        } = githubStats;

        const weights = this.weights.github;

        let score = 0;
        score += publicRepos * weights.publicRepos;
        score += totalStars * weights.totalStars;
        score += totalForks * weights.totalForks;
        score += followers * weights.followers;
        score += contributions * weights.contributions;
        score += following * weights.following;

        if (totalStars > 0 && contributions > 0) {
            score += totalStars * 0.5;
        }

        return Math.max(0, Math.round(score));
    }

    calculateTotalScore(leetcodeStats, githubStats) {
        const leetCodeScore = this.calculateLeetCodeScore(leetcodeStats);
        const githubScore = this.calculateGitHubScore(githubStats);

        const totalScore = 
            (leetCodeScore * this.weights.combined.leetCodeWeight) +
            (githubScore * this.weights.combined.githubWeight);

        return {
            totalScore: Math.round(totalScore),
            leetCodeScore: leetCodeScore,
            githubScore: githubScore,
            breakdown: {
                leetCode: leetCodeScore,
                github: githubScore,
                leetCodeWeight: this.weights.combined.leetCodeWeight,
                githubWeight: this.weights.combined.githubWeight
            }
        };
    }

    async updateUserScores(userId) {
        try {
            const leetcodeStats = await LeetCodeStats.findOne({ user: userId });
            const githubStats = await GitHubStats.findOne({ user: userId });

            if (!leetcodeStats && !githubStats) {
                return null;
            }

            const scores = this.calculateTotalScore(leetcodeStats, githubStats);

            const currentEntry = await Leaderboard.findOne({ user: userId });

            const leaderboardEntry = await Leaderboard.findOneAndUpdate(
                { user: userId },
                {
                    user: userId,
                    totalScore: scores.totalScore,
                    leetCodeScore: scores.leetCodeScore,
                    githubScore: scores.githubScore,
                    previousRank: currentEntry?.rank || 0,
                    lastUpdated: new Date()
                },
                { upsert: true, new: true }
            );

            return leaderboardEntry;
        } catch (error) {
            console.error(`Error updating scores for user ${userId}:`, error);
            throw error;
        }
    }

    async updateAllRanks() {
        try {
            const entries = await Leaderboard.find()
                .sort({ totalScore: -1, lastUpdated: -1 })
                .populate('user', 'username avatar');

            let rank = 1;
            const bulkOps = [];

            for (const entry of entries) {
                const previousRank = entry.rank;
                const rankChange = previousRank ? previousRank - rank : 0;

                bulkOps.push({
                    updateOne: {
                        filter: { _id: entry._id },
                        update: {
                            rank,
                            previousRank,
                            rankChange,
                            lastUpdated: new Date()
                        }
                    }
                });

                rank++;
            }

            if (bulkOps.length > 0) {
                await Leaderboard.bulkWrite(bulkOps);
            }

            console.log(`✅ Updated ranks for ${entries.length} users`);
            return entries.length;
        } catch (error) {
            console.error('Error updating ranks:', error);
            throw error;
        }
    }

    async getRankingPercentile(userId) {
        try {
            const totalUsers = await Leaderboard.countDocuments();
            
            if (totalUsers === 0) return 100;

            const userEntry = await Leaderboard.findOne({ user: userId });
            if (!userEntry || userEntry.rank === 0) return 0;

            const percentile = ((totalUsers - userEntry.rank) / totalUsers) * 100;
            return Math.round(percentile * 100) / 100;
        } catch (error) {
            console.error('Error calculating percentile:', error);
            return 0;
        }
    }
}

module.exports = new ScoringService();