import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Repo is hosted at https://<user>.github.io/sudoku/, so all asset URLs
// need the /sudoku/ prefix, and the build output must land in /docs so
// GitHub Pages can serve it straight from the main branch without Actions.
export default defineConfig({
  plugins: [react()],
  base: "/sudoku/",
  build: {
    outDir: "docs",
  },
});
