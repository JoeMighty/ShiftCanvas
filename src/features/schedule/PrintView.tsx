import dayjs from 'dayjs'
import { useEmployeesStore } from '@/stores/employeesStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { useBrandingStore } from '@/stores/brandingStore'
import type { ShiftType } from '@/types'

const TYPE_LABELS: Record<ShiftType, string> = {
  normal: '',
  sick: 'Sick',
  leave: 'Leave',
  unavailable: 'Off',
}

export function PrintView() {
  const { employees } = useEmployeesStore()
  const { shifts, weekStart } = useScheduleStore()
  const { branding } = useBrandingStore()

  const startDate = dayjs(weekStart || dayjs().startOf('week').add(1, 'day'))
  const days = Array.from({ length: 7 }, (_, i) => startDate.add(i, 'day'))

  function getShift(employeeId: string, date: string) {
    return shifts.find((s) => s.employeeId === employeeId && s.date === date)
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
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, i) => (
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
                      <span className={
                        shift.type === 'normal'
                          ? 'text-gray-800'
                          : shift.type === 'sick'
                          ? 'text-red-600'
                          : shift.type === 'leave'
                          ? 'text-amber-600'
                          : 'text-gray-400'
                      }>
                        {shift.type === 'normal'
                          ? `${shift.start}-${shift.end}`
                          : TYPE_LABELS[shift.type]}
                      </span>
                    ) : (
                      <span className="text-gray-200">-</span>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
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
