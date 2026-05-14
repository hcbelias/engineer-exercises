import { describe, it, expect } from "vitest";
import { queryKeys } from "./index";

describe("queryKeys factory", () => {
  it('users.all() returns an array starting with "users"', () => {
    const key = queryKeys.users.all();
    expect(key[0]).toBe("users");
    expect(Array.isArray(key)).toBe(true);
  });

  it('users.detail(login) contains both "users" and the login', () => {
    const key = queryKeys.users.detail("torvalds");
    expect(key).toContain("users");
    expect(key).toContain("torvalds");
  });

  it("users.detail(login) is a prefix of users.repos(login, page)", () => {
    const userDetailKey = queryKeys.users.detail("torvalds");
    const reposKey = queryKeys.users.repos("torvalds", 1);
    expect(reposKey.slice(0, userDetailKey.length)).toEqual(userDetailKey);
  });

  it('users.repos(login, page) includes "repos" and the page number', () => {
    const key = queryKeys.users.repos("torvalds", 1);
    expect(key).toContain("repos");
    expect(key).toContain(1);
  });

  it('repos.detail(owner, name) includes "repos", owner, and repo name', () => {
    const key = queryKeys.repos.detail("torvalds", "linux");
    expect(key).toContain("repos");
    expect(key).toContain("torvalds");
    expect(key).toContain("linux");
  });
});
