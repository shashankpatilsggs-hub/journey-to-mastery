import { kit } from './walletKit';
import { TESTNET_NETWORK_PASSPHRASE } from './stellar';
import * as StellarSdk from '@stellar/stellar-sdk';
import { rpc } from '@stellar/stellar-sdk';

export const CAMPAIGN_CONTRACT_ID = import.meta.env.VITE_CAMPAIGN_CONTRACT_ID || '';

const rpcServer = new rpc.Server("https://soroban-testnet.stellar.org:443");

export async function pledgeToCampaign(publicKey: string, amount: string): Promise<string> {
  if (!CAMPAIGN_CONTRACT_ID) {
    console.warn('CAMPAIGN_CONTRACT_ID is not configured. Simulating transaction...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    return "mock_" + Math.random().toString(36).substring(2, 15);
  }

  // 1. Get the account to fetch sequence number
  const account = await rpcServer.getAccount(publicKey);
  
  // 2. Build the invoke contract operation
  const contract = new StellarSdk.Contract(CAMPAIGN_CONTRACT_ID);
  const amountInStroops = BigInt(Math.floor(parseFloat(amount) * 10_000_000));
  
  const op = contract.call(
    'pledge',
    new StellarSdk.Address(publicKey).toScVal(),
    StellarSdk.nativeToScVal(amountInStroops, { type: 'i128' })
  );

  // 3. Create the initial transaction
  let tx = new StellarSdk.TransactionBuilder(account, {
    fee: '10000',
    networkPassphrase: TESTNET_NETWORK_PASSPHRASE,
  })
    .addOperation(op)
    .setTimeout(30)
    .build();

  // 4. Prepare the transaction to get auth footprints for Soroban
  try {
    tx = (await rpcServer.prepareTransaction(tx)) as StellarSdk.Transaction;
  } catch (e: any) {
    if (e.message?.includes('Bad union switch')) {
      throw new Error('Simulation failed: Check contract requirements (e.g., minimum pledge) or SDK compatibility.');
    }
    throw e;
  }

  // 5. Sign using StellarWalletsKit
  const { signedTxXdr } = await kit.signTransaction(tx.toXDR(), {
    networkPassphrase: TESTNET_NETWORK_PASSPHRASE,
    address: publicKey,
  });

  // 6. Send the transaction to the network
  const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedTxXdr, TESTNET_NETWORK_PASSPHRASE);
  const sendResponse = await rpcServer.sendTransaction(signedTx as StellarSdk.Transaction);
  
  if (sendResponse.status === "ERROR") {
     throw new Error("Transaction submission failed: " + JSON.stringify(sendResponse.errorResult));
  }

  // 7. Poll for confirmation
  let txStatus = await rpcServer.getTransaction(sendResponse.hash);
  while (txStatus.status === "NOT_FOUND") {
    await new Promise(resolve => setTimeout(resolve, 1000));
    txStatus = await rpcServer.getTransaction(sendResponse.hash);
  }

  if (txStatus.status === "FAILED") {
    throw new Error("Transaction failed on-chain");
  }

  return sendResponse.hash;
}
