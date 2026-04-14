import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const SHORTCUTS = [
  { key: 'E', action: 'Employees panel' },
  { key: 'I', action: 'Import CSV' },
  { key: 'T', action: 'Templates panel' },
  { key: 'B', action: 'Branding panel' },
  { key: 'S', action: 'Settings panel' },
  { key: '?', action: 'Show shortcuts' },
  { key: 'D', action: 'Toggle dark / light mode' },
  { key: 'P', action: 'Print schedule' },
  { key: 'Ctrl + Z', action: 'Undo last shift change' },
  { key: 'Esc', action: 'Close panel' },
]

interface KeyboardShortcutsModalProps {
  open: boolean
  onClose: () => void
}

export function KeyboardShortcutsModal({ open, onClose }: KeyboardShortcutsModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen: boolean) => { if (!isOpen) onClose() }}>
      <DialogContent className="max-w-sm" showCloseButton>
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
        </DialogHeader>
        <table className="w-full text-sm">
          <tbody>
            {SHORTCUTS.map(({ key, action }) => (
              <tr key={key} className="border-b border-border/50 last:border-0">
                <td className="py-2 pr-4 w-28">
                  <kbd className="inline-flex items-center rounded bg-muted px-2 py-0.5 text-xs font-mono font-medium text-foreground border border-border">
                    {key}
                  </kbd>
                </td>
                <td className="py-2 text-muted-foreground">{action}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-muted-foreground/60 pt-1">
          Shortcuts are disabled when typing in an input field.
        </p>
      </DialogContent>
    </Dialog>
  )
}
