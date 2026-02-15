import { create } from 'zustand'

export const useLeaderboardStore = create((set, get) => ({
  leaderboard: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false,
  },
  setLeaderboard: (leaderboard) => set({ leaderboard }),
  setPagination: (pagination) => set({ pagination }),
  getUserRank: (userId) => {
    const index = get().leaderboard.findIndex(entry => entry.user?._id === userId)
    return index >= 0 ? index + 1 : null
  },
}))