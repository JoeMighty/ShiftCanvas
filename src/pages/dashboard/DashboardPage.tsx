import { useState } from 'react'
import { ScheduleGrid } from '@/features/schedule/ScheduleGrid'
import { EmployeeList } from '@/features/employees/EmployeeList'
import { CSVUpload } from '@/features/employees/CSVUpload'
import { TemplateManager } from '@/features/templates/TemplateManager'
import { BrandingSettings } from '@/features/branding/BrandingSettings'
import { PrintView } from '@/features/schedule/PrintView'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { useBrandingStore } from '@/stores/brandingStore'
import { Users, Layers, Palette, Printer, Upload } from 'lucide-react'

type PanelType = 'employees' | 'templates' | 'branding' | 'csv' | null

export function DashboardPage() {
  const { branding } = useBrandingStore()
  const [panel, setPanel] = useState<PanelType>(null)
  const [printing, setPrinting] = useState(false)

  function handlePrint() {
    setPrinting(true)
    setTimeout(() => {
      window.print()
      setPrinting(false)
    }, 100)
  }

  if (printing) {
    return <PrintView />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {branding.logo && (
            <img src={branding.logo} alt="Logo" className="h-7 object-contain" />
          )}
          <span className="font-semibold text-gray-900 tracking-tight">
            {branding.companyName || 'ShiftCanvas'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2 text-gray-600" onClick={() => setPanel('employees')}>
            <Users className="w-4 h-4" />
            Employees
          </Button>

          <Button variant="ghost" size="sm" className="gap-2 text-gray-600" onClick={() => setPanel('templates')}>
            <Layers className="w-4 h-4" />
            Templates
          </Button>

          <Button variant="ghost" size="sm" className="gap-2 text-gray-600" onClick={() => setPanel('branding')}>
            <Palette className="w-4 h-4" />
            Branding
          </Button>

          <Button variant="outline" size="sm" className="gap-2" onClick={() => setPanel('csv')}>
            <Upload className="w-4 h-4" />
            Import CSV
          </Button>

          <Button size="sm" className="gap-2" onClick={handlePrint}>
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="p-6">
        <ScheduleGrid />
      </main>

      {/* Employees panel */}
      <Sheet open={panel === 'employees'} onOpenChange={(open) => !open && setPanel(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Employees</SheetTitle>
          </SheetHeader>
          <div className="mt-6 flex flex-col gap-6">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Import CSV</p>
              <CSVUpload onDone={() => setPanel(null)} />
            </div>
            <Separator />
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Manage</p>
              <EmployeeList />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Templates panel */}
      <Sheet open={panel === 'templates'} onOpenChange={(open) => !open && setPanel(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Templates</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <TemplateManager />
          </div>
        </SheetContent>
      </Sheet>

      {/* Branding panel */}
      <Sheet open={panel === 'branding'} onOpenChange={(open) => !open && setPanel(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Branding</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <BrandingSettings />
          </div>
        </SheetContent>
      </Sheet>

      {/* CSV quick import panel */}
      <Sheet open={panel === 'csv'} onOpenChange={(open) => !open && setPanel(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Import Employees</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <CSVUpload onDone={() => setPanel(null)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
