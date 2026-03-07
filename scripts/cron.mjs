/**
 * Cron Script for changelog-dev
 *
 * Calls two endpoints every 5 minutes:
 *   1. POST /api/cron/publish-scheduled  -- publishes scheduled changelog entries
 *   2. POST /api/notifications/retry     -- retries failed notifications
 *
 * Environment variables:
 *   CRON_SECRET   (optional) -- sent as Bearer token in Authorization header
 *   SITE_URL      (optional) -- base URL, defaults to https://www.changelogdev.com
 *
 * ---------------------------------------------------------------------------
 * RAILWAY SETUP (as a separate cron service)
 * ---------------------------------------------------------------------------
 *
 * 1. In the Railway dashboard, open your changelog-dev project.
 *
 * 2. Click "+ New" -> "Empty Service" to create a new service.
 *    Name it something like "cron-worker".
 *
 * 3. Connect it to the same GitHub repo (or use the same source).
 *
 * 4. Set the following service settings:
 *      - Build Command:  (leave empty, no build needed)
 *      - Start Command:  node scripts/cron.mjs
 *      - Root Directory:  / (or projects/changelog-dev if monorepo)
 *
 * 5. Set environment variables on the cron-worker service:
 *      SITE_URL=https://www.changelogdev.com
 *      CRON_SECRET=<same secret as your main app>
 *
 * 6. Under service settings, disable the public domain (this service
 *    does not need to receive traffic, it only makes outbound requests).
 *
 * 7. Deploy. The script runs indefinitely, calling both endpoints
 *    every 5 minutes. Railway will auto-restart it if it crashes.
 *
 * Alternative: If you prefer Railway's native cron instead of a long-running
 * process, set the service type to "Cron Job" with schedule "*/5 * * * *"
 * and the start command to: node scripts/cron.mjs --once
 * The --once flag runs a single cycle and exits.
 * ---------------------------------------------------------------------------
 */

const SITE_URL = (process.env.SITE_URL || "https://www.changelogdev.com").replace(/\/+$/, "");
const CRON_SECRET = process.env.CRON_SECRET || "";
const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const RUN_ONCE = process.argv.includes("--once");

const ENDPOINTS = [
  { path: "/api/cron/publish-scheduled", label: "publish-scheduled" },
  { path: "/api/notifications/retry", label: "notifications-retry" },
];

function timestamp() {
  return new Date().toISOString();
}

async function callEndpoint({ path, label }) {
  const url = `${SITE_URL}${path}`;
  const headers = { "Content-Type": "application/json" };
  if (CRON_SECRET) {
    headers["Authorization"] = `Bearer ${CRON_SECRET}`;
  }

  try {
    const res = await fetch(url, { method: "POST", headers });
    const body = await res.text();

    if (res.ok) {
      console.log(`[${timestamp()}] ${label} -- ${res.status} OK`);
    } else {
      console.error(`[${timestamp()}] ${label} -- ${res.status} FAILED -- ${body.slice(0, 500)}`);
    }
  } catch (err) {
    console.error(`[${timestamp()}] ${label} -- ERROR -- ${err.message}`);
  }
}

async function runCycle() {
  console.log(`[${timestamp()}] Starting cron cycle`);
  await Promise.allSettled(ENDPOINTS.map(callEndpoint));
  console.log(`[${timestamp()}] Cycle complete`);
}

async function main() {
  console.log(`[${timestamp()}] Cron worker started`);
  console.log(`  Site URL:    ${SITE_URL}`);
  console.log(`  Auth:        ${CRON_SECRET ? "Bearer token configured" : "no secret set"}`);
  console.log(`  Mode:        ${RUN_ONCE ? "single run (--once)" : `loop every ${INTERVAL_MS / 1000}s`}`);
  console.log("");

  // Run immediately on startup
  await runCycle();

  if (RUN_ONCE) {
    process.exit(0);
  }

  // Then repeat on interval
  setInterval(runCycle, INTERVAL_MS);
}

main();
