# Hours Planner

A mobile-friendly web app to track your monthly working hours.

## Deploy to Vercel

### Option A — Vercel CLI (fastest)
```bash
npm i -g vercel
cd hours-planner
vercel
```
Follow the prompts, and it's live in ~30 seconds.

### Option B — GitHub + Vercel UI
1. Create a new GitHub repo and push this folder to it
2. Go to https://vercel.com/new
3. Import your repo → Deploy (zero config needed)

---

## Add to Home Screen (iPhone)
1. Open the deployed URL in Safari
2. Tap the Share button → "Add to Home Screen"
3. The app will appear on your home screen and open full screen, like a native app

## Add to Home Screen (Android)
1. Open in Chrome
2. Tap the three-dot menu → "Add to Home Screen"

---

## Files
- `index.html` — the entire app (HTML + CSS + JS)
- `manifest.json` — makes it installable as a PWA
- `sw.js` — service worker that lets the app open offline
- `vercel.json` — Vercel routing config
- `icon-192.png` / `icon-512.png` — app icons
- `vendor/jspdf.umd.min.js` — jsPDF 4.2.1 (MIT), used for PDF timesheets

## Features
- Monthly calendar view with month navigation
- Click any day to toggle: workday → absent (weekdays) / weekend off → weekend worked
- Log hours per day directly on the calendar cell
- Remaining hours/day recalculates live as you log
- Target hours slider (1–300 h)
- Start/stop timer and manual time logs
- Insights: pace, average day, weekly and monthly hours, earnings estimate
- Export to CSV, JSON or a PDF timesheet
- Backup to a file and restore from it
- Reminders to start the timer and when today's hours are reached
- Works offline once it has been opened
- Dark mode support
- Data persists in localStorage (stays after closing the browser)

## Reminder limits
The app has no server, so reminders only fire while it's open or still running in the
background. Phones often pause background apps, so a reminder may only appear when the
app is next opened. Reliable reminders on a closed app would need web push and a small backend.
