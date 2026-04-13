import { create } from 'zustand'
import type { BrandingSettings } from '@/types'
import { loadBranding, saveBranding } from '@/lib/storage'

interface BrandingState {
  branding: BrandingSettings
  updateBranding: (updates: Partial<BrandingSettings>) => void
  hydrate: () => void
}

export const useBrandingStore = create<BrandingState>((set, get) => ({
  branding: {
    logo: null,
    primaryColour: '#2563eb',
    companyName: '',
  },

  hydrate() {
    set({ branding: loadBranding() })
  },

  updateBranding(updates) {
    const next = { ...get().branding, ...updates }
    saveBranding(next)
    set({ branding: next })
  },
}))
