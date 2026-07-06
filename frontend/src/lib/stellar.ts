import { Horizon } from '@stellar/stellar-sdk';

export const TESTNET_HORIZON_URL = 'https://horizon-testnet.stellar.org';
export const TESTNET_NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';
export const FRIENDBOT_URL = 'https://friendbot.stellar.org';

// Initialize Horizon Server client
export const horizonServer = new Horizon.Server(TESTNET_HORIZON_URL);

/**
 * Checks if a public key represents a funded account on testnet.
 * @param publicKey The Stellar public key to check.
 * @returns boolean indicating if the account is funded.
 */
export async function isAccountFunded(publicKey: string): Promise<boolean> {
  try {
    await horizonServer.loadAccount(publicKey);
    return true;
  } catch (error: any) {
    if (error.status === 404 || (error.response && error.response.status === 404)) {
      return false;
    }
    throw error;
  }
}

/**
 * Funds a public key using Stellar's Friendbot.
 * @param publicKey The Stellar public key to fund.
 */
export async function fundWithFriendbot(publicKey: string): Promise<void> {
  const url = `${FRIENDBOT_URL}?addr=${encodeURIComponent(publicKey)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Friendbot funding request failed. Please try again.');
  }
}
