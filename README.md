# Sudoku

A mobile-first Sudoku PWA built with React, TypeScript, and Vite.

## Development

```bash
npm install
npm run dev
```

## Build

Production builds are output to `/docs` so the app can be served directly
from GitHub Pages on the `main` branch (Settings → Pages → source:
`main` / `docs`) without needing GitHub Actions.

```bash
npm run build
```

The Vite `base` path is set to `/sudoku/` to match this repository's
GitHub Pages URL (`https://<user>.github.io/sudoku/`).

## PWA / offline support

The app is installable and works offline via `vite-plugin-pwa`:
precompiled assets are served from a generated service worker after the
first visit, so the puzzle keeps working without a network connection.
When a new deployment is available, a small in-app prompt offers to
update; `npm run preview` is the best way to try this locally, since
service workers aren't registered in `npm run dev`.
