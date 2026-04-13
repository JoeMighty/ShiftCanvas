import { Button } from '@/components/ui/button'
import { CalendarDays, Users, FileDown, Layers } from 'lucide-react'

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <header className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-lg tracking-tight text-gray-900">ShiftCanvas</span>
        <Button onClick={onGetStarted} size="sm">
          Open App
        </Button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6 py-24">
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm text-gray-500">
          Free. No account needed.
        </div>

        <h1 className="text-5xl font-semibold tracking-tight text-gray-900 max-w-2xl leading-tight">
          Employee scheduling,<br />made simple.
        </h1>

        <p className="text-lg text-gray-500 max-w-xl">
          Build shift schedules in seconds. Upload your team via CSV, assign shifts, track time off and export a clean printout. Everything runs in your browser.
        </p>

        <div className="flex gap-3 flex-wrap justify-center">
          <Button size="lg" onClick={onGetStarted} className="gap-2">
            <CalendarDays className="w-4 h-4" />
            Get Started
          </Button>
        </div>
      </main>

      {/* Features */}
      <section className="border-t border-gray-100 px-6 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Users, title: 'CSV Import', desc: 'Upload your team in one go with validation and preview.' },
            { icon: CalendarDays, title: 'Schedule Grid', desc: 'Click to assign shifts. Visual, fast and intuitive.' },
            { icon: Layers, title: 'Templates', desc: 'Save schedules and reapply them week after week.' },
            { icon: FileDown, title: 'Print & Export', desc: 'One-click clean printout with your logo and branding.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col gap-2">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <Icon className="w-4 h-4 text-blue-600" />
              </div>
              <p className="font-medium text-sm text-gray-900">{title}</p>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-100 px-6 py-4 text-center text-xs text-gray-400">
        ShiftCanvas runs entirely in your browser. No data is sent to any server.
      </footer>
    </div>
  )
}
