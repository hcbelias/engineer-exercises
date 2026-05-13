"use client";

// TODO: Implement LazyChart using next/dynamic
//
// Currently this file re-exports ChartWrapper directly (eager load).
// Your job is to wrap it with next/dynamic so the ChartWrapper code
// only loads when the analytics page mounts.
//
// Requirements:
// 1. Use next/dynamic to lazy-load ChartWrapper
// 2. Disable SSR — explain in a comment WHY this is necessary
//    (think about what browser APIs ChartWrapper relies on)
// 3. Provide a loading skeleton that prevents layout shift while the chunk downloads
//
// Before your change: ChartWrapper is in the main bundle.
// After your change: ChartWrapper is in a separate chunk loaded lazily.
// Verify with: ANALYZE=true pnpm build
//
// Discussion: The analytics/page.tsx is a Server Component that imports LazyChart.
// LazyChart is a Client Component. Can a Server Component import a Client Component?
// What are the rules around this?

import { ChartWrapper } from "./ChartWrapper";

export { ChartWrapper as LazyChart };
