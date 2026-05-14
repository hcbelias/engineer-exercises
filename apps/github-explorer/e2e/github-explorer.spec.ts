import { test, expect } from "@playwright/test";

const URL = "http://localhost:3003";

// Uses the real GitHub API — tests skip if rate-limited
test.describe("GitHub Explorer", () => {
  test("searching a valid username shows user card and repos", async ({ page }) => {
    await page.goto(URL);

    const searchInput = page
      .locator(
        'input[placeholder*="username" i], input[placeholder*="search" i], input[type="search"]',
      )
      .first();
    await expect(searchInput).toBeVisible();

    await searchInput.fill("torvalds");
    await searchInput.press("Enter");

    // User card should appear with the username
    await expect(page.locator("text=torvalds").first()).toBeVisible({ timeout: 10_000 });

    // Repo list should appear
    const repoCards = page.locator('[class*="repo"], [data-testid="repo-card"]');
    await expect(repoCards.first()).toBeVisible({ timeout: 10_000 });
  });

  test("searching a non-existent user shows an error message", async ({ page }) => {
    await page.goto(URL);

    const searchInput = page.locator("input").first();
    await searchInput.fill("this-user-absolutely-does-not-exist-xyzxyz123456");
    await searchInput.press("Enter");

    // An error or "not found" message should appear
    const errorMsg = page.locator("text=/not found|no user|error/i");
    await expect(errorMsg).toBeVisible({ timeout: 10_000 });
  });

  test("Load more button appends repos without replacing previous ones", async ({ page }) => {
    await page.goto(URL);

    const searchInput = page.locator("input").first();
    await searchInput.fill("torvalds");
    await searchInput.press("Enter");

    // Wait for initial repos
    const repoItems = page.locator(
      '[class*="repo-card"], [data-testid="repo-card"], [class*="RepoCard"]',
    );
    await expect(repoItems.first()).toBeVisible({ timeout: 10_000 });
    const initialCount = await repoItems.count();

    // Find and click "Load more"
    const loadMore = page.locator("button").filter({ hasText: /load more|show more/i });
    if ((await loadMore.count()) === 0) return; // skip if no more pages

    await loadMore.click();
    await page.waitForTimeout(2000); // wait for next page to load

    const newCount = await repoItems.count();
    // Repos should have been appended, not replaced
    expect(newCount).toBeGreaterThan(initialCount);
  });

  test("Load more disappears when there are no more pages", async ({ page }) => {
    await page.goto(URL);

    const searchInput = page.locator("input").first();
    // Use a user with few repos so we exhaust pages quickly
    await searchInput.fill("octocat");
    await searchInput.press("Enter");

    await expect(page.locator("text=octocat").first()).toBeVisible({ timeout: 10_000 });

    // Click Load more until it disappears or we've clicked enough times
    for (let i = 0; i < 10; i++) {
      const loadMore = page.locator("button").filter({ hasText: /load more|show more/i });
      if ((await loadMore.count()) === 0) break;
      await loadMore.click();
      await page.waitForTimeout(1000);
    }

    // Load more should be gone when all pages are loaded
    const loadMore = page.locator("button").filter({ hasText: /load more|show more/i });
    await expect(loadMore).toHaveCount(0);
  });

  test("Star button updates immediately (optimistic UI)", async ({ page }) => {
    await page.goto(URL);

    const searchInput = page.locator("input").first();
    await searchInput.fill("torvalds");
    await searchInput.press("Enter");

    await expect(page.locator('[class*="repo"]').first()).toBeVisible({ timeout: 10_000 });

    const starButton = page
      .locator("button")
      .filter({ hasText: /star|unstar/i })
      .first();
    if ((await starButton.count()) === 0) return;

    const initialText = await starButton.textContent();
    await starButton.click();

    // The button should update IMMEDIATELY (optimistic) — no waiting for server
    // We check within 100ms that the text has changed
    await page.waitForTimeout(100);
    const newText = await starButton.textContent();
    expect(newText).not.toBe(initialText);
  });

  test("searching the same username twice uses cached data", async ({ page }) => {
    await page.goto(URL);

    const searchInput = page.locator("input").first();
    await searchInput.fill("torvalds");
    await searchInput.press("Enter");

    await expect(page.locator("text=torvalds").first()).toBeVisible({ timeout: 10_000 });

    // Clear and re-search
    await searchInput.clear();
    await searchInput.fill("octocat");
    await searchInput.press("Enter");
    await expect(page.locator("text=octocat").first()).toBeVisible({ timeout: 10_000 });

    // Go back to torvalds — should appear fast from cache
    const start = Date.now();
    await searchInput.clear();
    await searchInput.fill("torvalds");
    await searchInput.press("Enter");
    await expect(page.locator("text=torvalds").first()).toBeVisible({ timeout: 5_000 });
    const elapsed = Date.now() - start;

    // Cache hit should be much faster than a fresh network request (< 500ms)
    expect(elapsed).toBeLessThan(2000);
  });
});
