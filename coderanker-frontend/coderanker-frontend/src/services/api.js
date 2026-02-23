import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
}

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  refreshStats: (type = 'both') => api.post('/users/refresh', { type }),
  compareUser: (userId) => api.get(`/users/compare/${userId}`),
}

export const leaderboardAPI = {
  getLeaderboard: (params) => api.get('/leaderboard', { params }),
  getTopPerformers: (limit = 3) => api.get('/leaderboard/top', { params: { limit } }),
  getStats: () => api.get('/leaderboard/stats'),
  getUserRank: (userId) => api.get(`/leaderboard/user/${userId}`),
  compareUsers: (uid1, uid2) => api.get(`/leaderboard/compare/${uid1}/${uid2}`),
}

export default api
