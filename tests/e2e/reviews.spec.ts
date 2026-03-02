import { test, expect } from "@playwright/test";

test("reviews page shows at least one review", async ({ page }) => {
  await page.goto("http://localhost:3000/reviews");

  const firstReview = page.locator(".text-card-foreground").first();
  await expect(firstReview).toBeVisible();
});
