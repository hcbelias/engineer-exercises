import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// Bundle analyzer: rollup-plugin-visualizer
//
// `pnpm build`         — production build; writes dist/stats.html (treemap, no auto-open)
// `pnpm build:analyze` — same build, then opens dist/stats.html in the browser automatically
//
// Key metrics to watch in the treemap:
//   - Initial chunk (index-[hash].js) — what the user downloads before seeing anything
//   - Number of chunks — each lazy-loaded page/component becomes its own file
//   - Largest module in each chunk — use this to find what's worth splitting next

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    visualizer({
      filename: "dist/stats.html",
      open: mode === "analyze",
      gzipSize: true,
      brotliSize: true,
      template: "treemap",
    }),
  ],
  server: { port: 3008 },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react-dom")) return "react-dom";
          if (id.includes("node_modules/react/")) return "react";
          if (id.includes("/src/data/geoData")) return "geo-data";
          if (id.includes("node_modules/")) return "vendor";
        },
      },
    },
  },
}));
