import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useIntroStore = create(
  persist(
    (set) => ({
      hasPlayed: false,
      setHasPlayed: (value) => set({ hasPlayed: value }),
    }),
    {
      name: 'intro-storage',
      storage: sessionStorage,
    }
  )
)