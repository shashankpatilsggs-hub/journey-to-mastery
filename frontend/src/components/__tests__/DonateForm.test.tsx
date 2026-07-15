import { rpc } from "@stellar/stellar-sdk";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DonateForm } from "../DonateForm";
import { useWallet } from "@/contexts/WalletContext";
import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
import { toast } from "sonner";

// Mock dependencies
jest.mock("@/contexts/WalletContext");
jest.mock("sonner");
jest.mock("@creit.tech/stellar-wallets-kit", () => ({
  StellarWalletsKit: {
    signTransaction: jest.fn(),
  },
}));
jest.mock("@stellar/stellar-sdk", () => ({
  Contract: jest.fn().mockImplementation(() => ({
    call: jest.fn(),
  })),
  rpc: {
    Server: jest.fn().mockImplementation(() => ({
      getAccount: jest.fn().mockResolvedValue({}),
      simulateTransaction: jest.fn().mockResolvedValue({}),
      sendTransaction: jest.fn().mockResolvedValue({ status: "SUCCESS", hash: "test-hash" }),
    })),
    Api: {
      isSimulationSuccess: jest.fn().mockReturnValue(true),
    },
    assembleTransaction: jest.fn().mockReturnValue({ build: jest.fn().mockReturnValue({ toXDR: jest.fn() }) }),
  },
  Horizon: {
    Server: jest.fn(),
  },
  TransactionBuilder: jest.fn().mockImplementation(() => ({
    addOperation: jest.fn().mockReturnThis(),
    setTimeout: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnThis(),
    toXDR: jest.fn(),
  })),
  Networks: { TESTNET: "Test SDF Network ; September 2015" },
  nativeToScVal: jest.fn(),
  Address: jest.fn().mockImplementation(() => ({ toScVal: jest.fn() })),
}));

// Provide a fake Contract ID environment variable
process.env.NEXT_PUBLIC_FUND_CONTRACT_ID = "CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

describe("DonateForm Error Handling", () => {
  beforeEach(() => {
    (useWallet as jest.Mock).mockReturnValue({
      address: "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    });
    jest.clearAllMocks();
  });

  it("handles insufficient balance (or invalid amount)", async () => {
    render(<DonateForm />);
    
    // Submitting empty or 0 amount triggers invalid amount error
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: "0" } });
    fireEvent.click(screen.getByText(/Donate Now/i));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Please enter a valid amount");
    });
  });

  it("handles transaction simulation failure", async () => {
    (rpc.Api.isSimulationSuccess as unknown as jest.Mock).mockReturnValueOnce(false);
    (rpc.Server as unknown as jest.Mock).mockImplementationOnce(() => ({
      getAccount: jest.fn().mockResolvedValue({}),
      simulateTransaction: jest.fn().mockResolvedValue({ error: "HostError: Error(WasmVm, InvalidAction)" }),
    }));

    render(<DonateForm />);
    
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: "100" } });
    fireEvent.click(screen.getByText(/Donate Now/i));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("Transaction failed: Transaction simulation failed"), expect.any(Object));
    });
  });

  it("handles user rejected signature", async () => {
    (StellarWalletsKit.signTransaction as jest.Mock).mockResolvedValueOnce({ signedTxXdr: "" });

    render(<DonateForm />);
    
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: "100" } });
    fireEvent.click(screen.getByText(/Donate Now/i));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("Transaction failed: User rejected signature"), expect.any(Object));
    });
  });
});
