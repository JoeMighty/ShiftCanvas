export interface Employee {
  id: string
  name: string
  role?: string
  notes?: string
}

// ShiftType is a string; built-in values are listed below.
export type ShiftType = string

export const BUILTIN_SHIFT_TYPE_IDS = ['normal', 'sick', 'leave', 'unavailable'] as const

export interface CustomShiftType {
  id: string
  label: string
  colour: string // hex
}

export interface Shift {
  id: string
  employeeId: string
  date: string   // YYYY-MM-DD
  start: string  // HH:MM
  end: string    // HH:MM
  type: ShiftType
}

export interface Template {
  id: string
  name: string
  schedule: Shift[]
}

export interface BrandingSettings {
  logo: string | null
  primaryColour: string
  companyName: string
}

export interface Preferences {
  weekStartDay: 0 | 1      // 0 = Sunday, 1 = Monday
  hasSeenWelcome: boolean
  hoursThreshold: number   // weekly hours warning threshold (default 40)
}
