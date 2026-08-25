#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::{Address as _, Ledger},
    token, Address, Env,
};

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
    let token_contract = env.register_stellar_asset_contract_v2(token_admin.clone()).address();
    let token_client = token::Client::new(&env, &token_contract);
    let token_admin_client = token::StellarAssetClient::new(&env, &token_contract);

    // Mint tokens to donor
    token_admin_client.mint(&donor, &2000);

    // Setup Badge contract
    let badge_contract = env.register(MockBadgeContract, ());

    // Setup Fund contract
    let fund_contract = env.register(StellarFund, ());
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

#[test]
fn test_fund_withdraw() {
    let env = Env::default();
    env.mock_all_auths();
    env.ledger().with_mut(|li| {
        li.timestamp = 1000;
    });

    let admin = Address::generate(&env);
    let donor = Address::generate(&env);

    let token_admin = Address::generate(&env);
    let token_contract = env.register_stellar_asset_contract_v2(token_admin.clone()).address();
    let token_client = token::Client::new(&env, &token_contract);
    let token_admin_client = token::StellarAssetClient::new(&env, &token_contract);

    token_admin_client.mint(&donor, &1000);

    let badge_contract = env.register(MockBadgeContract, ());
    let fund_contract = env.register(StellarFund, ());
    let fund_client = StellarFundClient::new(&env, &fund_contract);

    fund_client.initialize(&admin, &token_contract, &500, &2000, &badge_contract);
    fund_client.donate(&donor, &500);

    assert_eq!(token_client.balance(&fund_contract), 500);

    // Admin withdraws
    fund_client.withdraw();
    assert_eq!(token_client.balance(&admin), 500);
    assert_eq!(token_client.balance(&fund_contract), 0);
}
