export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  // NOTE: This field is not returned by the public API without auth.
  // We track it locally in the query cache to simulate the star/unstar flow.
  viewer_has_starred: boolean;
}

export class GitHubNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GitHubNotFoundError";
  }
}

export class GitHubRateLimitError extends Error {
  readonly retryAfter: number;
  constructor(retryAfter: number) {
    super(`GitHub API rate limit exceeded. Retry after ${retryAfter}s.`);
    this.name = "GitHubRateLimitError";
    this.retryAfter = retryAfter;
  }
}
