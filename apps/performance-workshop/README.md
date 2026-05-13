# Exercise 6 — Performance Workshop: Debounce, Throttle & Memoization

A React 18 + Vite app with **intentional performance issues** pre-built in. Your job is to identify each problem, implement the missing primitives, and verify the fix with React DevTools Profiler.

## Stack

- React 18 + Vite 6 + TypeScript
- No external performance libraries — implement the hooks from scratch
- 5,000 mock products generated deterministically

## Getting started

```bash
pnpm install        # from repo root
pnpm dev            # starts all apps; this one runs on http://localhost:3007
```

Or start only this app:
```bash
cd apps/performance-workshop
pnpm dev
```

## What's already built

| File | Status | Purpose |
|---|---|---|
| `src/data/mockProducts.ts` | ✅ Ready | 5,000 deterministic products |
| `src/utils/compute.ts` | ✅ Ready | `filterAndSortProducts` and `calculateStats` — pure, expensive functions |
| `src/components/ProductList/FilterBar.tsx` | ✅ Ready | Filter UI (category, price, stock, sort) |
| `src/hooks/useDebounce.ts` | ❌ TODO | Debounce a value by N ms |
| `src/hooks/useThrottle.ts` | ❌ TODO | Throttle a value to at most 1 update per N ms |
| `src/hooks/useDebouncedCallback.ts` | ❌ TODO | Debounce a callback function (bonus) |
| `src/App.tsx` | ⚠️ PERF ISSUE | `handleAddToCart` defined without `useCallback` |
| `src/components/SearchPanel/index.tsx` | ⚠️ PERF ISSUE | Search fires on every keystroke — no debounce |
| `src/components/SearchPanel/SearchResults.tsx` | ⚠️ PERF ISSUE | Missing `React.memo` |
| `src/components/StatsPanel.tsx` | ⚠️ PERF ISSUE | `calculateStats` runs on every render — no `useMemo` |
| `src/components/ProductList/index.tsx` | ⚠️ PERF ISSUE | `filterAndSortProducts` runs on every render — no `useMemo` |
| `src/components/ProductList/ProductCard.tsx` | ⚠️ PERF ISSUE | Missing `React.memo` |
| `src/components/ScrollTracker/index.tsx` | ⚠️ PERF ISSUE | `setState` called on every scroll event — no throttle |

## Exercises

### 1. Implement `useDebounce` — `src/hooks/useDebounce.ts`

The function signature is in place. Implement a hook that delays propagating a value until the input has been stable for a given duration. Apply it in `src/components/SearchPanel/index.tsx` to prevent the product filter from running on every keystroke.

**Verify**: Type quickly in the search box — the filter should fire once per pause, not on every character.

---

### 2. Implement `useThrottle` — `src/hooks/useThrottle.ts`

Implement a hook that limits how often a value can update. Apply it in `src/components/ScrollTracker/index.tsx` so the scroll position overlay updates at most 10 times per second instead of on every scroll event.

**Verify**: Scroll the page and watch the fixed overlay — it should update at most 10× per second.

---

### 3. Implement `useDebouncedCallback` (bonus) — `src/hooks/useDebouncedCallback.ts`

Unlike `useDebounce` (which debounces a *value*), implement a hook that debounces a *callback function*. The returned function reference must be stable across renders and must always invoke the latest version of the wrapped callback to avoid stale closures.

---

### 4. Fix `StatsPanel` — `src/components/StatsPanel.tsx`

`calculateStats` runs an expensive computation over 5,000 products on every render, even though the product list never changes. Fix it so the computation only runs when its inputs actually change.

**Verify**: Open React DevTools → Profiler. Record while clicking "Add to cart". StatsPanel should show near-zero render time after the first render.

---

### 5. Fix `ProductList` — `src/components/ProductList/index.tsx`

The filter and sort computation runs every time `ProductList` re-renders, including re-renders caused by cart changes that have nothing to do with the current filters. Fix it so the computation only re-runs when the filters change.

---

### 6. Fix `ProductCard` and `handleAddToCart` — `src/App.tsx` + `src/components/ProductList/ProductCard.tsx`

Clicking "Add to cart" on one product currently causes all 100 visible product cards to re-render. Fix the component and its callback prop so that only the card whose state changed re-renders.

**Verify**: In the Profiler, click "Add to cart" on one product — only that card should show a render, not all 100.

---

## Acceptance criteria

- [ ] `useDebounce` delays the returned value by `delay` ms and resets on each change
- [ ] `useThrottle` limits updates to at most one per `interval` ms (trailing edge)
- [ ] `useDebouncedCallback` returns a stable reference that debounces the wrapped callback
- [ ] Typing quickly in the search box triggers `filterAndSortProducts` once per pause, not per keystroke
- [ ] Scrolling the page updates the `ScrollTracker` overlay at most 10 times per second
- [ ] React DevTools Profiler shows `StatsPanel` with 0 ms render time after the first render
- [ ] React DevTools Profiler shows `filterAndSortProducts` not re-running when cart changes
- [ ] Clicking "Add to cart" causes only the affected `ProductCard` to re-render (not all 100)
- [ ] `type-check` passes: `pnpm type-check`

## Discussion questions

1. **Debounce vs. throttle**: What is the fundamental difference? Give a concrete example of a UI interaction where you'd choose debounce and one where you'd choose throttle — and explain why the other technique would be wrong for each.

2. **The memo + useCallback contract**: Why does wrapping `ProductCard` in `React.memo` alone fail to prevent re-renders when `onAddToCart` is not wrapped in `useCallback`? What does shallow equality actually check?

3. **Cost/benefit of memoization**: `useMemo` and `useCallback` add complexity and have their own overhead (allocation, dependency array comparison). How do you decide when memoization is worth it? What signals in the Profiler tell you a component *needs* memoization vs. is fast enough without it?

4. **Leading vs. trailing throttle**: The exercise uses trailing-edge throttle. What is the difference between leading and trailing edge? For scroll-to-top button visibility, which edge matters more and why?

5. **Strict Mode and timers**: React 18 Strict Mode in development runs effects twice by invoking setup + cleanup + setup. How does this interact with `useDebounce` and `useThrottle`? Could it cause the debounce to fire at unexpected times? How do you protect against it?

6. **Build vs. buy**: Lodash's `_.debounce` and `_.throttle` are well-tested and handle edge cases (cancel, flush, maxWait). What do you gain from implementing these hooks yourself vs. wrapping Lodash? When would you reach for the library version in production?
