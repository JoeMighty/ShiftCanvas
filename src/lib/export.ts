import type { Employee, Shift } from '@/types'
import type { Dayjs } from 'dayjs'

function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function downloadText(filename: string, content: string, type: string): void {
  downloadBlob(filename, new Blob([content], { type }))
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
  downloadText(`schedule-${days[0].format('YYYY-MM-DD')}.csv`, csv, 'text/csv')
}

export async function exportScheduleExcel(
  employees: Employee[],
  days: Dayjs[],
  getShift: (empId: string, date: string) => Shift | undefined,
  getTypeLabel: (type: string) => string,
): Promise<void> {
  const XLSX = (await import('xlsx')).default
  const headers = ['Employee', 'Role', ...days.map(d => d.format('ddd D MMM')), 'Shifts', 'Hours']
  const rows = employees.map(emp => {
    const shifts = days.map(d => getShift(emp.id, d.format('YYYY-MM-DD')))
    const totalShifts = shifts.filter(Boolean).length
    const totalHours = shifts
      .filter(s => s?.type === 'normal')
      .reduce((acc, s) => {
        if (!s) return acc
        const [sh, sm] = s.start.split(':').map(Number)
        const [eh, em] = s.end.split(':').map(Number)
        const mins = eh * 60 + em - sh * 60 - sm
        return acc + (mins > 0 ? Math.round(mins / 60 * 10) / 10 : 0)
      }, 0)
    return [
      emp.name,
      emp.role ?? '',
      ...shifts.map(s => {
        if (!s) return ''
        if (s.type === 'normal') return `${s.start}-${s.end}`
        return getTypeLabel(s.type)
      }),
      totalShifts,
      totalHours,
    ]
  })

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
  // Style header row bold
  const range = XLSX.utils.decode_range(ws['!ref'] ?? 'A1')
  for (let c = range.s.c; c <= range.e.c; c++) {
    const addr = XLSX.utils.encode_cell({ r: 0, c })
    if (!ws[addr]) continue
    ws[addr].s = { font: { bold: true } }
  }
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Schedule')
  XLSX.writeFile(wb, `schedule-${days[0].format('YYYY-MM-DD')}.xlsx`)
}

export async function exportScheduleImage(element: HTMLElement, weekLabel: string): Promise<void> {
  const { toPng } = await import('html-to-image')
  const dataUrl = await toPng(element, { quality: 1, pixelRatio: 2 })
  const link = document.createElement('a')
  link.download = `schedule-${weekLabel}.png`
  link.href = dataUrl
  link.click()
}

export function exportDataJSON(data: Record<string, unknown>): void {
  downloadText(
    `shiftcanvas-backup-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify(data, null, 2),
    'application/json',
  )
}
