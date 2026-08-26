import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FTUXModal } from "../FTUXModal";
import { useWallet } from "@/contexts/WalletContext";
import { toast } from "sonner";

jest.mock("@/contexts/WalletContext");
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("FTUXModal Component", () => {
  const mockAddress = "GCO2YQ3J2B3U567890ABCDEF1234567890ABCDEF1234567890ABCD";

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("does not render when wallet is disconnected", () => {
    (useWallet as jest.Mock).mockReturnValue({ address: null });
    render(<FTUXModal />);
    expect(screen.queryByText(/Welcome! Complete Your Profile/i)).not.toBeInTheDocument();
  });

  it("opens modal for first-time connected wallet", async () => {
    (useWallet as jest.Mock).mockReturnValue({ address: mockAddress });
    render(<FTUXModal />);

    await waitFor(() => {
      expect(screen.getByText(/Welcome! Complete Your Profile/i)).toBeInTheDocument();
      expect(screen.getByText(/Select Your Role/i)).toBeInTheDocument();
    });
  });

  it("allows selecting role and submitting profile", async () => {
    (useWallet as jest.Mock).mockReturnValue({ address: mockAddress });
    render(<FTUXModal />);

    await waitFor(() => {
      expect(screen.getByText(/Welcome! Complete Your Profile/i)).toBeInTheDocument();
    });

    // Select Enterprise role from the buttons
    const enterpriseBtns = screen.getAllByRole("button", { name: /Enterprise/i });
    fireEvent.click(enterpriseBtns[0]);

    // Enter organization name
    const orgInput = screen.getByLabelText(/Organization or Name/i);
    fireEvent.change(orgInput, { target: { value: "Apex Stellar Labs" } });

    // Submit
    const submitBtn = screen.getByRole("button", { name: /Complete Setup & Enter/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      const saved = localStorage.getItem(`stellar_user_profile_${mockAddress}`);
      expect(saved).not.toBeNull();
      const parsed = JSON.parse(saved!);
      expect(parsed.role).toBe("Enterprise");
      expect(parsed.companyName).toBe("Apex Stellar Labs");
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining("Apex Stellar Labs"),
        expect.any(Object)
      );
    });
  });
});
