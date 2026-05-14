# Exercise 7 — Bundle Workshop: Code Splitting & Lazy Loading

A React 18 + Vite app with **four intentional bundle bloat issues** pre-built in. Your job is to identify each problem using the bundle visualiser, apply the fix, and verify that the initial chunk shrinks.

## Stack

- React 18 + Vite 6 + TypeScript
- `rollup-plugin-visualizer` — generates `dist/stats.html` (treemap of your bundle)
- Three synthetic heavy libraries (~7–8 KB each): `chartEngine`, `pdfEngine`, `richTextEngine`
- Large static dataset: `geoData` (120 countries, ~18 KB)

## Getting started

```bash
pnpm install        # from repo root
pnpm dev            # starts all apps; this one runs on http://localhost:3008
```

Or start only this app:

```bash
cd apps/bundle-workshop
pnpm dev            # dev server — hot reload, no bundle analysis
pnpm build          # production build — generates dist/ and dist/stats.html
pnpm preview        # serve the production build locally
```

## Measuring the problem

```bash
pnpm build
# Note the size of index-[hash].js in the terminal output
open dist/stats.html   # or: npx serve dist/stats.html
```

The treemap shows every module in your bundle and which chunk it lives in.
**Before any fixes**, everything should appear in a single large chunk.
**After all fixes**, the initial chunk should shrink to roughly 15–20 KB gzipped,
with `chartEngine`, `pdfEngine`, `richTextEngine`, and `geoData` in separate chunks.

## What's already built

| File                                | Status          | Purpose                                           |
| ----------------------------------- | --------------- | ------------------------------------------------- |
| `src/lib/chartEngine.ts`            | ✅ Ready        | Synthetic chart library (~8 KB)                   |
| `src/lib/pdfEngine.ts`              | ✅ Ready        | Synthetic PDF library (~7 KB)                     |
| `src/lib/richTextEngine.ts`         | ✅ Ready        | Synthetic rich-text library (~8 KB)               |
| `src/data/geoData.ts`               | ✅ Ready        | 120-country dataset (~18 KB)                      |
| `src/utils/formatters.ts`           | ✅ Ready        | 30+ formatting utilities                          |
| `src/components/Nav.tsx`            | ✅ Ready        | Tab navigation                                    |
| `src/components/Spinner.tsx`        | ✅ Ready        | Loading fallback for Suspense                     |
| `src/components/RichTextEditor.tsx` | ✅ Ready        | Heavy editor (wraps richTextEngine)               |
| `src/pages/DashboardPage.tsx`       | ⚠️ BUNDLE ISSUE | `import *` blocks tree shaking                    |
| `src/pages/AnalyticsPage.tsx`       | ⚠️ BUNDLE ISSUE | chartEngine in initial chunk                      |
| `src/pages/ReportsPage.tsx`         | ⚠️ BUNDLE ISSUE | geoData (18 KB) in initial chunk                  |
| `src/pages/SettingsPage.tsx`        | ⚠️ BUNDLE ISSUE | RichTextEditor eagerly imported                   |
| `src/App.tsx`                       | ⚠️ BUNDLE ISSUE | All pages statically imported — no code splitting |

## Exercises

### 1. Route-level code splitting — `src/App.tsx`

All page components are imported statically, which forces every page's dependencies into the initial bundle. Make the heavy pages load on demand so the browser only downloads what it needs for the current view.

Dashboard can remain eager — it's the landing page. The other three pages should only download when the user navigates to them, and the UI should display the loading fallback while the chunk is in flight.

**Verify**: After rebuilding, `pnpm build` should show multiple JS chunks instead of one.

---

### 2. Deferred data loading — `src/pages/ReportsPage.tsx`

The geographic dataset (~18 KB) is loaded unconditionally when the Reports page is visited, but it is only used when the user triggers the export action. Move the data load so it happens at the moment it is actually needed, not on page load.

**Verify**: In `dist/stats.html`, the geo dataset should appear in its own chunk separate from the Reports page chunk.

---

### 3. Conditional component loading — `src/pages/SettingsPage.tsx`

The rich text editor is imported eagerly even though it only renders when the user clicks "Edit bio". Make it load only when it is about to be shown.

**Verify**: Navigate to /settings without clicking "Edit bio" — the rich text engine chunk should not appear in the Network tab. Click "Edit bio" and the chunk should download at that point.

---

### 4. Tree shaking — `src/pages/DashboardPage.tsx`

The page imports the entire formatters module using a namespace import, even though it only uses a small subset of the exported functions. Fix the import so the bundler can eliminate the unused exports.

**Verify**: In `dist/stats.html`, the formatters module should occupy less space in the Dashboard chunk after the fix.

---

## Acceptance criteria

- [ ] `pnpm build` produces at least 4 chunks (initial + analytics + reports + settings)
- [ ] Initial chunk is under 25 KB gzipped (verify in terminal build output)
- [ ] `dist/stats.html` treemap shows `chartEngine` only in the analytics chunk
- [ ] `dist/stats.html` treemap shows `geoData` in a separate chunk (not in reports chunk)
- [ ] Clicking "Edit bio" in Settings triggers a network request for the richTextEngine chunk
- [ ] Dashboard imports only named formatters (no `import *`)
- [ ] Navigating to each page shows the `<Spinner>` briefly on first visit (Suspense working)
- [ ] `pnpm type-check` passes

## Discussion questions

1. **Static vs. dynamic imports**: What is the fundamental difference between `import x from "..."` and `await import("...")`? How does each affect the module graph that Rollup builds?

2. **`React.lazy` internals**: `React.lazy` wraps a dynamic import. What does the component do while the Promise is pending? What happens if the Promise rejects? How does `<ErrorBoundary>` fit in?

3. **Chunk strategy**: How does Vite/Rollup decide what goes into the same chunk by default? What are the trade-offs of splitting aggressively (many tiny chunks) vs. conservatively (one large chunk)?

4. **Prefetching**: After code-splitting, a user navigating from Dashboard to Analytics experiences a brief delay while the chunk downloads. How would you implement prefetching on hover so the chunk loads before the click? (Hint: `<link rel="modulepreload">` or Vite's `import(/* @vite-prefetch */ "...")`)

5. **Tree shaking depth**: Why does `import * as fmt` prevent tree shaking in some environments even though Rollup can statically trace property accesses? What role does the `"sideEffects"` field in `package.json` play?

6. **Measuring impact on users**: The build output shows gzipped sizes. What user-facing metrics actually improve when the initial bundle shrinks? How would you measure LCP, TTI, and FCP before and after these changes in a real app?
