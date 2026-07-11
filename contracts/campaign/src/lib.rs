#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, symbol_short};

#[contracttype]
pub enum DataKey {
    Creator,
    Token,
    Goal,
    Deadline,
    TotalPledged,
}

#[contract]
pub struct CampaignContract;

#[contractimpl]
impl CampaignContract {
    pub fn init(
        env: Env,
        creator: Address,
        token: Address,
        goal: i128,
        deadline: u64,
    ) {
        creator.require_auth();
        env.storage().instance().set(&DataKey::Creator, &creator);
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage().instance().set(&DataKey::Goal, &goal);
        env.storage().instance().set(&DataKey::Deadline, &deadline);
        env.storage().instance().set(&DataKey::TotalPledged, &0i128);
    }

    pub fn pledge(env: Env, backer: Address, amount: i128) {
        backer.require_auth();
        
        let deadline: u64 = env.storage().instance().get(&DataKey::Deadline).unwrap();
        assert!(env.ledger().timestamp() <= deadline, "Campaign ended");

        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let token_client = token::Client::new(&env, &token_addr);
        
        // Transfer from backer to contract
        token_client.transfer(&backer, &env.current_contract_address(), &amount);

        let mut total: i128 = env.storage().instance().get(&DataKey::TotalPledged).unwrap();
        total += amount;
        env.storage().instance().set(&DataKey::TotalPledged, &total);

        // Emit pledge event
        env.events().publish((symbol_short!("pledge"), backer), amount);
    }

    pub fn get_info(env: Env) -> (i128, i128, u64) {
        let goal: i128 = env.storage().instance().get(&DataKey::Goal).unwrap();
        let total: i128 = env.storage().instance().get(&DataKey::TotalPledged).unwrap();
        let deadline: u64 = env.storage().instance().get(&DataKey::Deadline).unwrap();
        (goal, total, deadline)
    }
}
