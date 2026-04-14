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
  const [newTypeStart, setNewTypeStart] = useState('')
  const [newTypeEnd, setNewTypeEnd] = useState('')
  const [thresholdInput, setThresholdInput] = useState(String(preferences.hoursThreshold ?? 40))

  function handleAddType() {
    const label = newTypeLabel.trim()
    if (!label) return
    addType(label, newTypeColour, newTypeStart || undefined, newTypeEnd || undefined)
    setNewTypeLabel('')
    setNewTypeColour('#6366f1')
    setNewTypeStart('')
    setNewTypeEnd('')
  }

  async function handleExport() {
    const data = await exportAllData()
    exportDataJSON(data)
    toast.success('Backup downloaded')
  }

  function handleImportFile(file: File) {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as Record<string, unknown>
        await importAllData(data)
        await Promise.all([
          useEmployeesStore.getState().hydrate(),
          useScheduleStore.getState().hydrate(),
          useTemplateStore.getState().hydrate(),
          useBrandingStore.getState().hydrate(),
          usePreferencesStore.getState().hydrate(),
          useCustomTypesStore.getState().hydrate(),
        ])
        toast.success('Data restored from backup')
      } catch {
        toast.error('Invalid backup file')
      }
    }
    reader.readAsText(file)
  }

  async function handleClearAll() {
    if (!window.confirm('Clear all data? This cannot be undone.')) return
    await clearAllData()
    useEmployeesStore.getState().setEmployees([])
    useScheduleStore.getState().setShifts([])
    await Promise.all([
      useTemplateStore.getState().hydrate(),
      useBrandingStore.getState().hydrate(),
      usePreferencesStore.getState().hydrate(),
      useCustomTypesStore.getState().hydrate(),
    ])
    toast.success('All data cleared')
  }

  function handleThresholdBlur() {
    const val = parseInt(thresholdInput, 10)
    if (!isNaN(val) && val > 0) {
      updatePreferences({ hoursThreshold: val })
    } else {
      setThresholdInput(String(preferences.hoursThreshold ?? 40))
    }
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

      {/* Hours threshold */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Weekly hours warning</p>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            min="1"
            max="168"
            value={thresholdInput}
            onChange={(e) => setThresholdInput(e.target.value)}
            onBlur={handleThresholdBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleThresholdBlur()}
            className="w-24"
          />
          <Label className="text-sm text-muted-foreground">hours/week</Label>
        </div>
        <p className="text-xs text-muted-foreground">
          Employees exceeding this threshold are highlighted in the schedule summary.
        </p>
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
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-4 h-4 rounded-sm border shrink-0"
                    style={{ backgroundColor: t.colour + '33', borderColor: t.colour }}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm text-foreground">{t.label}</span>
                    {t.start && t.end && (
                      <span className="text-[10px] text-muted-foreground">{t.start} - {t.end}</span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground/40 hover:text-destructive shrink-0"
                  onClick={() => removeType(t.id)}
                  aria-label={`Remove ${t.label}`}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2">
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
          <div className="flex gap-2 items-center">
            <input
              type="time"
              value={newTypeStart}
              onChange={(e) => setNewTypeStart(e.target.value)}
              className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              aria-label="Default start time"
            />
            <span className="text-xs text-muted-foreground shrink-0">to</span>
            <input
              type="time"
              value={newTypeEnd}
              onChange={(e) => setNewTypeEnd(e.target.value)}
              className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              aria-label="Default end time"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Times are optional. When set, they auto-fill when you apply this type to a shift.
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
          All data is stored locally in your browser. Export regularly to avoid losing your schedules.
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

      <div className="mt-2">
        <Label className="text-xs text-muted-foreground/60 font-normal">
          All data stays in your browser. Nothing is sent to any server.
        </Label>
      </div>
    </div>
  )
}
