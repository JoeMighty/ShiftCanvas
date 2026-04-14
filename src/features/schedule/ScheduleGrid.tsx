import { useState, useRef, useEffect, useCallback } from 'react'
import dayjs from 'dayjs'
import { toast } from 'sonner'
import { useEmployeesStore } from '@/stores/employeesStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { useCustomTypesStore } from '@/stores/customTypesStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { ShiftCell } from './ShiftCell'
import { MobileScheduleView } from './MobileScheduleView'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { exportScheduleCSV } from '@/lib/export'
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  Download,
  CalendarDays,
  Upload,
  AlertTriangle,
} from 'lucide-react'
import type { ShiftType } from '@/types'

interface TimeDialog {
  employeeId: string
  date: string
  start: string
  end: string
  empName: string
  dayLabel: string
  applyToWeek: boolean
}

function calcShiftHours(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  const mins = eh * 60 + em - sh * 60 - sm
  return mins > 0 ? Math.round((mins / 60) * 10) / 10 : 0
}

function isTimeConflict(start: string, end: string): boolean {
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  return eh * 60 + em <= sh * 60 + sm
}

const LEGEND_ITEMS = [
  { label: 'Shift', light: 'bg-blue-100', dark: 'dark:bg-blue-900/40' },
  { label: 'Sick', light: 'bg-red-100', dark: 'dark:bg-red-900/40' },
  { label: 'Leave', light: 'bg-amber-100', dark: 'dark:bg-amber-900/40' },
  { label: 'Off', light: 'bg-gray-100', dark: 'dark:bg-muted' },
]

export function ScheduleGrid({ onOpenEmployees }: { onOpenEmployees?: () => void }) {
  const { employees } = useEmployeesStore()
  const { weekStart, setWeekStart, upsertShift, removeShift, getShift, clearShiftsForDates } = useScheduleStore()
  const { types: customTypes } = useCustomTypesStore()
  const { preferences } = usePreferencesStore()
  const { weekStartDay } = preferences

  const [timeDialog, setTimeDialog] = useState<TimeDialog | null>(null)
  const [dialogStart, setDialogStart] = useState('09:00')
  const [dialogEnd, setDialogEnd] = useState('17:00')

  const isPainting = useRef(false)
  const paintData = useRef<{ start: string; end: string; type: string } | null>(null)

  const todayStr = dayjs().format('YYYY-MM-DD')

  function getWeekStart(date: dayjs.Dayjs): dayjs.Dayjs {
    if (weekStartDay === 1) {
      const dow = date.day()
      return date.subtract(dow === 0 ? 6 : dow - 1, 'day')
    }
    return date.startOf('week')
  }

  const startDate = dayjs(weekStart || getWeekStart(dayjs()).format('YYYY-MM-DD'))
  const days = Array.from({ length: 7 }, (_, i) => startDate.add(i, 'day'))

  // Sync weekStart when weekStartDay preference changes and weekStart is unset
  useEffect(() => {
    if (!weekStart) {
      setWeekStart(getWeekStart(dayjs()).format('YYYY-MM-DD'))
    }
  }, [weekStartDay]) // eslint-disable-line react-hooks/exhaustive-deps

  // Stop painting on mouseup anywhere
  useEffect(() => {
    const stop = () => { isPainting.current = false; paintData.current = null }
    window.addEventListener('mouseup', stop)
    return () => window.removeEventListener('mouseup', stop)
  }, [])

  function getTypeLabel(type: string): string {
    const custom = customTypes.find(t => t.id === type)
    if (custom) return custom.label
    const labels: Record<string, string> = { normal: 'Shift', sick: 'Sick', leave: 'Leave', unavailable: 'Off' }
    return labels[type] ?? type
  }

  function prevWeek() { setWeekStart(startDate.subtract(7, 'day').format('YYYY-MM-DD')) }
  function nextWeek() { setWeekStart(startDate.add(7, 'day').format('YYYY-MM-DD')) }
  function goToday() { setWeekStart(getWeekStart(dayjs()).format('YYYY-MM-DD')) }

  function handleClearWeek() {
    if (!window.confirm('Clear all shifts for this week?')) return
    clearShiftsForDates(days.map(d => d.format('YYYY-MM-DD')))
    toast.success('Week cleared')
  }

  function handleExportCSV() {
    exportScheduleCSV(employees, days, getShift, getTypeLabel)
    toast.success('Schedule exported as CSV')
  }

  function openTimeDialog(
    employeeId: string,
    date: string,
    empName: string,
    dayLabel: string,
    start: string,
    end: string,
    applyToWeek = false,
  ) {
    setDialogStart(start)
    setDialogEnd(end)
    setTimeDialog({ employeeId, date, start, end, empName, dayLabel, applyToWeek })
  }

  function handleSaveTime(fillWeek = false) {
    if (!timeDialog) return
    const dates = fillWeek ? days.map(d => d.format('YYYY-MM-DD')) : [timeDialog.date]
    dates.forEach(date => {
      upsertShift({
        employeeId: timeDialog.employeeId,
        date,
        start: dialogStart,
        end: dialogEnd,
        type: 'normal',
      })
    })
    setTimeDialog(null)
    if (fillWeek) toast.success('Shift applied to whole week')
  }

  // Paint start handler
  const handlePaintStart = useCallback((employeeId: string, dateStr: string, e: React.MouseEvent<HTMLTableCellElement>) => {
    e.preventDefault()
    isPainting.current = true
    const existing = getShift(employeeId, dateStr)
    paintData.current = existing
      ? { start: existing.start, end: existing.end, type: existing.type }
      : { start: '09:00', end: '17:00', type: 'normal' }
    upsertShift({ employeeId, date: dateStr, ...paintData.current })
  }, [getShift, upsertShift])

  const handlePaintEnter = useCallback((employeeId: string, dateStr: string) => {
    if (!isPainting.current || !paintData.current) return
    upsertShift({ employeeId, date: dateStr, ...paintData.current })
  }, [upsertShift])

  // Onboarding empty state
  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center gap-6">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <CalendarDays className="w-7 h-7 text-primary" />
        </div>
        <div className="flex flex-col gap-2 max-w-xs">
          <h2 className="text-lg font-semibold text-foreground">Build your first schedule</h2>
          <p className="text-sm text-muted-foreground">Get started in three steps</p>
        </div>
        <div className="grid grid-cols-3 gap-4 max-w-sm w-full text-left">
          {[
            { step: '1', title: 'Add employees', desc: 'Import a CSV or add names manually' },
            { step: '2', title: 'Assign shifts', desc: 'Click any cell to set a shift' },
            { step: '3', title: 'Print or export', desc: 'Download a clean PDF or CSV' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4">
              <span className="text-xs font-semibold text-primary">Step {step}</span>
              <p className="text-sm font-medium text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
        <Button onClick={onOpenEmployees} className="gap-2">
          <Upload className="w-4 h-4" />
          Add employees
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="outline" size="icon" onClick={prevWeek} aria-label="Previous week">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium text-foreground min-w-[200px] text-center">
          {startDate.format('D MMM')} - {startDate.add(6, 'day').format('D MMM YYYY')}
        </span>
        <Button variant="outline" size="icon" onClick={nextWeek} aria-label="Next week">
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" className="text-xs" onClick={goToday}>
          Today
        </Button>
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-xs gap-1.5" onClick={handleExportCSV}>
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-destructive gap-1.5"
            onClick={handleClearWeek}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear week</span>
          </Button>
        </div>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-border bg-card">
        <table className="border-collapse text-sm min-w-full">
          <thead>
            <tr className="bg-muted/40">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground w-40 sticky left-0 bg-muted/40 z-10 border-r border-border">
                Employee
              </th>
              {days.map(day => {
                const isWeekend = day.day() === 0 || day.day() === 6
                const isToday = day.format('YYYY-MM-DD') === todayStr
                return (
                  <th
                    key={day.format('YYYY-MM-DD')}
                    className={`text-center px-2 py-2.5 text-xs font-medium w-24 ${
                      isWeekend ? 'text-muted-foreground/40' : 'text-muted-foreground'
                    }`}
                  >
                    <div>{day.format('ddd')}</div>
                    <div
                      className={`text-base font-semibold mx-auto w-7 h-7 flex items-center justify-center rounded-full ${
                        isToday
                          ? 'bg-primary text-primary-foreground'
                          : isWeekend
                          ? 'text-muted-foreground/30'
                          : 'text-foreground'
                      }`}
                    >
                      {day.format('D')}
                    </div>
                  </th>
                )
              })}
              <th className="text-center px-2 py-2.5 text-xs font-medium text-muted-foreground w-20 border-l border-border">
                Summary
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => {
              const weekShifts = days.map(d => getShift(emp.id, d.format('YYYY-MM-DD'))).filter((s): s is NonNullable<typeof s> => !!s)
              const totalHours = weekShifts
                .filter(s => s.type === 'normal' || !['sick', 'leave', 'unavailable'].includes(s.type))
                .reduce((acc, s) => acc + calcShiftHours(s.start, s.end), 0)
              const hasConflict = weekShifts.some(s => s.type === 'normal' && isTimeConflict(s.start, s.end))
              const isOverHours = totalHours > 40

              return (
                <tr key={emp.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-3 py-2 sticky left-0 bg-card z-10 border-r border-border">
                    <div className="flex items-center gap-2 group">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary shrink-0">
                        {emp.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate max-w-[90px]" title={emp.notes || undefined}>
                          {emp.name}
                        </p>
                        {emp.role && (
                          <p className="text-[10px] text-muted-foreground truncate max-w-[90px]">{emp.role}</p>
                        )}
                      </div>
                      <button
                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 rounded hover:bg-muted text-muted-foreground"
                        title="Fill week"
                        onClick={() => openTimeDialog(emp.id, days[0].format('YYYY-MM-DD'), emp.name, 'all week', '09:00', '17:00', true)}
                        tabIndex={-1}
                      >
                        <CalendarDays className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  {days.map(day => {
                    const dateStr = day.format('YYYY-MM-DD')
                    const isWeekend = day.day() === 0 || day.day() === 6
                    const shift = getShift(emp.id, dateStr)
                    const dayLabel = day.format('ddd D MMM')
                    const shiftLabel = shift
                      ? `${emp.name} on ${dayLabel}: ${getTypeLabel(shift.type)}${shift.type === 'normal' ? ` ${shift.start} - ${shift.end}` : ''}`
                      : `Assign shift for ${emp.name} on ${dayLabel}`
                    return (
                      <ShiftCell
                        key={dateStr}
                        shift={shift}
                        isWeekend={isWeekend}
                        ariaLabel={shiftLabel}
                        onAssign={(start, end, type) =>
                          upsertShift({ employeeId: emp.id, date: dateStr, start, end, type })
                        }
                        onChangeType={(type: ShiftType) => {
                          if (shift) upsertShift({ ...shift, type })
                        }}
                        onRemove={() => { if (shift) removeShift(shift.id) }}
                        onEditTime={
                          shift?.type === 'normal'
                            ? () => openTimeDialog(emp.id, dateStr, emp.name, dayLabel, shift.start, shift.end)
                            : undefined
                        }
                        onCopyToWeek={() => {
                          if (!shift) return
                          days.forEach(d => {
                            upsertShift({ employeeId: emp.id, date: d.format('YYYY-MM-DD'), start: shift.start, end: shift.end, type: shift.type })
                          })
                          toast.success(`Shift copied to all week for ${emp.name}`)
                        }}
                        onCellMouseDown={(e) => handlePaintStart(emp.id, dateStr, e)}
                        onCellMouseEnter={() => handlePaintEnter(emp.id, dateStr)}
                      />
                    )
                  })}
                  {/* Summary column */}
                  <td className="px-2 py-2 border-l border-border text-center">
                    {weekShifts.length > 0 ? (
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-[10px] font-medium text-foreground">{weekShifts.length}d</span>
                        {totalHours > 0 && (
                          <span className={`text-[10px] ${isOverHours ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-muted-foreground'}`}>
                            {totalHours}h
                          </span>
                        )}
                        {(hasConflict || isOverHours) && (
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertTriangle className="w-3 h-3 text-amber-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              {hasConflict ? 'Invalid shift time' : 'Over 40h this week'}
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted-foreground/30">-</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="block md:hidden">
        <MobileScheduleView
          days={days}
          onCellClick={(employeeId, dateStr, currentType) => {
            if (!currentType) {
              upsertShift({ employeeId, date: dateStr, start: '09:00', end: '17:00', type: 'normal' })
            } else {
              const shift = getShift(employeeId, dateStr)
              if (shift) removeShift(shift.id)
            }
          }}
        />
      </div>

      {/* Legend (desktop only) */}
      <div className="hidden md:flex gap-4 text-xs text-muted-foreground flex-wrap">
        {LEGEND_ITEMS.map(({ label, light, dark }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded ${light} ${dark}`} />
            {label}
          </div>
        ))}
        {customTypes.map(ct => (
          <div key={ct.id} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded border" style={{ backgroundColor: ct.colour + '33', borderColor: ct.colour }} />
            {ct.label}
          </div>
        ))}
        <span className="ml-auto text-muted-foreground/40 hidden lg:block">
          Click to add. Click shift to edit. Drag to paint.
        </span>
      </div>

      {/* Time edit dialog */}
      <Dialog open={timeDialog !== null} onOpenChange={(open: boolean) => { if (!open) setTimeDialog(null) }}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>
              {timeDialog?.applyToWeek ? 'Fill whole week' : 'Edit shift time'}
            </DialogTitle>
          </DialogHeader>
          {timeDialog && (
            <p className="text-sm text-muted-foreground">
              {timeDialog.empName} &middot; {timeDialog.dayLabel}
            </p>
          )}
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="shift-start">Start</Label>
              <input
                id="shift-start"
                type="time"
                value={dialogStart}
                onChange={(e) => setDialogStart(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="shift-end">End</Label>
              <input
                id="shift-end"
                type="time"
                value={dialogEnd}
                onChange={(e) => setDialogEnd(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              />
            </div>
          </div>
          {dialogEnd && dialogStart && isTimeConflict(dialogStart, dialogEnd) && (
            <p className="text-xs text-destructive flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              End time must be after start time
            </p>
          )}
          <DialogFooter>
            {timeDialog?.applyToWeek ? (
              <Button
                onClick={() => handleSaveTime(true)}
                disabled={!dialogStart || !dialogEnd || isTimeConflict(dialogStart, dialogEnd)}
              >
                Fill week
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleSaveTime(true)}
                  disabled={!dialogStart || !dialogEnd || isTimeConflict(dialogStart, dialogEnd)}
                >
                  Fill week
                </Button>
                <Button
                  onClick={() => handleSaveTime(false)}
                  disabled={!dialogStart || !dialogEnd || isTimeConflict(dialogStart, dialogEnd)}
                >
                  Save
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
