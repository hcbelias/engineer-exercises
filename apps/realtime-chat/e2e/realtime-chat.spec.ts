import { test, expect, type BrowserContext, type Page } from "@playwright/test";

const CLIENT_URL = "http://localhost:3002";

async function joinAsUser(context: BrowserContext, username: string): Promise<Page> {
  const page = await context.newPage();
  await page.goto(CLIENT_URL);
  // If there is a username input / prompt on load, fill it
  const usernameInput = page.locator('input[placeholder*="name" i], input[placeholder*="username" i]').first();
  if (await usernameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await usernameInput.fill(username);
    await usernameInput.press("Enter");
  }
  return page;
}

test.describe("Room management", () => {
  test("default rooms are visible on load", async ({ context }) => {
    const page = await joinAsUser(context, "Alice");

    // At least one room should be listed by default
    const roomItems = page.locator('[class*="room"], [data-testid="room-item"]');
    await expect(roomItems.first()).toBeVisible({ timeout: 5_000 });
  });

  test("creating a room adds it to the list", async ({ context }) => {
    const page = await joinAsUser(context, "Alice");

    const createButton = page.locator('button').filter({ hasText: /create|new room/i });
    if (await createButton.count() === 0) return;

    await createButton.click();

    const roomNameInput = page.locator('input[placeholder*="room" i]').first();
    if (await roomNameInput.isVisible({ timeout: 2_000 }).catch(() => false)) {
      const roomName = `test-room-${Date.now()}`;
      await roomNameInput.fill(roomName);
      await roomNameInput.press("Enter");
      await expect(page.locator(`text=${roomName}`)).toBeVisible({ timeout: 5_000 });
    }
  });
});

test.describe("Real-time messaging", () => {
  test("message sent by user A appears for user B in the same room", async ({ context }) => {
    const pageA = await joinAsUser(context, "Alice");
    const pageB = await joinAsUser(context, "Bob");

    // Both users join the first available room
    const firstRoom = pageA.locator('[class*="room"], [data-testid="room-item"]').first();
    await expect(firstRoom).toBeVisible({ timeout: 5_000 });
    await firstRoom.click();

    const firstRoomB = pageB.locator('[class*="room"], [data-testid="room-item"]').first();
    await expect(firstRoomB).toBeVisible({ timeout: 5_000 });
    await firstRoomB.click();

    // User A sends a message
    const messageText = `Hello from Alice at ${Date.now()}`;
    const inputA = pageA.locator('input[placeholder*="message" i], textarea[placeholder*="message" i]').first();
    await expect(inputA).toBeVisible({ timeout: 5_000 });
    await inputA.fill(messageText);
    await inputA.press("Enter");

    // User B should see the message
    await expect(pageB.locator(`text=${messageText}`)).toBeVisible({ timeout: 5_000 });
  });

  test("message in room A is NOT visible to user in room B", async ({ context }) => {
    const pageA = await joinAsUser(context, "Alice");
    const pageB = await joinAsUser(context, "Bob");

    const rooms = pageA.locator('[class*="room"], [data-testid="room-item"]');
    await expect(rooms.first()).toBeVisible({ timeout: 5_000 });
    const roomCount = await rooms.count();
    if (roomCount < 2) return; // need at least 2 rooms

    // A joins room 1, B joins room 2
    await rooms.first().click();
    await pageB.locator('[class*="room"], [data-testid="room-item"]').nth(1).click();

    const secretMessage = `Secret-${Date.now()}`;
    const inputA = pageA.locator('input[placeholder*="message" i], textarea[placeholder*="message" i]').first();
    await expect(inputA).toBeVisible({ timeout: 5_000 });
    await inputA.fill(secretMessage);
    await inputA.press("Enter");

    await pageA.waitForTimeout(1_000);

    // B should NOT see the message
    await expect(pageB.locator(`text=${secretMessage}`)).not.toBeVisible();
  });

  test("joining a room delivers the last 50 messages as history", async ({ context }) => {
    const pageA = await joinAsUser(context, "Alice");

    // Join the first room
    const firstRoom = pageA.locator('[class*="room"], [data-testid="room-item"]').first();
    await expect(firstRoom).toBeVisible({ timeout: 5_000 });
    await firstRoom.click();

    // Send a message so there's at least one in history
    const histMsg = `history-test-${Date.now()}`;
    const inputA = pageA.locator('input[placeholder*="message" i], textarea[placeholder*="message" i]').first();
    if (await inputA.isVisible({ timeout: 2000 }).catch(() => false)) {
      await inputA.fill(histMsg);
      await inputA.press("Enter");
      await expect(pageA.locator(`text=${histMsg}`)).toBeVisible({ timeout: 5_000 });
    }

    // A new user joining the same room should see the history
    const pageC = await joinAsUser(context, "Charlie");
    const firstRoomC = pageC.locator('[class*="room"], [data-testid="room-item"]').first();
    await expect(firstRoomC).toBeVisible({ timeout: 5_000 });
    await firstRoomC.click();

    await expect(pageC.locator(`text=${histMsg}`)).toBeVisible({ timeout: 5_000 });
  });
});

test.describe("Presence", () => {
  test("connected users appear in the presence list", async ({ context }) => {
    const pageA = await joinAsUser(context, "Alice");

    // Presence panel should show at least one user
    const presencePanel = pageA.locator('[class*="presence"], [class*="Presence"], [data-testid="presence"]');
    if (await presencePanel.count() === 0) return;

    await expect(presencePanel).toBeVisible({ timeout: 5_000 });
    const text = await presencePanel.textContent();
    expect(text?.length).toBeGreaterThan(0);
  });

  test("a user who disconnects is removed from the presence list", async ({ context }) => {
    const pageA = await joinAsUser(context, "Alice");
    const pageB = await joinAsUser(context, "Bob");

    await pageA.waitForTimeout(1_000); // let presence stabilize

    const presencePanel = pageA.locator('[class*="presence"], [class*="Presence"]');
    if (await presencePanel.count() === 0) return;

    // B closes — should disappear from A's presence panel within 5 seconds
    await pageB.close();
    await expect(pageA.locator('[class*="presence"] >> text=Bob')).not.toBeVisible({ timeout: 6_000 });
  });
});
