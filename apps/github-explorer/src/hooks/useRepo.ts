import { useQuery } from "@tanstack/react-query";
import { getRepo } from "../api/github";
import { queryKeys } from "../queryKeys";
import type { GithubRepo } from "../api/types";

// TODO: Implement useRepo
//
// Parameters:
//   owner: string | null
//   name: string | null
//
// Requirements:
// 1. Use the repos key hierarchy from queryKeys
// 2. Only run the query when both owner and name are provided
// 3. This query is mainly used to get fresh data after a star/unstar mutation

export function useRepo(owner: string | null, name: string | null) {
  return useQuery<GithubRepo>({
    queryKey: owner && name
      ? queryKeys.repos.detail(owner, name)
      : ([] as unknown as ReturnType<typeof queryKeys.repos.detail>),
    queryFn: () => {
      throw new Error("TODO: implement useRepo queryFn");
    },
    enabled: false, // TODO
  });
}
