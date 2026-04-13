export function getStoredTheme(): 'light' | 'dark' {
  try {
    const stored = localStorage.getItem('shiftcanvas_theme')
    if (stored === 'dark' || stored === 'light') return stored
  } catch { /* ignore */ }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme: 'light' | 'dark') {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  try {
    localStorage.setItem('shiftcanvas_theme', theme)
  } catch { /* ignore */ }
}
