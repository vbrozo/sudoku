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
