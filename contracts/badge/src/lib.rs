#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env};

#[cfg(test)]
mod test;

#[contracttype]
pub enum DataKey {
    Awarded(Address),
}

#[contract]
pub struct BadgeContract;

#[contractimpl]
impl BadgeContract {
    pub fn award(env: Env, backer: Address) {
        // Award the badge to the backer (Phase 3 Inter-contract call requirement)
        env.storage().instance().set(&DataKey::Awarded(backer.clone()), &true);
        env.events().publish((symbol_short!("badge"), backer), true);
    }

    pub fn has_badge(env: Env, backer: Address) -> bool {
        env.storage().instance().get(&DataKey::Awarded(backer)).unwrap_or(false)
    }
}
