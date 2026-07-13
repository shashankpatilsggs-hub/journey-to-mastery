#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test_badge_minting() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(StellarBadge, ());
    let client = StellarBadgeClient::new(&env, &contract_id);

    let campaign_contract = Address::generate(&env);
    let user1 = Address::generate(&env);
    
    client.initialize(&campaign_contract);
    
    // Check initial state
    assert_eq!(client.has_badge(&user1), false);

    // Issue badge (campaign contract calls mint)
    client.mint(&campaign_contract, &user1);

    // Verify badge issuance
    assert_eq!(client.has_badge(&user1), true);
}
