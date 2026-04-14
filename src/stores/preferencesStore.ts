import { create } from 'zustand'
import type { Preferences } from '@/types'
import { loadPreferences, savePreferences } from '@/lib/storage'

interface PreferencesState {
  preferences: Preferences
  updatePreferences: (updates: Partial<Preferences>) => void
  hydrate: () => void
}

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  preferences: {
    weekStartDay: 1,
    hasSeenWelcome: false,
  },

  hydrate() {
    set({ preferences: loadPreferences() })
  },

  updatePreferences(updates) {
    const next = { ...get().preferences, ...updates }
    savePreferences(next)
    set({ preferences: next })
  },
}))
