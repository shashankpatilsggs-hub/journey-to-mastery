"use client";

import React, { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function DonateForm() {
  const { address } = useWallet();
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    toast.info("Preparing transaction...", { id: "tx" });

    try {
      const fundContractId = process.env.NEXT_PUBLIC_FUND_CONTRACT_ID;
      if (!fundContractId) throw new Error("Contract ID not set");

      // We dynamically import Stellar SDK to avoid SSR issues if any
      const { Contract, rpc, TransactionBuilder, Networks, nativeToScVal, Address, xdr } = await import("@stellar/stellar-sdk");
      const { StellarWalletsKit } = await import("@creit.tech/stellar-wallets-kit");
      
      const server = new rpc.Server("https://soroban-testnet.stellar.org");
      const account = await server.getAccount(address);
      const contract = new Contract(fundContractId);

      const tx = new TransactionBuilder(account, {
        fee: "1000", // Will be simulated and bumped
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          contract.call(
            "donate",
            new Address(address).toScVal(),
            nativeToScVal(Math.floor(Number(amount) * 1e7), { type: "i128" })
          )
        )
        .setTimeout(30)
        .build();

      // Simulate transaction
      const sim = await server.simulateTransaction(tx);
      if (!rpc.Api.isSimulationSuccess(sim)) {
        throw new Error("Transaction simulation failed: " + (sim.error || "Unknown"));
      }
      
      // Assemble transaction with simulation data
      const assembledTx = rpc.assembleTransaction(tx, sim)
        .build();

      toast.info("Please sign the transaction in your wallet", { id: "tx" });
      
      // Sign using StellarWalletsKit
      const signedResult = await StellarWalletsKit.signTransaction(assembledTx.toXDR(), {
        networkPassphrase: Networks.TESTNET,
      });
      if (!signedResult.signedTxXdr) throw new Error("User rejected signature");
      
      const signedTx = TransactionBuilder.fromXDR(signedResult.signedTxXdr, Networks.TESTNET);

      toast.info("Submitting to network...", { id: "tx" });
      // @ts-ignore
      const submitRes = await server.sendTransaction(signedTx);
      
      if (submitRes.status === "ERROR") {
        throw new Error("Submission failed");
      }

      toast.success(
        <div>
          Donation successful!{" "}
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${submitRes.hash}`}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            View on Explorer
          </a>
        </div>,
        { id: "tx" }
      );
      setAmount("");
    } catch (error: any) {
      console.error("Donate error:", error);
      let msg = "Unknown error";
      if (error instanceof Error) {
        msg = error.message;
      } else if (typeof error === "string") {
        msg = error;
      } else if (error && error.error) {
        msg = error.error;
      } else if (typeof error === "object") {
        msg = JSON.stringify(error);
      }
      toast.error("Transaction failed: " + msg, { id: "tx" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <form onSubmit={handleDonate} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (XLM)</Label>
          <Input
            id="amount"
            placeholder="Enter amount to donate"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isSubmitting}
            type="number"
            step="0.0000001"
            className="bg-background/50 backdrop-blur-sm"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting || !address}
        >
          {isSubmitting ? "Processing..." : "Donate Now"}
        </Button>
      </form>
    </motion.div>
  );
}
