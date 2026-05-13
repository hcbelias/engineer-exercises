You are a senior engineer reviewing the implementation of the exercise named: $ARGUMENTS

First, read the README for that exercise to retrieve its Acceptance Criteria section. Match $ARGUMENTS to the correct path:
- realtime-chat → apps/realtime-chat/README.md
- github-explorer → apps/github-explorer/README.md
- accessible-form → apps/accessible-form/README.md
- scalable-dashboard → apps/scalable-dashboard/README.md
- distributed-checkout → apps/distributed-checkout/README.md
- performance-workshop → apps/performance-workshop/README.md
- bundle-workshop → apps/bundle-workshop/README.md

Read the matched README and extract every item from the "Acceptance criteria" checklist.

Then read the key implementation files for that exercise:

**realtime-chat**: read all of these:
- apps/realtime-chat/server/src/handlers/room.handler.ts
- apps/realtime-chat/server/src/handlers/message.handler.ts
- apps/realtime-chat/server/src/namespaces/chat.namespace.ts
- apps/realtime-chat/server/src/namespaces/presence.namespace.ts
- apps/realtime-chat/client/src/socket.ts
- apps/realtime-chat/client/src/hooks/useChat.ts
- apps/realtime-chat/client/src/hooks/useRoom.ts
- apps/realtime-chat/client/src/hooks/usePresence.ts

**github-explorer**: read all of these:
- apps/github-explorer/src/queryClient.ts
- apps/github-explorer/src/queryKeys/index.ts
- apps/github-explorer/src/hooks/useUser.ts
- apps/github-explorer/src/hooks/useUserRepos.ts
- apps/github-explorer/src/hooks/useRepo.ts
- apps/github-explorer/src/hooks/useStarRepo.ts

**accessible-form**: read all of these:
- apps/accessible-form/src/hooks/useFocusTrap.ts
- apps/accessible-form/src/hooks/useFocusReturn.ts
- apps/accessible-form/src/hooks/useAnnounce.ts
- apps/accessible-form/src/components/SkipNav/index.tsx
- apps/accessible-form/src/components/Modal/index.tsx
- apps/accessible-form/src/components/ComboBox/index.tsx
- apps/accessible-form/src/components/MultiStepForm/ProgressBar.tsx
- apps/accessible-form/src/App.tsx

**scalable-dashboard**: read all of these:
- apps/scalable-dashboard/src/components/charts/LazyChart.tsx
- apps/scalable-dashboard/src/components/UserTable/index.tsx
- apps/scalable-dashboard/src/components/providers/DashboardProvider.tsx
- apps/scalable-dashboard/src/components/Notifications/NotificationBell.tsx
- apps/scalable-dashboard/src/app/loading.tsx
- apps/scalable-dashboard/src/app/analytics/loading.tsx
- apps/scalable-dashboard/src/app/users/loading.tsx

**distributed-checkout**: read all of these:
- apps/distributed-checkout/src/saga/checkout.saga.ts
- apps/distributed-checkout/src/retry/withRetry.ts
- apps/distributed-checkout/src/idempotency/idempotency.store.ts
- apps/distributed-checkout/src/handlers/checkout.handler.ts
- apps/distributed-checkout/test/checkout.test.ts

**performance-workshop**: read all of these:
- apps/performance-workshop/src/hooks/useDebounce.ts
- apps/performance-workshop/src/hooks/useThrottle.ts
- apps/performance-workshop/src/hooks/useDebouncedCallback.ts
- apps/performance-workshop/src/App.tsx
- apps/performance-workshop/src/components/SearchPanel/index.tsx
- apps/performance-workshop/src/components/SearchPanel/SearchResults.tsx
- apps/performance-workshop/src/components/StatsPanel.tsx
- apps/performance-workshop/src/components/ProductList/index.tsx
- apps/performance-workshop/src/components/ProductList/ProductCard.tsx
- apps/performance-workshop/src/components/ScrollTracker/index.tsx

**bundle-workshop**: read all of these:
- apps/bundle-workshop/src/App.tsx
- apps/bundle-workshop/src/pages/DashboardPage.tsx
- apps/bundle-workshop/src/pages/AnalyticsPage.tsx
- apps/bundle-workshop/src/pages/ReportsPage.tsx
- apps/bundle-workshop/src/pages/SettingsPage.tsx

After reading the relevant files, evaluate each acceptance criterion one by one. For each item:
- State the criterion verbatim
- Verdict: **PASS**, **FAIL**, or **PARTIAL**
- Reasoning: cite the specific file and what you found (or what is still a TODO stub)

End with:
1. A count: X of Y criteria met
2. The 1–2 highest-priority fixes to reach full completion (reference exact file paths)
3. One thing that is already implemented particularly well

Be direct. Do not guess — if a function body is entirely a TODO stub, mark it FAIL.
