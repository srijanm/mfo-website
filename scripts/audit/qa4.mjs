/* Lab performance measurement. Emulated mobile, throttled. Not a real device. */
import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await cdp.send("Network.enable");
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
await cdp.send("Network.emulateNetworkConditions", {
  offline: false, downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8, latency: 150,
});

const results = [];
for (const route of ["/", "/pricing", "/get-started"]) {
  await p.goto("http://127.0.0.1:3100" + route, { waitUntil: "load" });
  await p.waitForTimeout(3500);
  results.push({ route, ...(await p.evaluate(() => new Promise((resolve) => {
    let lcp = 0, cls = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) lcp = Math.max(lcp, e.startTime); })
      .observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; })
      .observe({ type: "layout-shift", buffered: true });
    setTimeout(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      resolve({ lcpMs: Math.round(lcp), cls: +cls.toFixed(4), domContentLoadedMs: Math.round(nav?.domContentLoadedEventEnd ?? 0) });
    }, 400);
  }))) });
}
console.log(JSON.stringify({ conditions: "390x844, 4x CPU throttle, ~1.6Mbps / 150ms RTT, headless Chromium", results }, null, 2));
await b.close();
