<div align="center">
  <img src="https://stellar.org/wp-content/uploads/2022/11/Stellar-Logo.svg" alt="Stellar Logo" width="120" />
  <h1>🚀 StellarFund Live</h1>
  <p><b>A real-time, decentralized crowdfunding dApp on the Stellar Soroban Testnet</b></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Stellar Testnet](https://img.shields.io/badge/Network-Stellar_Testnet-blue.svg)](https://stellar.expert/)
  [![Soroban](https://img.shields.io/badge/Smart_Contracts-Soroban-orange.svg)](https://soroban.stellar.org/)
  [![CI Pipeline](https://github.com/Ayan1911/stellar-levels/actions/workflows/ci.yml/badge.svg)](https://github.com/Ayan1911/stellar-levels/actions)
</div>

<br />

> Built for the **RiseIn Stellar Journey to Mastery** across White Belt (wallet + payments), Yellow Belt (multi-wallet + contract), and Orange Belt (inter-contract calls, tests, CI/CD).

---

## 📖 Description
StellarFund Live is a fully transparent and non-custodial crowdfunding platform. It empowers project creators to raise XLM with absolute security, leveraging **Soroban smart contracts** to lock funds safely on-chain until the funding goals are met. Backers can pledge with confidence, knowing their contributions are managed trustlessly.

---

## ⚡ Tech Stack & Architecture

### **Architecture Flow**
`Frontend UI` ⇄ `StellarWalletsKit` ⇄ `Soroban RPC (Testnet)` ⇄ `Campaign Contract` ⇄ `Badge Contract (Goal Reached)`

### **Technologies Used**
* **Frontend:** React, TypeScript, Vite, Tailwind CSS
* **Wallet Integration:** StellarWalletsKit (Freighter, xBull, Albedo, Rabet)
* **Blockchain/Backend:** @stellar/stellar-sdk, Soroban Smart Contracts (Rust)
* **Testing & CI/CD:** Vitest, React Testing Library, GitHub Actions

---

## ✨ Detailed Application Overview

### 1. Smart Contract Architecture (Soroban)
StellarFund Live utilizes a modular, two-contract system deployed on the Soroban Testnet:
* **Campaign Contract:** The core escrow engine. It tracks the funding goal (`5000 XLM`), the deadline (`14 Days`), and individual user pledges. It securely holds all contributed funds and enforces validation (e.g., rejecting pledges if the deadline has passed).
* **Badge Contract:** A secondary reward system demonstrating **Inter-contract calls**. When the Campaign Contract detects that a pledge pushes the total funds above the target goal, it automatically makes a cross-contract invocation to the Badge Contract to permanently award an on-chain "Goal Reached" badge to the backer.

### 2. Frontend User Experience
* **Universal Wallet Manager:** Built using `StellarWalletsKit`, users are not locked into a single ecosystem. They can seamlessly connect, switch between, and sign transactions using Freighter, xBull, Albedo, or Rabet.
* **Real-Time Activity Feed:** The application uses Soroban Event polling to fetch and display live network events. When a user pledges, their contribution instantly appears in the feed alongside their public key and timestamp.
* **Robust Error Handling & Edge Cases:** The UI is designed to elegantly handle failure states. Whether a user rejects a signature request, lacks the XLM balance to cover a pledge, or attempts to send funds to an invalid address, they are met with clear, human-readable toast notifications translated directly from Horizon API error codes.
* **Mobile-First Responsiveness:** The dashboard, wallet modal, and transaction panels fluidly adapt to all screen sizes, ensuring backers can fund campaigns directly from their mobile devices.

---

## 🔗 Live Links & Contracts

| Resource | Link / Hash / Address |
|---|---|
| **Live Demo** | 🌐 [StellarFund on Vercel](https://stellar-levels.vercel.app/) |
| **Demo Video** | 🎥 **[Watch Demo on Loom](https://www.loom.com/share/1bd1396c00aa472c8b2a58092294c1a3)** |
| **Campaign Contract** | [`CDDYMQBKHR4TZ5LO3HCLFF56MFPAVLUECZ4665DAU2US7UMZZY4KDVNQ`](https://stellar.expert/explorer/testnet/contract/CDDYMQBKHR4TZ5LO3HCLFF56MFPAVLUECZ4665DAU2US7UMZZY4KDVNQ) |
| **Badge Contract** | [`CDUOSMYK4P7D3QUVH6HYXF5MRCICCC4UVXPJAWDRLYELF33ZXMJZYZ5R`](https://stellar.expert/explorer/testnet/contract/CDUOSMYK4P7D3QUVH6HYXF5MRCICCC4UVXPJAWDRLYELF33ZXMJZYZ5R) |
| **Contract Tx Hash** | [`c02144f450a87a04747edbac6d2982fb68fb8913aca4460ad6c9a716e838ffe8`](https://stellar.expert/explorer/testnet/tx/c02144f450a87a04747edbac6d2982fb68fb8913aca4460ad6c9a716e838ffe8) |
| **Public GitHub Repo** | [Ayan1911/stellar-levels](https://github.com/Ayan1911/stellar-levels) |

---

## 📸 Project Screenshots

### Level 1 — White Belt: Wallet & Payments
| Wallet Connected State | Balance Displayed |
|:---:|:---:|
| <img src="docs/screenshots/01-wallet-connected.png" width="400"/> | <img src="docs/screenshots/02-balance-displayed.png" width="400"/> |
| **Successful Testnet Tx** | **Tx Result Shown** |
| <img src="docs/screenshots/05-tx-success.png" width="400"/> | <img src="docs/screenshots/06-tx-result.png" width="400"/> |

### Level 2 — Yellow Belt: Multi-Wallet & Contract
| Wallet Options (Modal) | Error: Wallet Not Found |
|:---:|:---:|
| <img src="docs/screenshots/03-wallet-options-modal.png" width="400"/> | <img src="docs/screenshots/10-error-wallet-not-found.png" width="400"/> |
| **Error: Rejected Signature** | **Error: Insufficient Balance** |
| <img src="docs/screenshots/11-error-rejected-signature.png" width="400"/> | <img src="docs/screenshots/12-error-insufficient-balance.png" width="400"/> |

### Level 3 — Orange Belt: Production, Tests, CI/CD
| Mobile Responsive UI | CI/CD Pipeline Running |
|:---:|:---:|
| <img src="docs/screenshots/09-mobile-responsive.png" width="400"/> | <img src="docs/screenshots/ci-pipeline-passing.png" width="400"/> |
| **Test Output (3+ Passing)** | **Goal Reached (Badge Awarded)** |
| <img src="docs/screenshots/test-output.png" width="400"/> | <img src="docs/screenshots/08-goal-reached-badge-awarded.png" width="400"/> |

---

## 🛠 Setup Instructions (Local)

1. **Prerequisites**: Node 18+, Rust + Cargo, Stellar CLI, and a Stellar wallet browser extension (Freighter recommended).
2. **Clone the Repository**: 
   ```bash
   git clone https://github.com/Ayan1911/stellar-levels.git
   cd stellar-levels
   ```
3. **Compile Contracts**: 
   ```bash
   cd contracts && cargo test
   ../scripts/deploy_contracts.sh # (Optional) Redeploy locally
   ```
4. **Run Frontend**: 
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local 
   # Set VITE_CAMPAIGN_CONTRACT_ID and VITE_BADGE_CONTRACT_ID
   npm run dev
   ```
5. **Fund a Wallet**: Use the in-app "Fund with Friendbot" button or visit [friendbot.stellar.org](https://friendbot.stellar.org/).

---

## 🧪 Testing

```bash
# Smart Contracts (Rust)
cargo test --manifest-path contracts/Cargo.toml

# Frontend (Vitest)
cd frontend && npm test
```

---

## 🚨 Error Handling Summary

| Error Type | Where Caught | User-Facing Message |
|---|---|---|
| **Invalid Destination** | `SendPayment.tsx` | "Please enter a valid Stellar address" |
| **Insufficient Balance** | `contract.ts` / `SendPayment` | "Insufficient XLM balance for this transaction" |
| **User Rejected Tx** | `useWallet.tsx` | "Transaction was cancelled" |
| **Wallet Not Found** | `walletKit.ts` | "No compatible wallet detected — install Freighter" |
| **Missed Deadline** | `Campaign Contract` | "This campaign has ended and can no longer accept pledges" |

---

## 📌 Commit History (10+ Meaningful Commits)
- ⚪ **Level 1**: `level1-submission` tag — Wallet connect/disconnect, balance display, XLM payment flow.
- 🟡 **Level 2**: `level2-submission` tag — StellarWalletsKit multi-wallet, Campaign contract deployment, live event feed.
- 🟠 **Level 3**: `level3-submission` tag — Badge contract inter-contract calls, automated tests, CI/CD pipeline, mobile responsiveness, and production hardening.

---
*License: MIT*
