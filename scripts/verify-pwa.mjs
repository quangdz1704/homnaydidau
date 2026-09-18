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
    const swResponse = await fetch("/sw.js");
    return {
      scope: ready.scope,
      worker: ready.active?.scriptURL,
      display: manifest.display,
      iconCount: manifest.icons?.length ?? 0,
      hasAppIcons: manifest.icons?.some((icon) => icon.src === "/icon-192.png" && icon.sizes === "192x192") && manifest.icons?.some((icon) => icon.src === "/icon-512.png" && icon.sizes === "512x512"),
      hasMaskableIcon: manifest.icons?.some((icon) => icon.purpose === "maskable"),
      manifestStatus: manifestResponse.status,
      serviceWorkerCacheControl: swResponse.headers.get("cache-control"),
    };
  });
  assert.match(registration.worker ?? "", /\/sw\.js$/);
  assert.equal(registration.display, "standalone");
  assert.ok(registration.iconCount >= 3);
  assert.equal(registration.hasAppIcons, true);
  assert.equal(registration.hasMaskableIcon, true);
  assert.equal(registration.manifestStatus, 200);
  assert.match(registration.serviceWorkerCacheControl ?? "", /no-cache/);
  console.log(JSON.stringify({ ok: true, registration }, null, 2));
} finally {
  await browser.close();
}
