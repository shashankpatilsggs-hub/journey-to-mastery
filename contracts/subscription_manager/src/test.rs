#![cfg(test)]

use super::*;
use soroban_sdk::{
    contract, contractimpl,
    testutils::{Address as _, Ledger},
    token, Address, Env,
};

#[contract]
pub struct MockTreasuryVault;

#[contractimpl]
impl MockTreasuryVault {
    pub fn deposit(_env: Env, _caller: Address, _user: Address, _amount: i128) {}
}

#[test]
fn test_subscription_creation_and_treasury_call() {
    let env = Env::default();
    env.mock_all_auths();
    env.ledger().with_mut(|li| {
        li.timestamp = 1000;
    });

    let admin = Address::generate(&env);
    let subscriber = Address::generate(&env);

    // Setup Token
    let token_admin = Address::generate(&env);
    let token_contract = env.register_stellar_asset_contract_v2(token_admin.clone()).address();
    let token_admin_client = token::StellarAssetClient::new(&env, &token_contract);
    token_admin_client.mint(&subscriber, &10_000);

    // Setup Mock Treasury
    let treasury_contract = env.register(MockTreasuryVault, ());

    // Setup Subscription Manager
    let manager_contract = env.register(SubscriptionManager, ());
    let manager_client = SubscriptionManagerClient::new(&env, &manager_contract);

    manager_client.initialize(&admin, &token_contract, &treasury_contract);

    // Subscribe
    manager_client.subscribe(&subscriber, &1, &1000);

    // Verify subscriber status
    let sub = manager_client.get_subscription(&subscriber).unwrap();
    assert_eq!(sub.tier, 1);
    assert_eq!(sub.amount, 1000);
    assert_eq!(sub.is_active, true);
    assert_eq!(sub.start_timestamp, 1000);

    // Verify Manager State
    let state = manager_client.get_state();
    assert_eq!(state.total_subscribers, 1);
    assert_eq!(state.total_volume, 1000);
}

#[test]
fn test_cancel_subscription() {
    let env = Env::default();
    env.mock_all_auths();
    env.ledger().with_mut(|li| {
        li.timestamp = 1000;
    });

    let admin = Address::generate(&env);
    let subscriber = Address::generate(&env);

    let token_admin = Address::generate(&env);
    let token_contract = env.register_stellar_asset_contract_v2(token_admin.clone()).address();
    let token_admin_client = token::StellarAssetClient::new(&env, &token_contract);
    token_admin_client.mint(&subscriber, &5000);

    let treasury_contract = env.register(MockTreasuryVault, ());
    let manager_contract = env.register(SubscriptionManager, ());
    let manager_client = SubscriptionManagerClient::new(&env, &manager_contract);

    manager_client.initialize(&admin, &token_contract, &treasury_contract);
    manager_client.subscribe(&subscriber, &2, &2500);

    let sub_before = manager_client.get_subscription(&subscriber).unwrap();
    assert_eq!(sub_before.is_active, true);

    manager_client.cancel_subscription(&subscriber);

    let sub_after = manager_client.get_subscription(&subscriber).unwrap();
    assert_eq!(sub_after.is_active, false);
}

#[test]
fn test_multiple_tier_subscriptions() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let subscriber1 = Address::generate(&env);
    let subscriber2 = Address::generate(&env);

    let token_admin = Address::generate(&env);
    let token_contract = env.register_stellar_asset_contract_v2(token_admin.clone()).address();
    let token_admin_client = token::StellarAssetClient::new(&env, &token_contract);
    token_admin_client.mint(&subscriber1, &5000);
    token_admin_client.mint(&subscriber2, &10000);

    let treasury_contract = env.register(MockTreasuryVault, ());
    let manager_contract = env.register(SubscriptionManager, ());
    let manager_client = SubscriptionManagerClient::new(&env, &manager_contract);

    manager_client.initialize(&admin, &token_contract, &treasury_contract);

    manager_client.subscribe(&subscriber1, &1, &1000);
    manager_client.subscribe(&subscriber2, &3, &5000);

    let state = manager_client.get_state();
    assert_eq!(state.total_subscribers, 2);
    assert_eq!(state.total_volume, 6000);
}
