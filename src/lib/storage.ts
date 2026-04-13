import type { Employee, Shift, Template, BrandingSettings } from '@/types'

const KEYS = {
  EMPLOYEES: 'shiftcanvas_employees',
  SCHEDULE: 'shiftcanvas_schedule',
  TEMPLATES: 'shiftcanvas_templates',
  BRANDING: 'shiftcanvas_branding',
  WEEK_START: 'shiftcanvas_week_start',
} as const

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
