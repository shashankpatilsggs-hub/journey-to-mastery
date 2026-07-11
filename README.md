# StellarFund Live
A decentralized crowdfunding dApp built on the Stellar Soroban smart contract platform.

## Architecture
StellarFund Live consists of a Vite/React frontend and a Soroban-based smart contract backend.

### Smart Contracts (Soroban)
- **Campaign Contract (`contracts/campaign`)**: Manages the crowdfunding campaign, accepting pledges in Testnet XLM.
- **Badge Contract (`contracts/badge`)**: A secondary contract invoked by the Campaign contract (Inter-contract Call) when the funding goal is reached, awarding a celebratory badge to the backer.

### Frontend
- **React + TailwindCSS + Vite**: A beautifully designed, highly responsive dashboard.
- **StellarWalletsKit**: Multi-wallet support (Freighter, xBull, Albedo, Rabet) configured in `src/lib/walletKit.ts`.
- **TxStatusToast**: Live transaction status tracking UI.
- **ActivityFeed**: Real-time event polling from the Soroban RPC.

## Development & Deployment

### Prerequisites
- Node.js (v20+)
- Rust (`rustup default stable` & `wasm32-unknown-unknown` target)
- Stellar CLI (`cargo install --locked stellar-cli --features opt`)

### Deploying Contracts
Use the provided bash script to compile, optimize, and deploy the contracts to Testnet:
```bash
./scripts/deploy_contracts.sh
```

### Running Frontend Tests
```bash
cd frontend
npm run test
```

### Running the dApp
```bash
cd frontend
npm run dev
```

## CI/CD Pipeline
Configured via GitHub Actions (`.github/workflows/ci.yml`), which automatically runs:
1. `cargo test` for Soroban Rust smart contracts
2. `vitest` for React frontend UI components
3. `npm run build` to verify production bundling
