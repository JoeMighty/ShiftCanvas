import { Button } from '@/components/ui/button'
import { CalendarDays, Users, FileDown, Layers, Sun, Moon } from 'lucide-react'

interface LandingPageProps {
  onGetStarted: () => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

const MOCK_EMPLOYEES = ['Alex Morgan', 'Jamie Lee', 'Sam Chen', 'Taylor Brooks', 'Jordan Kim']
const MOCK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MOCK_SHIFTS: Record<string, Record<string, { label: string; colour: string }>> = {
  'Alex Morgan':   { Mon: { label: '9-5', colour: 'bg-blue-500' },    Tue: { label: '9-5', colour: 'bg-blue-500' },    Wed: { label: 'Leave', colour: 'bg-amber-400' }, Thu: { label: '9-5', colour: 'bg-blue-500' },   Fri: { label: '9-5', colour: 'bg-blue-500' } },
  'Jamie Lee':     { Mon: { label: '9-5', colour: 'bg-blue-500' },    Tue: { label: 'Sick', colour: 'bg-red-400' },    Wed: { label: '9-5', colour: 'bg-blue-500' },   Thu: { label: '9-5', colour: 'bg-blue-500' },   Fri: { label: 'Off', colour: 'bg-gray-400' } },
  'Sam Chen':      { Mon: { label: 'Off', colour: 'bg-gray-400' },    Tue: { label: '10-6', colour: 'bg-blue-500' },  Wed: { label: '10-6', colour: 'bg-blue-500' },  Thu: { label: '10-6', colour: 'bg-blue-500' }, Fri: { label: '10-6', colour: 'bg-blue-500' } },
  'Taylor Brooks': { Mon: { label: '8-4', colour: 'bg-violet-500' },  Tue: { label: '8-4', colour: 'bg-violet-500' }, Wed: { label: '8-4', colour: 'bg-violet-500' }, Thu: { label: 'Leave', colour: 'bg-amber-400' }, Fri: { label: 'Leave', colour: 'bg-amber-400' } },
  'Jordan Kim':    { Mon: { label: '9-5', colour: 'bg-blue-500' },    Tue: { label: '9-5', colour: 'bg-blue-500' },   Wed: { label: '9-5', colour: 'bg-blue-500' },   Thu: { label: '9-5', colour: 'bg-blue-500' },   Fri: { label: 'Off', colour: 'bg-gray-400' } },
}

export function LandingPage({ onGetStarted, theme, onToggleTheme }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-foreground flex items-center justify-center">
            <CalendarDays className="w-3.5 h-3.5 text-background" />
          </div>
          <span className="font-semibold text-sm tracking-tight">ShiftCanvas</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Button onClick={onGetStarted} size="sm" className="rounded-lg">
            Open App
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="w-full flex flex-col items-center px-6 pt-24 pb-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-500/8 dark:bg-blue-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs text-muted-foreground font-medium tracking-wide">
            Free to use. No sign-up. Runs entirely in your browser.
          </div>

          <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.1] text-center">
            Employee scheduling,
            <br />
            <span className="text-muted-foreground">beautifully simple.</span>
          </h1>

          <p className="text-base text-muted-foreground max-w-lg leading-relaxed">
            Build shift schedules in seconds. Upload your team via CSV, assign shifts, track time off and print a clean weekly rota.
          </p>

          <Button size="lg" onClick={onGetStarted} className="rounded-xl gap-2 px-6">
            <CalendarDays className="w-4 h-4" />
            Get Started
          </Button>
        </div>

        {/* Schedule mockup */}
        <div className="relative z-10 mt-16 w-full max-w-3xl">
          <div className="rounded-2xl border border-border bg-card shadow-xl shadow-black/5 dark:shadow-black/30 overflow-hidden">
            <div className="border-b border-border bg-muted/30 px-4 py-2.5 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">Week of 14 Apr 2026</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/20">
                    <th className="text-left px-4 py-2.5 text-muted-foreground font-medium w-32 border-r border-border/50">Employee</th>
                    {MOCK_DAYS.map(d => (
                      <th key={d} className="text-center px-2 py-2.5 text-muted-foreground font-medium min-w-[60px]">{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_EMPLOYEES.map((emp, i) => (
                    <tr key={emp} className={i % 2 === 1 ? 'bg-muted/10' : ''}>
                      <td className="px-4 py-2.5 font-medium text-foreground border-r border-border/50 whitespace-nowrap">{emp}</td>
                      {MOCK_DAYS.map(day => {
                        const shift = MOCK_SHIFTS[emp]?.[day]
                        return (
                          <td key={day} className="px-1.5 py-1.5 text-center">
                            {shift ? (
                              <span className={`inline-block px-2 py-0.5 rounded-md text-white text-[10px] font-medium ${shift.colour}`}>
                                {shift.label}
                              </span>
                            ) : (
                              <span className="text-muted-foreground/30 text-[10px]">-</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest text-center mb-12">Everything you need</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { icon: Users, title: 'CSV Import', desc: 'Upload your whole team in one go with validation and a live preview.' },
              { icon: CalendarDays, title: 'Schedule Grid', desc: 'Click any cell to assign a shift. Visual, fast, no fuss.' },
              { icon: Layers, title: 'Templates', desc: 'Save schedules as templates and reapply them every week.' },
              { icon: FileDown, title: 'Print & Export', desc: 'One-click clean printout with your logo and branding.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col gap-3">
                <div className="w-9 h-9 rounded-xl border border-border bg-muted/50 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-foreground" />
                </div>
                <p className="font-semibold text-sm text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-6 py-20 bg-muted/20">
        <div className="max-w-md mx-auto text-center flex flex-col items-center gap-5">
          <h2 className="text-2xl font-semibold tracking-tight">Ready to build your first rota?</h2>
          <p className="text-sm text-muted-foreground">No sign-up. No sync. Just open it and go.</p>
          <Button size="lg" onClick={onGetStarted} className="rounded-xl gap-2 px-6">
            <CalendarDays className="w-4 h-4" />
            Open ShiftCanvas
          </Button>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
        All data stays in your browser. Nothing is sent to any server.
      </footer>
    </div>
  )
}
