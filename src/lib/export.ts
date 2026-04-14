import type { Employee, Shift } from '@/types'
import type { Dayjs } from 'dayjs'

function downloadFile(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportScheduleCSV(
  employees: Employee[],
  days: Dayjs[],
  getShift: (empId: string, date: string) => Shift | undefined,
  getTypeLabel: (type: string) => string,
): void {
  const headers = ['Employee', 'Role', ...days.map(d => d.format('ddd D MMM'))]
  const rows = employees.map(emp => [
    emp.name,
    emp.role ?? '',
    ...days.map(d => {
      const shift = getShift(emp.id, d.format('YYYY-MM-DD'))
      if (!shift) return ''
      if (shift.type === 'normal') return `${shift.start}-${shift.end}`
      return getTypeLabel(shift.type)
    }),
  ])
  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\r\n')
  downloadFile(`schedule-${days[0].format('YYYY-MM-DD')}.csv`, csv, 'text/csv')
}

export function exportDataJSON(data: Record<string, unknown>): void {
  downloadFile(
    `shiftcanvas-backup-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify(data, null, 2),
    'application/json',
  )
}
