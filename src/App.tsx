import { useEffect, useState, useCallback } from 'react'
import { LandingPage } from '@/pages/landing/LandingPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useEmployeesStore } from '@/stores/employeesStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { useTemplateStore } from '@/stores/templateStore'
import { useBrandingStore } from '@/stores/brandingStore'
import { getStoredTheme, applyTheme } from '@/lib/theme'

type Page = 'landing' | 'dashboard'
export type PanelType = 'employees' | 'templates' | 'branding' | 'csv' | null

export default function App() {
  const [page, setPage] = useState<Page>('landing')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getStoredTheme())
  const [panel, setPanel] = useState<PanelType>(null)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    useEmployeesStore.getState().hydrate()
    useScheduleStore.getState().hydrate()
    useTemplateStore.getState().hydrate()
    useBrandingStore.getState().hydrate()
  }, [])

  function toggleTheme() {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (page !== 'dashboard') return
    // Ignore shortcuts when typing in an input
    const tag = (e.target as HTMLElement).tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA') return

    if (e.key === 'e') setPanel('employees')
    if (e.key === 't') setPanel('templates')
    if (e.key === 'b') setPanel('branding')
    if (e.key === 'i') setPanel('csv')
    if (e.key === 'Escape') setPanel(null)
    if (e.key === 'd') toggleTheme()
    if (e.key === 'p') {
      e.preventDefault()
      window.print()
    }
  }, [page])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <TooltipProvider>
      {page === 'landing' ? (
        <LandingPage
          onGetStarted={() => setPage('dashboard')}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      ) : (
        <DashboardPage theme={theme} onToggleTheme={toggleTheme} panel={panel} onPanelChange={setPanel} />
      )}
      <Toaster richColors position="bottom-right" />
    </TooltipProvider>
  )
}
