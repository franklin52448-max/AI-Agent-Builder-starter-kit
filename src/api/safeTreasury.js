/**
 * Read-only client for Safe (multisig) treasury data, via the public
 * Safe Transaction Service API. No signing, no write actions — this
 * only reads pending/executed transaction data for a given Safe.
 *
 * Docs: https://docs.safe.global/core-api/transaction-service-overview
 */

const CHAIN_ENDPOINTS = {
  ethereum: 'https://safe-transaction-mainnet.safe.global',
  base: 'https://safe-transaction-base.safe.global',
  arbitrum: 'https://safe-transaction-arbitrum.safe.global',
  optimism: 'https://safe-transaction-optimism.safe.global',
  polygon: 'https://safe-transaction-polygon.safe.global',
};

function baseUrl(chain) {
  const url = CHAIN_ENDPOINTS[chain];
  if (!url) {
    throw new Error(
      `Unsupported chain "${chain}". Supported: ${Object.keys(CHAIN_ENDPOINTS).join(', ')}`
    );
  }
  return url;
}

/**
 * Fetch pending (not-yet-executed) multisig transactions for a Safe.
 * @param {string} safeAddress
 * @param {string} chain - one of CHAIN_ENDPOINTS keys
 */
async function pendingTransactions(safeAddress, chain = 'base') {
  const url = `${baseUrl(chain)}/api/v1/safes/${safeAddress}/multisig-transactions/?executed=false`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Safe Transaction Service returned ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

/**
 * Fetch recent executed transactions for a Safe.
 * @param {string} safeAddress
 * @param {string} chain
 * @param {number} limit
 */
async function recentTransactions(safeAddress, chain = 'base', limit = 20) {
  const url = `${baseUrl(chain)}/api/v1/safes/${safeAddress}/multisig-transactions/?executed=true&limit=${limit}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Safe Transaction Service returned ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

/**
 * Fetch basic Safe info: owners, threshold, nonce.
 * @param {string} safeAddress
 * @param {string} chain
 */
async function safeInfo(safeAddress, chain = 'base') {
  const url = `${baseUrl(chain)}/api/v1/safes/${safeAddress}/`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Safe Transaction Service returned ${res.status}`);
  return res.json();
}
