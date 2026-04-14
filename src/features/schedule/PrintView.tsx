import dayjs from 'dayjs'
import { useEmployeesStore } from '@/stores/employeesStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { useBrandingStore } from '@/stores/brandingStore'
import { useCustomTypesStore } from '@/stores/customTypesStore'
import { usePreferencesStore } from '@/stores/preferencesStore'

const BUILTIN_LABELS: Record<string, string> = {
  normal: '',
  sick: 'Sick',
  leave: 'Leave',
  unavailable: 'Off',
}

export function PrintView() {
  const { employees } = useEmployeesStore()
  const { getShift, weekStart } = useScheduleStore()
  const { branding } = useBrandingStore()
  const { types: customTypes } = useCustomTypesStore()
  const { preferences } = usePreferencesStore()

  function getWeekStart(date: dayjs.Dayjs): dayjs.Dayjs {
    if (preferences.weekStartDay === 1) {
      const dow = date.day()
      return date.subtract(dow === 0 ? 6 : dow - 1, 'day')
    }
    return date.startOf('week')
  }

  const startDate = dayjs(weekStart || getWeekStart(dayjs()).format('YYYY-MM-DD'))
  const days = Array.from({ length: 7 }, (_, i) => startDate.add(i, 'day'))

  function getTypeLabel(type: string): string {
    if (type in BUILTIN_LABELS) return BUILTIN_LABELS[type]
    return customTypes.find(t => t.id === type)?.label ?? type
  }

  function getTypeColour(type: string): string {
    switch (type) {
      case 'normal': return '#1e3a5f'
      case 'sick': return '#dc2626'
      case 'leave': return '#d97706'
      case 'unavailable': return '#9ca3af'
      default: return customTypes.find(t => t.id === type)?.colour ?? '#6b7280'
    }
  }

  return (
    <div className="print-area p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          {branding.logo && (
            <img src={branding.logo} alt="Logo" className="h-10 object-contain" />
          )}
          <div>
            {branding.companyName && (
              <p className="font-semibold text-gray-900">{branding.companyName}</p>
            )}
            <p className="text-sm text-gray-500">
              Week of {startDate.format('D MMMM YYYY')}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-400">Printed {dayjs().format('D MMM YYYY')}</p>
      </div>

      {/* Table */}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th
              className="text-left py-2 px-3 border border-gray-200 text-xs font-semibold text-white w-36"
              style={{ backgroundColor: branding.primaryColour }}
            >
              Employee
            </th>
            {days.map((day) => (
              <th
                key={day.format('YYYY-MM-DD')}
                className="text-center py-2 px-2 border border-gray-200 text-xs font-semibold text-white w-20"
                style={{ backgroundColor: branding.primaryColour }}
              >
                <div>{day.format('ddd')}</div>
                <div className="font-bold">{day.format('D')}</div>
              </th>
            ))}
            <th
              className="text-center py-2 px-2 border border-gray-200 text-xs font-semibold text-white w-16"
              style={{ backgroundColor: branding.primaryColour }}
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, i) => {
            const weekShifts = days.map(d => getShift(emp.id, d.format('YYYY-MM-DD'))).filter(Boolean)
            const totalHours = weekShifts
              .filter(s => s && s.type === 'normal')
              .reduce((acc, s) => {
                if (!s) return acc
                const [sh, sm] = s.start.split(':').map(Number)
                const [eh, em] = s.end.split(':').map(Number)
                const mins = eh * 60 + em - sh * 60 - sm
                return acc + (mins > 0 ? Math.round(mins / 60 * 10) / 10 : 0)
              }, 0)

            return (
              <tr key={emp.id} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                <td className="py-2 px-3 border border-gray-200 font-medium text-gray-800 text-xs">
                  {emp.name}
                  {emp.role && <span className="block font-normal text-gray-400">{emp.role}</span>}
                </td>
                {days.map((day) => {
                  const shift = getShift(emp.id, day.format('YYYY-MM-DD'))
                  return (
                    <td key={day.format('YYYY-MM-DD')} className="py-2 px-2 border border-gray-200 text-center text-xs">
                      {shift ? (
                        <span style={{ color: getTypeColour(shift.type) }}>
                          {shift.type === 'normal'
                            ? `${shift.start}-${shift.end}`
                            : getTypeLabel(shift.type)}
                        </span>
                      ) : (
                        <span className="text-gray-200">-</span>
                      )}
                    </td>
                  )
                })}
                <td className="py-2 px-2 border border-gray-200 text-center text-xs text-gray-500">
                  {weekShifts.length > 0 ? (
                    <>
                      <span className="font-medium text-gray-700">{weekShifts.length}d</span>
                      {totalHours > 0 && <span className="block text-gray-400">{totalHours}h</span>}
                    </>
                  ) : (
                    <span className="text-gray-200">-</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-400">
        <span>ShiftCanvas</span>
        <span>{employees.length} employee{employees.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}
