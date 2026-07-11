#!/bin/bash
# scripts/deploy_contracts.sh
# This script assumes you have the Stellar CLI installed and your identity/network configured.

set -e

echo "Building contracts..."
cargo build --target wasm32-unknown-unknown --release

echo "Optimizing Campaign contract..."
stellar contract optimize --wasm target/wasm32-unknown-unknown/release/campaign.wasm

echo "Deploying Campaign contract to Testnet..."
CONTRACT_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/campaign.optimized.wasm \
  --source default \
  --network testnet)

echo "Campaign Contract deployed at: $CONTRACT_ID"
echo "CONTRACT_ID=$CONTRACT_ID" > .env.testnet

echo "Deployment complete."
