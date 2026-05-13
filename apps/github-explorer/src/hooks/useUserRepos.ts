import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserRepos } from "../api/github";
import { queryKeys } from "../queryKeys";
import type { GithubRepo } from "../api/types";

const PER_PAGE = 10;

// TODO: Implement useUserRepos using useInfiniteQuery
//
// Parameters:
//   username: string | null
//
// Returns (in addition to the standard TanStack Query fields):
//   allRepos: GithubRepo[]      — flat array across all loaded pages
//   fetchNextPage, hasNextPage, isFetchingNextPage — pass through from useInfiniteQuery
//
// Requirements:
// 1. Use a query key that sits under the user's key hierarchy so it gets
//    invalidated whenever the user is invalidated
// 2. Provide an initial page parameter for the first fetch
// 3. Determine whether more pages exist based on the size of the last page returned
// 4. Expose a flat allRepos array across all loaded pages
// 5. Only run the query when a username is provided
//
// Discussion question: Why does TanStack Query v5 require initialPageParam
// to be explicitly set? What was the v4 behaviour and why did it change?

export function useUserRepos(username: string | null) {
  const query = useInfiniteQuery<GithubRepo[]>({
    queryKey: username
      ? [...queryKeys.users.detail(username), "repos"]
      : ([] as unknown as readonly unknown[]),
    queryFn: ({ pageParam }) => {
      if (!username) throw new Error("username required");
      return getUserRepos(username, pageParam as number, PER_PAGE);
    },
    initialPageParam: 1,
    getNextPageParam: (_lastPage) => {
      // TODO: return next page number or undefined
      throw new Error("TODO: implement getNextPageParam");
    },
    enabled: !!username,
  });

  const allRepos: GithubRepo[] = query.data?.pages.flat() ?? [];

  return { ...query, allRepos };
}
