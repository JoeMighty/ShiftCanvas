import { useState } from 'react'
import type { Shift, ShiftType } from '@/types'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Clock, HeartPulse, Palmtree, Ban, X } from 'lucide-react'

const TYPE_STYLES: Record<ShiftType, string> = {
  normal: 'bg-blue-50 border-blue-200 text-blue-700',
  sick: 'bg-red-50 border-red-200 text-red-600',
  leave: 'bg-amber-50 border-amber-200 text-amber-700',
  unavailable: 'bg-gray-100 border-gray-200 text-gray-400',
}

const TYPE_LABELS: Record<ShiftType, string> = {
  normal: 'Shift',
  sick: 'Sick',
  leave: 'Leave',
  unavailable: 'Off',
}

interface ShiftCellProps {
  shift: Shift | undefined
  onAssign: (start: string, end: string, type: ShiftType) => void
  onChangeType: (type: ShiftType) => void
  onRemove: () => void
  isWeekend: boolean
}

export function ShiftCell({ shift, onAssign, onChangeType, onRemove, isWeekend }: ShiftCellProps) {
  const [open, setOpen] = useState(false)

  function handleEmpty() {
    onAssign('09:00', '17:00', 'normal')
  }

  if (!shift) {
    return (
      <td
        className={cn(
          'h-12 w-24 border border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors text-center',
          isWeekend && 'bg-gray-50'
        )}
        onClick={handleEmpty}
      />
    )
  }

  return (
    <td className="h-12 w-24 border border-gray-100 p-0.5">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          className={cn(
            'h-full w-full rounded border text-xs font-medium flex items-center justify-center cursor-pointer select-none focus:outline-none',
            TYPE_STYLES[shift.type]
          )}
        >
          <span>{TYPE_LABELS[shift.type]}</span>
          {shift.type === 'normal' && (
            <span className="ml-1 opacity-60 text-[10px]">
              {shift.start}-{shift.end}
            </span>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuItem onClick={() => { onChangeType('normal'); setOpen(false) }}>
            <Clock className="w-3.5 h-3.5 mr-2" />
            Normal Shift
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { onChangeType('sick'); setOpen(false) }}>
            <HeartPulse className="w-3.5 h-3.5 mr-2" />
            Sick
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { onChangeType('leave'); setOpen(false) }}>
            <Palmtree className="w-3.5 h-3.5 mr-2" />
            Annual Leave
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { onChangeType('unavailable'); setOpen(false) }}>
            <Ban className="w-3.5 h-3.5 mr-2" />
            Unavailable
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { onRemove(); setOpen(false) }} className="text-red-500">
            <X className="w-3.5 h-3.5 mr-2" />
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </td>
  )
}
