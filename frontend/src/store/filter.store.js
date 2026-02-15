import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useFilterStore = create(
  persist(
    (set) => ({
      filters: {
        search: '',
        sortBy: 'rank',
        order: 'asc',
        platform: 'all',
        minScore: 0,
        maxScore: 1000000,
      },
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      resetFilters: () =>
        set({
          filters: {
            search: '',
            sortBy: 'rank',
            order: 'asc',
            platform: 'all',
            minScore: 0,
            maxScore: 1000000,
          },
        }),
    }),
    {
      name: 'filter-storage',
      partialize: (state) => ({ filters: state.filters }),
    }
  )
)