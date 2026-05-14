Scan the following files for `TODO` markers and report the completion status of each exercise in this monorepo. For each exercise, count how many TODO items remain and list them by file. At the end, give a summary table.

Use Read to check these files in order:

**Exercise 1 — realtime-chat**

- apps/realtime-chat/client/src/socket.ts
- apps/realtime-chat/client/src/hooks/useChat.ts
- apps/realtime-chat/client/src/hooks/useRoom.ts
- apps/realtime-chat/client/src/hooks/usePresence.ts
- apps/realtime-chat/server/src/handlers/room.handler.ts
- apps/realtime-chat/server/src/handlers/message.handler.ts
- apps/realtime-chat/server/src/namespaces/chat.namespace.ts
- apps/realtime-chat/server/src/namespaces/presence.namespace.ts

**Exercise 2 — github-explorer**

- apps/github-explorer/src/queryClient.ts
- apps/github-explorer/src/queryKeys/index.ts
- apps/github-explorer/src/hooks/useUser.ts
- apps/github-explorer/src/hooks/useUserRepos.ts
- apps/github-explorer/src/hooks/useRepo.ts
- apps/github-explorer/src/hooks/useStarRepo.ts

**Exercise 3 — accessible-form**

- apps/accessible-form/src/hooks/useFocusTrap.ts
- apps/accessible-form/src/hooks/useFocusReturn.ts
- apps/accessible-form/src/hooks/useAnnounce.ts
- apps/accessible-form/src/components/SkipNav/index.tsx
- apps/accessible-form/src/components/Modal/index.tsx
- apps/accessible-form/src/components/ComboBox/index.tsx
- apps/accessible-form/src/components/MultiStepForm/ProgressBar.tsx
- apps/accessible-form/src/App.tsx

**Exercise 4 — scalable-dashboard**

- apps/scalable-dashboard/src/components/charts/LazyChart.tsx
- apps/scalable-dashboard/src/components/UserTable/index.tsx
- apps/scalable-dashboard/src/components/providers/DashboardProvider.tsx
- apps/scalable-dashboard/src/components/Notifications/NotificationBell.tsx
- apps/scalable-dashboard/src/app/loading.tsx
- apps/scalable-dashboard/src/app/analytics/loading.tsx
- apps/scalable-dashboard/src/app/users/loading.tsx

**Exercise 5 — distributed-checkout**

- apps/distributed-checkout/src/saga/checkout.saga.ts
- apps/distributed-checkout/src/retry/withRetry.ts
- apps/distributed-checkout/src/idempotency/idempotency.store.ts
- apps/distributed-checkout/src/handlers/checkout.handler.ts
- apps/distributed-checkout/test/checkout.test.ts

**Exercise 6 — performance-workshop**

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

**Exercise 7 — bundle-workshop**

- apps/bundle-workshop/src/App.tsx
- apps/bundle-workshop/src/pages/DashboardPage.tsx
- apps/bundle-workshop/src/pages/AnalyticsPage.tsx
- apps/bundle-workshop/src/pages/ReportsPage.tsx
- apps/bundle-workshop/src/pages/SettingsPage.tsx

For each file, report:

- File path (short, relative to apps/)
- Number of remaining TODOs
- A one-line description of each TODO item

End with a markdown summary table:

| Exercise      | TODOs Remaining | Status       |
| ------------- | --------------- | ------------ |
| realtime-chat | N               | 🔴 / 🟡 / 🟢 |

Use 🟢 for 0 TODOs, 🟡 for 1–3, and 🔴 for 4 or more. After the table, recommend which exercise to tackle next based on the number of remaining items and logical dependency order (e.g., distributed-checkout tests depend on the saga and retry being implemented first).
