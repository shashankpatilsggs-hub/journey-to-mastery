#![cfg(test)]

use crate::{CampaignContract, CampaignContractClient};
use soroban_sdk::{testutils::Address as _, Address, Env, token};

#[test]
fn test_campaign_init_and_pledge() {
    let env = Env::default();
    env.mock_all_auths();

    let creator = Address::generate(&env);
    let backer = Address::generate(&env);
    
    let token_admin = Address::generate(&env);
    let token_contract = env.register_stellar_asset_contract(token_admin.clone());
    let token_admin_client = token::StellarAssetClient::new(&env, &token_contract);
    
    // Mint test tokens
    token_admin_client.mint(&backer, &1000);

    let contract_id = env.register_contract(None, CampaignContract);
    let client = CampaignContractClient::new(&env, &contract_id);

    let goal = 500i128;
    let deadline = env.ledger().timestamp() + 1000;

    client.init(&creator, &token_contract, &goal, &deadline);

    client.pledge(&backer, &200);
    
    let (g, total, d) = client.get_info();
    assert_eq!(g, 500);
    assert_eq!(total, 200);
    assert_eq!(d, deadline);
}
