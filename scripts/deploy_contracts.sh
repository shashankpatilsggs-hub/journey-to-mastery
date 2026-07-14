#!/bin/bash

# Exit on error
set -e

echo "Building contracts..."
cd contracts
rustup target add wasm32-unknown-unknown
cargo build --target wasm32-unknown-unknown --release

echo "Deploying Badge Contract to Testnet..."
BADGE_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellar_badge.wasm \
  --source default \
  --network testnet)

echo "Badge Contract Deployed: $BADGE_ID"

echo "Deploying Campaign Contract to Testnet..."
CAMPAIGN_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellar_campaign.wasm \
  --source default \
  --network testnet)

echo "Campaign Contract Deployed: $CAMPAIGN_ID"

echo "Initializing Campaign Contract..."
stellar contract invoke \
  --id $CAMPAIGN_ID \
  --source default \
  --network testnet \
  -- \
  initialize \
  --badge_contract $BADGE_ID

echo "Deployment complete!"
echo "--------------------------------------------------"
echo "Badge ID: $BADGE_ID"
echo "Campaign ID: $CAMPAIGN_ID"
echo "--------------------------------------------------"
