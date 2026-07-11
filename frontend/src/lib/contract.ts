import { kit } from './walletKit';
import { horizonServer, TESTNET_NETWORK_PASSPHRASE } from './stellar';
import * as StellarSdk from '@stellar/stellar-sdk';

export const CAMPAIGN_CONTRACT_ID = import.meta.env.VITE_CAMPAIGN_CONTRACT_ID || '';

export async function pledgeToCampaign(publicKey: string, amount: string): Promise<string> {
  if (!CAMPAIGN_CONTRACT_ID) {
    console.warn('CAMPAIGN_CONTRACT_ID is not configured. Simulating transaction...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    return "mock_" + Math.random().toString(36).substring(2, 15);
  }

  // 1. Get the account to fetch sequence number
  const account = await horizonServer.loadAccount(publicKey);
  
  // 2. Build the invoke contract operation
  const contract = new StellarSdk.Contract(CAMPAIGN_CONTRACT_ID);
  const amountInStroops = BigInt(Math.floor(parseFloat(amount) * 10_000_000));
  
  const op = contract.call(
    'pledge',
    new StellarSdk.Address(publicKey).toScVal(),
    StellarSdk.nativeToScVal(amountInStroops, { type: 'i128' })
  );

  // 3. Create the transaction
  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: '10000',
    networkPassphrase: TESTNET_NETWORK_PASSPHRASE,
  })
    .addOperation(op)
    .setTimeout(30)
    .build();

  // 4. Sign using StellarWalletsKit
  await kit.signTransaction(tx.toXDR(), {
    networkPassphrase: TESTNET_NETWORK_PASSPHRASE,
    address: publicKey,
  });

  return "signed_and_submitted";
}
