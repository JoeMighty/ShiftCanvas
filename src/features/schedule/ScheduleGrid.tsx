import dayjs from 'dayjs'
import { useEmployeesStore } from '@/stores/employeesStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { ShiftCell } from './ShiftCell'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ShiftType } from '@/types'

export function ScheduleGrid() {
  const { employees } = useEmployeesStore()
  const { weekStart, setWeekStart, upsertShift, removeShift, getShift } = useScheduleStore()

  const startDate = dayjs(weekStart || dayjs().startOf('week').add(1, 'day'))
  const days = Array.from({ length: 7 }, (_, i) => startDate.add(i, 'day'))

  function prevWeek() {
    setWeekStart(startDate.subtract(7, 'day').format('YYYY-MM-DD'))
  }

  function nextWeek() {
    setWeekStart(startDate.add(7, 'day').format('YYYY-MM-DD'))
  }

  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
        <p className="text-sm">Add employees to start building a schedule.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Week navigation */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={prevWeek}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium text-gray-700 min-w-[200px] text-center">
          {startDate.format('D MMM')} - {startDate.add(6, 'day').format('D MMM YYYY')}
        </span>
        <Button variant="outline" size="icon" onClick={nextWeek}>
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-gray-400"
          onClick={() => setWeekStart(dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD'))}
        >
          Today
        </Button>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="border-collapse text-sm min-w-full">
          <thead>
            <tr className="bg-muted/40">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground w-40 sticky left-0 bg-muted/40 z-10 border-r border-border">
                Employee
              </th>
              {days.map((day) => {
                const isWeekend = day.day() === 0 || day.day() === 6
                return (
                  <th
                    key={day.format('YYYY-MM-DD')}
                    className={`text-center px-2 py-2.5 text-xs font-medium w-24 ${
                      isWeekend ? 'text-muted-foreground/40' : 'text-muted-foreground'
                    }`}
                  >
                    <div>{day.format('ddd')}</div>
                    <div className={`text-base font-semibold ${isWeekend ? 'text-muted-foreground/30' : 'text-foreground'}`}>
                      {day.format('D')}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-2 sticky left-0 bg-card z-10 border-r border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary shrink-0">
                      {emp.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground truncate max-w-[100px]">{emp.name}</p>
                      {emp.role && <p className="text-[10px] text-muted-foreground truncate max-w-[100px]">{emp.role}</p>}
                    </div>
                  </div>
                </td>
                {days.map((day) => {
                  const dateStr = day.format('YYYY-MM-DD')
                  const isWeekend = day.day() === 0 || day.day() === 6
                  const shift = getShift(emp.id, dateStr)
                  return (
                    <ShiftCell
                      key={dateStr}
                      shift={shift}
                      isWeekend={isWeekend}
                      onAssign={(start, end, type) =>
                        upsertShift({ employeeId: emp.id, date: dateStr, start, end, type })
                      }
                      onChangeType={(type: ShiftType) => {
                        if (shift) {
                          const updated = { ...shift, type }
                          upsertShift(updated)
                        }
                      }}
                      onRemove={() => {
                        if (shift) removeShift(shift.id)
                      }}
                    />
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-gray-500">
        {[
          { label: 'Shift', colour: 'bg-blue-100' },
          { label: 'Sick', colour: 'bg-red-100' },
          { label: 'Leave', colour: 'bg-amber-100' },
          { label: 'Off', colour: 'bg-gray-100' },
        ].map(({ label, colour }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded ${colour}`} />
            {label}
          </div>
        ))}
        <span className="ml-auto text-gray-300">Click empty cell to add shift. Click shift to edit.</span>
      </div>
    </div>
  )
}
