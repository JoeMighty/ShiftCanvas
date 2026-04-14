<div align="center">

# ShiftCanvas

![Live](https://img.shields.io/badge/live-joemighty.github.io%2FShiftCanvas-blue?style=plastic)
![React](https://img.shields.io/badge/react-18-61dafb?style=plastic&logo=react)
![TypeScript](https://img.shields.io/badge/typescript-5-3178c6?style=plastic&logo=typescript)
![Tailwind](https://img.shields.io/badge/tailwind-v4-38bdf8?style=plastic&logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green?style=plastic)

A frontend-only employee scheduling web app. No backend. No account. Everything runs in your browser and persists in localStorage.

**[Open ShiftCanvas](https://joemighty.github.io/ShiftCanvas/)**

</div>

---

## Features

- **CSV Import** - Upload your team in one go with live validation and preview ([sample CSV](https://joemighty.github.io/ShiftCanvas/sample-employees.csv))
- **Schedule Grid** - Click any cell to assign shifts across a 7-day week; drag across cells to paint the same shift
- **Edit Shift Times** - Set custom start and end times per shift, or fill an entire week in one step
- **Time Off** - Mark employees as sick, on leave, or unavailable
- **Custom Shift Types** - Define your own shift labels and colours alongside the built-in types
- **Conflict Detection** - Warnings for invalid shift times and employees over 40h per week
- **Weekly Summary** - Per-employee shift count and total hours column in the grid
- **Templates** - Save and reapply schedule structures week to week
- **Undo** - Ctrl+Z to reverse the last shift change
- **Export** - Download the current week as CSV; print a clean branded PDF
- **Branding** - Upload a logo, set a company name and accent colour
- **Dark Mode** - Full light and dark theme support
- **Mobile View** - Collapsible employee cards on small screens
- **Settings** - Choose week start day (Monday/Sunday), manage custom types, export/restore data
- **Keyboard Shortcuts** - Navigate the app without touching the mouse

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
| Zustand | State management (5 stores) |
| papaparse | CSV parsing |
| dayjs | Date handling |

---

## Data Storage

All data is stored locally in your browser via `localStorage`. Nothing is sent to any server. Use **Settings > Export backup** to download a JSON snapshot before clearing browser data.

All persistence goes through `src/lib/storage.ts`. Direct `localStorage` access is avoided everywhere else.

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
    employees/    # CSV upload, employee list
    schedule/     # Grid, shift cells, mobile view, print view
    templates/    # Save and load schedule templates
    branding/     # Logo, colour, company name
    settings/     # Week start, custom types, data management
  pages/
    landing/      # Landing page
    dashboard/    # Main app shell
  stores/         # Zustand stores (employees, schedule, templates, branding, preferences, customTypes)
  lib/            # storage.ts, csv.ts, export.ts, utils.ts, theme.ts
  components/     # Shared UI (KeyboardShortcutsModal + shadcn primitives)
  types/          # Shared TypeScript types
```

---

## Deployment

Deployed automatically to GitHub Pages via GitHub Actions on every push to `master`.
