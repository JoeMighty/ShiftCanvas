<div align="center">

# ShiftCanvas

![Live](https://img.shields.io/badge/live-joemighty.github.io%2FShiftCanvas-blue?style=plastic)
![React](https://img.shields.io/badge/react-18-61dafb?style=plastic&logo=react)
![TypeScript](https://img.shields.io/badge/typescript-5-3178c6?style=plastic&logo=typescript)
![Tailwind](https://img.shields.io/badge/tailwind-v4-38bdf8?style=plastic&logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green?style=plastic)

A frontend-only employee scheduling web app. No backend. No account. Everything runs in your browser and persists locally.

**[Open ShiftCanvas](https://joemighty.github.io/ShiftCanvas/)**

</div>

---

## Features

- **CSV Import** - Upload your team in one go with live validation and preview ([sample CSV](https://joemighty.github.io/ShiftCanvas/sample-employees.csv))
- **Schedule Grid** - Click any cell to assign shifts across a 7-day week; drag across cells to paint the same shift
- **Edit Shift Times** - Set custom start and end times per shift, or fill an entire week in one step
- **Copy Last Week** - Carry over all shifts from the previous week in one click
- **Time Off** - Mark employees as sick, on leave, or unavailable
- **Custom Shift Types** - Define your own shift labels and colours alongside the built-in types
- **Role Filter** - Filter the schedule grid by employee role
- **Employee Reorder** - Drag employees up/down or sort A-Z in the employees panel
- **Conflict Detection** - Warnings for invalid shift times and employees over the configurable hours threshold
- **Weekly Summary** - Per-employee shift count and total hours column in the grid
- **Templates** - Save and reapply schedule structures week to week
- **Undo** - Ctrl+Z to reverse the last shift change
- **Export** - Download the current week as CSV, Excel (.xlsx), or PNG image; print a clean branded PDF
- **Branding** - Upload a logo, set a company name and accent colour
- **Dark Mode** - Full light and dark theme support
- **Mobile View** - Collapsible employee cards on small screens
- **Settings** - Week start day (Mon/Sun), configurable hours threshold, custom types, export/restore data
- **Keyboard Shortcuts** - Navigate the app without touching the mouse
- **PWA** - Installable on desktop and mobile; works offline after first load

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `E` | Employees panel |
| `I` | Import CSV |
| `T` | Templates panel |
| `B` | Branding panel |
| `S` | Settings panel |
| `?` | Show shortcuts |
| `D` | Toggle dark / light mode |
| `P` | Print schedule |
| `Ctrl + Z` | Undo last shift change |
| `Esc` | Close panel |

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 + Vite | UI framework and build tool |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| shadcn/ui (Base UI) | Component library |
| Zustand | State management (6 stores) |
| idb | IndexedDB wrapper for local persistence |
| xlsx | Excel export (dynamic import) |
| html-to-image | PNG image export (dynamic import) |
| papaparse | CSV parsing |
| dayjs | Date handling |

---

## Data Storage

All data is stored locally in your browser via **IndexedDB** (with a `localStorage` fallback for private browsing). Nothing is sent to any server. On first load, existing `localStorage` data is automatically migrated to IndexedDB.

Use **Settings > Export backup** to download a JSON snapshot before clearing browser data.

All persistence goes through `src/lib/storage.ts` and `src/lib/idb.ts`. Direct storage access is avoided everywhere else.

---

## Local Development

Prerequisites: Node.js 18+ and npm.

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:5173)
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The app uses a `base: '/ShiftCanvas/'` path in `vite.config.ts` for GitHub Pages. When running locally via `npm run dev`, Vite serves from `/` automatically so no adjustment is needed.

---

## Project Structure

```
src/
  features/
    employees/    # CSV upload, employee list (with reorder)
    schedule/     # Grid, shift cells, mobile view, print view
    templates/    # Save and load schedule templates
    branding/     # Logo, colour, company name
    settings/     # Week start, hours threshold, custom types, data management
  pages/
    landing/      # Landing page
    dashboard/    # Main app shell
  stores/         # Zustand stores (employees, schedule, templates, branding, preferences, customTypes)
  lib/            # storage.ts, idb.ts, csv.ts, export.ts, utils.ts, theme.ts
  components/     # Shared UI (KeyboardShortcutsModal, ErrorBoundary, AppSkeleton + shadcn primitives)
  types/          # Shared TypeScript types
public/
  manifest.json   # PWA manifest
  sw.js           # Service worker (cache-first offline support)
```

---

## Deployment

Deployed automatically to GitHub Pages via GitHub Actions on every push to `master`.
