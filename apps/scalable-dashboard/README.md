# Exercise 4 — Scalable Dashboard with Next.js

A dashboard that currently loads everything eagerly, renders 10,000 DOM nodes, and has a context that causes full-tree re-renders on every state change. Make it production-ready.

## The problem

Performance and architecture trade-offs are constant in real products:
- Shipping too much JavaScript upfront kills Time to Interactive
- Rendering too many DOM nodes causes jank
- Monolithic context causes invisible performance regressions as a codebase grows
- Server vs. Client Component decisions affect bundle size, SEO, and data loading patterns

This exercise forces you to measure, decide, and justify.

## What's pre-scaffolded

| File | Status |
|------|--------|
| `src/app/layout.tsx` | Done — root layout, Server Component |
| `src/app/page.tsx` | Done — home page, Server Component |
| `src/app/analytics/page.tsx` | Done — imports LazyChart, **chart is not yet lazy** |
| `src/app/users/page.tsx` | Done — renders UserTable |
| `src/components/Sidebar.tsx` | Done — Server Component, pure navigation |
| `src/components/Header.tsx` | Done — Server Component with Client child |
| `src/components/charts/ChartWrapper.tsx` | Done — heavy canvas component (Client Component) |
| `src/components/charts/LazyChart.tsx` | **TODO** — currently eager, needs `next/dynamic` |
| `src/components/UserTable/mockData.ts` | Done — 10,000 seeded users |
| `src/components/UserTable/VirtualRow.tsx` | Done — pre-styled row component |
| `src/components/UserTable/index.tsx` | **TODO** — currently renders all 10,000 rows |
| `src/components/Notifications/NotificationPanel.tsx` | Done — panel component |
| `src/components/Notifications/NotificationBell.tsx` | Partial — **panel should be lazy-loaded** |
| `src/components/providers/DashboardProvider.tsx` | **TODO** — monolithic context needs splitting |
| `src/app/loading.tsx` (all routes) | **TODO** — placeholder skeletons |
| `src/app/error.tsx` | Partial — basic shell |
| `next.config.ts` | Partial — bundle analyzer is commented out |

## Your TODOs

### 1. Skeleton loading UIs — `src/app/*/loading.tsx`
Implement meaningful skeleton loading UIs for the home, analytics, and users pages so users see a structured placeholder instead of a blank screen while data loads.

### 2. Lazy-load charts — `src/components/charts/LazyChart.tsx`
The chart component uses browser APIs that are not available on the server. Make it load only on the client side and only when it is needed, keeping it out of the initial bundle.

### 3. Lazy-load notification panel — `src/components/Notifications/NotificationBell.tsx`
The notification panel is heavy and only shown on demand. It should not be part of the initial JS bundle. Verify with the bundle analyzer that it lands in a separate chunk.

### 4. Virtualize the user table — `src/components/UserTable/index.tsx`
The table currently renders all 10,000 rows into the DOM simultaneously, which causes severe jank. Refactor it to render only the rows visible in the viewport. Measure the commit time in React DevTools Profiler before and after.

### 5. Fix context re-renders — `src/components/providers/DashboardProvider.tsx`
The monolithic context causes every consumer to re-render whenever any piece of state changes — even state they don't use. Refactor it so components only re-render when the slice of state they depend on actually changes. Document your approach and the trade-off in a comment.

### 6. Bundle analysis
1. Uncomment the bundle analyzer in `next.config.ts`
2. Run `pnpm analyze`
3. Note which chunks are largest before your lazy-loading changes, and confirm they shrink or move to separate chunks after.

## How to run

```bash
# From this app's directory:
pnpm dev

# From the monorepo root:
turbo dev --filter=@exercises/scalable-dashboard
```

App starts on **http://localhost:3005**

```bash
# Run bundle analyzer:
pnpm analyze
```

## Acceptance criteria

- [ ] charts/LazyChart.tsx uses `next/dynamic` with `ssr: false`
- [ ] NotificationPanel is in a separate JS chunk (verify in Network tab)
- [ ] UserTable renders only ~20 DOM rows regardless of dataset size
- [ ] React DevTools Profiler shows significantly faster commit time for /users
- [ ] DashboardProvider refactored to avoid cascading re-renders
- [ ] All `loading.tsx` files show meaningful skeleton UIs

## Discussion questions

1. **Server vs. Client Components**: In `analytics/page.tsx`, the page itself is a Server Component that imports `LazyChart` (a Client Component). Is this allowed? What are the rules about mixing them? What CAN'T you do?

2. **`loading.tsx` vs manual Suspense**: Next.js's file-based `loading.tsx` is essentially a pre-configured `<Suspense>` boundary. When would you bypass it and use manual `<Suspense>` wrapping directly? Give a concrete scenario.

3. **Virtualization trade-offs**: Virtual lists require a fixed or estimatable row height. What happens if your rows have dynamic height (e.g., expandable rows)? How does `@tanstack/react-virtual` handle this with `measureElement`?

4. **Context vs. external store**: You're refactoring `DashboardProvider`. A colleague suggests using Zustand instead. What would Zustand give you that the split-context approach doesn't? When is that trade-off worth it?

5. **Streaming SSR**: Next.js App Router supports streaming — it can send HTML to the browser in chunks rather than waiting for all data. How does `loading.tsx` relate to streaming? What's the user-visible difference between streaming and a traditional loading spinner?
