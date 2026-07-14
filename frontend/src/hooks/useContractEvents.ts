import { useEffect, useState } from "react";
import { rpc } from "@stellar/stellar-sdk";

export interface DonationEvent {
  id: string;
  donor: string;
  amount: string;
  timestamp: string;
}

export function useContractEvents(contractId: string) {
  const [events, setEvents] = useState<DonationEvent[]>([]);

  useEffect(() => {
    if (!contractId) return;

    const server = new rpc.Server("https://soroban-testnet.stellar.org");
    let isPolling = true;

    async function pollEvents() {
      try {
        let cursor = "0"; // In production, store the last cursor
        while (isPolling) {
          const response = await server.getEvents({
            startLedger: 0,
            filters: [
              {
                type: "contract",
                contractIds: [contractId],
                topics: [["*", "Donation"]],
              },
            ],
            limit: 10,
          });

          if (response.events && response.events.length > 0) {
            // Very simplified event parsing for demo purposes
            const parsedEvents = response.events.map((evt, idx) => ({
              id: evt.id || `evt-${idx}`,
              donor: "Unknown (Decoded from XDR)",
              amount: "XLM",
              timestamp: new Date().toLocaleTimeString(),
            }));
            setEvents(parsedEvents);
          }

          // Poll every 5 seconds
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      } catch (err) {
        console.error("Event streaming error:", err);
      }
    }

    pollEvents();

    return () => {
      isPolling = false;
    };
  }, [contractId]);

  return { events };
}
