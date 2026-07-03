/**
 * Client for the owockibot bounty board API.
 * Read-only by design — no write/claim/complete methods are included here.
 * Add those yourself if you need them, with your own auth/signing logic.
 */

const API_URL = process.env.BOUNTY_BOARD_API || 'https://www.owockibot.xyz/api/bounty-board';

/**
 * Fetch the full bounty board.
 * @returns {Promise<Array<object>>}
 */
async function list() {
  const res = await fetch(API_URL, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Bounty board API returned ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('Unexpected bounty board response shape');
  return data;
}

/**
 * Fetch a single bounty by id (filters the full list client-side,
 * since the public API doesn't expose a dedicated /:id route).
 * @param {number|string} id
 */
async function getById(id) {
  const all = await list();
  return all.find(b => String(b.id) === String(id)) || null;
}

/**
 * Filter bounties by status.
 * @param {'open'|'claimed'|'completed'|'cancelled'} status
 */
async function byStatus(status) {
  const all = await list();
  return all.filter(b => b.status === status);
}

/**
 * Filter bounties claimed/created/updated within a time window.
 * @param {Date} since
 * @param {Date} [until]
 * @param {'created_at'|'updated_at'} [field='created_at']
 */
async function since(sinceDate, untilDate = new Date(), field = 'created_at') {
  const all = await list();
  return all.filter(b => {
    const d = new Date(b[field]);
    return d >= sinceDate && d <= untilDate;
  });
}

module.exports = { list, getById, byStatus, since, API_URL };
