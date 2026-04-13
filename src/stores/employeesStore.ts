import { create } from 'zustand'
import type { Employee } from '@/types'
import { loadEmployees, saveEmployees } from '@/lib/storage'

interface EmployeesState {
  employees: Employee[]
  setEmployees: (employees: Employee[]) => void
  addEmployee: (employee: Employee) => void
  removeEmployee: (id: string) => void
  updateEmployee: (id: string, updates: Partial<Employee>) => void
  hydrate: () => void
}

export const useEmployeesStore = create<EmployeesState>((set, get) => ({
  employees: [],

  hydrate() {
    set({ employees: loadEmployees() })
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
    const next = get().employees.filter((e) => e.id !== id)
    saveEmployees(next)
    set({ employees: next })
  },

  updateEmployee(id, updates) {
    const next = get().employees.map((e) =>
      e.id === id ? { ...e, ...updates } : e
    )
    saveEmployees(next)
    set({ employees: next })
  },
}))
