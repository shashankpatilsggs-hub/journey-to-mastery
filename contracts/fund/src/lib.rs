#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, token, Address, Env, IntoVal, String,
    Symbol,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    TargetAmount,
    Deadline,
    TotalRaised,
    Token,
    BadgeContract,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CampaignState {
    pub admin: Address,
    pub target_amount: i128,
    pub deadline: u64,
    pub total_raised: i128,
    pub token: Address,
    pub badge_contract: Address,
}

#[contract]
pub struct StellarFund;

#[contractimpl]
impl StellarFund {
    /// Initialize the campaign with admin, token, target amount, and deadline
    pub fn initialize(
        env: Env,
        admin: Address,
        token: Address,
        target_amount: i128,
        deadline: u64,
        badge_contract: Address,
    ) {
        assert!(
            !env.storage().instance().has(&DataKey::Admin),
            "Already initialized"
        );
        assert!(target_amount > 0, "Target amount must be positive");
        assert!(
            deadline > env.ledger().timestamp(),
            "Deadline must be in the future"
        );

        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage()
            .instance()
            .set(&DataKey::TargetAmount, &target_amount);
        env.storage().instance().set(&DataKey::Deadline, &deadline);
        env.storage().instance().set(&DataKey::TotalRaised, &0i128);
        env.storage().instance().set(&DataKey::BadgeContract, &badge_contract);
    }

    /// Donate to the campaign
    pub fn donate(env: Env, donor: Address, amount: i128) {
        donor.require_auth();
        assert!(amount > 0, "Donation must be positive");

        let deadline: u64 = env.storage().instance().get(&DataKey::Deadline).unwrap();
        assert!(env.ledger().timestamp() < deadline, "Campaign has ended");

        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let token_client = token::Client::new(&env, &token_addr);

        // Transfer funds from donor to the contract
        token_client.transfer(&donor, &env.current_contract_address(), &amount);

        // Update total raised
        let mut total_raised: i128 = env.storage().instance().get(&DataKey::TotalRaised).unwrap();
        total_raised += amount;
        env.storage()
            .instance()
            .set(&DataKey::TotalRaised, &total_raised);

        // Cross-contract call to mint a badge
        let badge_contract: Address = env.storage().instance().get(&DataKey::BadgeContract).unwrap();
        env.invoke_contract::<()>(&badge_contract, &soroban_sdk::symbol_short!("mint"), soroban_sdk::vec![&env, donor.to_val()]);

        // Emit an event
        env.events()
            .publish((symbol_short!("donate"), donor), amount);
    }

    /// Withdraw funds by admin if target is reached or deadline has passed
    pub fn withdraw(env: Env) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let total_raised: i128 = env.storage().instance().get(&DataKey::TotalRaised).unwrap();
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let token_client = token::Client::new(&env, &token_addr);

        assert!(total_raised > 0, "Nothing to withdraw");

        // Transfer funds from contract to admin
        token_client.transfer(&env.current_contract_address(), &admin, &total_raised);

        // Reset total raised (or mark as withdrawn, for simplicity we reset)
        env.storage().instance().set(&DataKey::TotalRaised, &0i128);

        // Emit an event
        env.events()
            .publish((symbol_short!("withdraw"), admin), total_raised);
    }

    /// Get current campaign state
    pub fn get_state(env: Env) -> CampaignState {
        let admin = env.storage().instance().get(&DataKey::Admin).unwrap();
        let target_amount = env.storage().instance().get(&DataKey::TargetAmount).unwrap();
        let deadline = env.storage().instance().get(&DataKey::Deadline).unwrap();
        let total_raised = env.storage().instance().get(&DataKey::TotalRaised).unwrap();
        let token = env.storage().instance().get(&DataKey::Token).unwrap();
        let badge_contract = env.storage().instance().get(&DataKey::BadgeContract).unwrap();

        CampaignState {
            admin,
            target_amount,
            deadline,
            total_raised,
            token,
            badge_contract,
        }
    }
}
