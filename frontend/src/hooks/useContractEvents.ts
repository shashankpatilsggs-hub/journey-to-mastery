import { useEffect, useState } from "react";
import { rpc, xdr, scValToNative } from "@stellar/stellar-sdk";

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
        while (isPolling) {
          const response = await server.getEvents({
            startLedger: 0,
            filters: [
              {
                type: "contract",
                contractIds: [contractId],
              },
            ],
            limit: 10,
          });

          if (response.events && response.events.length > 0) {
            const newEvents: DonationEvent[] = [];
            for (const evt of response.events) {
              try {
                // Topic 0 is usually the event name ("donate")
                const topic0 = evt.topic[0];
                const eventName = scValToNative(topic0);

                if (eventName === "donate" && evt.topic.length > 1) {
                  const topic1 = evt.topic[1];
                  const donorAddr = scValToNative(topic1);
                  
                  const valueXdr = evt.value;
                  const amount = scValToNative(valueXdr);

                  // Formatting the amount (it's in stroops)
                  const formattedAmount = (Number(amount) / 10000000).toString();

                  newEvents.push({
                    id: evt.id || `evt-${newEvents.length}`,
                    donor: `${donorAddr.substring(0, 4)}...${donorAddr.substring(donorAddr.length - 4)}`,
                    amount: `${formattedAmount} XLM`,
                    timestamp: new Date(evt.ledgerClosedAt).toLocaleTimeString(),
                  });
                }
              } catch (e) {
                console.warn("Could not parse event:", e);
              }
            }
            
            // reverse to show newest first if we assume returned order is oldest to newest, but usually RPC returns newest first
            setEvents(newEvents);
          }

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
