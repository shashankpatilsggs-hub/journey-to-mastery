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
        
        // Phase 3: Check if goal is met by this pledge
        let goal: i128 = env.storage().instance().get(&DataKey::Goal).unwrap();
        let was_below_goal = total < goal;
        
        total += amount;
        env.storage().instance().set(&DataKey::TotalPledged, &total);

        // Emit pledge event
        env.events().publish((symbol_short!("pledge"), backer.clone()), amount);

        // Phase 3 Inter-contract call: Award badge if goal is reached for the first time
        if was_below_goal && total >= goal {
            env.events().publish((symbol_short!("goal_met"), env.current_contract_address()), total);
            
            if let Some(badge_addr) = env.storage().instance().get::<_, Address>(&symbol_short!("badge_c")) {
                use soroban_sdk::IntoVal;
                env.invoke_contract::<()>(
                    &badge_addr, 
                    &soroban_sdk::Symbol::new(&env, "award"), 
                    soroban_sdk::vec![&env, backer.into_val(&env)]
                );
            }
        }
    }

    pub fn get_info(env: Env) -> (i128, i128, u64) {
        let goal: i128 = env.storage().instance().get(&DataKey::Goal).unwrap();
        let total: i128 = env.storage().instance().get(&DataKey::TotalPledged).unwrap();
        let deadline: u64 = env.storage().instance().get(&DataKey::Deadline).unwrap();
        (goal, total, deadline)
    }

    pub fn set_badge(env: Env, creator: Address, badge_contract: Address) {
        creator.require_auth();
        let stored_creator: Address = env.storage().instance().get(&DataKey::Creator).unwrap();
        assert!(creator == stored_creator, "Not creator");
        env.storage().instance().set(&symbol_short!("badge_c"), &badge_contract);
    }
}
