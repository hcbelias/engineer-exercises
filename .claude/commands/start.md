You are a senior engineer giving a pre-coding briefing for the exercise: $ARGUMENTS

Read the README for the exercise. Match $ARGUMENTS to:

- realtime-chat → apps/realtime-chat/README.md
- github-explorer → apps/github-explorer/README.md
- accessible-form → apps/accessible-form/README.md
- scalable-dashboard → apps/scalable-dashboard/README.md
- distributed-checkout → apps/distributed-checkout/README.md
- performance-workshop → apps/performance-workshop/README.md
- bundle-workshop → apps/bundle-workshop/README.md

Then read the scaffolded entry-point files to understand what is already wired up:

**realtime-chat**: apps/realtime-chat/server/src/index.ts, apps/realtime-chat/server/src/types.ts, apps/realtime-chat/client/src/App.tsx

**github-explorer**: apps/github-explorer/src/api/github.ts, apps/github-explorer/src/api/types.ts, apps/github-explorer/src/App.tsx

**accessible-form**: apps/accessible-form/src/App.tsx, apps/accessible-form/src/components/MultiStepForm/index.tsx, apps/accessible-form/src/styles/global.css

**scalable-dashboard**: apps/scalable-dashboard/src/app/layout.tsx, apps/scalable-dashboard/src/components/providers/DashboardProvider.tsx, apps/scalable-dashboard/src/components/UserTable/index.tsx

**distributed-checkout**: apps/distributed-checkout/src/types.ts, apps/distributed-checkout/src/saga/saga.types.ts, apps/distributed-checkout/src/services/inventory.service.ts

Also read the first TODO stub file for each exercise:

**realtime-chat**: apps/realtime-chat/server/src/handlers/room.handler.ts
**github-explorer**: apps/github-explorer/src/queryKeys/index.ts
**accessible-form**: apps/accessible-form/src/hooks/useFocusTrap.ts
**scalable-dashboard**: apps/scalable-dashboard/src/components/charts/LazyChart.tsx
**distributed-checkout**: apps/distributed-checkout/src/retry/withRetry.ts

Produce a briefing with exactly these five sections:

## What's already working

List what is pre-scaffolded and ready to use — types, API wrappers, service clients, styled components. Name actual exported symbols and their file paths. Be specific, not generic.

## The core concept

One paragraph: what is the central engineering challenge in this exercise? Name the pattern (e.g., "saga pattern with compensation", "query key hierarchy for cache invalidation", "focus trap for modal accessibility"). Explain it in plain terms without assuming the reader knows the term.

## Recommended coding order

A numbered list of 5–8 steps in the order to implement them. Each step names a specific file and what to implement first. Explain dependencies explicitly (e.g., "implement withRetry before checkout.saga.ts because the saga calls it").

## First 15 minutes

The single most important thing to get working first, and why it unblocks everything else. Paste the exact function signature from the first TODO stub file so there is a concrete anchor to start from.

## Watch out for

Two common mistakes specific to this exercise — not generic TypeScript or React advice, but pitfalls unique to the pattern being practiced here.
