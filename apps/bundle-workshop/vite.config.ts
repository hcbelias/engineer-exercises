import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// Run `pnpm build` to generate dist/ and open dist/stats.html to inspect the bundle.
// After applying code-splitting fixes, rebuild and compare the chunk sizes.
//
// Key metrics to watch:
//   - Initial chunk size (index-[hash].js) — what the user downloads before seeing anything
//   - Number of chunks — each lazy-loaded page/component becomes its own file
//   - Largest module in each chunk (visible in stats.html treemap)

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "dist/stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: "treemap",
    }),
  ],
  server: { port: 3008 },
  build: {
    // TODO: after implementing React.lazy for all pages, uncomment this to verify
    // that each page lands in its own chunk and the initial chunk shrinks.
    //
    // rollupOptions: {
    //   output: {
    //     manualChunks: undefined, // let Rollup's natural splitting work
    //   },
    // },
  },
});
