import api from './api.client'

export const leaderboardService = {
  getLeaderboard: (params) => api.get('/leaderboard', { params }),
  getTopPerformers: (limit = 3) => api.get(`/leaderboard/top?limit=${limit}`),
  getUserRank: (userId) => api.get(`/leaderboard/user/${userId}`),
  compareUsers: (userId1, userId2) => api.get(`/leaderboard/compare/${userId1}/${userId2}`),
  getStats: () => api.get('/leaderboard/stats'),
}