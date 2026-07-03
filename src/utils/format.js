function usd(n) {
  return '$' + Math.round(Number(n) || 0).toLocaleString('en-US');
}

function shortAddr(addr) {
  if (!addr) return '—';
  return addr.slice(0, 6) + '…' + addr.slice(-4);
}

async function notify(message, { mode = process.env.NOTIFY_MODE || 'console', webhookUrl = process.env.WEBHOOK_URL } = {}) {
  if (mode === 'webhook' && webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
      });
      return;
    } catch (err) {
      console.error('Webhook delivery failed, falling back to console:', err.message);
    }
  }
  console.log(message);
}

module.exports = { usd, shortAddr, notify };
