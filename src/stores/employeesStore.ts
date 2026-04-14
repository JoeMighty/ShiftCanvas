import { create } from 'zustand'
import type { Employee } from '@/types'
import { loadEmployees, saveEmployees } from '@/lib/storage'

interface EmployeesState {
  employees: Employee[]
  setEmployees: (employees: Employee[]) => void
  addEmployee: (employee: Employee) => void
  removeEmployee: (id: string) => void
  updateEmployee: (id: string, updates: Partial<Employee>) => void
  moveEmployee: (id: string, direction: 'up' | 'down') => void
  sortAlphabetically: () => void
  hydrate: () => Promise<void>
}

export const useEmployeesStore = create<EmployeesState>((set, get) => ({
  employees: [],

  async hydrate() {
    set({ employees: await loadEmployees() })
  },

  setEmployees(employees) {
    saveEmployees(employees)
    set({ employees })
  },

  addEmployee(employee) {
    const next = [...get().employees, employee]
    saveEmployees(next)
    set({ employees: next })
  },

  removeEmployee(id) {
    const next = get().employees.filter(e => e.id !== id)
    saveEmployees(next)
    set({ employees: next })
  },

  updateEmployee(id, updates) {
    const next = get().employees.map(e => e.id === id ? { ...e, ...updates } : e)
    saveEmployees(next)
    set({ employees: next })
  },

  moveEmployee(id, direction) {
    const list = get().employees
    const idx = list.findIndex(e => e.id === id)
    if (idx === -1) return
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === list.length - 1) return
    const next = [...list]
    const swap = direction === 'up' ? idx - 1 : idx + 1
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    saveEmployees(next)
    set({ employees: next })
  },

  sortAlphabetically() {
    const next = [...get().employees].sort((a, b) => a.name.localeCompare(b.name))
    saveEmployees(next)
    set({ employees: next })
  },
}))
