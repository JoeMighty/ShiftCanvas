import { useState } from 'react'
import dayjs from 'dayjs'
import { useEmployeesStore } from '@/stores/employeesStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { useCustomTypesStore } from '@/stores/customTypesStore'
import { cn } from '@/lib/utils'
import type { ShiftType } from '@/types'

const BUILTIN_CELL_STYLES: Record<string, string> = {
  normal: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-300',
  sick: 'bg-red-50 border-red-200 text-red-600 dark:bg-red-950/50 dark:border-red-800 dark:text-red-300',
  leave: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-300',
  unavailable: 'bg-gray-100 border-gray-200 text-gray-400 dark:bg-muted dark:border-border dark:text-muted-foreground',
}

const BUILTIN_LABELS: Record<string, string> = {
  normal: 'Shift',
  sick: 'Sick',
  leave: 'Leave',
  unavailable: 'Off',
}

interface MobileScheduleViewProps {
  days: dayjs.Dayjs[]
  onCellClick: (employeeId: string, date: string, currentType: ShiftType | undefined) => void
}

export function MobileScheduleView({ days, onCellClick }: MobileScheduleViewProps) {
  const { employees } = useEmployeesStore()
  const { getShift } = useScheduleStore()
  const { types: customTypes } = useCustomTypesStore()
  const todayStr = dayjs().format('YYYY-MM-DD')
  const [expanded, setExpanded] = useState<string | null>(null)

  function getLabel(type: string): string {
    if (type in BUILTIN_LABELS) return BUILTIN_LABELS[type]
    return customTypes.find(t => t.id === type)?.label ?? type
  }

  function getCellStyle(type: string): { className: string; style?: React.CSSProperties } {
    if (type in BUILTIN_CELL_STYLES) return { className: BUILTIN_CELL_STYLES[type] }
    const custom = customTypes.find(t => t.id === type)
    if (custom) {
      return {
        className: 'border',
        style: {
          backgroundColor: custom.colour + '22',
          borderColor: custom.colour + '99',
          color: custom.colour,
        },
      }
    }
    return { className: 'bg-muted border-border text-muted-foreground' }
  }

  if (employees.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      {employees.map(emp => {
        const isExpanded = expanded === emp.id
        const weekShifts = days.map(d => getShift(emp.id, d.format('YYYY-MM-DD'))).filter(Boolean)

        return (
          <div key={emp.id} className="rounded-lg border border-border bg-card overflow-hidden">
            {/* Employee header - tap to expand */}
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/30 transition-colors"
              onClick={() => setExpanded(isExpanded ? null : emp.id)}
              aria-expanded={isExpanded}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                  {emp.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">{emp.name}</p>
                  {emp.role && <p className="text-xs text-muted-foreground">{emp.role}</p>}
                </div>
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">{weekShifts.length}/7</span>
            </button>

            {/* Day grid - shown when expanded */}
            {isExpanded && (
              <div className="border-t border-border px-3 py-3">
                <div className="grid grid-cols-7 gap-1">
                  {days.map(day => {
                    const dateStr = day.format('YYYY-MM-DD')
                    const isToday = dateStr === todayStr
                    const isWeekend = day.day() === 0 || day.day() === 6
                    const shift = getShift(emp.id, dateStr)

                    return (
                      <div key={dateStr} className="flex flex-col items-center gap-1">
                        <span
                          className={cn(
                            'text-[10px] font-medium w-7 h-7 flex items-center justify-center rounded-full',
                            isToday ? 'bg-primary text-primary-foreground' : isWeekend ? 'text-muted-foreground/40' : 'text-muted-foreground'
                          )}
                        >
                          {day.format('dd')[0]}
                        </span>
                        {shift ? (() => {
                          const { className, style } = getCellStyle(shift.type)
                          return (
                            <button
                              className={cn('w-full min-h-[44px] rounded-md border text-[10px] font-medium flex flex-col items-center justify-center gap-0.5 px-0.5', className)}
                              style={style}
                              onClick={() => onCellClick(emp.id, dateStr, shift.type)}
                              aria-label={`${emp.name} ${day.format('ddd D')}: ${getLabel(shift.type)}`}
                            >
                              <span>{getLabel(shift.type)}</span>
                              {shift.type === 'normal' && (
                                <span className="opacity-60 text-[9px]">{shift.start}</span>
                              )}
                            </button>
                          )
                        })() : (
                          <button
                            className={cn(
                              'w-full min-h-[44px] rounded-md border border-dashed border-border text-muted-foreground/30 text-lg flex items-center justify-center',
                              isWeekend && 'bg-muted/20'
                            )}
                            onClick={() => onCellClick(emp.id, dateStr, undefined)}
                            aria-label={`Assign shift for ${emp.name} on ${day.format('ddd D')}`}
                          >
                            +
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
