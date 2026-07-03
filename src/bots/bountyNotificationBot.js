/**
 * DEMO: Bounty Notification Bot
 *
 * Polls the bounty board for new bounties and reports them.
 * On each run it compares against the previous snapshot (in-memory —
 * swap for a file/DB if you want persistence across restarts) and only
 * notifies about bounties it hasn't seen before.
 *
 * Run once:      node src/bots/bountyNotificationBot.js
 * Run on a loop: node src/bots/bountyNotificationBot.js --watch
 */

try { require('dotenv').config(); } catch (_) { /* dotenv not installed yet - fine, falls back to process.env or defaults */ }
const bountyBoard = require('../api/bountyBoard');
const { usd, notify } = require('../utils/format');

let seenIds = new Set();

async function checkOnce() {
  const all = await bountyBoard.list();
  const valid = all.filter(b => typeof b.reward_usdc === 'number' && b.reward_usdc > 0);

  const isFirstRun = seenIds.size === 0;
  const newOnes = valid.filter(b => !seenIds.has(b.id));
  valid.forEach(b => seenIds.add(b.id));

  if (isFirstRun) {
    await notify(`🤖 Bounty notification bot started. Tracking ${valid.length} existing bounties. Will alert on new ones from here.`);
    return;
  }

  if (newOnes.length === 0) {
    console.log(`[${new Date().toLocaleTimeString()}] No new bounties.`);
    return;
  }

  for (const b of newOnes) {
    await notify(`🆕 New bounty: "${b.title || 'Untitled'}" — ${usd(b.reward_usdc)}\nStatus: ${b.status}`);
  }
}

async function main() {
  const watch = process.argv.includes('--watch');
  const interval = Number(process.env.POLL_INTERVAL_MS) || 300000;

  await checkOnce();

  if (watch) {
    console.log(`Watching for new bounties every ${interval / 1000}s. Ctrl+C to stop.`);
    setInterval(() => {
      checkOnce().catch(err => console.error('Poll failed:', err.message));
    }, interval);
  }
}

main().catch(err => {
  console.error('Bounty notification bot failed:', err.message);
  process.exit(1);
});
