import { useState } from 'react'
import type { Shift } from '@/types'
import { cn } from '@/lib/utils'
import { useCustomTypesStore } from '@/stores/customTypesStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Clock, HeartPulse, Palmtree, Ban, X, Pencil, CopyPlus } from 'lucide-react'

const BUILTIN_STYLES: Record<string, string> = {
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

const BUILTIN_ICONS: Record<string, React.ReactNode> = {
  normal: <Clock className="w-3.5 h-3.5 mr-2" />,
  sick: <HeartPulse className="w-3.5 h-3.5 mr-2" />,
  leave: <Palmtree className="w-3.5 h-3.5 mr-2" />,
  unavailable: <Ban className="w-3.5 h-3.5 mr-2" />,
}

interface ShiftCellProps {
  shift: Shift | undefined
  onAssign: (start: string, end: string, type: string) => void
  onChangeType: (type: string) => void
  onRemove: () => void
  onEditTime?: () => void
  onCopyToWeek?: () => void
  isWeekend: boolean
  ariaLabel: string
  onCellMouseDown?: (e: React.MouseEvent<HTMLTableCellElement>) => void
  onCellMouseEnter?: () => void
}

export function ShiftCell({
  shift,
  onAssign,
  onChangeType,
  onRemove,
  onEditTime,
  onCopyToWeek,
  isWeekend,
  ariaLabel,
  onCellMouseDown,
  onCellMouseEnter,
}: ShiftCellProps) {
  const [open, setOpen] = useState(false)
  const { types: customTypes } = useCustomTypesStore()

  function getCellStyle(type: string): { className: string; style?: React.CSSProperties } {
    if (type in BUILTIN_STYLES) return { className: BUILTIN_STYLES[type] }
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

  function getLabel(type: string): string {
    if (type in BUILTIN_LABELS) return BUILTIN_LABELS[type]
    return customTypes.find(t => t.id === type)?.label ?? type
  }

  if (!shift) {
    return (
      <td
        className={cn(
          'h-12 w-24 border border-border cursor-pointer hover:bg-primary/5 transition-colors text-center select-none',
          isWeekend && 'bg-muted/30'
        )}
        onClick={() => onAssign('09:00', '17:00', 'normal')}
        onMouseDown={onCellMouseDown}
        onMouseEnter={onCellMouseEnter}
        tabIndex={0}
        role="button"
        aria-label={ariaLabel}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onAssign('09:00', '17:00', 'normal')
          }
        }}
      />
    )
  }

  const { className: cellClass, style: cellStyle } = getCellStyle(shift.type)

  return (
    <td
      className="h-12 w-24 border border-border p-0.5 select-none"
      onMouseDown={onCellMouseDown}
      onMouseEnter={onCellMouseEnter}
    >
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          aria-label={ariaLabel}
          className={cn(
            'h-full w-full rounded border text-xs font-medium flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1',
            cellClass
          )}
          style={cellStyle}
        >
          <span>{getLabel(shift.type)}</span>
          {shift.type === 'normal' && (
            <span className="ml-1 opacity-60 text-[10px]">
              {shift.start} - {shift.end}
            </span>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {/* Built-in types */}
          {Object.entries(BUILTIN_LABELS).map(([typeId, label]) => (
            <DropdownMenuItem key={typeId} onClick={() => { onChangeType(typeId); setOpen(false) }}>
              {BUILTIN_ICONS[typeId]}
              {label}
            </DropdownMenuItem>
          ))}

          {/* Custom types */}
          {customTypes.length > 0 && (
            <>
              <DropdownMenuSeparator />
              {customTypes.map(ct => (
                <DropdownMenuItem key={ct.id} onClick={() => { onChangeType(ct.id); setOpen(false) }}>
                  <span
                    className="w-3.5 h-3.5 rounded-sm mr-2 shrink-0 border"
                    style={{ backgroundColor: ct.colour + '33', borderColor: ct.colour }}
                  />
                  {ct.label}
                </DropdownMenuItem>
              ))}
            </>
          )}

          <DropdownMenuSeparator />

          {/* Edit time (normal shifts) */}
          {shift.type === 'normal' && onEditTime && (
            <DropdownMenuItem onClick={() => { onEditTime(); setOpen(false) }}>
              <Pencil className="w-3.5 h-3.5 mr-2" />
              Edit time
            </DropdownMenuItem>
          )}

          {/* Copy to week */}
          {onCopyToWeek && (
            <DropdownMenuItem onClick={() => { onCopyToWeek(); setOpen(false) }}>
              <CopyPlus className="w-3.5 h-3.5 mr-2" />
              Copy to week
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => { onRemove(); setOpen(false) }}
            className="text-destructive focus:text-destructive"
          >
            <X className="w-3.5 h-3.5 mr-2" />
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </td>
  )
}
