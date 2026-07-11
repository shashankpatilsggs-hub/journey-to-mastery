#!/bin/bash
set -e

echo "Setting up Stellar Testnet..."
stellar network add testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015" || true

echo "Setting up default deployment identity (and funding it)..."
stellar keys generate default --network testnet --fund || true

cd contracts

echo "Optimizing Badge contract..."
stellar contract optimize --wasm target/wasm32-unknown-unknown/release/badge.wasm

echo "Deploying Badge contract to Testnet..."
BADGE_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/badge.optimized.wasm \
  --source default \
  --network testnet)
echo "Badge Contract deployed at: $BADGE_ID"

echo "Optimizing Campaign contract..."
stellar contract optimize --wasm target/wasm32-unknown-unknown/release/campaign.wasm

echo "Deploying Campaign contract to Testnet..."
CAMPAIGN_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/campaign.optimized.wasm \
  --source default \
  --network testnet)
echo "Campaign Contract deployed at: $CAMPAIGN_ID"

cd ..
echo "VITE_CAMPAIGN_CONTRACT_ID=$CAMPAIGN_ID" > .env.local
echo "VITE_BADGE_CONTRACT_ID=$BADGE_ID" >> .env.local

echo "Deployment complete! Contract IDs have been saved to .env.local"
