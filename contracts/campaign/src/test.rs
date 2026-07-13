#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::{Address as _, Ledger},
    token, Address, Env,
};

// We need a mock or actual implementation of the Badge contract to test cross-contract calls
mod badge {
    soroban_sdk::contractimport!(file = "../target/wasm32-unknown-unknown/release/stellar_badge.wasm");
}

pub struct MockBadge;
#[contract]
pub struct MockBadgeContract;
#[contractimpl]
impl MockBadgeContract {
    pub fn mint(_env: Env, _caller: Address, _to: Address) {}
}

#[test]
fn test_fund_donation() {
    let env = Env::default();
    env.mock_all_auths();
    env.ledger().with_mut(|li| {
        li.timestamp = 1000;
    });

    let admin = Address::generate(&env);
    let donor = Address::generate(&env);

    // Setup Token
    let token_admin = Address::generate(&env);
    let token_contract = env.register_stellar_asset_contract(token_admin.clone());
    let token_client = token::Client::new(&env, &token_contract);
    let token_admin_client = token::StellarAssetClient::new(&env, &token_contract);

    // Mint tokens to donor
    token_admin_client.mint(&donor, &2000);

    // Setup Badge contract (using a mock contract structure that mimics the Badge)
    // Actually we can just register the wasm if it's built, but we can also just register a dummy contract
    let badge_contract = env.register_contract(None, MockBadgeContract);

    // Setup Fund contract
    let fund_contract = env.register_contract(None, StellarFund);
    let fund_client = StellarFundClient::new(&env, &fund_contract);

    // Initialize
    fund_client.initialize(
        &admin,
        &token_contract,
        &1000,
        &2000, // deadline > current timestamp
        &badge_contract,
    );

    // Donate
    fund_client.donate(&donor, &500);

    // Verify balances
    assert_eq!(token_client.balance(&donor), 1500);
    assert_eq!(token_client.balance(&fund_contract), 500);

    // Verify state
    let state = fund_client.get_state();
    assert_eq!(state.total_raised, 500);
}
