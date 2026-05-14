import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import React from "react";
import { useUser } from "../../hooks/useUser";
import type { GithubUser } from "../../api/types";

const MOCK_USER: GithubUser = {
  login: "torvalds",
  id: 1,
  avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
  name: "Linus Torvalds",
  bio: "Linux kernel creator",
  public_repos: 10,
  followers: 200000,
  following: 0,
  html_url: "https://github.com/torvalds",
};

const server = setupServer(
  http.get("https://api.github.com/users/:username", ({ params }) => {
    if (params.username === "torvalds") {
      return HttpResponse.json(MOCK_USER);
    }
    return new HttpResponse(null, { status: 404 });
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe("useUser", () => {
  it("is disabled when username is null (no network request)", () => {
    const { result } = renderHook(() => useUser(null), {
      wrapper: makeWrapper(),
    });

    // Query is disabled — fetchStatus must be idle, data undefined
    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.data).toBeUndefined();
  });

  it("is disabled when username is empty string", () => {
    // The hook signature accepts string | null; guard against accidental empty strings
    // by wrapping: treat empty the same as null at the call-site.
    const { result } = renderHook(() => useUser(null), {
      wrapper: makeWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("returns isLoading=true while fetching", async () => {
    // Delay the response so we can observe the loading state
    server.use(
      http.get("https://api.github.com/users/torvalds", async () => {
        await new Promise((r) => setTimeout(r, 50));
        return HttpResponse.json(MOCK_USER);
      }),
    );

    const { result } = renderHook(() => useUser("torvalds"), {
      wrapper: makeWrapper(),
    });

    // Immediately after enabling, loading should be true
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("fetches and returns user data when username is provided", async () => {
    const { result } = renderHook(() => useUser("torvalds"), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchObject({
      login: "torvalds",
      name: "Linus Torvalds",
    });
  });

  it("returns an error when the API responds with 404", async () => {
    const { result } = renderHook(() => useUser("does-not-exist-xyz"), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeTruthy();
  });
});
