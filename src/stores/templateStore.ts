import { create } from 'zustand'
import type { Template } from '@/types'
import { loadTemplates, saveTemplates } from '@/lib/storage'
import { nanoid } from '@/lib/utils'

interface TemplateState {
  templates: Template[]
  saveTemplate: (name: string, shifts: Template['schedule']) => void
  deleteTemplate: (id: string) => void
  hydrate: () => Promise<void>
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: [],

  async hydrate() {
    set({ templates: await loadTemplates() })
  },

  saveTemplate(name, shifts) {
    const next = [...get().templates, { id: nanoid(), name, schedule: shifts }]
    saveTemplates(next)
    set({ templates: next })
  },

  deleteTemplate(id) {
    const next = get().templates.filter((t) => t.id !== id)
    saveTemplates(next)
    set({ templates: next })
  },
}))
