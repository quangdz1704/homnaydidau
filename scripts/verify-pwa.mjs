import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const baseURL = process.env.BASE_URL ?? "http://localhost:3000";
const executablePath = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await chromium.launch({ executablePath, headless: true });

try {
  const context = await browser.newContext({ serviceWorkers: "allow" });
  const page = await context.newPage();
  await page.goto(baseURL, { waitUntil: "networkidle" });
  const registration = await page.evaluate(async () => {
    const ready = await navigator.serviceWorker.ready;
    const manifestResponse = await fetch("/manifest.webmanifest");
    const manifest = await manifestResponse.json();
    return {
      scope: ready.scope,
      worker: ready.active?.scriptURL,
      display: manifest.display,
      iconCount: manifest.icons?.length ?? 0,
      manifestStatus: manifestResponse.status,
    };
  });
  assert.match(registration.worker ?? "", /\/sw\.js$/);
  assert.equal(registration.display, "standalone");
  assert.ok(registration.iconCount >= 2);
  assert.equal(registration.manifestStatus, 200);
  console.log(JSON.stringify({ ok: true, registration }, null, 2));
} finally {
  await browser.close();
}
