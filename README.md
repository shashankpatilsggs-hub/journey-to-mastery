# StellarFund Live

A real-time crowdfunding dApp on Stellar Testnet using Soroban smart contracts — built across White Belt (wallet + payments), Yellow Belt (multi-wallet + contract), and Orange Belt (inter-contract calls, tests, CI/CD) of the RiseIn Stellar Journey to Mastery.

## Description
StellarFund Live is a decentralized crowdfunding platform built on the Stellar Soroban network. It allows project creators to raise XLM in a fully transparent and non-custodial way, leveraging smart contracts to secure funds until goals are met. Backers can pledge funds with confidence, knowing their contributions are managed securely on-chain.

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS
- StellarWalletsKit (Freighter, xBull, Albedo, Rabet)
- @stellar/stellar-sdk (Soroban RPC)
- Soroban smart contracts (Rust)
- Vitest + React Testing Library
- GitHub Actions (CI/CD)

## Architecture
Frontend ⇄ StellarWalletsKit ⇄ Horizon / Soroban RPC (Testnet) ⇄ Campaign contract ⇄ Badge contract (inter-contract call on goal reached)

## Setup Instructions (Local)
1. **Prerequisites**: Node 18+, Rust + Cargo, Stellar CLI (`stellar --version`), a Stellar wallet browser extension (Freighter recommended)
2. **Clone**: `git clone https://github.com/Ayan1911/stellar-levels.git && cd stellar-levels`
3. **Contracts**: `cd contracts && cargo test` to verify, `../scripts/deploy_contracts.sh` to redeploy if needed
4. **Frontend**: `cd frontend && npm install && cp .env.example .env.local` — fill in `VITE_CAMPAIGN_CONTRACT_ID` and `VITE_BADGE_CONTRACT_ID` with the deployed IDs below, then `npm run dev`
5. **Fund a wallet**: use the in-app "Fund with Friendbot" button, or visit `https://friendbot.stellar.org?addr=<your public key>`

## Deployed Contracts (Testnet)
- **Campaign contract**: `CDDYMQBKHR4TZ5LO3HCLFF56MFPAVLUECZ4665DAU2US7UMZZY4KDVNQ`
- **Badge contract**: `CDUOSMYK4P7D3QUVH6HYXF5MRCICCC4UVXPJAWDRLYELF33ZXMJZYZ5R`
- **Contract call transaction hash**: `c02144f450a87a04747edbac6d2982fb68fb8913aca4460ad6c9a716e838ffe8` → [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/c02144f450a87a04747edbac6d2982fb68fb8913aca4460ad6c9a716e838ffe8)

## Live Demo
[https://stellar-levels.vercel.app/](https://stellar-levels.vercel.app/)

## Demo Video
[1–2 min unlisted YouTube/Loom link]

---

## Screenshots

### Level 1 — White Belt: Wallet & Payments
**Wallet connected state**
![Wallet Connected](docs/screenshots/01-wallet-connected.png)

**Balance displayed**
![Balance Displayed](docs/screenshots/02-balance-displayed.png)

**Successful testnet transaction**
![Transaction Success](docs/screenshots/05-tx-success.png)

**Transaction result shown to user**
![Transaction Result](docs/screenshots/06-tx-result.png)

### Level 2 — Yellow Belt: Multi-Wallet & Contract
**Wallet options available**
![Wallet Options Modal](docs/screenshots/03-wallet-options-modal.png)

**Error state: wallet not found**
![Error - Wallet Not Found](docs/screenshots/10-error-wallet-not-found.png)

**Error state: user rejected signature**
![Error - Rejected Signature](docs/screenshots/11-error-rejected-signature.png)

**Error state: insufficient balance**
![Error - Insufficient Balance](docs/screenshots/12-error-insufficient-balance.png)

### Level 3 — Orange Belt: Production, Tests, CI/CD
**Mobile responsive UI**
![Mobile Responsive](docs/screenshots/09-mobile-responsive.png)

**CI/CD pipeline running**
![CI Pipeline](docs/screenshots/ci-pipeline-passing.png)

**Test output — 3+ passing tests**
![Test Output](docs/screenshots/test-output.png)

**Goal reached / badge awarded (inter-contract call)**
![Badge Awarded](docs/screenshots/08-goal-reached-badge-awarded.png)

---

## Testing
```bash
# Smart contracts
cargo test --manifest-path contracts/Cargo.toml

# Frontend
cd frontend && npm test
```

## Error Handling Summary
| Error type | Where caught | User-facing message |
|---|---|---|
| Invalid destination address | `SendPayment.tsx` | "Please enter a valid Stellar address" |
| Insufficient balance | `contract.ts` / `SendPayment.tsx` | "Insufficient XLM balance for this transaction" |
| User rejected signature | `useWallet.tsx` | "Transaction was cancelled" |
| Wallet not found / not installed | `walletKit.ts` | "No compatible wallet detected — install Freighter or another supported wallet" |
| Pledge after campaign deadline | Campaign contract / `PledgeForm.tsx` | "This campaign has ended and can no longer accept pledges" |

## Commit History
- **Level 1 (White Belt)**: `level1-submission` tag — wallet connect/disconnect, balance display, XLM payment flow
- **Level 2 (Yellow Belt)**: `level2-submission` tag — StellarWalletsKit multi-wallet, Campaign contract deployed, live event feed
- **Level 3 (Orange Belt)**: `level3-submission` tag — Badge contract inter-contract calls, tests, CI/CD, mobile responsive, production hardening

## License
MIT
