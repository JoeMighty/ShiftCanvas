import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { useCustomTypesStore } from '@/stores/customTypesStore'
import { useEmployeesStore } from '@/stores/employeesStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { useTemplateStore } from '@/stores/templateStore'
import { useBrandingStore } from '@/stores/brandingStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { exportDataJSON } from '@/lib/export'
import { exportAllData, importAllData, clearAllData } from '@/lib/storage'
import { Trash2, Plus, Download, Upload } from 'lucide-react'

export function SettingsPanel() {
  const { preferences, updatePreferences } = usePreferencesStore()
  const { types, addType, removeType } = useCustomTypesStore()
  const importRef = useRef<HTMLInputElement>(null)

  const [newTypeLabel, setNewTypeLabel] = useState('')
  const [newTypeColour, setNewTypeColour] = useState('#6366f1')

  function handleAddType() {
    const label = newTypeLabel.trim()
    if (!label) return
    addType(label, newTypeColour)
    setNewTypeLabel('')
    setNewTypeColour('#6366f1')
  }

  function handleExport() {
    const data = exportAllData()
    exportDataJSON(data)
    toast.success('Backup downloaded')
  }

  function handleImportFile(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as Record<string, unknown>
        importAllData(data)
        // Re-hydrate all stores
        useEmployeesStore.getState().hydrate()
        useScheduleStore.getState().hydrate()
        useTemplateStore.getState().hydrate()
        useBrandingStore.getState().hydrate()
        usePreferencesStore.getState().hydrate()
        useCustomTypesStore.getState().hydrate()
        toast.success('Data restored from backup')
      } catch {
        toast.error('Invalid backup file')
      }
    }
    reader.readAsText(file)
  }

  function handleClearAll() {
    if (!window.confirm('Clear all data? This cannot be undone.')) return
    clearAllData()
    useEmployeesStore.getState().setEmployees([])
    useScheduleStore.getState().setShifts([])
    useTemplateStore.getState().hydrate()
    useBrandingStore.getState().hydrate()
    usePreferencesStore.getState().hydrate()
    useCustomTypesStore.getState().hydrate()
    toast.success('All data cleared')
  }

  return (
    <div className="flex flex-col gap-6 px-6 pb-6">

      {/* Week start */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Week starts on</p>
        <div className="flex gap-2">
          {([{ label: 'Monday', value: 1 }, { label: 'Sunday', value: 0 }] as const).map(({ label, value }) => (
            <button
              key={value}
              onClick={() => updatePreferences({ weekStartDay: value })}
              className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                preferences.weekStartDay === value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-foreground hover:bg-muted'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Custom shift types */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Custom shift types</p>

        {types.length > 0 && (
          <div className="rounded-lg border border-border overflow-hidden">
            {types.map((t, i) => (
              <div
                key={t.id}
                className={`flex items-center justify-between px-3 py-2 ${
                  i < types.length - 1 ? 'border-b border-border/50' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-sm border shrink-0"
                    style={{ backgroundColor: t.colour + '33', borderColor: t.colour }}
                  />
                  <span className="text-sm text-foreground">{t.label}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground/40 hover:text-destructive"
                  onClick={() => removeType(t.id)}
                  aria-label={`Remove ${t.label}`}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="color"
            value={newTypeColour}
            onChange={(e) => setNewTypeColour(e.target.value)}
            className="w-10 h-9 rounded border border-border cursor-pointer p-1 shrink-0"
            aria-label="Shift type colour"
          />
          <Input
            placeholder="Label (e.g. Evening)"
            value={newTypeLabel}
            onChange={(e) => setNewTypeLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddType()}
            className="flex-1"
          />
          <Button size="icon" onClick={handleAddType} disabled={!newTypeLabel.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Custom types appear in every shift cell's dropdown alongside the built-in types.
        </p>
      </div>

      <Separator />

      {/* Data management */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Data</p>
        <div className="flex flex-col gap-2">
          <Button variant="outline" className="justify-start gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export backup (JSON)
          </Button>
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => importRef.current?.click()}
          >
            <Upload className="w-4 h-4" />
            Restore from backup
          </Button>
          <input
            ref={importRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImportFile(file)
              e.target.value = ''
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          All data is stored in your browser's localStorage. Export regularly to avoid losing your schedules.
        </p>
        <Button
          variant="ghost"
          className="justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleClearAll}
        >
          <Trash2 className="w-4 h-4" />
          Clear all data
        </Button>
      </div>

      {/* Label */}
      <div className="mt-2">
        <Label className="text-xs text-muted-foreground/60 font-normal">
          All data stays in your browser. Nothing is sent to any server.
        </Label>
      </div>
    </div>
  )
}
