"use client";

import React from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";

export function ConnectWallet() {
  const { address, balance, connect, disconnect, isConnecting } = useWallet();

  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.substring(0, 5)}...${addr.substring(addr.length - 4)}`;
  };

  if (address) {
    return (
      <div className="flex items-center gap-4">
        {balance && (
          <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
            {Number(balance).toFixed(2)} XLM
          </span>
        )}
        <span className="text-sm font-medium text-foreground bg-muted px-3 py-1.5 rounded-md">
          {formatAddress(address)}
        </span>
        <Button variant="outline" onClick={disconnect}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={connect} disabled={isConnecting}>
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
