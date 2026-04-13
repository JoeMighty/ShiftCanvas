import Papa from 'papaparse'
import type { Employee } from '@/types'
import { nanoid } from '@/lib/utils'

interface RawRow {
  [key: string]: string
}

export interface CSVParseResult {
  valid: Employee[]
  errors: string[]
}

export function parseEmployeeCSV(file: File): Promise<CSVParseResult> {
  return new Promise((resolve) => {
    Papa.parse<RawRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const valid: Employee[] = []
        const errors: string[] = []
        const seen = new Set<string>()

        results.data.forEach((row, i) => {
          const lineNum = i + 2
          const name = (row['name'] ?? row['Name'] ?? '').trim()
          const role = (row['role'] ?? row['Role'] ?? '').trim()

          if (!name) {
            errors.push(`Row ${lineNum}: missing name`)
            return
          }

          const lower = name.toLowerCase()
          if (seen.has(lower)) {
            errors.push(`Row ${lineNum}: duplicate name "${name}" skipped`)
            return
          }

          seen.add(lower)
          valid.push({ id: nanoid(), name, role: role || undefined })
        })

        if (results.errors.length > 0) {
          results.errors.forEach((e) =>
            errors.push(`Parse error at row ${e.row ?? '?'}: ${e.message}`)
          )
        }

        resolve({ valid, errors })
      },
      error(err) {
        resolve({ valid: [], errors: [err.message] })
      },
    })
  })
}
