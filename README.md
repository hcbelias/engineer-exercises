# Engineer Exercises

A collection of hands-on coding exercises to build depth in the areas most commonly probed in fullstack/frontend interviews.

Each exercise is a self-contained app with pre-built scaffolding and clearly marked `TODO`s. Read the app's `README.md` for the problem statement, what to implement, and interview discussion questions.

## Exercises

| #   | App                                                                | Topic                                                                    |
| --- | ------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| 1   | [`apps/realtime-chat`](apps/realtime-chat/README.md)               | Real-time Socket.io — rooms, namespaces, presence, reconnection          |
| 2   | [`apps/github-explorer`](apps/github-explorer/README.md)           | TanStack Query — caching, infinite scroll, optimistic mutations          |
| 3   | [`apps/accessible-form`](apps/accessible-form/README.md)           | Accessibility — ARIA patterns, focus management, keyboard navigation     |
| 4   | [`apps/scalable-dashboard`](apps/scalable-dashboard/README.md)     | Scalable frontend — code splitting, virtualization, context optimization |
| 5   | [`apps/distributed-checkout`](apps/distributed-checkout/README.md) | Distributed systems — saga pattern, idempotency, retry with backoff      |

## Getting started

```bash
# Install dependencies
pnpm install

# Run all apps in parallel
pnpm dev

# Run a single app
turbo dev --filter=@exercises/realtime-chat
```

| App                    | URL                   |
| ---------------------- | --------------------- |
| realtime-chat (server) | http://localhost:3001 |
| realtime-chat (client) | http://localhost:3002 |
| github-explorer        | http://localhost:3003 |
| accessible-form        | http://localhost:3004 |
| scalable-dashboard     | http://localhost:3005 |
| distributed-checkout   | http://localhost:3006 |

## Stack

- **Monorepo**: [Turborepo](https://turbo.build) + [pnpm workspaces](https://pnpm.io/workspaces)
- **Language**: TypeScript throughout
- **Frontend**: React 18 + Vite (exercises 1–3), Next.js 15 App Router (exercise 4)
- **Backend**: Node.js + Express (exercises 1, 5)
