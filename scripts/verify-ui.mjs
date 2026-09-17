import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const baseURL = process.env.BASE_URL ?? "http://localhost:3000";
const executablePath = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const output = process.env.SCREENSHOT_DIR ?? "/private/tmp/shuffle-browser-check";
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ executablePath, headless: true });
const results = [];

async function checkViewport(width, height, fullFlow = false) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));

  if (!fullFlow) {
    await page.addInitScript(() => localStorage.setItem("shuffle:preferences", JSON.stringify({ onboardingComplete: true, mode: "solo", reducedMotion: false, excludedCategories: [] })));
  }
  await page.goto(baseURL, { waitUntil: "networkidle" });
  assert.equal(await page.locator("[data-nextjs-dialog]").count(), 0, "Không được có Next.js error overlay");

  if (fullFlow) {
    await page.screenshot({ path: `${output}/onboarding-${width}.png`, fullPage: true });
    await page.getByRole("button", { name: /Bắt đầu thôi/ }).click();
    await page.getByRole("button", { name: /Người thương/ }).click();
    await page.getByRole("button", { name: /Đi thôi/ }).click();
    await page.getByText("Hôm nay làm gì?", { exact: false }).waitFor();
    assert.equal(await page.getByRole("button", { name: /Bắc Ninh/ }).getAttribute("aria-pressed"), "true", "Bắc Ninh cần là khu vực mặc định");
    await page.getByRole("button", { name: /Chill/ }).click();
    await page.getByRole("button", { name: "~500k", exact: true }).click();
    await page.getByRole("button", { name: /Nửa ngày/ }).click();
    await page.getByRole("button", { name: /LẮC KÈO/ }).click();
    await page.locator(".result-card").waitFor({ state: "visible", timeout: 7000 });
    assert.equal(await page.locator(".plan-steps li").count(), 3, "Nửa ngày cần có ba chặng");
    await page.screenshot({ path: `${output}/result-${width}.png`, fullPage: true });
    await page.getByRole("button", { name: /Xem plan chi tiết/ }).click();
    assert.equal(await page.locator(".plan-step-card").count(), 3, "Plan chi tiết cần đủ ba chặng");
    await page.locator(".step-choice button").first().click();
    await page.locator(".step-choice strong").first().filter({ hasNotText: "Để xúc xắc chọn hộ" }).waitFor();
    await page.locator(".place-discovery__trigger").first().click();
    await page.locator(".trend-results").first().waitFor();
    assert.ok(await page.locator(".trend-grid a").count() >= 4, "Cần có ít nhất bốn gợi ý địa phương");
    await page.getByText("Ăn một món Kinh Bắc", { exact: true }).waitFor();
    assert.match(await page.locator(".trend-grid a").first().getAttribute("href") ?? "", /google\.com\/maps\/search/);
    await page.screenshot({ path: `${output}/plan-detail-${width}.png`, fullPage: false });
    await page.getByRole("button", { name: "Đóng chi tiết plan" }).click();
    await page.getByRole("button", { name: "Lưu kèo" }).click();
    await page.getByRole("button", { name: /Chốt kèo/ }).click();
    await page.getByRole("button", { name: "✓ Xong rồi" }).click();
    await page.getByRole("button", { name: /Khá vui/ }).click();
    await page.locator("textarea").fill("Một kèo rất ổn áp!");
    await page.getByRole("button", { name: /Lưu kỷ niệm/ }).click();
    await page.getByText("Những kèo đã qua", { exact: false }).waitFor();
    assert.match(await page.locator("body").innerText(), /Một kèo rất ổn áp/);

    await page.getByRole("button", { name: "Đã lưu", exact: true }).click();
    await page.getByText("Để dành hôm khác", { exact: false }).waitFor();
    assert.ok(await page.locator(".activity-card").count() > 0, "Kèo đã lưu phải xuất hiện");
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Đã lưu", exact: true }).click();
    await page.getByText("Để dành hôm khác", { exact: false }).waitFor();
    await page.locator(".activity-card").first().waitFor();
    assert.ok(await page.locator(".activity-card").count() > 0, "Kèo đã lưu phải còn sau reload");

    await page.getByRole("button", { name: "Tôi", exact: true }).click();
    await page.getByRole("button", { name: /Thêm kèo/ }).click();
    await page.locator('input[name="title"]').fill("Kèo ăn kem bí mật");
    await page.locator('textarea[name="description"]').fill("Chọn vị kem chưa ai thử bao giờ.");
    await page.locator('select[name="mode"]').selectOption("couple");
    await page.getByRole("button", { name: /Lưu kèo này/ }).click();
    await page.getByText("Kèo ăn kem bí mật").waitFor();
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Tôi", exact: true }).click();
    await page.getByText("Kèo ăn kem bí mật").waitFor();
  } else {
    await page.getByText("Hôm nay làm gì?", { exact: false }).waitFor();
    assert.ok(await page.getByRole("button", { name: /Bắc Ninh/ }).count() > 0, "Bộ lọc cần có Bắc Ninh");
    await page.screenshot({ path: `${output}/home-${width}.png`, fullPage: true });
  }

  const metrics = await page.evaluate(() => ({
    viewport: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    bottomNav: getComputedStyle(document.querySelector(".bottom-nav")).display,
    desktopNav: getComputedStyle(document.querySelector(".desktop-nav")).display,
  }));
  assert.ok(metrics.scrollWidth <= metrics.viewport, `Có horizontal overflow ở ${width}px: ${metrics.scrollWidth}px`);
  if (width < 900) assert.notEqual(metrics.bottomNav, "none", "Mobile cần bottom nav");
  else assert.notEqual(metrics.desktopNav, "none", "Desktop cần top nav");
  assert.deepEqual(errors, [], `Console/page errors ở ${width}px`);
  results.push({ width, ...metrics, errors: errors.length });
  await context.close();
}

try {
  await checkViewport(360, 800);
  await checkViewport(390, 844, true);
  await checkViewport(430, 932);
  await checkViewport(768, 1024);
  await checkViewport(1280, 900);
  await checkViewport(1440, 1000);
  console.log(JSON.stringify({ ok: true, screenshots: output, results }, null, 2));
} finally {
  await browser.close();
}
