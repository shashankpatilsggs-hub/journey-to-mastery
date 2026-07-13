#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    CampaignContract,
    Badge(Address),
}

#[contract]
pub struct StellarBadge;

#[contractimpl]
impl StellarBadge {
    /// Initialize the badge contract with the authorized campaign address
    pub fn initialize(env: Env, campaign: Address) {
        assert!(!env.storage().instance().has(&DataKey::CampaignContract), "Already initialized");
        env.storage().instance().set(&DataKey::CampaignContract, &campaign);
    }

    /// Mint a supporter badge for the specified address
    pub fn mint(env: Env, caller: Address, to: Address) {
        caller.require_auth();
        let authorized_caller: Address = env.storage().instance().get(&DataKey::CampaignContract).expect("Not initialized");
        if caller != authorized_caller {
            panic!("unauthorized caller");
        }
        env.storage().instance().set(&DataKey::Badge(to), &true);
    }

    /// Check if an address has a badge
    pub fn has_badge(env: Env, user: Address) -> bool {
        env.storage()
            .instance()
            .get(&DataKey::Badge(user))
            .unwrap_or(false)
    }
}

mod test;
