import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { parseEmployeeCSV, type CSVParseResult } from '@/lib/csv'
import { useEmployeesStore } from '@/stores/employeesStore'
import { Upload, CheckCircle, AlertCircle, X } from 'lucide-react'
import type { Employee } from '@/types'

interface CSVUploadProps {
  onDone?: () => void
}

export function CSVUpload({ onDone }: CSVUploadProps) {
  const [result, setResult] = useState<CSVParseResult | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { setEmployees } = useEmployeesStore()

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
          dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
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
        <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 font-medium">Drop a CSV file here or click to browse</p>
        <p className="text-xs text-gray-400 mt-1">Columns: name (required), role (optional)</p>
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
          {result.valid.length > 0 && (
            <div className="rounded-lg border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 flex items-center gap-2 border-b border-gray-100">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  {result.valid.length} employee{result.valid.length !== 1 ? 's' : ''} ready to import
                </span>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {result.valid.map((emp: Employee) => (
                  <div key={emp.id} className="flex items-center justify-between px-4 py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-800">{emp.name}</span>
                    {emp.role && <Badge variant="secondary" className="text-xs">{emp.role}</Badge>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.errors.length > 0 && (
            <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-red-700">Issues found</span>
              </div>
              {result.errors.map((err, i) => (
                <p key={i} className="text-xs text-red-600">{err}</p>
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
