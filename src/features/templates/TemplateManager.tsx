import { useState } from 'react'
import { toast } from 'sonner'
import { useTemplateStore } from '@/stores/templateStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Layers, Trash2, Download, Save } from 'lucide-react'

export function TemplateManager() {
  const { templates, saveTemplate, deleteTemplate } = useTemplateStore()
  const { shifts, setShifts } = useScheduleStore()
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')

  function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) return
    if (templates.some(t => t.name === trimmed)) {
      setNameError(`A template named "${trimmed}" already exists.`)
      return
    }
    setNameError('')
    saveTemplate(trimmed, shifts)
    setName('')
    toast.success(`Template "${trimmed}" saved`)
  }

  function handleLoad(templateId: string) {
    const t = templates.find(t => t.id === templateId)
    if (!t) return
    setShifts(t.schedule)
    toast.success(`Template "${t.name}" applied`)
  }

  function handleDelete(templateId: string) {
    const t = templates.find(t => t.id === templateId)
    if (!t) return
    deleteTemplate(templateId)
    toast.success(`Template "${t.name}" deleted`)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Save current */}
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-2">
          <Input
            placeholder="Template name"
            value={name}
            onChange={(e) => { setName(e.target.value); setNameError('') }}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className={nameError ? 'border-destructive focus-visible:ring-destructive/50' : ''}
          />
          <Button onClick={handleSave} disabled={!name.trim()} className="gap-2">
            <Save className="w-4 h-4" />
            Save
          </Button>
        </div>
        {nameError && <p className="text-xs text-destructive">{nameError}</p>}
      </div>

      {/* Saved templates */}
      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
          <Layers className="w-8 h-8" />
          <p className="text-sm">No templates saved yet.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          {templates.map((t, i) => (
            <div
              key={t.id}
              className={`flex items-center justify-between px-4 py-3 ${
                i < templates.length - 1 ? 'border-b border-border/50' : ''
              }`}
            >
              <div>
                <p className="text-sm font-medium text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">
                  {t.schedule.length} shift{t.schedule.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={() => handleLoad(t.id)}
                  aria-label={`Apply template ${t.name}`}
                  title="Apply template"
                >
                  <Download className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground/40 hover:text-destructive"
                  onClick={() => handleDelete(t.id)}
                  aria-label={`Delete template ${t.name}`}
                  title="Delete template"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
