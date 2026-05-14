import { useQuery } from "@tanstack/react-query";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getUser } from "../api/github";
import { queryKeys } from "../queryKeys";
import type { GithubUser } from "../api/types";

// TODO: Implement useUser
//
// Returns the result of useQuery for a GitHub user.
//
// Parameters:
//   username: string | null  — null means "no search yet", query should be disabled
//
// Requirements:
// 1. Use the users key hierarchy from queryKeys
// 2. Only run the query when a username is provided
//
// The caller will handle GitHubNotFoundError and GitHubRateLimitError
// by checking the error type — you don't need to catch them here.

export function useUser(username: string | null) {
  return useQuery<GithubUser>({
    // TODO: queryKey, queryFn, enabled
    queryKey: username
      ? queryKeys.users.detail(username)
      : ([] as unknown as ReturnType<typeof queryKeys.users.detail>),
    queryFn: () => {
      throw new Error("TODO: implement useUser queryFn");
    },
    enabled: false, // TODO: only enable when a username is provided
  });
}
