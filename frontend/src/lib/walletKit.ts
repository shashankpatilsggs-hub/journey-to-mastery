import {
  StellarWalletsKit,
  WalletNetwork,
  FREIGHTER_ID,
  FreighterModule,
  xBullModule,
  AlbedoModule,
  RabetModule
} from '@creit.tech/stellar-wallets-kit';

// Initialize StellarWalletsKit with multiple wallets for Phase 2
export const kit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: FREIGHTER_ID,
  modules: [
    new FreighterModule(),
    new xBullModule(),
    new AlbedoModule(),
    new RabetModule(),
  ],
});
