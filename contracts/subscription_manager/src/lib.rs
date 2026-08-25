#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, token, vec, Address, Env, IntoVal,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    Token,
    TreasuryVault,
    TotalSubscribers,
    TotalVolume,
    Subscription(Address),
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Subscription {
    pub subscriber: Address,
    pub tier: u32,
    pub amount: i128,
    pub start_timestamp: u64,
    pub is_active: bool,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ManagerState {
    pub admin: Address,
    pub token: Address,
    pub treasury_vault: Address,
    pub total_subscribers: u32,
    pub total_volume: i128,
}

#[contract]
pub struct SubscriptionManager;

#[contractimpl]
impl SubscriptionManager {
    /// Initialize subscription manager with admin, token, and treasury vault
    pub fn initialize(env: Env, admin: Address, token: Address, treasury_vault: Address) {
        assert!(
            !env.storage().instance().has(&DataKey::Admin),
            "Already initialized"
        );
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage()
            .instance()
            .set(&DataKey::TreasuryVault, &treasury_vault);
        env.storage()
            .instance()
            .set(&DataKey::TotalSubscribers, &0u32);
        env.storage().instance().set(&DataKey::TotalVolume, &0i128);
    }

    /// Subscribe to a tier and route funds to treasury vault via cross-contract call
    pub fn subscribe(env: Env, subscriber: Address, tier: u32, amount: i128) {
        subscriber.require_auth();
        assert!(amount > 0, "Subscription amount must be positive");
        assert!(tier > 0, "Tier must be greater than 0");

        let token_addr: Address = env
            .storage()
            .instance()
            .get(&DataKey::Token)
            .expect("Not initialized");
        let treasury_vault: Address = env
            .storage()
            .instance()
            .get(&DataKey::TreasuryVault)
            .expect("Not initialized");

        let token_client = token::Client::new(&env, &token_addr);

        // Transfer funds from subscriber to this contract
        token_client.transfer(&subscriber, &env.current_contract_address(), &amount);

        // Inter-contract communication: Deposit funds into Treasury Vault
        env.invoke_contract::<()>(
            &treasury_vault,
            &symbol_short!("deposit"),
            vec![
                &env,
                env.current_contract_address().to_val(),
                subscriber.to_val(),
                amount.to_val(),
            ],
        );

        // Update total volume
        let mut total_vol: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TotalVolume)
            .unwrap_or(0i128);
        total_vol += amount;
        env.storage()
            .instance()
            .set(&DataKey::TotalVolume, &total_vol);

        // Update subscriber records
        let is_new = !env
            .storage()
            .instance()
            .has(&DataKey::Subscription(subscriber.clone()));

        if is_new {
            let mut total_subs: u32 = env
                .storage()
                .instance()
                .get(&DataKey::TotalSubscribers)
                .unwrap_or(0u32);
            total_subs += 1;
            env.storage()
                .instance()
                .set(&DataKey::TotalSubscribers, &total_subs);
        }

        let sub = Subscription {
            subscriber: subscriber.clone(),
            tier,
            amount,
            start_timestamp: env.ledger().timestamp(),
            is_active: true,
        };
        env.storage()
            .instance()
            .set(&DataKey::Subscription(subscriber.clone()), &sub);

        // Emit custom Soroban events
        env.events()
            .publish((symbol_short!("sub_new"), subscriber.clone()), tier);
        env.events()
            .publish((symbol_short!("pay_exec"), subscriber), amount);
    }

    /// Cancel an active subscription
    pub fn cancel_subscription(env: Env, subscriber: Address) {
        subscriber.require_auth();
        let mut sub: Subscription = env
            .storage()
            .instance()
            .get(&DataKey::Subscription(subscriber.clone()))
            .expect("Subscription not found");

        assert!(sub.is_active, "Subscription is already inactive");
        sub.is_active = false;
        env.storage()
            .instance()
            .set(&DataKey::Subscription(subscriber.clone()), &sub);

        env.events()
            .publish((symbol_short!("sub_canc"), subscriber), 0i128);
    }

    /// Retrieve subscriber details
    pub fn get_subscription(env: Env, subscriber: Address) -> Option<Subscription> {
        env.storage()
            .instance()
            .get(&DataKey::Subscription(subscriber))
    }

    /// Get overall manager state
    pub fn get_state(env: Env) -> ManagerState {
        let admin = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("Not initialized");
        let token = env
            .storage()
            .instance()
            .get(&DataKey::Token)
            .expect("Not initialized");
        let treasury_vault = env
            .storage()
            .instance()
            .get(&DataKey::TreasuryVault)
            .expect("Not initialized");
        let total_subscribers = env
            .storage()
            .instance()
            .get(&DataKey::TotalSubscribers)
            .unwrap_or(0u32);
        let total_volume = env
            .storage()
            .instance()
            .get(&DataKey::TotalVolume)
            .unwrap_or(0i128);

        ManagerState {
            admin,
            token,
            treasury_vault,
            total_subscribers,
            total_volume,
        }
    }
}

#[cfg(test)]
mod test;
