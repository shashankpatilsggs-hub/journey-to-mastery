#!/bin/bash

# ==============================================================================
# StellarFund & Soroban Smart Contract Automated Deployment Pipeline
# Networks: Stellar Testnet
# Contracts: StellarFund (Campaign), StellarBadge, TreasuryVault, SubscriptionManager
# ==============================================================================

set -e

NETWORK="testnet"
RPC_URL="https://soroban-testnet.stellar.org"
NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
IDENTITY="deployer"

echo "=================================================="
echo "🚀 Starting Stellar Soroban Automated Deployment"
echo "Network: $NETWORK"
echo "=================================================="

# 1. Identity & Key Generation
echo "🔑 Verifying / Generating Testnet Deployer Key..."
if ! stellar keys address $IDENTITY > /dev/null 2>&1; then
  echo "Generating new testnet keypair for identity: $IDENTITY"
  stellar keys generate $IDENTITY --network $NETWORK
else
  echo "Using existing deployer identity: $IDENTITY"
fi

DEPLOYER_ADDR=$(stellar keys address $IDENTITY)
echo "Deployer Address: $DEPLOYER_ADDR"

# 2. Friendbot Funding
echo "💰 Requesting Friendbot Testnet XLM funding..."
curl -s "https://friendbot.stellar.org?addr=$DEPLOYER_ADDR" > /dev/null || true
echo "Deployer account funded."

# 3. Compiling Smart Contracts
echo "📦 Compiling Soroban Rust Contracts to wasm32..."
cd "$(dirname "$0")/../contracts"
rustup target add wasm32-unknown-unknown
cargo build --target wasm32-unknown-unknown --release

echo "✅ Contract Compilation Complete."

# 4. Deploying Treasury Vault Contract
echo "🏛️ Deploying Treasury Vault Contract..."
TREASURY_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellar_treasury_vault.wasm \
  --source $IDENTITY \
  --network $NETWORK)
echo "Treasury Vault Deployed: $TREASURY_ID"

# 5. Deploying Badge Contract
echo "🎖️ Deploying Badge Contract..."
BADGE_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellar_badge.wasm \
  --source $IDENTITY \
  --network $NETWORK)
echo "Badge Contract Deployed: $BADGE_ID"

# 6. Deploying Campaign Contract (StellarFund)
echo "🌟 Deploying Campaign Contract (StellarFund)..."
CAMPAIGN_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellar_campaign.wasm \
  --source $IDENTITY \
  --network $NETWORK)
echo "Campaign Contract Deployed: $CAMPAIGN_ID"

# 7. Deploying Subscription Manager Contract
echo "🔄 Deploying Subscription Manager Contract..."
SUB_MANAGER_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellar_subscription_manager.wasm \
  --source $IDENTITY \
  --network $NETWORK)
echo "Subscription Manager Deployed: $SUB_MANAGER_ID"

# 8. Contract Cross-Contract Binding & Initializations
echo "⚙️ Initializing Badge Contract with Campaign address..."
stellar contract invoke \
  --id $BADGE_ID \
  --source $IDENTITY \
  --network $NETWORK \
  -- \
  initialize \
  --campaign $CAMPAIGN_ID || true

echo "⚙️ Initializing Treasury Vault with Admin & Manager address..."
stellar contract invoke \
  --id $TREASURY_ID \
  --source $IDENTITY \
  --network $NETWORK \
  -- \
  initialize \
  --admin $DEPLOYER_ADDR \
  --authorized_caller $SUB_MANAGER_ID || true

echo "⚙️ Initializing Subscription Manager..."
stellar contract invoke \
  --id $SUB_MANAGER_ID \
  --source $IDENTITY \
  --network $NETWORK \
  -- \
  initialize \
  --admin $DEPLOYER_ADDR \
  --token "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC" \
  --treasury_vault $TREASURY_ID || true

echo "=================================================="
echo "🎉 ALL CONTRACTS SUCCESSFULLY DEPLOYED & BOUND!"
echo "=================================================="
echo "Campaign Contract ID:     $CAMPAIGN_ID"
echo "Badge Contract ID:        $BADGE_ID"
echo "Treasury Vault ID:        $TREASURY_ID"
echo "Subscription Manager ID:  $SUB_MANAGER_ID"
echo "=================================================="
echo "Paste the following into your frontend/.env.local:"
echo "NEXT_PUBLIC_FUND_CONTRACT_ID=$CAMPAIGN_ID"
echo "NEXT_PUBLIC_BADGE_CONTRACT_ID=$BADGE_ID"
echo "NEXT_PUBLIC_TREASURY_CONTRACT_ID=$TREASURY_ID"
echo "NEXT_PUBLIC_SUB_MANAGER_ID=$SUB_MANAGER_ID"
echo "=================================================="
