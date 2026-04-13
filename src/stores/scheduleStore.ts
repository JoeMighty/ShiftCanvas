import { create } from 'zustand'
import type { Shift, ShiftType } from '@/types'
import { loadSchedule, saveSchedule, loadWeekStart, saveWeekStart } from '@/lib/storage'
import dayjs from 'dayjs'
import { nanoid } from '@/lib/utils'

interface ScheduleState {
  shifts: Shift[]
  weekStart: string
  setWeekStart: (date: string) => void
  setShifts: (shifts: Shift[]) => void
  upsertShift: (shift: Omit<Shift, 'id'> & { id?: string }) => void
  removeShift: (id: string) => void
  removeShiftsForEmployee: (employeeId: string) => void
  getShift: (employeeId: string, date: string) => Shift | undefined
  setShiftType: (employeeId: string, date: string, type: ShiftType) => void
  hydrate: () => void
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  shifts: [],
  weekStart: '',

  hydrate() {
    const stored = loadWeekStart()
    const weekStart = stored || dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD')
    set({ shifts: loadSchedule(), weekStart })
  },

  setWeekStart(date) {
    saveWeekStart(date)
    set({ weekStart: date })
  },

  setShifts(shifts) {
    saveSchedule(shifts)
    set({ shifts })
  },

  upsertShift(shift) {
    const existing = get().shifts.find(
      (s) => s.employeeId === shift.employeeId && s.date === shift.date
    )
    let next: Shift[]
    if (existing) {
      next = get().shifts.map((s) =>
        s.id === existing.id ? { ...s, ...shift, id: existing.id } : s
      )
    } else {
      next = [...get().shifts, { ...shift, id: shift.id ?? nanoid() }]
    }
    saveSchedule(next)
    set({ shifts: next })
  },

  removeShift(id) {
    const next = get().shifts.filter((s) => s.id !== id)
    saveSchedule(next)
    set({ shifts: next })
  },

  removeShiftsForEmployee(employeeId) {
    const next = get().shifts.filter((s) => s.employeeId !== employeeId)
    saveSchedule(next)
    set({ shifts: next })
  },

  getShift(employeeId, date) {
    return get().shifts.find((s) => s.employeeId === employeeId && s.date === date)
  },

  setShiftType(employeeId, date, type) {
    const existing = get().shifts.find(
      (s) => s.employeeId === employeeId && s.date === date
    )
    if (existing) {
      const next = get().shifts.map((s) =>
        s.id === existing.id ? { ...s, type } : s
      )
      saveSchedule(next)
      set({ shifts: next })
    }
  },
}))
