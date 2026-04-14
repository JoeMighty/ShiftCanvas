import type { Employee, Shift, Template, BrandingSettings, CustomShiftType, Preferences } from '@/types'
import { idbGet, idbSet, idbDelete } from '@/lib/idb'

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

// --- Migration from localStorage to IndexedDB (runs once) ---
const MIGRATION_FLAG = 'shiftcanvas_migrated_v2'

export async function migrateFromLocalStorage(): Promise<void> {
  if (localStorage.getItem(MIGRATION_FLAG)) return
  const moved: string[] = []
  for (const key of ALL_STORAGE_KEYS) {
    const raw = localStorage.getItem(key)
    if (raw) {
      try {
        await idbSet(key, JSON.parse(raw))
        localStorage.removeItem(key)
        moved.push(key)
      } catch { /* leave in localStorage if migration fails */ }
    }
  }
  if (moved.length > 0) console.info('ShiftCanvas: migrated', moved.length, 'keys to IndexedDB')
  localStorage.setItem(MIGRATION_FLAG, '1')
}

// --- Employees ---
export async function saveEmployees(employees: Employee[]): Promise<void> {
  await idbSet(KEYS.EMPLOYEES, employees)
}
export async function loadEmployees(): Promise<Employee[]> {
  return idbGet<Employee[]>(KEYS.EMPLOYEES, [])
}

// --- Schedule ---
export async function saveSchedule(shifts: Shift[]): Promise<void> {
  await idbSet(KEYS.SCHEDULE, shifts)
}
export async function loadSchedule(): Promise<Shift[]> {
  return idbGet<Shift[]>(KEYS.SCHEDULE, [])
}

// --- Templates ---
export async function saveTemplates(templates: Template[]): Promise<void> {
  await idbSet(KEYS.TEMPLATES, templates)
}
export async function loadTemplates(): Promise<Template[]> {
  return idbGet<Template[]>(KEYS.TEMPLATES, [])
}

// --- Branding ---
export async function saveBranding(settings: BrandingSettings): Promise<void> {
  await idbSet(KEYS.BRANDING, settings)
}
export async function loadBranding(): Promise<BrandingSettings> {
  return idbGet<BrandingSettings>(KEYS.BRANDING, {
    logo: null,
    primaryColour: '#2563eb',
    companyName: '',
  })
}

// --- Week start ---
export async function saveWeekStart(date: string): Promise<void> {
  await idbSet(KEYS.WEEK_START, date)
}
export async function loadWeekStart(): Promise<string> {
  return idbGet<string>(KEYS.WEEK_START, '')
}

// --- Preferences ---
export async function savePreferences(prefs: Preferences): Promise<void> {
  await idbSet(KEYS.PREFERENCES, prefs)
}
export async function loadPreferences(): Promise<Preferences> {
  return idbGet<Preferences>(KEYS.PREFERENCES, {
    weekStartDay: 1,
    hasSeenWelcome: false,
    hoursThreshold: 40,
  })
}

// --- Custom shift types ---
export async function saveCustomTypes(types: CustomShiftType[]): Promise<void> {
  await idbSet(KEYS.CUSTOM_TYPES, types)
}
export async function loadCustomTypes(): Promise<CustomShiftType[]> {
  return idbGet<CustomShiftType[]>(KEYS.CUSTOM_TYPES, [])
}

// --- Data management ---
export async function exportAllData(): Promise<Record<string, unknown>> {
  const data: Record<string, unknown> = {}
  for (const key of ALL_STORAGE_KEYS) {
    const val = await idbGet<unknown>(key, undefined)
    if (val !== undefined) data[key] = val
  }
  return data
}

export async function importAllData(data: Record<string, unknown>): Promise<void> {
  for (const key of ALL_STORAGE_KEYS) {
    if (key in data) await idbSet(key, data[key])
  }
}

export async function clearAllData(): Promise<void> {
  for (const key of ALL_STORAGE_KEYS) {
    await idbDelete(key)
  }
}
