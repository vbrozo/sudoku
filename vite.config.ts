import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const BASE_PATH = "/sudoku/";

// Repo is hosted at https://<user>.github.io/sudoku/, so all asset URLs
// need the /sudoku/ prefix, and the build output must land in /docs so
// GitHub Pages can serve it straight from the main branch without Actions.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      // Registration is handled in React via the virtual:pwa-register/react hook,
      // so we don't need the plugin's own auto-injected register script.
      injectRegister: false,
      includeAssets: ["favicon.svg", "icons/*.png"],
      manifest: {
        name: "Sudoku",
        short_name: "Sudoku",
        description: "A mobile-first Sudoku puzzle game you can play offline.",
        theme_color: "#2d6cdf",
        background_color: "#f4f5f7",
        display: "standalone",
        start_url: BASE_PATH,
        scope: BASE_PATH,
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          {
            src: "icons/icon-maskable-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "icons/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,webmanifest}"],
      },
    }),
  ],
  base: BASE_PATH,
  build: {
    outDir: "docs",
  },
});
