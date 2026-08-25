#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test_treasury_initialization_and_deposit() {
    let env = Env::default();
    env.mock_all_auths();

    let treasury_id = env.register(TreasuryVault, ());
    let client = TreasuryVaultClient::new(&env, &treasury_id);

    let admin = Address::generate(&env);
    let manager = Address::generate(&env);
    let user = Address::generate(&env);

    client.initialize(&admin, &manager);

    assert_eq!(client.get_balance(), 0);

    // Authorized deposit
    client.deposit(&manager, &user, &500);

    assert_eq!(client.get_balance(), 500);
    assert_eq!(client.get_user_deposit(&user), 500);

    let state = client.get_state();
    assert_eq!(state.total_deposits, 500);
    assert_eq!(state.balance, 500);
    assert_eq!(state.admin, admin);
    assert_eq!(state.authorized_caller, manager);
}

#[test]
fn test_treasury_withdraw() {
    let env = Env::default();
    env.mock_all_auths();

    let treasury_id = env.register(TreasuryVault, ());
    let client = TreasuryVaultClient::new(&env, &treasury_id);

    let admin = Address::generate(&env);
    let manager = Address::generate(&env);
    let user = Address::generate(&env);
    let recipient = Address::generate(&env);

    client.initialize(&admin, &manager);
    client.deposit(&manager, &user, &1000);

    // Admin withdraws 400
    client.withdraw(&recipient, &400);
    assert_eq!(client.get_balance(), 600);

    // Admin withdraws remaining 600
    client.withdraw(&recipient, &600);
    assert_eq!(client.get_balance(), 0);
}

#[test]
#[should_panic(expected = "unauthorized caller for treasury deposit")]
fn test_unauthorized_deposit() {
    let env = Env::default();
    env.mock_all_auths();

    let treasury_id = env.register(TreasuryVault, ());
    let client = TreasuryVaultClient::new(&env, &treasury_id);

    let admin = Address::generate(&env);
    let manager = Address::generate(&env);
    let attacker = Address::generate(&env);
    let user = Address::generate(&env);

    client.initialize(&admin, &manager);

    // Attacker tries to deposit
    client.deposit(&attacker, &user, &500);
}
