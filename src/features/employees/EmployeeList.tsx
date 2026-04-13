import { useState } from 'react'
import { useEmployeesStore } from '@/stores/employeesStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { nanoid } from '@/lib/utils'
import { Trash2, Plus, Users } from 'lucide-react'
import type { Employee } from '@/types'

export function EmployeeList() {
  const { employees, addEmployee, removeEmployee, updateEmployee } = useEmployeesStore()
  const { removeShiftsForEmployee } = useScheduleStore()
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState('')

  function handleAdd() {
    const name = newName.trim()
    if (!name) return
    const isDupe = employees.some(
      (e) => e.name.toLowerCase() === name.toLowerCase()
    )
    if (isDupe) return
    addEmployee({ id: nanoid(), name, role: newRole.trim() || undefined })
    setNewName('')
    setNewRole('')
  }

  function handleRemove(emp: Employee) {
    removeEmployee(emp.id)
    removeShiftsForEmployee(emp.id)
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
        <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
          <Users className="w-8 h-8" />
          <p className="text-sm">No employees yet. Add one above or import a CSV.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-100 overflow-hidden">
          {employees.map((emp, i) => (
            <div
              key={emp.id}
              className={`flex items-center justify-between px-4 py-2.5 ${
                i < employees.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-xs font-medium text-blue-600">
                  {emp.name.charAt(0).toUpperCase()}
                </div>
                <Input
                  value={emp.name}
                  onChange={(e) => updateEmployee(emp.id, { name: e.target.value })}
                  className="border-none shadow-none p-0 h-auto text-sm font-medium text-gray-800 focus-visible:ring-0 bg-transparent w-36"
                />
                {emp.role && (
                  <Input
                    value={emp.role}
                    onChange={(e) => updateEmployee(emp.id, { role: e.target.value || undefined })}
                    className="border-none shadow-none p-0 h-auto text-xs text-gray-400 focus-visible:ring-0 bg-transparent w-28"
                    placeholder="Role"
                  />
                )}
                {!emp.role && (
                  <Badge variant="outline" className="text-xs text-gray-300 border-dashed cursor-default">
                    no role
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-red-500 h-7 w-7"
                onClick={() => handleRemove(emp)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {employees.length > 0 && (
        <p className="text-xs text-gray-400 text-right">{employees.length} employee{employees.length !== 1 ? 's' : ''}</p>
      )}
    </div>
  )
}
