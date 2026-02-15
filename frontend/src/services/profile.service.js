import api from './api.client'

export const profileService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  refreshStats: (type = 'both') => api.post('/users/refresh', { type }),
  getRefreshHistory: (limit = 10) => api.get(`/users/refresh/history?limit=${limit}`),
}