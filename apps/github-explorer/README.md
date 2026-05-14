# Exercise 2 — GitHub Explorer with TanStack Query

Build a GitHub user and repository explorer that manages all server state through TanStack Query — no `useState` for fetched data.

## The problem

Most apps that "work" still have subtle server-state bugs: stale UI after mutations, waterfalling requests, missing loading states, or re-fetching data that was just fetched. This exercise forces you to use TanStack Query correctly by:

- Designing a **query key hierarchy** that enables precise cache invalidation
- Implementing **infinite scroll** with proper pagination state
- Writing an **optimistic update** with rollback — the UI must update before the server confirms

## What's pre-scaffolded

| File                     | Status                                                            |
| ------------------------ | ----------------------------------------------------------------- |
| `src/api/github.ts`      | Done — typed fetch wrappers for all GitHub calls                  |
| `src/api/types.ts`       | Done — `GithubUser`, `GithubRepo`, typed error classes            |
| `src/main.tsx`           | Done — `QueryClientProvider` + `ReactQueryDevtools` wired up      |
| `src/App.tsx`            | Done — search → user card → repo list layout                      |
| `src/components/*`       | Done — `UserSearch`, `UserCard`, `RepoCard`, `RepoList` shells    |
| `src/queryClient.ts`     | Partial — `retry` logic present, **`staleTime`/`gcTime` missing** |
| `src/queryKeys/index.ts` | Stub — factory shape defined, **implementations are `TODO`**      |
| `src/hooks/*.ts`         | Stub — signatures + docs present, **bodies are `TODO`**           |

## Your TODOs

### `src/queryClient.ts`

Configure appropriate cache lifetimes so that data is considered fresh for 1 minute and garbage-collected after 5 minutes of inactivity.

### `src/queryKeys/index.ts`

Implement the query key factory. Keys must be structured hierarchically so that invalidating a parent key (e.g. a user) automatically cascades to all child queries (e.g. that user's repos).

### `src/hooks/useUser.ts`

Fetch a GitHub user by username. The query should be disabled when no username has been provided.

### `src/hooks/useUserRepos.ts`

Fetch a user's repositories with infinite scroll pagination. The hook should know when there are no more pages to load and expose a flat list of all repos loaded so far.

### `src/hooks/useRepo.ts`

Fetch a single repository. Used to re-read a repo's state after a mutation.

### `src/hooks/useStarRepo.ts`

Implement star/unstar as a mutation with a full optimistic update: the UI must reflect the new state immediately, before the server responds. If the server call fails, the UI must revert to its previous state. Once the mutation settles (success or failure), the repos cache should be refreshed.

## How to run

```bash
# From this app's directory:
pnpm dev

# Or from the monorepo root:
turbo dev --filter=@exercises/github-explorer
```

App starts on **http://localhost:3003**

Open the **React Query Devtools** (bottom-right icon) to inspect cache state while you work.

## Acceptance criteria

- [ ] Searching for a valid GitHub username shows the user card and first 10 repos
- [ ] "Load more" appends the next 10 repos without replacing the previous ones
- [ ] "Load more" disappears when there are no more pages
- [ ] Clicking Star/Unstar updates the button immediately (before the server responds)
- [ ] If the mock server call fails (remove the `await new Promise` in `starRepo`/`unstarRepo` and throw), the button reverts to its original state
- [ ] Searching the same username a second time uses cached data (no network request — verify in DevTools Network tab)
- [ ] Searching a non-existent user shows a clear "not found" message

## Discussion questions

1. **staleTime vs gcTime**: Explain the difference. What happens if you set `staleTime > gcTime`? (This is a misconfiguration — explain why.)

2. **Key hierarchy**: Your `queryKeys.users.detail(login)` key is a parent of `queryKeys.users.repos(login, ...)`. What does that mean in practice? Write the `invalidateQueries` call that would refetch both the user profile and all their repo pages with one call.

3. **Optimistic update race condition**: What happens if the user clicks Star on repo A, then immediately clicks Star on repo B before the first response comes back? Walk through the `onMutate` → `onError`/`onSettled` cycle for both mutations.

4. **Infinite query refetch**: When TanStack Query refetches an infinite query in the background, it refetches ALL loaded pages in sequence. For a user who has loaded 10 pages of repos, how many API calls does a background refetch make? How would you limit this?

5. **No useState for server state**: Why is it an anti-pattern to store fetched data in `useState`? Give a concrete scenario where it causes a bug.
