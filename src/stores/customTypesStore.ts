import { create } from 'zustand'
import type { CustomShiftType } from '@/types'
import { loadCustomTypes, saveCustomTypes } from '@/lib/storage'
import { nanoid } from '@/lib/utils'

interface CustomTypesState {
  types: CustomShiftType[]
  addType: (label: string, colour: string) => void
  removeType: (id: string) => void
  hydrate: () => Promise<void>
}

export const useCustomTypesStore = create<CustomTypesState>((set, get) => ({
  types: [],

  async hydrate() {
    set({ types: await loadCustomTypes() })
  },

  addType(label, colour) {
    const next = [...get().types, { id: nanoid(), label, colour }]
    saveCustomTypes(next)
    set({ types: next })
  },

  removeType(id) {
    const next = get().types.filter(t => t.id !== id)
    saveCustomTypes(next)
    set({ types: next })
  },
}))
