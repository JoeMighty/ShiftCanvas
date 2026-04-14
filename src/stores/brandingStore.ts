import { create } from 'zustand'
import type { BrandingSettings } from '@/types'
import { loadBranding, saveBranding } from '@/lib/storage'

interface BrandingState {
  branding: BrandingSettings
  updateBranding: (updates: Partial<BrandingSettings>) => void
  hydrate: () => Promise<void>
}

export const useBrandingStore = create<BrandingState>((set, get) => ({
  branding: {
    logo: null,
    primaryColour: '#2563eb',
    companyName: '',
  },

  async hydrate() {
    set({ branding: await loadBranding() })
  },

  updateBranding(updates) {
    const next = { ...get().branding, ...updates }
    saveBranding(next)
    set({ branding: next })
  },
}))
