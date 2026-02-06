const axios = require('axios');

class LeetCodeService {
    constructor() {
        this.baseURL = 'https://leetcode-stats-api.herokuapp.com';
        this.timeout = 10000;
    }

    async getUserStats(username) {
        try {
            if (!username || typeof username !== 'string') {
                throw new Error('Invalid LeetCode username');
            }

            const response = await axios.get(
                `${this.baseURL}/${username}`,
                { timeout: this.timeout }
            );

            if (!response.data || response.data.status === 'error') {
                throw new Error(response.data?.message || 'Invalid LeetCode username');
            }

            const data = response.data;
            
            return {
                totalSolved: data.totalSolved || 0,
                easySolved: data.easySolved || 0,
                mediumSolved: data.mediumSolved || 0,
                hardSolved: data.hardSolved || 0,
                acceptanceRate: data.acceptanceRate || 0,
                ranking: data.ranking || 0,
                reputation: data.reputation || 0,
                contributionPoints: data.contributionPoints || 0,
                rawData: data
            };
        } catch (error) {
            console.error(`LeetCode API Error for ${username}:`, error.message);
            
            if (error.code === 'ECONNABORTED') {
                throw new Error('LeetCode API timeout - please try again');
            }
            
            if (error.response) {
                if (error.response.status === 404) {
                    throw new Error('LeetCode user not found');
                }
            }
            
            throw new Error(`Failed to fetch LeetCode data: ${error.message}`);
        }
    }

    async validateUsername(username) {
        try {
            const response = await axios.get(
                `${this.baseURL}/${username}`,
                { timeout: 5000 }
            );
            return !(response.data.status === 'error');
        } catch (error) {
            return false;
        }
    }
}

module.exports = new LeetCodeService();