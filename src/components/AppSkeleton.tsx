export function AppSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Header */}
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="h-5 w-32 rounded bg-muted" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 rounded bg-muted" />
          <div className="h-8 w-24 rounded bg-muted" />
          <div className="h-8 w-8 rounded bg-muted" />
        </div>
      </div>
      {/* Content */}
      <div className="p-6 flex flex-col gap-4">
        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded bg-muted" />
          <div className="h-5 w-48 rounded bg-muted" />
          <div className="h-9 w-9 rounded bg-muted" />
          <div className="h-9 w-16 rounded bg-muted" />
        </div>
        {/* Grid */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {/* Header row */}
          <div className="flex border-b border-border bg-muted/40 px-4 py-3 gap-2">
            <div className="h-4 w-32 rounded bg-muted" />
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-4 w-16 rounded bg-muted mx-auto flex-1" />
            ))}
            <div className="h-4 w-16 rounded bg-muted" />
          </div>
          {/* Rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex border-b border-border/50 last:border-0 px-4 py-3 gap-2 items-center">
              <div className="h-6 w-28 rounded bg-muted" />
              {Array.from({ length: 7 }).map((_, j) => (
                <div key={j} className="flex-1 h-8 rounded bg-muted/60 mx-1" />
              ))}
              <div className="h-6 w-12 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
