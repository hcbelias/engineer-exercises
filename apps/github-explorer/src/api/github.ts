import type { GithubUser, GithubRepo } from "./types";
import { GitHubNotFoundError, GitHubRateLimitError } from "./types";

const BASE = "https://api.github.com";

async function ghFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Accept: "application/vnd.github.v3+json" },
    ...options,
  });

  if (res.status === 404) {
    throw new GitHubNotFoundError(`Not found: ${path}`);
  }
  if (res.status === 403 || res.status === 429) {
    const retryAfter = Number(res.headers.get("Retry-After") ?? 60);
    throw new GitHubRateLimitError(retryAfter);
  }
  if (!res.ok) {
    throw new Error(`GitHub API error ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}

export async function getUser(username: string): Promise<GithubUser> {
  return ghFetch<GithubUser>(`/users/${username}`);
}

export async function getUserRepos(
  username: string,
  page: number,
  perPage = 10,
): Promise<GithubRepo[]> {
  const repos = await ghFetch<GithubRepo[]>(
    `/users/${username}/repos?sort=updated&per_page=${perPage}&page=${page}`,
  );
  // Inject a local viewer_has_starred field since it requires auth
  return repos.map((r) => ({ ...r, viewer_has_starred: false }));
}

export async function getRepo(owner: string, repo: string): Promise<GithubRepo> {
  const r = await ghFetch<GithubRepo>(`/repos/${owner}/${repo}`);
  return { ...r, viewer_has_starred: false };
}

// These require authentication in the real GitHub API.
// For this exercise they simulate the network call with a 300ms delay.
export async function starRepo(_owner: string, _repo: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 300));
}

export async function unstarRepo(_owner: string, _repo: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 300));
}
