import { useEffect, useState } from 'react'
import { LandingPage } from '@/pages/landing/LandingPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useEmployeesStore } from '@/stores/employeesStore'
import { useScheduleStore } from '@/stores/scheduleStore'
import { useTemplateStore } from '@/stores/templateStore'
import { useBrandingStore } from '@/stores/brandingStore'

type Page = 'landing' | 'dashboard'

export default function App() {
  const [page, setPage] = useState<Page>('landing')

  useEffect(() => {
    useEmployeesStore.getState().hydrate()
    useScheduleStore.getState().hydrate()
    useTemplateStore.getState().hydrate()
    useBrandingStore.getState().hydrate()
  }, [])

  return (
    <TooltipProvider>
      {page === 'landing' ? (
        <LandingPage onGetStarted={() => setPage('dashboard')} />
      ) : (
        <DashboardPage />
      )}
      <Toaster richColors position="bottom-right" />
    </TooltipProvider>
  )
}
