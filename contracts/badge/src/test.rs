#![cfg(test)]

use crate::{BadgeContract, BadgeContractClient};
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test_award_badge() {
    let env = Env::default();
    let contract_id = env.register_contract(None, BadgeContract);
    let client = BadgeContractClient::new(&env, &contract_id);

    let backer = Address::generate(&env);

    assert_eq!(client.has_badge(&backer), false);

    client.award(&backer);

    assert_eq!(client.has_badge(&backer), true);
}
