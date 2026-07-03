# AI-Agent-Builder-starter-kit
# owockibot Agent Builder Starter Kit

A template for building AI agent tools on top of the owockibot bounty board — notification bots, treasury trackers, dashboards, or anything else that reads from the public API.

This kit gives you:

- 📡 A typed API client for the **bounty board** endpoint
- 💰 A read-only client for **Safe treasury** data (via the public Safe Transaction Service API)
- 🤖 A sample bot structure you can extend
- ✅ Two **working demos**: a bounty notification bot and a treasury tracker

Everything here is read-only by default. No demo in this kit signs transactions, claims bounties, or writes to anything on your behalf — it only reads and reports. That's intentional: agents that act autonomously on a bounty board should be built carefully and reviewed before they touch anything live.

---

## Quickstart

```bash
git clone <your-repo-url>
cd owockibot-agent-starter-kit
npm install
cp .env.example .env
```

Edit `.env` — at minimum set:

```
BOUNTY_BOARD_API=https://www.owockibot.xyz/api/bounty-board
```

If you're tracking a specific Safe multisig, also set:

```
SAFE_ADDRESS=0xYourSafeAddressHere
SAFE_CHAIN=base   # or ethereum, arbitrum, etc — see src/api/safeTreasury.js for supported keys
```

Run a demo:

```bash
npm run demo:notify      # bounty notification bot (polls for new bounties)
npm run demo:treasury    # treasury tracker (shows pending Safe transactions)
```

---

## Project structure

```
owockibot-agent-starter-kit/
├── src/
│   ├── api/
│   │   ├── bountyBoard.js     # client for the bounty board API
│   │   └── safeTreasury.js    # client for Safe Transaction Service (treasury data)
│   ├── bots/
│   │   ├── bountyNotificationBot.js   # demo: watches for new bounties, notifies
│   │   └── treasuryTracker.js         # demo: reports pending Safe payouts
│   └── utils/
│       └── format.js          # shared 
