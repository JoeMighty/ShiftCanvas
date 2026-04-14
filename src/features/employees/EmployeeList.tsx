import { useState } from 'react'
import { toast } from 'sonner'
import { useEmployeesStore } from '@/stores/employeesStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { nanoid } from '@/lib/utils'
import { Trash2, Plus, Users, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react'
import type { Employee } from '@/types'

export function EmployeeList() {
  const { employees, addEmployee, removeEmployee, updateEmployee, moveEmployee, sortAlphabetically } = useEmployeesStore()
  const { removeShiftsForEmployee } = useScheduleStore()
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState('')

  function handleAdd() {
    const name = newName.trim()
    if (!name) return
    const isDupe = employees.some(e => e.name.toLowerCase() === name.toLowerCase())
    if (isDupe) return
    addEmployee({ id: nanoid(), name, role: newRole.trim() || undefined })
    setNewName('')
    setNewRole('')
  }

  function handleRemove(emp: Employee) {
    if (!window.confirm(`Remove ${emp.name}? This will also delete all their shifts.`)) return
    removeEmployee(emp.id)
    removeShiftsForEmployee(emp.id)
    toast.success(`${emp.name} removed`)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Add employee */}
      <div className="flex gap-2">
        <Input
          placeholder="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1"
        />
        <Input
          placeholder="Role (optional)"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1"
        />
        <Button onClick={handleAdd} size="icon" disabled={!newName.trim()}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* List */}
      {employees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
          <Users className="w-8 h-8" />
          <p className="text-sm">No employees yet. Add one above or import a CSV.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {employees.length} employee{employees.length !== 1 ? 's' : ''}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs gap-1.5 text-muted-foreground h-7"
              onClick={sortAlphabetically}
            >
              <ArrowUpDown className="w-3 h-3" />
              Sort A-Z
            </Button>
          </div>
          <div className="rounded-lg border border-border overflow-hidden">
            {employees.map((emp, i) => (
              <div
                key={emp.id}
                className={`flex items-start justify-between px-3 py-2.5 gap-2 ${
                  i < employees.length - 1 ? 'border-b border-border/50' : ''
                }`}
              >
                {/* Reorder buttons */}
                <div className="flex flex-col gap-0.5 shrink-0 mt-0.5">
                  <button
                    onClick={() => moveEmployee(emp.id, 'up')}
                    disabled={i === 0}
                    className="w-5 h-5 flex items-center justify-center rounded text-muted-foreground/40 hover:text-foreground hover:bg-muted disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    aria-label={`Move ${emp.name} up`}
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => moveEmployee(emp.id, 'down')}
                    disabled={i === employees.length - 1}
                    className="w-5 h-5 flex items-center justify-center rounded text-muted-foreground/40 hover:text-foreground hover:bg-muted disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    aria-label={`Move ${emp.name} down`}
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0 mt-0.5">
                    {emp.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <Input
                      value={emp.name}
                      onChange={(e) => updateEmployee(emp.id, { name: e.target.value })}
                      className="border-none shadow-none p-0 h-auto text-sm font-medium text-foreground focus-visible:ring-0 bg-transparent"
                      aria-label="Employee name"
                    />
                    <Input
                      value={emp.role ?? ''}
                      onChange={(e) => updateEmployee(emp.id, { role: e.target.value || undefined })}
                      className="border-none shadow-none p-0 h-auto text-xs text-muted-foreground focus-visible:ring-0 bg-transparent"
                      placeholder="Role"
                      aria-label="Employee role"
                    />
                    <Input
                      value={emp.notes ?? ''}
                      onChange={(e) => updateEmployee(emp.id, { notes: e.target.value || undefined })}
                      className="border-none shadow-none p-0 h-auto text-xs text-muted-foreground/60 focus-visible:ring-0 bg-transparent italic"
                      placeholder="Notes (optional)"
                      aria-label="Employee notes"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground/40 hover:text-destructive h-7 w-7 shrink-0 mt-0.5"
                  onClick={() => handleRemove(emp)}
                  aria-label={`Remove ${emp.name}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
