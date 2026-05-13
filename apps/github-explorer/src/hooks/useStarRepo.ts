import { useMutation, useQueryClient } from "@tanstack/react-query";
import { starRepo, unstarRepo } from "../api/github";
import { queryKeys } from "../queryKeys";
import type { GithubRepo } from "../api/types";
import type { InfiniteData } from "@tanstack/react-query";

interface StarVariables {
  owner: string;
  name: string;
  currentlyStarred: boolean;
}

// TODO: Implement useStarRepo with an optimistic update
//
// This is the most important mutation pattern to understand for interviews.
// Read the TanStack Query docs on optimistic updates before implementing.
//
// Requirements:
//
// 1. mutationFn: toggle star/unstar based on currentlyStarred
//
// 2. onMutate (optimistic update):
//    a. Cancel any in-flight queries that could overwrite the optimistic state
//    b. Snapshot the current cache data so you can roll back on error
//    c. Immediately update the cache to reflect the expected outcome
//    d. Return the snapshot so onError can use it for rollback
//
// 3. onError: roll back the cache to the snapshot taken in onMutate
//
// 4. onSettled: invalidate the repos query so the server state is refreshed
//
// Discussion questions:
// - What's the race condition risk if you don't cancel in-flight queries in onMutate?
// - Why do we invalidate on onSettled instead of onSuccess?
// - What happens if the user stars 3 repos quickly in a row before any responses come back?

export function useStarRepo() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, StarVariables, { previousData: InfiniteData<GithubRepo[]> | undefined }>({
    mutationFn: async ({ owner, name, currentlyStarred }) => {
      // TODO
      if (currentlyStarred) {
        await unstarRepo(owner, name);
      } else {
        await starRepo(owner, name);
      }
    },

    onMutate: async (_variables) => {
      // TODO: implement optimistic update
      return { previousData: undefined };
    },

    onError: (_err, _variables, context) => {
      // TODO: rollback
      if (context?.previousData !== undefined) {
        // restore previous data
      }
    },

    onSettled: (_data, _err, _variables) => {
      // TODO: invalidate
    },
  });
}
