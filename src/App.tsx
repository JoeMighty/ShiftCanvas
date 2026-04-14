import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { LandingPage } from '@/pages/landing/LandingPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { KeyboardShortcutsModal } from '@/components/KeyboardShortcutsModal'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useEmployeesStore } from '@/stores/employeesStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { useTemplateStore } from '@/stores/templateStore'
import { useBrandingStore } from '@/stores/brandingStore'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { useCustomTypesStore } from '@/stores/customTypesStore'
import { getStoredTheme, applyTheme } from '@/lib/theme'

type Page = 'landing' | 'dashboard'
export type PanelType = 'employees' | 'templates' | 'branding' | 'csv' | 'settings' | null

export default function App() {
  const [page, setPage] = useState<Page>('landing')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getStoredTheme())
  const [panel, setPanel] = useState<PanelType>(null)
  const [showShortcuts, setShowShortcuts] = useState(false)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    useEmployeesStore.getState().hydrate()
    useScheduleStore.getState().hydrate()
    useTemplateStore.getState().hydrate()
    useBrandingStore.getState().hydrate()
    usePreferencesStore.getState().hydrate()
    useCustomTypesStore.getState().hydrate()
  }, [])

  // Show shortcuts modal on first visit to the dashboard
  useEffect(() => {
    if (page === 'dashboard') {
      const prefs = usePreferencesStore.getState().preferences
      if (!prefs.hasSeenWelcome) {
        setShowShortcuts(true)
        usePreferencesStore.getState().updatePreferences({ hasSeenWelcome: true })
      }
    }
  }, [page])

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (page !== 'dashboard') return
    const tag = (e.target as HTMLElement).tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA') return

    // Undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault()
      const undone = useScheduleStore.getState().undo()
      if (undone) toast.success('Undone')
      else toast.info('Nothing to undo')
      return
    }

    if (e.key === 'e') setPanel('employees')
    if (e.key === 't') setPanel('templates')
    if (e.key === 'b') setPanel('branding')
    if (e.key === 'i') setPanel('csv')
    if (e.key === 's') setPanel('settings')
    if (e.key === '?') setShowShortcuts(true)
    if (e.key === 'Escape') { setPanel(null); setShowShortcuts(false) }
    if (e.key === 'd') toggleTheme()
    if (e.key === 'p') {
      e.preventDefault()
      window.print()
    }
  }, [page, toggleTheme])

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
        <DashboardPage
          theme={theme}
          onToggleTheme={toggleTheme}
          panel={panel}
          onPanelChange={setPanel}
        />
      )}
      <KeyboardShortcutsModal
        open={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
      <Toaster richColors position="bottom-right" />
    </TooltipProvider>
  )
}
