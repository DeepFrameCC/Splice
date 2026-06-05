import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Log browser console messages
  page.on("console", (msg) => {
    console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  // Log page errors
  page.on("pageerror", (err) => {
    console.error("[BROWSER ERROR]", err);
  });

  try {
    console.log("Navigating to login page...");
    await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
    
    console.log("Dismissing cookie banner if present...");
    await page.click('button:has-text("Tout refuser")', { timeout: 3000 }).catch(() => {
      console.log("Cookie banner not found or already dismissed.");
    });

    console.log("Filling login credentials...");
    await page.fill('input[name="email"]', "admin@splice.cc");
    await page.fill('input[name="password"]', "Splice2024!");
    
    console.log("Submitting login form...");
    await page.click('button[type="submit"]', { force: true });
    
    console.log("Waiting for navigation after login...");
    try {
      await page.waitForURL("**/profil**", { timeout: 10000 });
      console.log("Logged in successfully! Current URL:", page.url());
    } catch (timeoutErr) {
      console.error("Timeout waiting for /profil. Taking screenshot and dumping HTML...");
      const screenshotPath = path.join(process.cwd(), "playwright_timeout.png");
      await page.screenshot({ path: screenshotPath });
      console.log(`Screenshot saved to ${screenshotPath}`);
      const html = await page.content();
      fs.writeFileSync(path.join(process.cwd(), "playwright_timeout.html"), html);
      console.log("HTML dump saved.");
      throw timeoutErr;
    }
    
    console.log("Navigating to factures page...");
    await page.goto("http://localhost:3000/profil/factures", { waitUntil: "networkidle" });
    console.log("Current URL:", page.url());
    
    const pageTitle = await page.locator("h1").innerText().catch(() => "No H1 found");
    console.log("H1 text:", pageTitle);
    
    // Check if error message exists on page
    const hasError = await page.locator("text=Une erreur est survenue").count();
    if (hasError > 0) {
      console.error("PAGE CRASH DETECTED ON LOCAL DEV!");
      const diagnosticDetails = await page.locator(".diagnostic-details, text=diagnostic").innerText().catch(() => "No diagnostic details found");
      console.error("Diagnostic text:", diagnosticDetails);
      
      const bodyText = await page.innerText("body");
      console.log("Full body text:", bodyText);
    } else {
      console.log("Page rendered successfully without crash!");
      const listItems = await page.locator("ul.space-y-4 li").count().catch(() => 0);
      console.log(`Found ${listItems} invoices on the page.`);
    }
    
  } catch (err) {
    console.error("An error occurred during Playwright test:", err);
  } finally {
    await browser.close();
  }
}

main();
