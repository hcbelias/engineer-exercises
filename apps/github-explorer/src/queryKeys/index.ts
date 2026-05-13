// TODO: Implement a hierarchical query key factory.
//
// Query key factories serve two purposes:
// 1. Centralise keys so they never go out of sync across hooks
// 2. Enable hierarchical invalidation — invalidating a parent key
//    also invalidates all child keys
//
// Required namespaces: users (all, detail, repos) and repos (all, detail).
// Keys must be structured so that invalidating a user also invalidates their repos.
//
// Example of hierarchical invalidation:
//   queryClient.invalidateQueries({ queryKey: queryKeys.users.detail("torvalds") })
//   → invalidates BOTH the user detail AND all of their repo pages
//
// Type the keys as const tuples so TypeScript catches key mismatches.

export const queryKeys = {
  users: {
    // TODO
    all: () => ["users"] as const,
    detail: (_login: string) => {
      throw new Error("TODO: implement queryKeys.users.detail");
    },
    repos: (_login: string, _page: number) => {
      throw new Error("TODO: implement queryKeys.users.repos");
    },
  },
  repos: {
    all: () => ["repos"] as const,
    detail: (_owner: string, _name: string) => {
      throw new Error("TODO: implement queryKeys.repos.detail");
    },
  },
};
