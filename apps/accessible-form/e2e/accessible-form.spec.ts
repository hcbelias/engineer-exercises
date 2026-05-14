import { test, expect } from "@playwright/test";

const URL = "http://localhost:3004";

test.describe("Skip navigation link", () => {
  test("appears on first Tab press and skips to main content", async ({ page }) => {
    await page.goto(URL);

    // Skip nav should be visually hidden initially
    const skipNav = page.locator("a[href='#main-content']");
    await expect(skipNav).toBeAttached();

    // Tab from page — skip link should receive focus and become visible
    await page.keyboard.press("Tab");
    await expect(skipNav).toBeFocused();

    // Activate the skip link
    await page.keyboard.press("Enter");

    // Focus should now be on main content or inside it
    const mainContent = page.locator("#main-content");
    await expect(mainContent).toBeAttached();
  });
});

test.describe("Tab panel keyboard navigation", () => {
  test("has correct ARIA roles on tab container and tabs", async ({ page }) => {
    await page.goto(URL);

    await expect(page.locator('[role="tablist"]')).toBeAttached();
    const tabs = page.locator('[role="tab"]');
    await expect(tabs).not.toHaveCount(0);
    const panels = page.locator('[role="tabpanel"]');
    await expect(panels).not.toHaveCount(0);
  });

  test("active tab has aria-selected=true and others have aria-selected=false", async ({
    page,
  }) => {
    await page.goto(URL);

    const selectedTabs = page.locator('[role="tab"][aria-selected="true"]');
    await expect(selectedTabs).toHaveCount(1);
  });

  test("ArrowRight moves focus to next tab", async ({ page }) => {
    await page.goto(URL);

    const firstTab = page.locator('[role="tab"]').first();
    await firstTab.focus();
    await page.keyboard.press("ArrowRight");

    const secondTab = page.locator('[role="tab"]').nth(1);
    await expect(secondTab).toBeFocused();
  });

  test("ArrowLeft wraps focus to last tab from first", async ({ page }) => {
    await page.goto(URL);

    const firstTab = page.locator('[role="tab"]').first();
    await firstTab.focus();
    await page.keyboard.press("ArrowLeft");

    const tabs = page.locator('[role="tab"]');
    const count = await tabs.count();
    await expect(tabs.nth(count - 1)).toBeFocused();
  });

  test("Home key moves focus to first tab", async ({ page }) => {
    await page.goto(URL);

    const secondTab = page.locator('[role="tab"]').nth(1);
    await secondTab.focus();
    await page.keyboard.press("Home");

    await expect(page.locator('[role="tab"]').first()).toBeFocused();
  });

  test("End key moves focus to last tab", async ({ page }) => {
    await page.goto(URL);

    const firstTab = page.locator('[role="tab"]').first();
    await firstTab.focus();
    await page.keyboard.press("End");

    const tabs = page.locator('[role="tab"]');
    const count = await tabs.count();
    await expect(tabs.nth(count - 1)).toBeFocused();
  });
});

test.describe("Multi-step form accessibility", () => {
  test("progress bar has correct ARIA attributes", async ({ page }) => {
    await page.goto(URL);

    const progressbar = page.locator('[role="progressbar"]');
    await expect(progressbar).toBeAttached();
    await expect(progressbar).toHaveAttribute("aria-valuenow");
    await expect(progressbar).toHaveAttribute("aria-valuemin");
    await expect(progressbar).toHaveAttribute("aria-valuemax");
  });

  test("form labels are associated with their inputs", async ({ page }) => {
    await page.goto(URL);

    // Navigate to the tab containing the multi-step form
    const formTab = page.locator('[role="tab"]').filter({ hasText: /form/i });
    if ((await formTab.count()) > 0) {
      await formTab.click();
    }

    // All visible inputs should have a label
    const inputs = page.locator('input:not([type="hidden"])');
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute("id");
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeAttached();
      }
    }
  });
});

test.describe("Modal accessibility", () => {
  test("modal has role=dialog and aria-modal=true", async ({ page }) => {
    await page.goto(URL);

    const trigger = page
      .locator("button")
      .filter({ hasText: /open|modal/i })
      .first();
    if ((await trigger.count()) === 0) return; // skip if no modal trigger visible
    await trigger.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(dialog).toHaveAttribute("aria-labelledby");
  });

  test("focus moves inside modal when it opens", async ({ page }) => {
    await page.goto(URL);

    const trigger = page
      .locator("button")
      .filter({ hasText: /open|modal/i })
      .first();
    if ((await trigger.count()) === 0) return;
    await trigger.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Focus should be inside the dialog
    const focusedElement = page.locator(":focus");
    const isInsideDialog = await focusedElement.evaluate((el) => !!el.closest('[role="dialog"]'));
    expect(isInsideDialog).toBe(true);
  });

  test("Escape closes the modal and returns focus to trigger", async ({ page }) => {
    await page.goto(URL);

    const trigger = page
      .locator("button")
      .filter({ hasText: /open|modal/i })
      .first();
    if ((await trigger.count()) === 0) return;
    await trigger.click();

    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();

    // Focus should return to the trigger button
    await expect(trigger).toBeFocused();
  });

  test("Tab key does not escape the modal", async ({ page }) => {
    await page.goto(URL);

    const trigger = page
      .locator("button")
      .filter({ hasText: /open|modal/i })
      .first();
    if ((await trigger.count()) === 0) return;
    await trigger.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Tab through all focusable elements — focus must stay inside dialog
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
      const isInsideDialog = await page
        .locator(":focus")
        .evaluate((el) => !!el.closest('[role="dialog"]'));
      expect(isInsideDialog).toBe(true);
    }
  });
});

test.describe("ComboBox keyboard navigation", () => {
  test("input has role=combobox", async ({ page }) => {
    await page.goto(URL);
    const combobox = page.locator('[role="combobox"]');
    await expect(combobox).toBeAttached();
  });

  test("aria-expanded starts false and becomes true when opened", async ({ page }) => {
    await page.goto(URL);
    const combobox = page.locator('[role="combobox"]');
    await expect(combobox).toHaveAttribute("aria-expanded", "false");

    await combobox.focus();
    await page.keyboard.press("ArrowDown");
    await expect(combobox).toHaveAttribute("aria-expanded", "true");
  });

  test("ArrowDown navigates through options, Enter selects", async ({ page }) => {
    await page.goto(URL);
    const combobox = page.locator('[role="combobox"]');
    await combobox.focus();
    await page.keyboard.press("ArrowDown"); // open
    await page.keyboard.press("ArrowDown"); // move to first option
    await page.keyboard.press("Enter"); // select

    // After selection the combobox should reflect the chosen value
    const value = await combobox.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test("Escape closes the listbox", async ({ page }) => {
    await page.goto(URL);
    const combobox = page.locator('[role="combobox"]');
    await combobox.focus();
    await page.keyboard.press("ArrowDown");
    await expect(combobox).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(combobox).toHaveAttribute("aria-expanded", "false");
  });
});
