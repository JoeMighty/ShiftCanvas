import type { Employee, Shift, Template, BrandingSettings, CustomShiftType, Preferences } from '@/types'

const KEYS = {
  EMPLOYEES: 'shiftcanvas_employees',
  SCHEDULE: 'shiftcanvas_schedule',
  TEMPLATES: 'shiftcanvas_templates',
  BRANDING: 'shiftcanvas_branding',
  WEEK_START: 'shiftcanvas_week_start',
  PREFERENCES: 'shiftcanvas_preferences',
  CUSTOM_TYPES: 'shiftcanvas_custom_types',
} as const

export const ALL_STORAGE_KEYS = Object.values(KEYS)

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.error('ShiftCanvas: failed to save to localStorage')
  }
}

// Employees
export function saveEmployees(employees: Employee[]): void {
  safeSet(KEYS.EMPLOYEES, employees)
}
export function loadEmployees(): Employee[] {
  return safeGet<Employee[]>(KEYS.EMPLOYEES, [])
}

// Schedule
export function saveSchedule(shifts: Shift[]): void {
  safeSet(KEYS.SCHEDULE, shifts)
}
export function loadSchedule(): Shift[] {
  return safeGet<Shift[]>(KEYS.SCHEDULE, [])
}

// Templates
export function saveTemplates(templates: Template[]): void {
  safeSet(KEYS.TEMPLATES, templates)
}
export function loadTemplates(): Template[] {
  return safeGet<Template[]>(KEYS.TEMPLATES, [])
}

// Branding
export function saveBranding(settings: BrandingSettings): void {
  safeSet(KEYS.BRANDING, settings)
}
export function loadBranding(): BrandingSettings {
  return safeGet<BrandingSettings>(KEYS.BRANDING, {
    logo: null,
    primaryColour: '#2563eb',
    companyName: '',
  })
}

// Week start date
export function saveWeekStart(date: string): void {
  safeSet(KEYS.WEEK_START, date)
}
export function loadWeekStart(): string {
  return safeGet<string>(KEYS.WEEK_START, '')
}

// Preferences
export function savePreferences(prefs: Preferences): void {
  safeSet(KEYS.PREFERENCES, prefs)
}
export function loadPreferences(): Preferences {
  return safeGet<Preferences>(KEYS.PREFERENCES, {
    weekStartDay: 1,
    hasSeenWelcome: false,
  })
}

// Custom shift types
export function saveCustomTypes(types: CustomShiftType[]): void {
  safeSet(KEYS.CUSTOM_TYPES, types)
}
export function loadCustomTypes(): CustomShiftType[] {
  return safeGet<CustomShiftType[]>(KEYS.CUSTOM_TYPES, [])
}

// Data management helpers
export function exportAllData(): Record<string, unknown> {
  const data: Record<string, unknown> = {}
  ALL_STORAGE_KEYS.forEach(key => {
    const raw = localStorage.getItem(key)
    if (raw) {
      try { data[key] = JSON.parse(raw) } catch { /* skip */ }
    }
  })
  return data
}

export function importAllData(data: Record<string, unknown>): void {
  ALL_STORAGE_KEYS.forEach(key => {
    if (key in data) {
      localStorage.setItem(key, JSON.stringify(data[key]))
    }
  })
}

export function clearAllData(): void {
  ALL_STORAGE_KEYS.forEach(key => localStorage.removeItem(key))
}
