# Daily Diet

A premium, installable Progressive Web App that shows today's diet plan as a stack of swipeable, full-screen meal cards — Tinder-style, but for meals instead of people.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, SWR, and a hand-built shadcn-style component layer (Radix primitives + `class-variance-authority`).

---

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. On first load the app uses the default Google Apps Script URL baked into `constants/app.ts`; you can change it any time from the in-app **Settings** panel (gear icon, top right) — it's stored in `localStorage` and takes effect immediately, no rebuild required.

### Production build

```bash
npm run build
npm run start
```

The service worker (`public/sw.js`) only registers in production (`NODE_ENV=production`), so offline caching and installability are best verified with `npm run build && npm run start`, not `npm run dev`.

---

## How data flows

1. **Source of truth**: a Google Sheet, exposed as JSON by a Google Apps Script Web App (`doGet` returning `ContentService` JSON).
2. **`services/GoogleSheetService.ts`** is the single reusable service every part of the app goes through to read the plan. It never hits the Apps Script URL directly from the browser — instead it calls:
3. **`app/api/mealplan/route.ts`** — a same-origin proxy. This exists so:
   - The browser never needs the Apps Script response to carry CORS headers (Apps Script doesn't reliably set them).
   - Requests can be validated (only `script.google.com` / `script.googleusercontent.com` hosts are allowed) and cached at the edge.
4. **`hooks/useMealPlan.ts`** wraps the service in SWR, with a mirrored copy written to `localStorage` on every successful fetch. On load, SWR's `fallbackData` reads straight from that mirror, so the last known plan renders instantly — including fully offline — before/without any network round trip. `revalidateOnFocus` / `revalidateOnReconnect` handle background refresh.
5. **`utils/date.ts` → `getDayNumberForDate`** maps the selected calendar date to a 1-based day number, looping through the sheet's rows once the day-of-month exceeds the row count (e.g. day 31 of a 30-row sheet loops back to day 1).
6. **`utils/meal.ts`** converts a raw sheet row into a `DietDay`: it splits each cell like `"Vegetable Upma (1 medium bowl)"` into a hero food name + portion, and skips any section whose cell is empty.

Nothing about the meal content is hardcoded or mocked — the only static content is the eight companion messages in `constants/mealMessages.ts`, which the brief explicitly asked to be predefined rather than AI-generated.

---

## Project structure

```
app/
  layout.tsx            Root layout: fonts, theme + settings providers, SW registration
  page.tsx               Main screen: wires date, plan, carousel, states together
  manifest.ts             Native Next.js PWA manifest route
  api/mealplan/route.ts   Server-side proxy to the Apps Script endpoint
  globals.css             Design tokens (CSS variables), light/dark, reduced motion

components/
  MealCard.tsx            Single full-screen meal card (typography hierarchy)
  MealCarousel.tsx         Framer Motion drag/swipe carousel + keyboard a11y
  ProgressDots.tsx          Animated progress indicator
  TopBar.tsx / DateDropdown.tsx   Date picker header
  Settings.tsx              API URL / accent color / theme sheet
  LoadingSkeleton.tsx        First-load skeleton
  EmptyState.tsx              Error / no-meals / not-configured states
  PullToRefreshIndicator.tsx, UpdatedIndicator.tsx, ServiceWorkerRegister.tsx
  ui/                         Hand-built shadcn-style primitives (Button, Sheet, Select, …)

hooks/
  useMealPlan.ts            SWR + localStorage offline cache
  useLastViewedMeal.ts       Per-day "resume where you left off" persistence
  useSelectedDate.ts, useHaptics.ts, usePullToRefresh.ts

services/GoogleSheetService.ts   The only place that talks to the meal-plan API
types/meal.ts                     Shared TypeScript types
utils/date.ts, meal.ts, color.ts  Pure helper functions
constants/app.ts, mealMessages.ts Config + predefined copy
providers/                        SettingsProvider, ThemeProvider, ThemeBridge

public/
  sw.js                     Runtime service worker (network-first API, cache-first assets)
  icons/                     Generated app icons (regular, maskable, apple-touch)

scripts/generate_icons.py    Regenerates public/icons/* from vector shapes if you want to restyle them
```

---

## Settings

- **Google Apps Script API URL** — swap sheets without a rebuild.
- **Accent color** — six presets (Sage, Clay, Ocean, Plum, Mustard, Rose) plus a custom color picker; applied live via a CSS variable, no reload.
- **Appearance** — Light / Dark / System, powered by `next-themes` and mirrored into the same settings store.

---

## PWA / installability

- `app/manifest.ts` generates `/manifest.webmanifest` with the full icon set (192/512, plus maskable variants for Android's adaptive icon system).
- `public/sw.js` precaches the app shell, serves `/api/mealplan` network-first with a cached fallback (offline support), and serves static assets cache-first.
- `viewport.viewportFit = "cover"` plus `env(safe-area-inset-*)` in `globals.css` handle iPhone notches/home indicators.
- Icons were generated locally from vector shapes (`scripts/generate_icons.py`, Pillow) rather than any external/licensed art — regenerate or replace them freely.

To reskin the icon, edit the palette constants at the top of `scripts/generate_icons.py` and re-run:

```bash
pip install pillow
python3 scripts/generate_icons.py
```

---

## Notes on the sandbox this was built in

This project was built in an environment without general internet access, so two adjustments were made that don't affect real-world deployment:

- **Fonts**: `next/font/google` needs to fetch from `fonts.googleapis.com` at build time, which wasn't reachable here, so the project uses the self-hosted `@fontsource/fraunces` and `@fontsource/inter` packages instead (same fonts, bundled locally — this is arguably better for a PWA anyway, since it removes a runtime dependency on Google Fonts).
- **Live endpoint test**: the build was verified end-to-end (`npm run build` is clean, all routes generate correctly), but a live fetch against `script.google.com` couldn't be executed from this sandbox. The proxy route's logic was reviewed carefully and there's nothing endpoint-specific about it — it will work as soon as it's deployed somewhere with normal internet access. Please do a first real run against your Apps Script URL and let me know if anything needs adjusting.

---

## Tech stack

Next.js 15 · TypeScript · Tailwind CSS · Framer Motion · SWR · next-themes · Radix UI primitives · lucide-react
