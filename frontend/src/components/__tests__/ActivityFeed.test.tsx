import React from "react";
import { render, screen } from "@testing-library/react";
import { ActivityFeed } from "../ActivityFeed";
import { useSorobanEvents } from "@/hooks/useSorobanEvents";

jest.mock("@/hooks/useSorobanEvents");

describe("ActivityFeed Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading skeletons when fetching events initially", () => {
    (useSorobanEvents as jest.Mock).mockReturnValue({
      events: [],
      isLoading: true,
      error: null,
      refresh: jest.fn(),
    });

    render(<ActivityFeed />);
    expect(screen.getByText(/Recent Activity/i)).toBeInTheDocument();
    expect(screen.getByText(/Connecting to Stellar Testnet RPC.../i)).toBeInTheDocument();
  });

  it("renders empty state message when no events exist", () => {
    (useSorobanEvents as jest.Mock).mockReturnValue({
      events: [],
      isLoading: false,
      error: null,
      refresh: jest.fn(),
    });

    render(<ActivityFeed />);
    expect(screen.getByText(/No recent events yet/i)).toBeInTheDocument();
  });

  it("renders list of parsed Soroban events dynamically", () => {
    (useSorobanEvents as jest.Mock).mockReturnValue({
      events: [
        {
          id: "evt-1",
          type: "donate",
          actor: "GCO2...ABCD",
          amount: "50.00 XLM",
          details: "Donated 50.00 XLM to campaign",
          timestamp: "12:00:00 PM",
        },
        {
          id: "evt-2",
          type: "mint",
          actor: "GDF8...WXYZ",
          details: "Supporter NFT Badge minted for GDF8...WXYZ",
          timestamp: "12:05:00 PM",
        },
      ],
      isLoading: false,
      error: null,
      refresh: jest.fn(),
    });

    render(<ActivityFeed />);
    expect(screen.getByText("GCO2...ABCD")).toBeInTheDocument();
    expect(screen.getByText("Donated 50.00 XLM to campaign")).toBeInTheDocument();
    expect(screen.getByText("50.00 XLM")).toBeInTheDocument();
    expect(screen.getByText("Supporter NFT Badge minted for GDF8...WXYZ")).toBeInTheDocument();
  });
});
