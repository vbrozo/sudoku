# Sudoku

A mobile-first Sudoku PWA built with React, TypeScript, and Vite — puzzle
generation, solving/validation, notes, hints, a timer, local statistics,
light/dark themes, offline support, and localStorage save/resume, all
running entirely client-side with no backend.

## Requirements

- Node.js 18+ and npm

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173/sudoku/`).

## Available scripts

| Script            | Purpose                                                        |
| ----------------- | --------------------------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with hot reload                       |
| `npm run build`   | Type-check (`tsc -b`) and build the production bundle to `/docs`|
| `npm run preview` | Serve the built `/docs` output locally, service worker included |
| `npm test`        | Run the Vitest suite once                                       |
| `npm run lint`    | Run ESLint over the project                                     |

Service workers are only registered against a production build, so use
`npm run preview` (not `npm run dev`) to try offline mode or the update
prompt locally.

## Project structure

```
src/
  components/   UI components (one .tsx + its .css per component)
  hooks/        useSudoku (game state) and useTheme (theme mode)
  logic/        Pure, UI-independent Sudoku rules: validation, solver,
                generator, hint/notes/mistake helpers — all unit-tested
  utils/        Board helpers, localStorage persistence, statistics,
                time formatting — also unit-tested
  types/        Shared TypeScript types (Cell, Board, Grid, Puzzle, ...)
```

The `logic/` and `utils/` layers have no React or DOM dependency and are
exercised by the Vitest suite; UI components consume them through the
`useSudoku` hook.

## Deploying to GitHub Pages (main branch, `/docs` folder, no Actions)

This repo is configured so GitHub Pages can serve the app straight from
the `main` branch's `/docs` folder — no CI/CD workflow required.

1. **Build the production bundle:**

   ```bash
   npm run build
   ```

   This runs a full type-check and writes the deployable app to `/docs`
   (Vite's `base` is `/sudoku/` and `build.outDir` is `docs`, matching
   this repo's GitHub Pages URL: `https://<user>.github.io/sudoku/`).

2. **Commit the `/docs` folder** along with your source changes:

   ```bash
   git add docs
   git commit -m "Build for deployment"
   ```

3. **Push to `main`:**

   ```bash
   git push origin main
   ```

4. **Enable GitHub Pages** (one-time setup): in the repository's
   **Settings → Pages**, set the source to **Deploy from a branch**,
   branch **`main`**, folder **`/docs`**, then save. GitHub serves the
   site at `https://<user>.github.io/sudoku/` within a minute or two.

If you rename the repository or serve it from a different path, update
`BASE_PATH` in `vite.config.ts` to match before rebuilding — the base
path is used for both asset URLs and the PWA manifest's `start_url`/
`scope`, so it must exactly match the deployed subpath.

## PWA / offline support

The app is installable and works offline via `vite-plugin-pwa`: after
the first visit, a generated service worker precaches the built
JS/CSS/HTML/icons, so the puzzle keeps working without a network
connection, including on a hard refresh. When a new deployment is
available, a small in-app banner offers to update.

## Data storage

Everything is stored in the browser's `localStorage`, scoped to this
app's origin — no account, backend, or network access is required:

- **Active game** (board, puzzle, solution, difficulty, notes, hint/
  mistake counters, pause state, elapsed time) — saved continuously and
  offered back via a "Resume your game?" prompt on next launch; cleared
  once the puzzle is solved.
- **Statistics** (games played/won, best/average time, hints used,
  mistakes made, per difficulty) — updated only when a puzzle is
  completed, viewable via the "Stats" button.
- **Theme preference** — Auto (follows the OS), Light, or Dark.

All of this is read/written defensively: corrupted or unexpected data
is discarded in favor of sensible defaults instead of crashing the app.
