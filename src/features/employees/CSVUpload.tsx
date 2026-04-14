import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { parseEmployeeCSV, type CSVParseResult } from '@/lib/csv'
import { useEmployeesStore } from '@/stores/employeesStore'
import { Upload, CheckCircle, AlertCircle, X, AlertTriangle } from 'lucide-react'
import type { Employee } from '@/types'

interface CSVUploadProps {
  onDone?: () => void
}

export function CSVUpload({ onDone }: CSVUploadProps) {
  const [result, setResult] = useState<CSVParseResult | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { employees, setEmployees } = useEmployeesStore()

  async function handleFile(file: File) {
    if (!file.name.endsWith('.csv')) {
      setResult({ valid: [], errors: ['Only .csv files are supported.'] })
      return
    }
    const parsed = await parseEmployeeCSV(file)
    setResult(parsed)
  }

  function handleImport() {
    if (!result || result.valid.length === 0) return
    setEmployees(result.valid)
    setResult(null)
    onDone?.()
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/40'
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          const file = e.dataTransfer.files[0]
          if (file) handleFile(file)
        }}
      >
        <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-foreground font-medium">Drop a CSV file here or click to browse</p>
        <p className="text-xs text-muted-foreground mt-1">Columns: name (required), role (optional)</p>
        <a
          href="sample-employees.csv"
          download
          onClick={e => e.stopPropagation()}
          className="text-xs text-primary hover:underline mt-2 inline-block"
        >
          Download sample CSV
        </a>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />
      </div>

      {/* Preview */}
      {result && (
        <div className="flex flex-col gap-3">
          {/* Existing employees warning */}
          {employees.length > 0 && result.valid.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 px-4 py-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-300">
                This will replace {employees.length} existing employee{employees.length !== 1 ? 's' : ''}.
              </p>
            </div>
          )}

          {result.valid.length > 0 && (
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="bg-muted/50 px-4 py-2 flex items-center gap-2 border-b border-border">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-foreground">
                  {result.valid.length} employee{result.valid.length !== 1 ? 's' : ''} ready to import
                </span>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {result.valid.map((emp: Employee) => (
                  <div key={emp.id} className="flex items-center justify-between px-4 py-2 border-b border-border/50 last:border-0">
                    <span className="text-sm text-foreground">{emp.name}</span>
                    {emp.role && <Badge variant="secondary" className="text-xs">{emp.role}</Badge>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.errors.length > 0 && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">Issues found</span>
              </div>
              {result.errors.map((err, i) => (
                <p key={i} className="text-xs text-destructive/80">{err}</p>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              onClick={handleImport}
              disabled={result.valid.length === 0}
              className="flex-1"
            >
              Import {result.valid.length > 0 ? `${result.valid.length} Employees` : ''}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setResult(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
