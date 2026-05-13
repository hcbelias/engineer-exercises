import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import React from "react";
import { useStarRepo } from "../../hooks/useStarRepo";
import type { GithubRepo } from "../../api/types";
import { queryKeys } from "../../queryKeys";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRepo(overrides: Partial<GithubRepo> = {}): GithubRepo {
  return {
    id: 1,
    name: "linux",
    full_name: "torvalds/linux",
    description: "Linux kernel",
    html_url: "https://github.com/torvalds/linux",
    stargazers_count: 100,
    forks_count: 50,
    language: "C",
    updated_at: "2026-01-01T00:00:00Z",
    viewer_has_starred: false,
    ...overrides,
  };
}

/** Build the InfiniteData shape TanStack Query stores in cache */
function makeInfiniteData(pages: GithubRepo[][]): InfiniteData<GithubRepo[]> {
  return {
    pages,
    pageParams: pages.map((_, i) => i + 1),
  };
}

/** Create a fresh QueryClient with retries disabled */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

function makeWrapper(queryClient: QueryClient) {
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

/** Seed the infinite-repos cache so the mutation has data to update */
function seedReposCache(
  queryClient: QueryClient,
  owner: string,
  repos: GithubRepo[]
) {
  const key = [...queryKeys.users.detail(owner), "repos"];
  queryClient.setQueryData<InfiniteData<GithubRepo[]>>(
    key,
    makeInfiniteData([repos])
  );
}

function getReposFromCache(
  queryClient: QueryClient,
  owner: string
): GithubRepo[] {
  const key = [...queryKeys.users.detail(owner), "repos"];
  const data = queryClient.getQueryData<InfiniteData<GithubRepo[]>>(key);
  return data?.pages.flat() ?? [];
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useStarRepo", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = makeQueryClient();
  });

  it("optimistically flips viewer_has_starred in the cache before the server responds", async () => {
    const repo = makeRepo({ viewer_has_starred: false });
    seedReposCache(queryClient, "torvalds", [repo]);

    const { result } = renderHook(() => useStarRepo(), {
      wrapper: makeWrapper(queryClient),
    });

    // Fire the mutation but do NOT await it yet
    act(() => {
      result.current.mutate({
        owner: "torvalds",
        name: "linux",
        currentlyStarred: false,
      });
    });

    // The optimistic update should have run synchronously inside onMutate
    await waitFor(() => {
      const cached = getReposFromCache(queryClient, "torvalds");
      expect(cached[0].viewer_has_starred).toBe(true);
    });
  });

  it("keeps viewer_has_starred=true in the cache after a successful mutation", async () => {
    const repo = makeRepo({ viewer_has_starred: false });
    seedReposCache(queryClient, "torvalds", [repo]);

    const { result } = renderHook(() => useStarRepo(), {
      wrapper: makeWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({
        owner: "torvalds",
        name: "linux",
        currentlyStarred: false,
      });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    // Server succeeded — optimistic value should still be true
    const cached = getReposFromCache(queryClient, "torvalds");
    expect(cached[0].viewer_has_starred).toBe(true);
  });

  it("reverts viewer_has_starred to false in the cache when the server call fails", async () => {
    // Override starRepo to reject for this test
    const { starRepo } = await import("../../api/github");
    vi.spyOn(await import("../../api/github"), "starRepo").mockRejectedValueOnce(
      new Error("Network error")
    );

    const repo = makeRepo({ viewer_has_starred: false });
    seedReposCache(queryClient, "torvalds", [repo]);

    const { result } = renderHook(() => useStarRepo(), {
      wrapper: makeWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({
        owner: "torvalds",
        name: "linux",
        currentlyStarred: false,
      });
      await waitFor(() => expect(result.current.isError).toBe(true));
    });

    // onError should have rolled back to the original false value
    const cached = getReposFromCache(queryClient, "torvalds");
    expect(cached[0].viewer_has_starred).toBe(false);

    vi.restoreAllMocks();
  });

  it("invalidates the repos query after the mutation settles", async () => {
    const spy = vi.spyOn(queryClient, "invalidateQueries");

    const repo = makeRepo({ viewer_has_starred: false });
    seedReposCache(queryClient, "torvalds", [repo]);

    const { result } = renderHook(() => useStarRepo(), {
      wrapper: makeWrapper(queryClient),
    });

    await act(async () => {
      result.current.mutate({
        owner: "torvalds",
        name: "linux",
        currentlyStarred: false,
      });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    expect(spy).toHaveBeenCalled();

    // The invalidation should target the repos key hierarchy
    const calls = spy.mock.calls;
    const invalidatedKey = calls[0]?.[0] as { queryKey?: unknown[] } | undefined;
    expect(JSON.stringify(invalidatedKey?.queryKey)).toContain("torvalds");

    spy.mockRestore();
  });
});
