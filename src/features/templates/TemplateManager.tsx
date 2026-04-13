import { useState } from 'react'
import { useTemplateStore } from '@/stores/templateStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Layers, Trash2, Download, Save } from 'lucide-react'

export function TemplateManager() {
  const { templates, saveTemplate, deleteTemplate } = useTemplateStore()
  const { shifts, setShifts } = useScheduleStore()
  const [name, setName] = useState('')

  function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) return
    saveTemplate(trimmed, shifts)
    setName('')
  }

  function handleLoad(templateId: string) {
    const t = templates.find((t) => t.id === templateId)
    if (t) setShifts(t.schedule)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Save current */}
      <div className="flex gap-2">
        <Input
          placeholder="Template name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          className="flex-1"
        />
        <Button onClick={handleSave} disabled={!name.trim()} className="gap-2">
          <Save className="w-4 h-4" />
          Save
        </Button>
      </div>

      {/* Saved templates */}
      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
          <Layers className="w-8 h-8" />
          <p className="text-sm">No templates saved yet.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-100 overflow-hidden">
          {templates.map((t, i) => (
            <div
              key={t.id}
              className={`flex items-center justify-between px-4 py-3 ${
                i < templates.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{t.name}</p>
                <p className="text-xs text-gray-400">{t.schedule.length} shift{t.schedule.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-400 hover:text-blue-600"
                  onClick={() => handleLoad(t.id)}
                  title="Apply template"
                >
                  <Download className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-300 hover:text-red-500"
                  onClick={() => deleteTemplate(t.id)}
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
