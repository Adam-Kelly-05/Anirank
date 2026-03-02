import { test, expect } from "@playwright/test";

test("search results include One Piece", async ({ page }) => {
  await page.goto("/search");

  const search = page.getByPlaceholder("Search anime...").first();
  await expect(search).toBeVisible();

  await search.fill("one piece");
  await search.press("Enter");

  await expect(page.getByText(/Showing\s+\d+\s+results\s+for\s+one piece/i)).toBeVisible();

  await expect(page.locator('img[alt="One Piece"]').first()).toBeVisible();
});
