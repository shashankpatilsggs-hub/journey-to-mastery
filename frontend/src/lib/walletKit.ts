import {
  StellarWalletsKit,
  WalletNetwork,
  FREIGHTER_ID,
  FreighterModule
} from '@creit.tech/stellar-wallets-kit';

// Initialize StellarWalletsKit with Freighter only for Phase 1
export const kit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: FREIGHTER_ID,
  modules: [
    new FreighterModule(),
  ],
});
