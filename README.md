# ShiftCanvas

![Live](https://img.shields.io/badge/live-joemighty.github.io%2FShiftCanvas-blue?style=plastic)
![React](https://img.shields.io/badge/react-18-61dafb?style=plastic&logo=react)
![TypeScript](https://img.shields.io/badge/typescript-5-3178c6?style=plastic&logo=typescript)
![Tailwind](https://img.shields.io/badge/tailwind-v4-38bdf8?style=plastic&logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green?style=plastic)

A frontend-only employee scheduling web app. No backend. No account. Everything runs in your browser and persists in localStorage.

**[Open ShiftCanvas](https://joemighty.github.io/ShiftCanvas/)**

---

## Features

- **CSV Import** - Upload your team in one go with live validation and preview ([sample CSV](https://joemighty.github.io/ShiftCanvas/sample-employees.csv))
- **Schedule Grid** - Click any cell to assign shifts across a 7-day week
- **Time Off** - Mark employees as sick, on leave, or unavailable
- **Templates** - Save and reapply schedule structures week to week
- **Branding** - Upload a logo, set a company name and accent colour
- **Print View** - Clean, branded printout with no UI chrome
- **Dark Mode** - Full light and dark theme support
- **Keyboard Shortcuts** - Navigate the app without touching the mouse

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `E` | Open Employees panel |
| `I` | Import CSV |
| `T` | Open Templates panel |
| `B` | Open Branding panel |
| `D` | Toggle dark / light mode |
| `P` | Print schedule |
| `Esc` | Close panel |

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React + Vite | UI framework and build tool |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| shadcn/ui | Component library |
| Zustand | State management |
| papaparse | CSV parsing |
| dayjs | Date handling |

---

## Data Storage

All data is stored locally in your browser via `localStorage`. Nothing is sent to any server. Clearing your browser data will remove your schedules.

All persistence goes through `/src/lib/storage.ts`. Direct `localStorage` access is avoided everywhere else.

---

## Local Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

---

## Project Structure

```
src/
  features/
    employees/    # CSV upload, employee list
    schedule/     # Grid, shift cells, print view
    templates/    # Save and load schedule templates
    branding/     # Logo, colour, company name
  pages/
    landing/      # Landing page
    dashboard/    # Main app shell
  stores/         # Zustand stores
  lib/            # storage.ts, csv.ts, utils.ts, theme.ts
  types/          # Shared TypeScript types
```

---

## Deployment

Deployed automatically to GitHub Pages via GitHub Actions on every push to `master`.
