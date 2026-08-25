#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    AuthorizedCaller,
    TotalDeposits,
    Balance,
    Deposits(Address),
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct TreasuryState {
    pub admin: Address,
    pub authorized_caller: Address,
    pub total_deposits: i128,
    pub balance: i128,
}

#[contract]
pub struct TreasuryVault;

#[contractimpl]
impl TreasuryVault {
    /// Initialize treasury with admin and authorized caller (e.g. subscription manager or campaign)
    pub fn initialize(env: Env, admin: Address, authorized_caller: Address) {
        assert!(
            !env.storage().instance().has(&DataKey::Admin),
            "Already initialized"
        );
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage()
            .instance()
            .set(&DataKey::AuthorizedCaller, &authorized_caller);
        env.storage().instance().set(&DataKey::TotalDeposits, &0i128);
        env.storage().instance().set(&DataKey::Balance, &0i128);
    }

    /// Deposit funds into the treasury vault
    pub fn deposit(env: Env, caller: Address, user: Address, amount: i128) {
        caller.require_auth();
        assert!(amount > 0, "Deposit amount must be positive");

        let authorized_caller: Address = env
            .storage()
            .instance()
            .get(&DataKey::AuthorizedCaller)
            .expect("Not initialized");

        if caller != authorized_caller {
            panic!("unauthorized caller for treasury deposit");
        }

        let mut balance: i128 = env
            .storage()
            .instance()
            .get(&DataKey::Balance)
            .unwrap_or(0i128);
        let mut total_deposits: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TotalDeposits)
            .unwrap_or(0i128);

        balance += amount;
        total_deposits += amount;

        let user_deposits: i128 = env
            .storage()
            .instance()
            .get(&DataKey::Deposits(user.clone()))
            .unwrap_or(0i128);
        env.storage()
            .instance()
            .set(&DataKey::Deposits(user.clone()), &(user_deposits + amount));

        env.storage().instance().set(&DataKey::Balance, &balance);
        env.storage()
            .instance()
            .set(&DataKey::TotalDeposits, &total_deposits);

        // Emit Treasury Deposit event
        env.events()
            .publish((symbol_short!("deposit"), user), amount);
    }

    /// Withdraw funds by admin
    pub fn withdraw(env: Env, to: Address, amount: i128) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("Not initialized");
        admin.require_auth();
        assert!(amount > 0, "Withdrawal amount must be positive");

        let mut balance: i128 = env
            .storage()
            .instance()
            .get(&DataKey::Balance)
            .unwrap_or(0i128);
        assert!(balance >= amount, "Insufficient treasury balance");

        balance -= amount;
        env.storage().instance().set(&DataKey::Balance, &balance);

        // Emit Treasury Withdraw event
        env.events()
            .publish((symbol_short!("withdraw"), to), amount);
    }

    /// Get current treasury state
    pub fn get_state(env: Env) -> TreasuryState {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("Not initialized");
        let authorized_caller: Address = env
            .storage()
            .instance()
            .get(&DataKey::AuthorizedCaller)
            .expect("Not initialized");
        let total_deposits: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TotalDeposits)
            .unwrap_or(0i128);
        let balance: i128 = env
            .storage()
            .instance()
            .get(&DataKey::Balance)
            .unwrap_or(0i128);

        TreasuryState {
            admin,
            authorized_caller,
            total_deposits,
            balance,
        }
    }

    /// Get balance
    pub fn get_balance(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::Balance)
            .unwrap_or(0i128)
    }

    /// Get user deposited amount
    pub fn get_user_deposit(env: Env, user: Address) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::Deposits(user))
            .unwrap_or(0i128)
    }
}

#[cfg(test)]
mod test;
