/**
 * DEMO: Treasury Tracker
 *
 * Reports on a Safe multisig's pending and recent transactions.
 * Read-only — does not sign or execute anything.
 *
 * Requires SAFE_ADDRESS and SAFE_CHAIN set in .env
 *
 * Run: node src/bots/treasuryTracker.js
 */

try { require('dotenv').config(); } catch (_) { /* dotenv not installed yet - fine, falls back to process.env or defaults */ }
const safeTreasury = require('../api/safeTreasury');
const { usd, shortAddr, notify } = require('../utils/format');

async function main() {
  const safeAddress = process.env.SAFE_ADDRESS;
  const chain = process.env.SAFE_CHAIN || 'base';

  if (!safeAddress) {
    console.log('No SAFE_ADDRESS set in .env — set one to run this demo against a real Safe.');
    console.log('Example: SAFE_ADDRESS=0xYourSafeAddress SAFE_CHAIN=base');
    return;
  }

  console.log(`Checking Safe ${shortAddr(safeAddress)} on ${chain}...\n`);

  const info = await safeTreasury.safeInfo(safeAddress, chain);
  console.log(`Owners: ${info.owners.length} · Threshold: ${info.threshold} signatures · Nonce: ${info.nonce}\n`);

  const pending = await safeTreasury.pendingTransactions(safeAddress, chain);

  if (pending.length === 0) {
    await notify(`✅ Treasury check: no pending transactions on Safe ${shortAddr(safeAddress)}.`);
    return;
  }

  for (const tx of pending) {
    const confirmations = (tx.confirmations || []).length;
    const value = tx.value && tx.value !== '0' ? `${(Number(tx.value) / 1e18).toFixed(4)} native token` : '(token transfer or contract call)';
    await notify(
      `⏳ Pending Safe tx — nonce ${tx.nonce}\n` +
      `To: ${shortAddr(tx.to)}\n` +
      `Value: ${value}\n` +
      `Confirmations: ${confirmations}/${tx.confirmationsRequired || '?'}\n` +
      `Submitted: ${new Date(tx.submissionDate).toLocaleString()}`
    );
  }
}

main().catch(err => {
  console.error('Treasury tracker failed:', err.message);
  process.exit(1);
});
