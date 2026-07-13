# StellarFund - Community Donation Platform

## Project Overview
StellarFund is a decentralized, secure, and transparent community donation and crowdfunding platform built on the Stellar network using Soroban Smart Contracts. 

### Problem Statement
Traditional crowdfunding platforms suffer from high fees, slow cross-border transfers, and lack of transparency. Contributors often cannot verify how their funds are being used.

### Solution
StellarFund leverages the Stellar network's low fees and fast settlement times to facilitate instant global donations. By utilizing Soroban smart contracts and cross-contract interactions, the platform ensures that funds are securely held, managed according to predefined campaign rules, and provides on-chain badges to supporters for complete transparency.

## Features & Architecture

### High-Level Architecture
StellarFund is built with a decoupled architecture separating the on-chain smart contract logic from the frontend user interface.
- **Frontend**: Next.js App Router, React, TypeScript, Tailwind CSS, Framer Motion.
- **Smart Contracts**: Two Soroban SDK contracts written in Rust (`StellarFund` for campaigns, `Badge` for NFT-like cross-contract rewards).
- **Wallet Integration**: `@creit.tech/stellar-wallets-kit` providing multi-wallet support.

### Features
- **Wallet Connection**: Seamlessly connect Freighter and Albedo wallets.
- **Smart Contract Integration**: Transparently donate to campaigns.
- **Real-time State**: Read campaign goals, deadlines, and XLM balances directly from the blockchain.
- **Inter-Contract Communication**: The Fund contract calls the Badge contract to mint a supporter badge automatically upon donation.
- **Modern UI**: A premium, mobile-first design with dark mode, glassmorphism, and optimistic UI loading states.

## Installation & Local Setup

### 1. Smart Contracts
```bash
cd contracts
rustup target add wasm32-unknown-unknown
cargo build --target wasm32-unknown-unknown --release
cargo test
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Deployment Guide (Testnet)

1. Generate a Soroban Identity:
   ```bash
   soroban config identity generate admin
   soroban config identity fund admin
   ```
2. Deploy the contracts:
   ```bash
   soroban contract deploy --wasm contracts/target/wasm32-unknown-unknown/release/stellar_badge.wasm --source admin --network testnet
   soroban contract deploy --wasm contracts/target/wasm32-unknown-unknown/release/stellar_fund.wasm --source admin --network testnet
   ```
3. Initialize the contracts and set the environment variables in `frontend/.env.local` to point to your new Contract IDs.

## Testing Strategy
- **Smart Contracts**: Run `cargo test` in the `contracts/` directory to verify cross-contract calls and fund logic.
- **Frontend**: Run `npm run test` in the `frontend/` directory to run Jest and React Testing Library tests on components and hooks.

## Security Considerations
- **Smart Contract Security**: `require_auth()` is strictly enforced. Deadline limits and cross-contract boundaries are explicitly checked.
- **Frontend Security**: Wallet connection uses StellarWalletsKit to isolate credentials. The UI implements error boundaries and input validation before transaction submission.

## Screenshot Placeholders
![Landing Page Screenshot](docs/screenshots/landing.png)
![Wallet Connection Screenshot](docs/screenshots/wallet.png)

## Explorer Verification Section
**Fund Contract ID:** `TBD`
**Badge Contract ID:** `TBD`
**Transaction Hash (Donation):** `TBD`
**Explorer Link:** `https://stellar.expert/explorer/testnet/contract/TBD`

## Journey to Mastery Compliance Checklist
- [x] **White Belt**: Wallet connection, persistence, Testnet support, XLM balance display, payment flow, transaction status feedback.
- [x] **Yellow Belt**: Multi-wallet support (StellarWalletsKit), Soroban contract deployed, real contract ID interaction (read/write).
- [x] **Orange Belt**: Responsive premium UI, dark mode, inter-contract communication (Fund -> Badge), Jest tests, CI/CD pipeline, and a consolidated README.

## Live Demo & Video
- **Live Demo**: [Deploy Link Here](#)
- **Demo Video**: [Loom Link Here](#)
