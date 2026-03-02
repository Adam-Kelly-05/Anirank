import { test, expect } from "@playwright/test";

test("home page shows anime under Action section", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  const carousel = page.locator('[aria-roledescription="carousel"]').first();
  const firstCard = carousel.locator(".text-card-foreground").first();
  const firstCardTitle = firstCard.locator("h3").first();

  await expect(firstCardTitle).toBeVisible();
});
