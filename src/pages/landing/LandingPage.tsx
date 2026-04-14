import { Button } from '@/components/ui/button'
import {
  CalendarDays, Users, FileDown, Layers, Sun, Moon,
  Copy, Undo2, Palette, Smartphone, Shield, Zap, Filter,
  FileSpreadsheet, Printer, AlertTriangle, ChevronRight,
  BarChart2, ArrowUpDown,
} from 'lucide-react'

interface LandingPageProps {
  onGetStarted: () => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DATES = [14, 15, 16, 17, 18, 19, 20]
const TODAY_IDX = 2 // Wed

type MockShift = { label: string; style: string } | null

const MOCK: { name: string; role: string; shifts: MockShift[]; days: number; hours: number; warn?: boolean }[] = [
  {
    name: 'Alex Morgan', role: 'Manager',
    shifts: [
      { label: '9-5',   style: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
      { label: '9-5',   style: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
      { label: '9-5',   style: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
      { label: 'Leave', style: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' },
      { label: '9-5',   style: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
      null, null,
    ],
    days: 5, hours: 40,
  },
  {
    name: 'Jamie Lee', role: 'Barista',
    shifts: [
      { label: '9-5',  style: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
      { label: 'Sick', style: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300' },
      { label: '9-5',  style: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
      { label: '9-5',  style: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
      { label: 'Off',  style: 'bg-gray-100 text-gray-500 dark:bg-gray-800/50 dark:text-gray-400' },
      null, null,
    ],
    days: 4, hours: 24,
  },
  {
    name: 'Sam Chen', role: 'Barista',
    shifts: [
      { label: 'Off',  style: 'bg-gray-100 text-gray-500 dark:bg-gray-800/50 dark:text-gray-400' },
      { label: '10-6', style: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
      { label: '10-6', style: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
      { label: '10-6', style: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
      { label: '10-6', style: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
      null, null,
    ],
    days: 4, hours: 32,
  },
  {
    name: 'Taylor Brooks', role: 'Evening',
    shifts: [
      { label: '4-10', style: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300' },
      { label: '4-10', style: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300' },
      { label: '4-10', style: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300' },
      { label: 'Leave', style: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' },
      { label: 'Leave', style: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' },
      null, null,
    ],
    days: 3, hours: 18,
  },
  {
    name: 'Jordan Kim', role: 'Manager',
    shifts: [
      { label: '9-5', style: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
      { label: '9-5', style: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
      { label: '9-5', style: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
      { label: '9-5', style: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
      { label: '9-5', style: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
      null, null,
    ],
    days: 5, hours: 40, warn: true,
  },
]

const FEATURES = [
  {
    icon: CalendarDays,
    title: 'Visual schedule grid',
    desc: 'Click any cell to assign a shift. Drag across multiple cells to paint the same shift instantly across your team.',
  },
  {
    icon: Users,
    title: 'CSV import',
    desc: 'Upload your entire team in seconds with live validation and a preview. A sample CSV is included to get you started.',
  },
  {
    icon: Copy,
    title: 'Copy last week',
    desc: 'Carry over every shift from the previous week with a single click. Stop re-entering the same schedule every Monday.',
  },
  {
    icon: Layers,
    title: 'Templates',
    desc: 'Save any schedule as a reusable template and apply it to any future week in one action.',
  },
  {
    icon: Palette,
    title: 'Custom shift types',
    desc: 'Create your own types with custom labels, colours, and default start/end times to match your exact workflow.',
  },
  {
    icon: Undo2,
    title: 'Undo history',
    desc: 'Ctrl+Z steps back through your changes. Up to 20 levels of undo per session, with no data lost.',
  },
  {
    icon: FileSpreadsheet,
    title: 'Export anywhere',
    desc: 'Download as CSV, Excel (.xlsx), or a PNG image. Print a clean, branded PDF with your logo and company colours.',
  },
  {
    icon: AlertTriangle,
    title: 'Conflict detection',
    desc: 'Flags employees over your configurable hours threshold and highlights any shifts with invalid start/end times.',
  },
  {
    icon: BarChart2,
    title: 'Weekly summary',
    desc: 'Each employee shows their shift count and total hours at a glance in the summary column beside the grid.',
  },
  {
    icon: Filter,
    title: 'Role filters',
    desc: 'Filter the grid by role to focus on one team at a time. Baristas, managers, evening staff, all separated.',
  },
  {
    icon: ArrowUpDown,
    title: 'Employee ordering',
    desc: 'Move employees up or down the list, or sort alphabetically in one click to keep your roster organised.',
  },
  {
    icon: Smartphone,
    title: 'Mobile ready',
    desc: 'Collapsible employee cards make the schedule easy to read and manage on phones and tablets.',
  },
]

export function LandingPage({ onGetStarted, theme, onToggleTheme }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold tracking-tight">ShiftCanvas</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Button onClick={onGetStarted} size="sm">
            Open App
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex flex-col items-center px-6 pt-20 pb-0 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/6 dark:bg-blue-400/8 rounded-full blur-3xl" />
          <div className="absolute top-32 left-1/4 w-[500px] h-[400px] bg-violet-500/4 dark:bg-violet-400/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground font-medium shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 animate-pulse" />
            Free forever. No account. Runs entirely in your browser.
          </div>

          <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.1]">
            Scheduling your team
            <br />
            <span className="text-muted-foreground">made effortless.</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            Build weekly shift rotas in minutes. Import your team, assign shifts with a click or drag, then export a clean schedule. No login, no sync, no friction.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
            <Button size="lg" onClick={onGetStarted} className="gap-2 px-8 rounded-xl text-base h-12">
              <CalendarDays className="w-5 h-5" />
              Build your first rota
              <ChevronRight className="w-4 h-4" />
            </Button>
            <p className="text-xs text-muted-foreground">No setup required. Opens instantly.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { icon: Shield, label: 'No account needed' },
              { icon: Zap,    label: 'Works offline (PWA)' },
              { icon: FileSpreadsheet, label: 'CSV, Excel, PNG export' },
              { icon: Printer, label: 'Branded PDF print' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 border border-border/60 rounded-full px-3 py-1">
                <Icon className="w-3 h-3" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Schedule mockup */}
        <div className="relative z-10 mt-14 w-full max-w-4xl">
          <div className="rounded-2xl border border-border bg-card shadow-2xl shadow-black/8 dark:shadow-black/40 overflow-hidden">
            <div className="border-b border-border bg-muted/30 px-4 py-2.5 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">Week of 14 Apr 2026</span>
              <div className="ml-auto flex items-center gap-1.5">
                <div className="flex gap-1">
                  {['bg-blue-400/60','bg-amber-400/60','bg-red-400/60','bg-violet-400/60'].map((c,i) => (
                    <span key={i} className={`w-2 h-2 rounded-full ${c}`} />
                  ))}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/20 border-b border-border">
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium w-36 border-r border-border/50 sticky left-0 bg-muted/20 z-10">
                      Employee
                    </th>
                    {DAYS.map((d, i) => {
                      const isToday = i === TODAY_IDX
                      const isWeekend = i >= 5
                      return (
                        <th key={d} className={`text-center px-2 py-3 font-medium min-w-[68px] ${isWeekend ? 'text-muted-foreground/30' : 'text-muted-foreground'}`}>
                          <div className="text-[10px] uppercase tracking-wide">{d}</div>
                          <div className={`text-sm font-semibold w-7 h-7 mx-auto flex items-center justify-center rounded-full mt-0.5 ${
                            isToday
                              ? 'bg-primary text-primary-foreground'
                              : isWeekend
                              ? 'text-muted-foreground/25'
                              : 'text-foreground'
                          }`}>
                            {DATES[i]}
                          </div>
                        </th>
                      )
                    })}
                    <th className="text-center px-3 py-3 text-muted-foreground font-medium w-20 border-l border-border/50">
                      Summary
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK.map((emp, ri) => (
                    <tr key={emp.name} className={`border-b border-border/40 last:border-0 hover:bg-muted/10 transition-colors ${ri % 2 === 1 ? 'bg-muted/5' : ''}`}>
                      <td className="px-3 py-2.5 border-r border-border/50 sticky left-0 bg-card z-10">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                            {emp.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate max-w-[76px] text-[11px]">{emp.name}</p>
                            <p className="text-[10px] text-muted-foreground">{emp.role}</p>
                          </div>
                        </div>
                      </td>
                      {emp.shifts.map((shift, si) => {
                        const isWeekend = si >= 5
                        const isToday = si === TODAY_IDX
                        return (
                          <td key={si} className={`px-1.5 py-2 text-center ${isWeekend ? 'bg-muted/10' : ''} ${isToday ? 'bg-primary/3' : ''}`}>
                            {shift ? (
                              <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${shift.style}`}>
                                {shift.label}
                              </span>
                            ) : (
                              <span className="text-muted-foreground/20 text-[10px]">-</span>
                            )}
                          </td>
                        )
                      })}
                      <td className="px-2 py-2 border-l border-border/50 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-[10px] font-medium text-foreground">{emp.days}d</span>
                          <span className={`text-[10px] font-semibold ${emp.warn ? 'text-amber-500 dark:text-amber-400' : 'text-muted-foreground'}`}>
                            {emp.hours}h
                          </span>
                          {emp.warn && <AlertTriangle className="w-2.5 h-2.5 text-amber-500" />}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-28 border-t border-border mt-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Simple by design</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Up and running in three steps</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-11 left-[calc(16.66%+2.5rem)] right-[calc(16.66%+2.5rem)] h-px bg-gradient-to-r from-border via-border to-border" />
            {[
              {
                num: 1,
                icon: Users,
                title: 'Add your team',
                desc: 'Import a CSV with names and roles, or add employees one by one. A sample CSV is included to get you started instantly.',
              },
              {
                num: 2,
                icon: CalendarDays,
                title: 'Assign shifts',
                desc: 'Click any cell to set a shift. Drag across cells to paint a range. Fill a whole employee\'s week with one action.',
              },
              {
                num: 3,
                icon: FileDown,
                title: 'Export or print',
                desc: 'Download as CSV, Excel, or PNG. Or print a branded PDF rota to share with your team.',
              },
            ].map(({ num, icon: Icon, title, desc }) => (
              <div key={num} className="flex flex-col items-center text-center gap-5">
                <div className="relative">
                  <div className="w-[88px] h-[88px] rounded-2xl border-2 border-border bg-card flex items-center justify-center shadow-sm">
                    <Icon className="w-9 h-9 text-primary" />
                  </div>
                  <span className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow">
                    {num}
                  </span>
                </div>
                <div className="flex flex-col gap-2 max-w-[220px]">
                  <h3 className="text-base font-semibold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Button onClick={onGetStarted} size="lg" className="gap-2 rounded-xl px-8">
              Get started free
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="px-6 py-28 bg-muted/20 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Fully featured</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Everything you need to run your rota</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-base">
              Built for shift-based teams. No subscriptions, no feature gating, no setup required.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col gap-3.5 rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 group-hover:bg-primary/15 flex items-center justify-center shrink-0 transition-colors">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground mb-1.5">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy section */}
      <section className="px-6 py-28 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-10 lg:p-12 flex flex-col gap-5 justify-center border-b md:border-b-0 md:border-r border-border">
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight leading-tight">Your data stays with you.</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  ShiftCanvas stores everything in your browser using IndexedDB. No account required, no cloud sync, no telemetry. Your schedule data never touches a server.
                </p>
                <p className="text-xs text-muted-foreground border-t border-border pt-4">
                  Export a full JSON backup at any time from Settings, and restore it on any device.
                </p>
              </div>
              <div className="p-10 lg:p-12 flex flex-col gap-6 justify-center">
                {[
                  {
                    icon: Shield,
                    title: 'No server, ever',
                    desc: 'All data is stored locally via IndexedDB. Nothing is transmitted over the network.',
                  },
                  {
                    icon: FileDown,
                    title: 'Portable backups',
                    desc: 'Export a JSON snapshot and restore it on any device, any time.',
                  },
                  {
                    icon: Zap,
                    title: 'Works offline',
                    desc: 'Install as a PWA and the app runs fully offline after the first load.',
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{title}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-28 bg-muted/20 border-t border-border">
        <div className="max-w-xl mx-auto text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <CalendarDays className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Ready to build your rota?</h2>
            <p className="text-muted-foreground text-base">
              No sign-up. No installation. Just open it and start scheduling.
            </p>
          </div>
          <Button size="lg" onClick={onGetStarted} className="gap-2 rounded-xl px-10 h-12 text-base shadow-lg shadow-primary/20">
            <CalendarDays className="w-5 h-5" />
            Open ShiftCanvas
          </Button>
          <p className="text-xs text-muted-foreground">Free forever. All data stays in your browser.</p>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
            <CalendarDays className="w-3 h-3 text-primary" />
          </div>
          <span className="font-medium text-foreground">ShiftCanvas</span>
        </div>
        <span>All data stays in your browser. Nothing is sent to any server.</span>
      </footer>

    </div>
  )
}
