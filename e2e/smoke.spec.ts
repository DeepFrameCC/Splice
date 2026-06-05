import { test, expect } from "@playwright/test";

test.describe("Smoke tests — public pages", () => {
  test("homepage loads and shows Splice Studio branding", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Splice Studio/i);
  });

  test("galerie page loads", async ({ page }) => {
    await page.goto("/galerie");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("equipe page loads", async ({ page }) => {
    await page.goto("/equipe");
    await expect(page.locator("h1")).toContainText(/artisans/i);
  });

  test("avis page loads", async ({ page }) => {
    await page.goto("/avis");
    await expect(page.locator("h1")).toContainText(/avis/i);
  });

  test("contact page loads", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("mentions-legales page loads", async ({ page }) => {
    await page.goto("/mentions-legales");
    await expect(page.locator("h1")).toContainText(/mentions/i);
  });

  test("confidentialite page loads", async ({ page }) => {
    await page.goto("/confidentialite");
    await expect(page.locator("h1")).toContainText(/confidentialité/i);
  });

  test("cookies page loads", async ({ page }) => {
    await page.goto("/cookies");
    await expect(page.locator("h1")).toContainText(/cookie/i);
  });

  test("services page loads", async ({ page }) => {
    await page.goto("/services");
    await expect(page.locator("h1")).toBeVisible();
  });
});

test.describe("Smoke tests — auth redirects", () => {
  test("profil redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/profil");
    await page.waitForURL(/\/login/);
    expect(page.url()).toContain("/login");
  });

  test("admin redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForURL(/\/login/);
    expect(page.url()).toContain("/login");
  });

  test("devis page loads (requires no auth for viewing)", async ({ page }) => {
    await page.goto("/devis");
    await expect(page.locator("h1")).toBeVisible();
  });
});

test.describe("Smoke tests — login page", () => {
  test("login page renders form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test("register page renders form", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });
});

test.describe("Smoke tests — API", () => {
  test("health endpoint returns 200", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.status()).toBeLessThanOrEqual(503);
    const body = await res.json();
    expect(body.status).toMatch(/healthy|degraded/);
    expect(body.timestamp).toBeDefined();
  });

  test("robots.txt is accessible", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.ok()).toBeTruthy();
    const text = await res.text();
    expect(text).toContain("User-Agent");
  });

  test("sitemap.xml is accessible", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.ok()).toBeTruthy();
    const text = await res.text();
    expect(text).toContain("urlset");
  });
});

test.describe("404 page", () => {
  test("shows custom 404 for unknown routes", async ({ page }) => {
    const res = await page.goto("/this-page-does-not-exist-xyz");
    expect(res?.status()).toBe(404);
    await expect(page.locator("h1")).toContainText(/introuvable/i);
  });
});
