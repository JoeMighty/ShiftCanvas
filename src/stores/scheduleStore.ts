import { create } from 'zustand'
import type { Shift, ShiftType } from '@/types'
import { loadSchedule, saveSchedule, loadWeekStart, saveWeekStart } from '@/lib/storage'
import dayjs from 'dayjs'
import { nanoid } from '@/lib/utils'

function buildMap(shifts: Shift[]): Record<string, Shift> {
  const map: Record<string, Shift> = {}
  for (const s of shifts) {
    map[`${s.employeeId}|${s.date}`] = s
  }
  return map
}

// Module-level undo history (session-only, not persisted)
let _history: Shift[][] = []

function pushHistory(current: Shift[]): void {
  _history = [..._history.slice(-19), [...current]]
}

interface ScheduleState {
  shifts: Shift[]
  shiftMap: Record<string, Shift>
  weekStart: string
  setWeekStart: (date: string) => void
  setShifts: (shifts: Shift[]) => void
  upsertShift: (shift: Omit<Shift, 'id'> & { id?: string }) => void
  removeShift: (id: string) => void
  removeShiftsForEmployee: (employeeId: string) => void
  clearShiftsForDates: (dates: string[]) => void
  getShift: (employeeId: string, date: string) => Shift | undefined
  setShiftType: (employeeId: string, date: string, type: ShiftType) => void
  undo: () => boolean
  hydrate: () => Promise<void>
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  shifts: [],
  shiftMap: {},
  weekStart: '',

  async hydrate() {
    const stored = await loadWeekStart()
    const weekStart = stored || dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD')
    const shifts = await loadSchedule()
    _history = []
    set({ shifts, shiftMap: buildMap(shifts), weekStart })
  },

  setWeekStart(date) {
    saveWeekStart(date)
    set({ weekStart: date })
  },

  setShifts(shifts) {
    pushHistory(get().shifts)
    saveSchedule(shifts)
    set({ shifts, shiftMap: buildMap(shifts) })
  },

  upsertShift(shift) {
    pushHistory(get().shifts)
    const existing = get().shiftMap[`${shift.employeeId}|${shift.date}`]
    let next: Shift[]
    if (existing) {
      next = get().shifts.map((s) =>
        s.id === existing.id ? { ...s, ...shift, id: existing.id } : s
      )
    } else {
      next = [...get().shifts, { ...shift, id: shift.id ?? nanoid() }]
    }
    saveSchedule(next)
    set({ shifts: next, shiftMap: buildMap(next) })
  },

  removeShift(id) {
    pushHistory(get().shifts)
    const next = get().shifts.filter((s) => s.id !== id)
    saveSchedule(next)
    set({ shifts: next, shiftMap: buildMap(next) })
  },

  removeShiftsForEmployee(employeeId) {
    const next = get().shifts.filter((s) => s.employeeId !== employeeId)
    saveSchedule(next)
    set({ shifts: next, shiftMap: buildMap(next) })
  },

  clearShiftsForDates(dates) {
    pushHistory(get().shifts)
    const dateSet = new Set(dates)
    const next = get().shifts.filter((s) => !dateSet.has(s.date))
    saveSchedule(next)
    set({ shifts: next, shiftMap: buildMap(next) })
  },

  getShift(employeeId, date) {
    return get().shiftMap[`${employeeId}|${date}`]
  },

  setShiftType(employeeId, date, type) {
    pushHistory(get().shifts)
    const existing = get().shiftMap[`${employeeId}|${date}`]
    if (existing) {
      const next = get().shifts.map((s) =>
        s.id === existing.id ? { ...s, type } : s
      )
      saveSchedule(next)
      set({ shifts: next, shiftMap: buildMap(next) })
    }
  },

  undo() {
    if (_history.length === 0) return false
    const prev = _history[_history.length - 1]
    _history = _history.slice(0, -1)
    saveSchedule(prev)
    set({ shifts: prev, shiftMap: buildMap(prev) })
    return true
  },
}))
