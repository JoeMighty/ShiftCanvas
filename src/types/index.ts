export interface Employee {
  id: string
  name: string
  role?: string
}

export type ShiftType = 'normal' | 'sick' | 'leave' | 'unavailable'

export interface Shift {
  id: string
  employeeId: string
  date: string
  start: string
  end: string
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
