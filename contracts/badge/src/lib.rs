#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Badge(Address),
}

#[contract]
pub struct StellarBadge;

#[contractimpl]
impl StellarBadge {
    /// Mint a supporter badge for the specified address
    pub fn mint(env: Env, to: Address) {
        // In a real NFT contract, this would increment supply and emit events.
        // For simplicity, we just record that this address holds a badge.
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
