import { QueryClient } from "@tanstack/react-query";
import { GitHubNotFoundError } from "./api/types";

// TODO: Configure QueryClient with sensible defaults.
//
// Requirements:
// 1. Set a staleTime so data is considered fresh for a short window before background refetches
// 2. Set a gcTime so unused cache entries are kept in memory before being garbage collected
// 3. Do NOT retry on GitHubNotFoundError (404s will never succeed on retry);
//    retry other errors up to a reasonable limit
//
// Discussion questions:
// - What's the difference between staleTime and gcTime?
// - What happens if staleTime > gcTime? (This is a configuration bug — can you explain why?)
// - When would you set staleTime: Infinity?

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // TODO: add staleTime, gcTime
      retry: (failureCount, error) => {
        if (error instanceof GitHubNotFoundError) return false;
        return failureCount < 2;
      },
    },
  },
});
