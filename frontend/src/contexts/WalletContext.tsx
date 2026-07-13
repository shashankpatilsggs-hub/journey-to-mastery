"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { StellarWalletsKit, Networks } from "@creit.tech/stellar-wallets-kit";
import { FreighterModule } from "@creit.tech/stellar-wallets-kit/modules/freighter";
import { AlbedoModule } from "@creit.tech/stellar-wallets-kit/modules/albedo";
import { Horizon } from "@stellar/stellar-sdk";

interface WalletContextType {
  address: string | null;
  balance: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnecting: boolean;
  network: Networks;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);
const server = new Horizon.Server("https://horizon-testnet.stellar.org");

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const network = Networks.TESTNET;

  // Initialize Kit
  useEffect(() => {
    StellarWalletsKit.init({
      network,
      modules: [new FreighterModule(), new AlbedoModule()],
      selectedWalletId: "freighter",
    });

    const savedAddress = localStorage.getItem("stellar_address");
    if (savedAddress) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAddress(savedAddress);
    }
  }, [network]);

  // Fetch Balance
  useEffect(() => {
    async function fetchBalance() {
      if (!address) {
        setBalance(null);
        return;
      }
      try {
        const account = await server.loadAccount(address);
        const nativeBalance = account.balances.find((b) => b.asset_type === "native");
        if (nativeBalance) {
          setBalance(nativeBalance.balance);
        }
      } catch (e) {
        console.error("Error fetching balance:", e);
        setBalance("0.00");
      }
    }
    fetchBalance();
  }, [address]);

  const connect = async () => {
    setIsConnecting(true);
    try {
      const res = await StellarWalletsKit.authModal();
      if (res && res.address) {
        setAddress(res.address);
        localStorage.setItem("stellar_address", res.address);
      }
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await StellarWalletsKit.disconnect();
    } catch {
      // ignore
    }
    setAddress(null);
    setBalance(null);
    localStorage.removeItem("stellar_address");
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        connect,
        disconnect,
        isConnecting,
        network,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
